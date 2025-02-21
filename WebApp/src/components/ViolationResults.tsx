import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface Violation {
  imageName: string;
  violationType: string;
  status: string;
  timestamp: string;
}

const ViolationResults: React.FC = () => {
  const [latestViolation, setLatestViolation] = useState<Violation | null>(null);
  const location = useLocation();
  const imageUrl = location.state?.imageUrl;

  const fetchLatestViolation = () => {
    const exampleViolation: Violation = {
      imageName: "Uploaded Image",
      violationType: "Eye Wash Station Blocked",
      status: "Violation Detected",
      timestamp: new Date().toLocaleString(),
    };
    
    setLatestViolation(exampleViolation);
  };

  useEffect(() => {
    fetchLatestViolation();
  }, []);

  return (
    <div className="violation-display">
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="Uploaded" 
          style={{ maxWidth: '100%', maxHeight: '400px', marginBottom: '20px' }} 
        />
      )}
      {latestViolation ? (
        <div className="violation-details">
          <h2>Violation Report</h2>
          <p><strong>Image Name:</strong> {latestViolation.imageName}</p>
          <p><strong>Violation Type:</strong> {latestViolation.violationType}</p>
          <p><strong>Status:</strong> {latestViolation.status}</p>
          <p><strong>Timestamp:</strong> {latestViolation.timestamp}</p>
        </div>
      ) : (
        <p>No violation detected. Please upload or take a picture to check for violations.</p>
      )}
    </div>
  );
};

export default ViolationResults;
