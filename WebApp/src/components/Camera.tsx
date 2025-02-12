import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

function CameraComponent() {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  // Capture function to take a photo
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  // Retake function to reset the image
  const retake = () => {
    setImgSrc(null);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Take a Picture</h1>
      {imgSrc ? (
        <div>
          <img
            src={imgSrc}
            alt="Captured"
            style={{ width: "100%", maxWidth: "400px" }}
          />
          <button onClick={retake}>Retake Photo</button>
        </div>
      ) : (
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={{
              width: "100%",
              maxWidth: "400px",
              border: "2px solid black",
            }}
          />
          <div>
            <button onClick={capture}>Capture Photo</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CameraComponent;
