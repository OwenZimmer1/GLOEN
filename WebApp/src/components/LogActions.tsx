import React from "react";
import "./LogActions.css";

interface LogActionsProps {
  imageUrl: string;
  violationType?: string;
  onPrint?: () => void;
}

const LogActions: React.FC<LogActionsProps> = ({ imageUrl, onPrint }) => {
  const handleSave = () => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "image_log.png";
    a.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Violation Log", text: "Check out this OSHA violation log.", url: imageUrl });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Sharing is not supported on this device.");
    }
  };

  return (
    <div className="log-actions">
      <button onClick={handleSave}>Save</button>
      <button onClick={handleShare}>Share</button>
      <button onClick={onPrint}>Print</button>
    </div>
  );
};

export default LogActions;
