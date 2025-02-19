// src/pages/Prediction.tsx
import React, { useState } from "react";
import { getPredictions, Prediction } from "../services/predictService";

interface PredictionProps {
  file: File;
}

const PredictionPage: React.FC<PredictionProps> = ({ file }) => {
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handlePredict = async () => {
    setLoading(true);
    setError("");
    try {
      const preds = await getPredictions(file);
      // If the top prediction is nearly certain (>=0.99), use only that;
      // otherwise, use the top 4 predictions.
      if (preds[0].probability >= 0.99) {
        setPredictions(preds.slice(0, 1));
      } else {
        setPredictions(preds.slice(0, 4));
      }
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
              {(predictions[0].probability * 100).toFixed(2)}%)
            </p>
          )}
          <h3>Top Predictions:</h3>
          <ul>
            {predictions.map((pred, idx) => (
              <li key={idx}>
                {pred.prediction} (Confidence: {(pred.probability * 100).toFixed(2)}%)
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
