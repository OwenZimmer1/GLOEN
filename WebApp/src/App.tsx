import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import NavBar from './components/Navbar';
import Home from './pages/home';
import ImageUpload from './components/ImageUpload';
import Camera from './components/Camera';
import ViolationResults from './pages/ViolationResults';
import HistoryPage from './pages/HistoryPage';
import PocketHazmapp from './components/PocketHazmapp';
import { LoadingStateProvider } from './components/LoadingState';
import { Violation } from './pages/ViolationResults';

const App: React.FC = () => {
  const [isVertical, setIsVertical] = useState(window.innerWidth < window.innerHeight);
  const [history, setHistory] = useState<{ 
    imageUrl: string; 
    report: string; 
    processedData: Violation[] // ✅ Made required
  }[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerWidth < window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onAddToHistory = (imageUrl: string, report?: string, processedData?: Violation[]) => {
    setHistory((prevHistory) => [...prevHistory, { 
      imageUrl, 
      report: report || '', 
      processedData: processedData || [] // ✅ Default to empty array if not provided
    }]);
  };

  return (
    <LoadingStateProvider>
      <Router>
        <div className={`app-container ${isVertical ? 'vertical' : ''}`}>
          <NavBar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/upload" 
                element={<ImageUpload onAddToHistory={onAddToHistory} />} 
              />
              <Route 
                path="/camera" 
                element={<Camera onAddToHistory={onAddToHistory} />} 
              />
              <Route path="/violation" element={<ViolationResults />} />
              <Route path="/reports" element={<HistoryPage history={history} />} />
              <Route path="/pockethazmapp" element={<PocketHazmapp />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </LoadingStateProvider>
  );
};

export default App;