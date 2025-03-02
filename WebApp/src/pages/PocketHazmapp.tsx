import React from "react";
import ChatBox from "../components/ChatBox";

interface Violation {
  class_id: number;
  class_name: string;
  confidence: number;
}

interface PocketHazmappProps {
  history?: { imageUrl: string; report: string; processedData: Violation[] }[];
}

const PocketHazmapp: React.FC<PocketHazmappProps> = ({ history = [] }) => {
  // ✅ Get the latest report from history (or default to empty context)
  const lastReport = history.length > 0 ? history[history.length - 1] : null;
  
  const context = lastReport
    ? lastReport.processedData
        .map((v) => `${v.class_name} (${Math.round(v.confidence * 100)}%)`)
        .join(", ")
    : "No previous violations detected.";

  return (
    <div className="pockethazmapp-container">
      <h1>Pocket Hazmapp</h1>
      <p>Ask workplace safety questions based on previous analysis.</p>
      <ChatBox context={context} />
    </div>
  );
};

export default PocketHazmapp;
