import React from "react";
import "./HistoryPage.css"; // We'll create this CSS file

interface HistoryPageProps {
  history: { imageUrl: string; report: string }[]; // History structure
}

const HistoryPage: React.FC<HistoryPageProps> = ({ history }) => {
  return (
    <div className="history-page">
      <h1>History</h1>
      {history.length === 0 ? (
        <p>No history available.</p>
      ) : (
        <div className="history-grid">
          {[...history].reverse().map((entry, index) => (
            <div key={history.length - 1 - index} className="history-entry">
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
