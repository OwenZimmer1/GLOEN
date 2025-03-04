import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam"; // React webcam component
import { useNavigate } from "react-router-dom";
import { useLoadingState } from "./LoadingState";
import { Violation } from "../pages/ViolationResults";
import API_BASE_URL from "../config";

// Interface for component props
interface CameraProps {
  onAddToHistory: (
    imageUrl: string,
    report: string,
    processedData: Violation[]
  ) => void;
}

// Camera component for capturing and processing images
function CameraComponent({ onAddToHistory }: CameraProps) {
  // Webcam reference for capturing screenshots
  const webcamRef = useRef<Webcam>(null);

  // State management
  const [imgSrc, setImgSrc] = useState<string | null>(null); // Captured image URL
  const navigate = useNavigate();
  const { isLoading, setLoading } = useLoadingState();

  // Memoized capture function to prevent unnecessary re-renders
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
    }
  }, []);

  // Reset captured image
  const retake = () => {
    setImgSrc(null);
  };

  // Process captured image through backend API
  const processImage = async () => {
    if (imgSrc) {
      try {
        setLoading(true);

        // Convert base64 image to file format for backend processing
        const blob = await fetch(imgSrc).then((res) => res.blob());
        const formData = new FormData();
        formData.append("image", blob, "captured.jpg");

        // Send image to backend for processing
        const response = await fetch(`${API_BASE_URL}/process-image`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        console.log("Backend response:", data);

        if (data.status === "success") {
          // Format violation report
          const report = data.violations
            .map(
              (v: Violation) =>
                `${v.class_name} (${Math.round(v.confidence * 100)}%)`
            )
            .join(", ");

          // Update history and navigate
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

  // Camera configuration for environment-facing camera
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
        // Captured image preview
        <div>
          <img
            src={imgSrc}
            alt="Captured"
            style={{ width: "100%", maxWidth: "400px" }}
          />
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <button
              onClick={processImage}
              disabled={isLoading}
              style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
            >
              {isLoading ? "Processing..." : "Process Image"}
            </button>
            <button
              onClick={retake}
              disabled={isLoading}
              style={{ backgroundColor: "#dc3545", color: "white" }}
            >
              Retake
            </button>
          </div>
        </div>
      ) : (
        // Webcam view
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
