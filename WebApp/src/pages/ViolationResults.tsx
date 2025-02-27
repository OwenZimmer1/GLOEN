import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LogActions from "../components/LogActions";
import "./ViolationResults.css";

interface Violation {
  imageName: string;
  violationType: string;
  status: string;
  timestamp: string;
}

const ViolationResults: React.FC = () => {
  const [latestViolation, setLatestViolation] = useState<Violation | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const imageUrl = location.state?.imageUrl;
  const processedData = location.state?.processedData;
  const printRef = useRef<HTMLDivElement>(null);

  // ✅ Map class IDs to their regulation names
  const violationMap: Record<number, string> = {
    0: "ANSI A13-1",
    1: "ANSI Z358-1",
    2: "OSHA 1910-157(c)(1)",
    3: "OSHA 1910-303(e)(1)",
    4: "OSHA 1910-303(g)(1)",
    5: "OSHA 1910-37(a)(3)",
    6: "No Violation",
  };

  const violationTypes = Object.values(violationMap);

  useEffect(() => {
    if (processedData && processedData.length > 0) {
      const firstViolation = processedData[0]; // ✅ Get first detected violation
      const classId = firstViolation?.class_id ?? -1; // Get class ID or default to -1
      const violationType = violationMap[classId] || "Unknown"; // ✅ Convert ID to regulation

      setLatestViolation({
        imageName: "Uploaded Image",
        violationType: violationType, // ✅ Show regulation name instead of number
        status: classId === 6 ? "No Violation Detected" : "Violation Detected",
        timestamp: new Date().toLocaleString(),
      });
    } else {
      setLatestViolation({
        imageName: "Uploaded Image",
        violationType: "Unknown",
        status: "No Data",
        timestamp: new Date().toLocaleString(),
      });
    }
  }, [processedData]);

  const handleGoBack = () => navigate(-1);
  const handleEdit = () => setIsEditMode(true);
  const handleDone = () => setIsEditMode(false);

  const handleViolationTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (latestViolation) {
      setLatestViolation({
        ...latestViolation,
        violationType: event.target.value,
        status: event.target.value === "No Violation" ? "No Violation Detected" : "Violation Detected",
      });
    }
  };

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

        {latestViolation ? (
          <div className="violation-details">
            <h2>Violation Report</h2>
            <p>
              <strong>Image Name:</strong> {latestViolation.imageName}
            </p>
            {isEditMode ? (
              <select
                value={latestViolation.violationType}
                onChange={handleViolationTypeChange}
                className="violation-select"
              >
                {violationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            ) : (
              <p>
                <strong>Violation Type:</strong> {latestViolation.violationType}
              </p>
            )}
            <p>
              <strong>Status:</strong> {latestViolation.status}
            </p>
            <p>
              <strong>Timestamp:</strong> {latestViolation.timestamp}
            </p>
          </div>
        ) : (
          <p>No violation detected. Please upload or take a picture to check for violations.</p>
        )}
      </div>

      <div className="violation-buttons">
        <button onClick={handleGoBack}>Go Back</button>
        {isEditMode ? (
          <button onClick={handleDone}>Done</button>
        ) : (
          <button onClick={handleEdit}>Edit</button>
        )}
      </div>

      {/* ✅ LogActions handles Save, Share, Print, and Flag actions */}
      {imageUrl && <LogActions imageUrl={imageUrl} violationType={latestViolation?.violationType} onPrint={handlePrint} />}
    </div>
  );
};

export default ViolationResults;