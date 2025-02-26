import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadingState } from "./LoadingState";

interface ImageUploadProps {
  onAddToHistory: (imageUrl: string, report?: string) => void;
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
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulated API call

        onAddToHistory(imageSrc);
        console.log("Navigating to ViolationResults with imageUrl:", imageSrc);
        navigate("/violation", { state: { imageUrl: imageSrc } });

        setImageSrc(null);
      } catch (error) {
        console.error("Error processing image:", error);
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
