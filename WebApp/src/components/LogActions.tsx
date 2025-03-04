import React from "react";
import "./LogActions.css";

// Interface defining props for LogActions component
interface LogActionsProps {
  imageUrl: string; // URL of the image to save/share
  violationType?: string; // Optional violation type (not used in current implementation)
  onPrint?: () => void; // Optional callback for print functionality
}

// Component for handling image-related actions (save/share/print)
const LogActions: React.FC<LogActionsProps> = ({ imageUrl, onPrint }) => {
  // Handle image download functionality
  const handleSave = () => {
    // Create temporary anchor element to trigger download
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "image_log.png";
    a.click();
  };

  // Handle sharing via Web Share API
  const handleShare = async () => {
    if (navigator.share) {
      try {
        // Share image URL with title and description
        await navigator.share({
          title: "Violation Log",
          text: "Check out this OSHA violation log.",
          url: imageUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for unsupported browsers
      alert("Sharing is not supported on this device.");
    }
  };

  return (
    <div className="log-actions">
      {/* Save button triggers image download */}
      <button onClick={handleSave}>Save</button>

      {/* Share button uses Web Share API */}
      <button onClick={handleShare}>Share</button>

      {/* Print button (requires onPrint prop to be provided) */}
      <button onClick={onPrint}>Print</button>
    </div>
  );
};

export default LogActions;
