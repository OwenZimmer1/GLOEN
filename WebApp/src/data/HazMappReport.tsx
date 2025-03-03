import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./HazMappReport.css";
import API_BASE_URL from "../config";

const HazMappReport: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const violationContext = location.state?.violations || "No violations detected.";

  const [report, setReport] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      const storedReports = JSON.parse(localStorage.getItem("hazmapp_reports") || "{}");

      if (storedReports[violationContext]) {
        setReport(storedReports[violationContext]);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/chat`, {
          question: "Generate a detailed safety report based on these violations.",
          context: violationContext,
        });

        const generatedReport = response.data.response;
        setReport(generatedReport);

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
  }, [violationContext]);

  return (
    <div className="hazmapp-report-container">
      <h1 className="report-title">HazMapp Safety Report</h1>

      {loading ? (
        <p className="loading-message"></p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="report-content">
          <ReactMarkdown>{report}</ReactMarkdown> {/* Proper AI response formatting */}
        </div>
      )}

      {/* Go Back Button at the Bottom */}
      <div className="bottom-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </div>
  );
};

export default HazMappReport;
