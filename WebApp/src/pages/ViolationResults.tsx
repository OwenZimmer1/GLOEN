import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LogActions from "../components/LogActions";
import ViolationDetails from "./ViolationDetails"; 
import "./ViolationResults.css";

export interface Violation {
  class_id: number;
  class_name: string;
  confidence: number;
}

const ViolationResults: React.FC = () => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
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
      const printContent = `
        <html>
          <head>
            <title>Violation Report</title>
            <link rel="stylesheet" type="text/css" href="/styles/ViolationResults.css">
          </head>
          <body>
            <h2>Violation Report</h2>
            ${imageUrl ? `<img src="${imageUrl}" alt="Uploaded" class="violation-image" style="max-width: 300px;"/>` : ""}
            <ul>
              ${violations.map(v => `<li><strong>${v.class_name}</strong> - Confidence: ${(v.confidence * 100).toFixed(2)}%</li>`).join("")}
            </ul>
          </body>
        </html>
      `;

      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(printContent);
        newWindow.document.close();
        newWindow.print();
      }
    }
  };

  const handleViolationClick = (violation: Violation) => {
    setSelectedViolation(violation);
  };

  return (
    <div className="violation-page">
      {selectedViolation ? (
        <ViolationDetails violation={selectedViolation} onClose={() => setSelectedViolation(null)} />
      ) : (
        <>
          <div ref={printRef} className="violation-content">
            {imageUrl && <img src={imageUrl} alt="Uploaded" className="violation-image" />}

            {violations.length > 0 ? (
              <div className="violation-details">
                <h2>Violation Report</h2>
                <div className="violation-list">
                  {violations.map((violation, index) => (
                    <button
                      key={index}
                      className="violation-item"
                      onClick={() => handleViolationClick(violation)}
                    >
                      <strong>{violation.class_name}</strong>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p>No violation detected. Please upload or take a picture to check for violations.</p>
            )}
          </div>

          <div className="violation-buttons">
            {imageUrl && (
              <LogActions
                imageUrl={imageUrl}
                violationType={violations.map((v) => `${v.class_name} (${(v.confidence * 100).toFixed(2)}%)`).join(", ")}
                onPrint={handlePrint}
              />
            )}
            <button className="go-back" onClick={handleGoBack}>Go Back</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ViolationResults;
