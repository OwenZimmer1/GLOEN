import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadingState } from "./LoadingState";
import { Violation } from "../pages/ViolationResults"; 
import "./ImageUpload.css";
import API_BASE_URL from "../config";


interface ImageUploadProps {
  onAddToHistory: (imageUrl: string, report: string, processedData: Violation[]) => void;
}

function ImageUpload({ onAddToHistory }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>([]);
  const navigate = useNavigate();
  const { isLoading, setLoading } = useLoadingState();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(newImages);
    }
  };

  const processImages = async () => {
    if (images.length === 0) return;

    try {
      setLoading(true);
      
      // Process images sequentially
      for (const image of images) {
        const response = await fetch(image);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append("image", blob, "image.jpg");

        const res = await fetch(`${API_BASE_URL}/process-image`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        
        if (data.status === "success") {
          const report = data.violations
            .map((v: Violation) => `${v.class_name} (${Math.round(v.confidence * 100)}%)`)
            .join(", ");

          onAddToHistory(image, report, data.violations);
        } else {
          console.error("Error processing image:", data.message);
        }
      }

      // Navigate to history after all images processed
      navigate("/reports");
      
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const discardImages = () => {
    setImages([]);
    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className={`image-upload-container ${isLoading ? "pointer-events-none select-none opacity-50" : ""}`}>
      <h1>Upload Images</h1>
      <p>Upload multiple images to check for safety hazards.</p>
  
      {!images.length && (
        <>
          <input 
            type="file" 
            accept="image/*" 
            id="file-upload"
            multiple
            className="image-upload-input"
            onChange={handleImageChange} 
            disabled={isLoading} 
          />
          <label htmlFor="file-upload" className={`image-upload-label ${isLoading ? "disabled" : ""}`}>
            {isLoading ? "Uploading..." : "Choose Files"}
          </label>
        </>
      )}
  
      {images.length > 0 && (
        <div className="image-previews grid">
          {images.map((img, index) => (
            <div key={index} className="image-preview">
              <img src={img} alt={`Preview ${index + 1}`} />
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div className="upload-buttons">
          <button onClick={processImages} disabled={isLoading}>
            {isLoading ? "Processing..." : "Process All Images"}
          </button>
          <button onClick={discardImages} disabled={isLoading} className="cancel-btn">
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
