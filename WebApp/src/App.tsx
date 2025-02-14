import React, { useState } from 'react';
import './App.css';
import NavBar from './components/Navbar';
import Home from './pages/home';
import ImageUpload from './components/ImageUpload';
import Camera from './components/Camera';
import ViolationResults from './components/ViolationResults';

const App: React.FC = () => {
  const [view, setView] = useState('home');

  return (
    <div className="app-container">
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
