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

  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerWidth < window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`app-container ${isVertical ? 'vertical' : ''}`}>
      <NavBar onViewChange={setView} />
      <div className="content">
        {view === 'home' && <Home />}
        {view === 'upload' && <ImageUpload />}
        {view === 'camera' && <Camera />}
        {view === 'violation' && <ViolationResults />}
      </div>
    </div>
  );
};

export default App;
