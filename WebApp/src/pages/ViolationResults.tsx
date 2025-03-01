import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LogActions from "../components/LogActions";
import "./ViolationResults.css";

export interface Violation {
  class_id: number;
  class_name: string;
  confidence: number;
}

const ViolationResults: React.FC = () => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const imageUrl = location.state?.imageUrl;
  const printRef = useRef<HTMLDivElement>(null);
  const processedData = location.state?.processedData as Violation[] | undefined;

  useEffect(() => {
    if (processedData && processedData.length > 0) {
      setViolations(processedData);
    } else {
      setViolations([{ class_id: 6, class_name: "No Violation", confidence: 1.0 }]);
    }
  }, [processedData]);

  const handleGoBack = () => navigate(-1);

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Violation Report</title>
              <link rel="stylesheet" type="text/css" href="/styles/ViolationResults.css">
            </head>
            <body>${printContent}</body>
          </html>
        `);
        newWindow.document.close();
        newWindow.print();
      }
    }
  };

  return (
    <div className="violation-page">
      <div ref={printRef}>
        {imageUrl && <img src={imageUrl} alt="Uploaded" className="violation-image" />}

        {violations.length > 0 ? (
          <div className="violation-details">
            <h2>Violation Report</h2>
            <ul className="violation-list">
              {violations.map((violation, index) => (
                <li key={index} className="violation-item">
                  <strong>{violation.class_name}</strong> (Confidence: {Math.round(violation.confidence * 100)}%)
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No violation detected. Please upload or take a picture to check for violations.</p>
        )}
      </div>

      <div className="violation-buttons">
        <button onClick={handleGoBack}>Go Back</button>
      </div>

      {/* ✅ LogActions handles Save, Share, Print, and Flag actions */}
      {imageUrl && <LogActions imageUrl={imageUrl} violationType={violations.map(v => v.class_name).join(", ")} onPrint={handlePrint} />}
    </div>
  );
};

export default ViolationResults;
