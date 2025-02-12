function ImageUpload() {
  return (
    <div className="page-container">
      <h1>Upload Your Image</h1>
      <p>Upload an image to check for safety hazards.</p>
      <input type="file" accept="image/*" />
    </div>
  );
}

export default ImageUpload;