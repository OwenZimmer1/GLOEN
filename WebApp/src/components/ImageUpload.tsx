import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadingState } from "./LoadingState";
import { Violation } from "../pages/ViolationResults"; // ✅ Import interface


interface ImageUploadProps {
  onAddToHistory: (imageUrl: string, report: string, processedData: Violation[]) => void; // ✅ Updated interface
}

function ImageUpload({ onAddToHistory }: ImageUploadProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isLoading, setLoading } = useLoadingState();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
    }
  };

  const processImage = async () => {
    if (imageSrc) {
      try {
        setLoading(true);

        // ✅ Convert the image to a Blob for sending to the backend
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append("image", blob, "image.jpg");

        // ✅ Send image to Flask backend
        const res = await fetch("http://localhost:5000/process-image", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        // ✅ If successful, navigate to ViolationResults with processed data
        if (data.status === "success") {
          // ✅ Pass processedData to history
          onAddToHistory(imageSrc, "", data.violations);
          
          navigate("/violation", { 
            state: { imageUrl: imageSrc, processedData: data.violations } 
          });
        } else {
          console.error("Error processing image:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const discardImage = () => {
    setImageSrc(null);
  };

  return (
    <div className={`page-container ${isLoading ? "pointer-events-none select-none opacity-50" : ""}`}>
      <h1>Upload Your Image</h1>
      <p>Upload an image to check for safety hazards.</p>
      <input type="file" accept="image/*" onChange={handleImageChange} disabled={isLoading} />

      {imageSrc && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <img
            src={imageSrc}
            alt="Uploaded Preview"
            style={{
              maxWidth: "80%",
              maxHeight: "400px",
              objectFit: "contain",
            }}
          />
        </div>
      )}

      {imageSrc && (
        <div style={{ marginTop: "10px", textAlign: "center", display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            onClick={processImage}
            disabled={isLoading}
            style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
          >
            {isLoading ? "Processing..." : "Process Image"}
          </button>
          <button
            onClick={discardImage}
            disabled={isLoading}
            style={{ backgroundColor: "#dc3545", color: "white", cursor: isLoading ? "not-allowed" : "pointer" }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
