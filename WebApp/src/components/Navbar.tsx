import React, { useState } from 'react';
import BradyLogo from '../assets/bradyCorpLogo.png';

interface NavBarProps {
  onViewChange: (view: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ onViewChange }) => {
  const [activeView, setActiveView] = useState('home');

  const handleViewChange = (view: string) => {
    setActiveView(view);
    onViewChange(view);
  };

  return (
    <nav className="navbar">
      <img src={BradyLogo} alt="Brady Corporation Logo" className="navbar-logo" />
      <div className="navbar-buttons">
        <button 
          className={activeView === 'home' ? 'active' : ''}
          onClick={() => handleViewChange('home')}
        >
          Home
        </button>
        <button 
          className={activeView === 'upload' ? 'active' : ''}
          onClick={() => handleViewChange('upload')}
        >
          Upload
        </button>
        <button 
          className={activeView === 'camera' ? 'active' : ''}
          onClick={() => handleViewChange('camera')}
        >
          Camera
        </button>
        <button 
          className={activeView === 'violation' ? 'active' : ''}
          onClick={() => handleViewChange('violation')}
        >
          Display Violation
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
