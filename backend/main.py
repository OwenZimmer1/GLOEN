import os
import httpx
import asyncio
import json
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime
from azure.storage.blob import BlobServiceClient, ContentSettings
from azure.core.exceptions import ResourceNotFoundError

# Blob Storage connection
BLOB_CONNECTION_STRING = os.getenv("BLOB_CONNECTION_STRING")
CONTAINER_NAME = os.getenv("BLOB_CONTAINER_NAME", "detection-results")
ML_SERVICE_URL = os.getenv("ML_SERVICE_URL", "http://ml-processor:8001")

# Initialize blob service
blob_service_client = BlobServiceClient.from_connection_string(BLOB_CONNECTION_STRING)

# Ensure container exists
try:
    container_client = blob_service_client.get_container_client(CONTAINER_NAME)
    container_client.get_container_properties()
except Exception:
    container_client = blob_service_client.create_container(CONTAINER_NAME)

app = FastAPI(title="Object Detection API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Response models
class DetectionResult(BaseModel):
    class_id: int
    class_name: str
    confidence: float
    bbox: List[float]

class DetectionResponse(BaseModel):
    id: str  # Using blob name as ID
    filename: str
    results: List[DetectionResult]
    processed_image: str
    created_at: datetime

@app.get("/")
async def root():
    return {"message": "Object Detection API is running"}

@app.get("/health")
async def health_check():
    # Check ML service health
    try:
        async with httpx.AsyncClient() as client:
            ml_health = await client.get(f"{ML_SERVICE_URL}/health", timeout=5.0)
            ml_health.raise_for_status()
    except Exception as e:
        return {"status": "unhealthy", "ml_service": str(e)}
    
    # Check blob storage health
    try:
        container_client.get_container_properties()
    except Exception as e:
        return {"status": "unhealthy", "blob_storage": str(e)}
    
    return {"status": "healthy"}

@app.post("/detect", response_model=DetectionResponse)
async def detect_objects(file: UploadFile = File(...)):
    try:
        # Forward the file to the ML service
        form_data = {"file": (file.filename, await file.read(), file.content_type)}
        
        # Reset file position after reading
        await file.seek(0)
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{ML_SERVICE_URL}/detect",
                files=form_data,
                timeout=30.0
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, 
                                   detail=f"ML service error: {response.text}")
            
            ml_results = response.json()
            
            # Create unique blob name
            timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
            blob_name = f"{timestamp}_{file.filename}"
            
            # Store results in blob storage
            detection_data = {
                "filename": file.filename,
                "detection_data": ml_results,
                "created_at": datetime.utcnow().isoformat()
            }
            
            blob_client = container_client.get_blob_client(blob_name)
            blob_client.upload_blob(
                json.dumps(detection_data),
                content_settings=ContentSettings(content_type='application/json')
            )
            
            # Return the detection results
            return DetectionResponse(
                id=blob_name,
                filename=file.filename,
                results=ml_results["results"],
                processed_image=ml_results["processed_image"],
                created_at=datetime.utcnow()
            )
    
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, 
                           detail=f"Error communicating with ML service: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/detections", response_model=List[Dict[str, Any]])
async def get_all_detections():
    detections = []
    blobs = container_client.list_blobs()
    
    for blob in blobs:
        blob_client = container_client.get_blob_client(blob.name)
        blob_data = blob_client.download_blob().readall()
        detection = json.loads(blob_data)
        detection["id"] = blob.name
        detections.append(detection)
    
    # Sort by created_at in descending order
    return sorted(detections, key=lambda x: x["created_at"], reverse=True)

@app.get("/detections/{detection_id}", response_model=Dict[str, Any])
async def get_detection(detection_id: str):
    try:
        blob_client = container_client.get_blob_client(detection_id)
        blob_data = blob_client.download_blob().readall()
        detection = json.loads(blob_data)
        detection["id"] = detection_id
        return detection
    except ResourceNotFoundError:
        raise HTTPException(status_code=404, detail="Detection not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)