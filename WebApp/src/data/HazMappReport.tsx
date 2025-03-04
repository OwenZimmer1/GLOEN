import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./HazMappReport.css";
import API_BASE_URL from "../config";

// Component for displaying safety reports based on violations
const HazMappReport: React.FC = () => {
  // Get navigation and location from react-router
  const location = useLocation();
  const navigate = useNavigate();

  // Get violation context from route state (default to empty string)
  const violationContext =
    location.state?.violations || "No violations detected.";

  // State management for report content, loading status, and errors
  const [report, setReport] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch report from API or localStorage
  useEffect(() => {
    const fetchReport = async () => {
      // Check localStorage for cached report
      const storedReports = JSON.parse(
        localStorage.getItem("hazmapp_reports") || "{}"
      );

      if (storedReports[violationContext]) {
        setReport(storedReports[violationContext]);
        setLoading(false);
        return;
      }

      try {
        // API call to generate report based on violations
        const response = await axios.post(`${API_BASE_URL}/chat`, {
          question:
            "Generate a detailed safety report based on these violations.",
          context: violationContext,
        });

        const generatedReport = response.data.response;
        setReport(generatedReport);

        // Cache report in localStorage
        storedReports[violationContext] = generatedReport;
        localStorage.setItem("hazmapp_reports", JSON.stringify(storedReports));
      } catch (err) {
        console.error("Error fetching report:", err);
        setError("❌ Error retrieving report. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [violationContext]); // Re-run when violation context changes

  return (
    <div className="hazmapp-report-container">
      <h1 className="report-title">HazMapp Safety Report</h1>

      {/* Loading/error states */}
      {loading ? (
        <p className="loading-message"></p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="report-content">
          {/* Render markdown report */}
          <ReactMarkdown>{report}</ReactMarkdown>
        </div>
      )}

      {/* Navigation controls */}
      <div className="bottom-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default HazMappReport;
