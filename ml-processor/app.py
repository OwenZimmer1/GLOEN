import os
import io
import cv2
import base64
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from PIL import Image
from ultralytics import YOLO
import json

app = FastAPI(title="YOLOv8 Object Detection Service")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the YOLO model
MODEL_PATH = os.getenv("MODEL_PATH", "yolov8n.pt")

# Initialize model on startup
@app.on_event("startup")
async def startup_event():
    global model
    try:
        model = YOLO(MODEL_PATH)
        print(f"Successfully loaded model: {MODEL_PATH}")
    except Exception as e:
        print(f"Error loading model: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to load ML model: {str(e)}")

# Response models
class DetectionResult(BaseModel):
    class_id: int
    class_name: str
    confidence: float
    bbox: List[float]  # [x1, y1, x2, y2]

class DetectionResponse(BaseModel):
    results: List[DetectionResult]
    processed_image: str  # base64 encoded image with bounding boxes

@app.get("/")
async def root():
    return {"message": "YOLOv8 Object Detection Service is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/detect", response_model=DetectionResponse)
async def detect_objects(file: UploadFile = File(...)):
    try:
        # Read and process the image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert PIL Image to numpy array for OpenCV/YOLOv8
        img_array = np.array(image)
        
        # Run inference
        results = model(img_array)
        
        # Process results
        detection_results = []
        
        # Get first result (assuming single image input)
        result = results[0]
        
        # Extract boxes, confidences, and class ids
        for box, conf, cls in zip(result.boxes.xyxy.tolist(), 
                                 result.boxes.conf.tolist(), 
                                 result.boxes.cls.tolist()):
            class_id = int(cls)
            class_name = result.names[class_id]
            
            detection_results.append(
                DetectionResult(
                    class_id=class_id,
                    class_name=class_name,
                    confidence=conf,
                    bbox=box
                )
            )
        
        # Generate image with bounding boxes
        img_with_boxes = results[0].plot()
        
        # Convert the image with boxes to base64
        _, buffer = cv2.imencode('.jpg', img_with_boxes)
	
        processed_image_b64 = base64.b64encode(buffer).decode('utf-8')
        
        return DetectionResponse(
            results=detection_results,
            processed_image=processed_image_b64
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)