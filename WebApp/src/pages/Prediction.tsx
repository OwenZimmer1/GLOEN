// src/pages/Prediction.tsx
import React, { useState } from "react";
import { getPredictions, Prediction } from "../services/predictService";

interface PredictionProps {
  file: File;
  groundTruth: string; // Expected class (e.g., extracted from folder name or user input)
}

const PredictionPage: React.FC<PredictionProps> = ({ file, groundTruth }) => {
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handlePredict = async () => {
    setLoading(true);
    setError("");
    try {
      const preds = await getPredictions(file);
      setPredictions(preds);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Prediction Results</h1>
      <button onClick={handlePredict} disabled={loading}>
        {loading ? "Processing..." : "Get Predictions"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {predictions && (
        <div>
          <h2>Overall Prediction:</h2>
          {predictions.length > 0 && (
            <p>
              {predictions[0].prediction} (Confidence:{" "}
              {(predictions[0].probability * 100).toFixed(2)}%){" "}
              {predictions[0].prediction.toLowerCase().includes(groundTruth.toLowerCase()) ? "✓" : "X"}
            </p>
          )}
          <h3>Top Predictions:</h3>
          <ul>
            {predictions.map((pred, idx) => (
              <li key={idx}>
                {pred.prediction} (Confidence: {(pred.probability * 100).toFixed(2)}%){" "}
                {pred.prediction.toLowerCase().includes(groundTruth.toLowerCase()) ? "✓" : "X"}
              </li>
            ))}
          </ul>
          <h3>Explanation:</h3>
          <p>{predictions[0].caption}</p>
        </div>
      )}
    </div>
  );
};

export default PredictionPage;
