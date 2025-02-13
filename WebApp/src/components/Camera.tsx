import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

function CameraComponent() {
  const webcam = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcam.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
    }
  }, [webcam]);

  const retake = () => {
    setImgSrc(null);
  };

  const videoConstraints = {
    facingMode: 'user'
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
          <div>
            <button onClick={retake}>Upload Immage</button>
            <button onClick={retake}>Retake Photo</button>
          </div>
        </div>
      ) : (
        <div>
          <Webcam
            audio={false}
            ref={webcam}
            screenshotFormat="image/jpeg"
            style={{
              width: "100%",
              maxWidth: "400px",
              border: "2px solid black",
            }}
            videoConstraints={videoConstraints}
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
