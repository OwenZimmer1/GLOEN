import React, { useState, useEffect } from 'react';
import './App.css';
import NavBar from './components/Navbar';
import Home from './pages/home';
import ImageUpload from './components/ImageUpload';
import Camera from './components/Camera';
import ViolationResults from './components/ViolationResults';
import HistoryPage from './components/HistoryPage'; // Import HistoryPage

const App: React.FC = () => {
  const [view, setView] = useState('home');
  const [isVertical, setIsVertical] = useState(window.innerWidth < window.innerHeight);
  const [history, setHistory] = useState<{ imageUrl: string; report: string }[]>([]); // Add history state

  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerWidth < window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onAddToHistory = (imageUrl: string, report?: string) => {
    setHistory((prevHistory) => [...prevHistory, { imageUrl, report: report || '' }]);
  };  
  
  return (
    <div className={`app-container ${isVertical ? 'vertical' : ''}`}>
      <NavBar onViewChange={setView} />
      <div className="content">
        {view === 'home' && <Home />}
        {view === 'upload' && <ImageUpload />}
        {view === 'camera' && <Camera onAddToHistory={onAddToHistory}/>}
        {view === 'violation' && <ViolationResults />}
        {view === 'history' && <HistoryPage history={history} />}
      </div>
    </div>
  );
};

export default App;
