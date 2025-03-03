import React from "react";
import { useNavigate } from "react-router-dom";
import { violationDescriptions } from "../data/ViolationList";
import products from "../data/Products";
import "./ViolationDetails.css";

interface ViolationListProps {
  violation: { class_name: string };
  onClose: () => void;
}

const ViolationDetails: React.FC<ViolationListProps> = ({ violation, onClose }) => {
  const navigate = useNavigate();
  const relatedProducts = products[violation.class_name] || [];

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
        {relatedProducts.length > 0 ? (
          <div className="product-grid">
            {relatedProducts.map((product, index) => (
              <a
                key={index}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="product-card"
              >
                {product.img && <img src={product.img} alt={product.name} className="product-image" />}
                <p className="product-name">{product.name}</p>
              </a>
            ))}
          </div>
        ) : (
          <p>No recommended products for this violation.</p>
        )}

        <div className="violation-buttons">
          <button
            className="hazmapp-button"
            onClick={() => navigate("/hazmapp-report", { state: { violations: violation.class_name } })}
          >
            HazMapp Report
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
