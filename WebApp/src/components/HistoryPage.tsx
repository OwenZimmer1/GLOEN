import React from "react";

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
        <div className="history-list">
          {history.map((entry, index) => (
            <div key={index} className="history-entry">
              <img
                src={entry.imageUrl}
                alt={`Captured ${index}`}
                style={{ width: '100%', maxWidth: '400px', marginBottom: '10px' }}
              />
              <p>{entry.report}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
