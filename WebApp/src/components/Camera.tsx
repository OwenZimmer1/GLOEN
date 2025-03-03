import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { useLoadingState } from "./LoadingState";
import { Violation } from "../pages/ViolationResults";
import "./Camera.css"; 

interface CameraProps {
  onAddToHistory: (
    imageUrl: string,
    report: string,
    processedData: Violation[]
  ) => void;
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

  const processImage = async () => {
    if (imgSrc) {
      try {
        setLoading(true);

        // ✅ Convert base64 image to file format for backend
        const blob = await fetch(imgSrc).then((res) => res.blob());
        const formData = new FormData();
        formData.append("image", blob, "captured.jpg");

        // ✅ Send to backend
        const response = await fetch("http://localhost:5000/process-image", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        console.log("Backend response:", data);

        if (data.status === "success") {
          const report = data.violations
            .map(
              (v: Violation) =>
                `${v.class_name} (${Math.round(v.confidence * 100)}%)`
            )
            .join(", ");

          // ✅ Pass processedData to history
          onAddToHistory(imgSrc, report, data.violations);

          navigate("/violation", {
            state: { imageUrl: imgSrc, processedData: data.violations },
          });
        }

        setImgSrc(null);
      } catch (error) {
        console.error("Error processing image:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const videoConstraints = {
    facingMode: "environment",
  };

  return (
    <div className={`camera-container ${isLoading ? "pointer-events-none select-none opacity-50" : ""}`}>
      <h1 className="camera-heading">Take a Picture</h1>
      {imgSrc ? (
        <div className="image-container">
          <img src={imgSrc} alt="Captured" className="captured-image" />
          <div className="button-container">
            <button
              onClick={processImage}
              disabled={isLoading}
              className="button"
            >
              {isLoading ? "Processing..." : "Process Image"}
            </button>
            <button onClick={retake} disabled={isLoading} className="button">
              Retake
            </button>
          </div>
        </div>
      ) : (
        <div className="webcam-container">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="webcam-preview"
            videoConstraints={videoConstraints}
          />
          <div className="button-container">
            <button onClick={capture} disabled={isLoading} className="button">
              Capture Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CameraComponent;
