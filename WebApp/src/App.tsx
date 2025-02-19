// src/App.tsx
import React, { useState, useEffect } from "react";
import "./App.css";
import NavBar from "./components/Navbar";
import Home from "./pages/Home";
import ImageUpload from "./components/ImageUpload";
import Camera from "./components/Camera";
import PredictionPage from "./pages/Prediction";

const App: React.FC = () => {
  const [view, setView] = useState("home");
  const [file, setFile] = useState<File | null>(null);
  const [groundTruth, setGroundTruth] = useState<string>("");

  // For responsive layout.
  const [isVertical, setIsVertical] = useState(window.innerWidth < window.innerHeight);
  useEffect(() => {
    const handleResize = () => setIsVertical(window.innerWidth < window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Callback for ImageUpload component to update file and ground truth (if applicable).
  const handleFileSelected = (selectedFile: File, gt: string) => {
    setFile(selectedFile);
    setGroundTruth(gt); // You could get this from the file's folder or user input.
    setView("prediction");
  };

  return (
    <div className={`app-container ${isVertical ? "vertical" : ""}`}>
      <NavBar onViewChange={setView} />
      <div className="content">
        {view === "home" && <Home />}
        {view === "upload" && <ImageUpload onFileSelect={handleFileSelected} />}
        {view === "camera" && <Camera onFileSelect={handleFileSelected} />}
        {view === "prediction" && file && (
          <PredictionPage file={file} groundTruth={groundTruth} />
        )}
      </div>
    </div>
  );
};

export default App;
