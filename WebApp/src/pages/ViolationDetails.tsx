import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation hook
import { violationDescriptions } from "../data/ViolationList";
import "./ViolationDetails.css";

interface ViolationListProps {
  violation: { class_name: string };
  onClose: () => void;
}

const ViolationDetails: React.FC<ViolationListProps> = ({ violation, onClose }) => {
  const navigate = useNavigate(); // ✅ Use navigation hook

  const handleFlagViolation = () => {
    alert("Violation has been flagged for review.");
  };

  return (
    <div className="violation-info-container">
      <div className="violation-modal">
        <h2 className="modal-title">{violation.class_name}</h2>
        <p>
          <strong>Regulation Description:</strong>{" "}
          {violationDescriptions[violation.class_name as keyof typeof violationDescriptions] ?? 
            "No description available."}
        </p>

        <h3>Possible Brady Products</h3>
        <ul className="product-list">
          <li>🔹 Lockout Tagout Devices</li>
          <li>🔹 Safety Signage</li>
          <li>🔹 Spill Control Kits</li>
        </ul>

        {/* ✅ Updated Button Layout */}
        <div className="violation-buttons">
        <button 
          className="hazmapp-button" 
          onClick={() => navigate("/hazmapp-report", { state: { violations: violation.class_name } })}
        >
          HazMapp Report
        </button>


          <button
            className="product-link"
            onClick={() => window.open("https://www.bradyid.com/", "_blank")}
          >
            Find Products
          </button>

          <button className="flag-button" onClick={handleFlagViolation}>
            Flag
          </button>

          <button className="back-button" onClick={onClose}>
            Back to Violations
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViolationDetails;
