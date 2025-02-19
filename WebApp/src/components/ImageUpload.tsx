import { useState, ChangeEvent } from "react";

function ImageUpload() {
  const [imageSrc, setImageSrc] = useState("");

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
    }
  };

  return (
    <div className="page-container">
      <h1>Upload Your Image</h1>
      <p>Upload an image to check for safety hazards.</p>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Uploaded Preview"
          style={{ marginTop: "20px", maxWidth: "100%" }}
        />
      )}
    </div>
  );
}

export default ImageUpload;
