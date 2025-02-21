import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ViolationResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { imageUrl, report } = location.state || {};

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="violation-display">
      <button onClick={handleGoBack} style={{ marginBottom: '20px' }}>Go Back</button>
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="Uploaded" 
          style={{ maxWidth: '100%', maxHeight: '400px', marginBottom: '20px' }} 
        />
      )}
      {report ? (
        <div className="violation-details">
          <h2>Violation Report</h2>
          <p>{report}</p>
        </div>
      ) : (
        <p>No violation detected. Please upload or take a picture to check for violations.</p>
      )}
    </div>
  );
};

export default ViolationResults;
