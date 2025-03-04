import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import NavBar from "./components/Navbar";
import Home from "./pages/home";
import ImageUpload from "./components/ImageUpload";
import Camera from "./components/Camera";
import ViolationResults from "./pages/ViolationResults";
import HistoryPage from "./pages/HistoryPage";
import PocketHazmapp from "./pages/PocketHazmapp";
import HazMappReport from "./data/HazMappReport";
import { LoadingStateProvider } from "./components/LoadingState";
import { Violation } from "./pages/ViolationResults";
import "./index.css";

// Main application component handling routing and state management
const App: React.FC = () => {
  // Track screen orientation (vertical/horizontal)
  const [isVertical, setIsVertical] = useState(
    window.innerWidth < window.innerHeight
  );

  // Store history of processed reports with image URLs and violation data
  const [history, setHistory] = useState<
    {
      imageUrl: string;
      report: string;
      processedData: Violation[];
    }[]
  >([]);

  // Handle window resize events to update orientation state
  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerWidth < window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add new report to history with optional parameters
  const onAddToHistory = (
    imageUrl: string,
    report?: string,
    processedData?: Violation[]
  ) => {
    setHistory((prevHistory) => [
      ...prevHistory,
      {
        imageUrl,
        report: report || "",
        processedData: processedData || [],
      },
    ]);
  };

  return (
    // Global loading state context provider
    <LoadingStateProvider>
      <Router>
        {/* Container with orientation-based class */}
        <div className={`app-container ${isVertical ? "vertical" : ""}`}>
          {/* Navigation bar */}
          <NavBar />

          {/* Main content area */}
          <div className="content">
            {/* Route configuration */}
            <Routes>
              {/* Home page */}
              <Route path="/" element={<Home />} />

              {/* Image upload page */}
              <Route
                path="/upload"
                element={<ImageUpload onAddToHistory={onAddToHistory} />}
              />

              {/* Camera capture page */}
              <Route
                path="/camera"
                element={<Camera onAddToHistory={onAddToHistory} />}
              />

              {/* Violation results display */}
              <Route path="/violation" element={<ViolationResults />} />

              {/* History of reports */}
              <Route
                path="/reports"
                element={<HistoryPage history={history} />}
              />

              {/* PocketHazmapp integration */}
              <Route
                path="/pockethazmapp"
                element={<PocketHazmapp history={history} />}
              />

              {/* Fallback redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />

              {/* HazMapp report display */}
              <Route path="/hazmapp-report" element={<HazMappReport />} />
            </Routes>
          </div>
        </div>
      </Router>
    </LoadingStateProvider>
  );
};

export default App;
