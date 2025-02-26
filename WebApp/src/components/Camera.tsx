import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { useLoadingState } from "./LoadingState";

interface CameraProps {
  onAddToHistory: (imageUrl: string, report?: string) => void;
}

function CameraComponent({ onAddToHistory }: CameraProps) {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isLoading, setLoading } = useLoadingState();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
    }
  }, []);

  const retake = () => {
    setImgSrc(null);
  };

  const upload = async () => {
    if (imgSrc) {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulated API call

        onAddToHistory(imgSrc);
        console.log("Navigating to ViolationResults with imageUrl:", imgSrc);
        navigate("/violation", { state: { imageUrl: imgSrc } });

        setImgSrc(null);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const videoConstraints = {
    facingMode: "environment",
  };

  return (
    <div
      style={{ textAlign: "center" }}
      className={isLoading ? "pointer-events-none select-none opacity-50" : ""}
    >
      <h1>Take a Picture</h1>
      {imgSrc ? (
        <div>
          <img
            src={imgSrc}
            alt="Captured"
            style={{ width: "100%", maxWidth: "400px" }}
          />
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={upload}
              disabled={isLoading}
              style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
            >
              {isLoading ? "Processing..." : "Process Image"}
            </button>
            <button onClick={retake} disabled={isLoading}>
              Retake Photo
            </button>
          </div>
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
            videoConstraints={videoConstraints}
          />
          <div>
            <button onClick={capture} disabled={isLoading}>
              Capture Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CameraComponent;