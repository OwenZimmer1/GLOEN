// src/App.tsx
"use client";

import React, { useState, useEffect } from "react";
import "./App.css";
import NavBar from "./components/Navbar";
import Home from "./pages/Home";
import ImageUpload from "./components/ImageUpload";
import Camera from "./components/Camera";
import PredictionPage from "./pages/Prediction";

const App: React.FC = () => {
  // "view" controls which page is shown: "home", "upload", "camera", or "prediction"
  const [view, setView] = useState<string>("home");
  // "file" will store the image file selected or captured
  const [file, setFile] = useState<File | null>(null);
  // "groundTruth" is optional—for example, it might come from the folder name or user input.
  const [groundTruth, setGroundTruth] = useState<string>("");

  // For responsive layout: detect if the window is vertical
  const [isVertical, setIsVertical] = useState<boolean>(true);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsVertical(window.innerWidth < window.innerHeight);
      const handleResize = () => setIsVertical(window.innerWidth < window.innerHeight);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Callback passed to ImageUpload and Camera components.
  // When an image is selected/captured, we update our state and switch to prediction view.
  const handleFileSelected = (selectedFile: File, gt: string) => {
    console.log("File selected:", selectedFile);
    setFile(selectedFile);
    setGroundTruth(gt);
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
