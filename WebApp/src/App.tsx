// src/App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';
import NavBar from './components/Navbar';
import Home from './pages/home';
import ImageUpload from './components/ImageUpload';
import Camera from './components/Camera';
import ViolationResults from './components/ViolationResults';

const App: React.FC = () => {
  const [view, setView] = useState('home');
  const [isVertical, setIsVertical] = useState(window.innerWidth < window.innerHeight);
  const [predictions, setPredictions] = useState<any>(null);
  const [imageSource, setImageSource] = useState<string>("");

  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerWidth < window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // This callback will be passed to ImageUpload and Camera components.
  // When an image is processed and predictions are obtained, call this to update state.
  const handlePrediction = (preds: any, imgSrc: string) => {
    setPredictions(preds);
    setImageSource(imgSrc);
    setView('violation');
  };

  return (
    <div className={`app-container ${isVertical ? 'vertical' : ''}`}>
      <NavBar onViewChange={setView} />
      <div className="content">
        {view === 'home' && <Home />}
        {view === 'upload' && <ImageUpload onPrediction={handlePrediction} />}
        {view === 'camera' && <Camera onPrediction={handlePrediction} />}
        {view === 'violation' && <ViolationResults predictions={predictions} imageSource={imageSource} />}
      </div>
    </div>
  );
};

export default App;
