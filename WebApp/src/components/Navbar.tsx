import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import BradyLogo from "../assets/bradyLogo.svg";
import "./NavBar.css";

const NavBar: React.FC = () => {
  const switchViewWidth = 1000;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVertical, setIsVertical] = useState(window.innerWidth <= switchViewWidth);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    localStorage.getItem("theme") === "dark"
  );
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerWidth <= switchViewWidth);
      if (window.innerWidth > switchViewWidth) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <nav className={`navbar ${isVertical ? "vertical" : ""}`}>
      {/* Logo - Always Available */}
      <Link to="/" className="navbar-logo" onClick={() => setIsDropdownOpen(false)}>
        <img src={BradyLogo} alt="Brady Corporation Logo" className="navbar-logo-img" />
      </Link>

      {/* Desktop Navigation */}
      {!isVertical && (
        <div className="navbar-buttons">
          {location.pathname !== "/" && (
            <Link to="/" className="home-link">Home</Link>
          )}

          {location.pathname !== "/" && (
            <>
              <Link to="/upload" className={location.pathname === "/upload" ? "active" : ""}>Upload</Link>
              <Link to="/camera" className={location.pathname === "/camera" ? "active" : ""}>Camera</Link>
              <Link to="/reports" className={location.pathname === "/reports" ? "active" : ""}>Reports</Link>
              <Link to="/pockethazmapp" className={location.pathname === "/pockethazmapp" ? "active" : ""}>Pocket Hazmapp</Link>
            </>
          )}
        </div>
      )}

      {/* Dark Mode Toggle - Desktop */}
      {!isVertical && (
        <div className="dark-mode-toggle">
          <span>Dark Mode</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={() => setIsDarkMode(!isDarkMode)}
            />
            <span className="slider round"></span>
          </label>
        </div>
      )}

      {/* Mobile Menu */}
      {isVertical && (
        <div className="dropdown" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="dropdown-toggle"
            aria-label="Toggle menu"
          >
            ☰
          </button>
          
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {location.pathname !== "/" && (
                <Link to="/" className="home-link" onClick={() => setIsDropdownOpen(false)}>Home</Link>
              )}

              {location.pathname !== "/" && (
                <>
                  <Link to="/upload" className={location.pathname === "/upload" ? "active" : ""} onClick={() => setIsDropdownOpen(false)}>Upload</Link>
                  <Link to="/camera" className={location.pathname === "/camera" ? "active" : ""} onClick={() => setIsDropdownOpen(false)}>Camera</Link>
                  <Link to="/reports" className={location.pathname === "/reports" ? "active" : ""} onClick={() => setIsDropdownOpen(false)}>Reports</Link>
                  <Link to="/pockethazmapp" className={location.pathname === "/pockethazmapp" ? "active" : ""} onClick={() => setIsDropdownOpen(false)}>Pocket Hazmapp</Link>
                </>
              )}

              {/* Dark Mode Toggle - Mobile */}
              <div className="dark-mode-toggle">
                <span>Dark Mode</span>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={isDarkMode} 
                    onChange={() => setIsDarkMode(!isDarkMode)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
