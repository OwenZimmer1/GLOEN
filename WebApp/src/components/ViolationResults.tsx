import React, { useEffect, useState } from 'react';

// Example type for the violation. will adjust after our backend is up.
interface Violation {
  imageName: string;
  violationType: string;
  status: string;
  timestamp: string;
}

const ViolationResults: React.FC = () => {
  const [latestViolation, setLatestViolation] = useState<Violation | null>(null);

  // Fetch the latest violation log. Also waiting for backend
  const fetchLatestViolation = () => {
    // Example data - replace with actual logic to get the latest violation
    const exampleViolation: Violation = {
      imageName: "office_picture.jpg",
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