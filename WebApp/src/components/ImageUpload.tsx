import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadingState } from "./LoadingState";
import { Violation } from "../pages/ViolationResults";
import "./ImageUpload.css";
import API_BASE_URL from "../config";

// Interface for component props
interface ImageUploadProps {
  onAddToHistory: (
    imageUrl: string,
    report: string,
    processedData: Violation[]
  ) => void;
}

// Image upload component handling file processing and API communication
function ImageUpload({ onAddToHistory }: ImageUploadProps) {
  // State management for uploaded images and navigation
  const [images, setImages] = useState<string[]>([]);
  const navigate = useNavigate();
  const { isLoading, setLoading } = useLoadingState();

  // Handle file input changes (convert files to URLs)
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages(newImages);
    }
  };

  // Process images through API and handle results
  const processImages = async () => {
    if (images.length === 0) return;

    try {
      setLoading(true);

      // Process each image individually
      for (const image of images) {
        // Fetch image data
        const response = await fetch(image);
        const blob = await response.blob();

        // Create form data for API submission
        const formData = new FormData();
        formData.append("image", blob, "image.jpg");

        // API call to process image
        const res = await fetch(`${API_BASE_URL}/process-image`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.status === "success") {
          // Format violation report
          const report = data.violations
            .map(
              (v: Violation) =>
                `${v.class_name} (${Math.round(v.confidence * 100)}%)`
            )
            .join(", ");

          // Add to history and navigate
          onAddToHistory(image, report, data.violations);

          // Single image navigation
          if (images.length === 1) {
            navigate("/violation", {
              state: { imageUrl: image, processedData: data.violations },
            });
            return;
          }
        } else {
          console.error("Error processing image:", data.message);
        }
      }

      // Multi-image navigation
      if (images.length > 1) {
        navigate("/reports");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Clear all uploaded images
  const discardImages = () => {
    setImages([]);
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div
      className={`image-upload-container ${
        isLoading ? "pointer-events-none select-none opacity-50" : ""
      }`}
    >
      <h1>Upload Images</h1>
      <p>Upload multiple images to check for safety hazards.</p>

      {/* File input and upload UI */}
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
          <label
            htmlFor="file-upload"
            className={`image-upload-label ${isLoading ? "disabled" : ""}`}
          >
            {isLoading ? "Uploading..." : "Choose Files"}
          </label>
        </>
      )}

      {/* Image previews */}
      {images.length === 1 && (
        <div className="single-image-preview">
          <img src={images[0]} alt="Preview" />
        </div>
      )}

      {images.length > 1 && (
        <div className="image-previews grid">
          {images.map((img, index) => (
            <div key={index} className="image-preview">
              <img src={img} alt={`Preview ${index + 1}`} />
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      {images.length > 0 && (
        <div className="upload-buttons">
          <button onClick={processImages} disabled={isLoading}>
            {isLoading
              ? "Processing..."
              : images.length === 1
              ? "Process Image"
              : "Process All Images"}
          </button>
          <button
            onClick={discardImages}
            disabled={isLoading}
            className="cancel-btn"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
