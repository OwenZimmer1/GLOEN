import { useState, ChangeEvent } from "react";

interface ImageUploadProps {
  onAddToHistory: (imageUrl: string) => void;
}

function ImageUpload({ onAddToHistory }: ImageUploadProps) {
  const [imageSrc, setImageSrc] = useState<string>("");

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
    }
  };

  const upload = () => {
    if (imageSrc) {
      onAddToHistory(imageSrc);
      setImageSrc("");
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
            <button onClick={upload}>Upload Image</button>
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
