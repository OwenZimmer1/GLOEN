import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadingState } from "./LoadingState";


interface ImageUploadProps {
  onAddToHistory: (imageUrl: string) => void;
}

function ImageUpload({ onAddToHistory }: ImageUploadProps) {
  const [imageSrc, setImageSrc] = useState<string>("");
  const navigate = useNavigate();
  const { isLoading, setLoading } = useLoadingState();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
    }
  };

  const upload = async () => {
    if (imageSrc) {
      try {
        setLoading(true);
        // Simulate API call - replace this with actual API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        onAddToHistory(imageSrc);
        navigate("/violation", { state: { imageUrl: imageSrc } });
        setImageSrc("");
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="page-container">
      <h1>Upload Your Image</h1>
      <p>Upload an image to check for safety hazards.</p>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {imageSrc && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <div style={{ marginBottom: '5px' }}>
            <button 
              onClick={upload}
              disabled={isLoading}
            >
              Upload Image
            </button>
          </div>
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
    </div>
  );
}

export default ImageUpload;
