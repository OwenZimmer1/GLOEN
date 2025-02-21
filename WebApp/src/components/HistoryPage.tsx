import React from "react";
import { useNavigate } from "react-router-dom";
import "./HistoryPage.css";

interface HistoryPageProps {
  history: { imageUrl: string; report: string }[]; // History structure
}

const HistoryPage: React.FC<HistoryPageProps> = ({ history }) => {
  const navigate = useNavigate();

  const handleImageClick = (imageUrl: string, report: string) => {
    navigate("/violation", { state: { imageUrl, report } });
  };

  return (
    <div className="history-page">
      <h1>History</h1>
      {history.length === 0 ? (
        <p>No history available.</p>
      ) : (
        <div className="history-grid">
          {[...history].reverse().map((entry, index) => (
            <div 
              key={history.length - 1 - index} 
              className="history-entry"
              onClick={() => handleImageClick(entry.imageUrl, entry.report)}
            >
              <img
                src={entry.imageUrl}
                alt={`Captured ${history.length - 1 - index}`}
                className="history-image"
              />
              <p className="history-report">{entry.report}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
