import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./HazMappReport.css";

const HazMappReport: React.FC = () => {
  const location = useLocation();
  const violationContext = location.state?.violations || "No violations detected.";
  
  const [report, setReport] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      const storedReports = JSON.parse(localStorage.getItem("hazmapp_reports") || "{}");

      // ✅ Check if report is already stored for this violation
      if (storedReports[violationContext]) {
        setReport(storedReports[violationContext]);
        setLoading(false);
        return;
      }

      // ✅ If no cached report, fetch from AI
      try {
        const response = await axios.post("http://localhost:5000/chat", {
          question: "Generate a detailed safety report based on these violations.",
          context: violationContext,
        });

        const generatedReport = response.data.response;
        setReport(generatedReport);

        // ✅ Save the new report in local storage
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
    </div>
  );
};

export default HazMappReport;
