from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Azure AI Web Application")

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Azure AI Web Application API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Placeholder for YOLOv8 integration
@app.post("/detect")
async def detect_objects(file: UploadFile = File(...)):
    # Here you'll add the YOLOv8 object detection logic
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "detection_status": "placeholder - YOLOv8 integration pending"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)