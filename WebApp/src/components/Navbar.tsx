import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import BradyLogo from "../assets/bradyLogo.svg";
import "./NavBar.css";

const NavBar: React.FC = () => {
  const switchViewWidth = 768;
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

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Navigation links array for easier maintenance
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/upload", label: "Upload" },
    { to: "/camera", label: "Camera" },
    { to: "/history", label: "History" },
    { to: "/pockethazmapp", label: "Pocket Hazmapp" },
  ];

  return (
    <nav className={`navbar ${isVertical ? "vertical" : ""}`}>
      {/* Logo */}
      <Link to="/" className="navbar-logo" onClick={() => setIsDropdownOpen(false)}>
        <img src={BradyLogo} alt="Brady Corporation Logo" className="navbar-logo-img" />
      </Link>

      {/* Desktop Navigation */}
      {!isVertical && (
        <div className="navbar-buttons">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={location.pathname === link.to ? "active" : ""}
            >
              {link.label}
            </Link>
          ))}
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
            onClick={toggleDropdown} 
            className="dropdown-toggle"
            aria-label="Toggle menu"
          >
            {"☰"}
          </button>
          
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={location.pathname === link.to ? "active" : ""}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Dark Mode Toggle - Mobile */}
              <div 
                className="dark-mode-toggle"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
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