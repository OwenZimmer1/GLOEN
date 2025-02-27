import React, { useState } from "react";
import "./LogActions.css";

interface LogActionsProps {
  imageUrl: string;
  violationType?: string;
  onPrint?: () => void;
}

const LogActions: React.FC<LogActionsProps> = ({ imageUrl, violationType, onPrint }) => {
  const [flagged, setFlagged] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [isFlagging, setIsFlagging] = useState(false);

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

  const handleFlag = async () => {
    if (!flagReason.trim()) {
      alert("Please provide a reason for flagging.");
      return;
    }

    const flagData = { imageUrl, violationType, flagReason, timestamp: new Date().toISOString() };

    try {
      const response = await fetch("https://your-backend-api.com/flag-violation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flagData),
      });

      if (response.ok) {
        setFlagged(true);
        alert("Violation flagged successfully!");
      } else {
        alert("Failed to flag the violation.");
      }
    } catch (error) {
      console.error("Error flagging violation:", error);
      alert("An error occurred while flagging.");
    }
  };

  return (
    <div className="log-actions">
      <button onClick={handleSave}>Save</button>
      <button onClick={handleShare}>Share</button>
      <button onClick={onPrint}>Print</button>
      <button onClick={() => setIsFlagging(true)} className={`flag-button ${flagged ? "flagged" : ""}`}>
        {flagged ? "Flagged" : "Flag"}
      </button>

      {isFlagging && !flagged && (
        <div className="flagging-section">
          <textarea value={flagReason} onChange={(e) => setFlagReason(e.target.value)} placeholder="Enter reason for flagging..." rows={3} />
          <button onClick={handleFlag} className="flag-submit">Submit Flag</button>
        </div>
      )}
    </div>
  );
};

export default LogActions;
