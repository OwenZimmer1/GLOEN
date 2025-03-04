import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import BradyLogo from "../assets/bradyLogo.svg";
import "./NavBar.css";

// Navigation bar component with responsive design and theme switching
const NavBar: React.FC = () => {
  // Breakpoint for switching between desktop/mobile layouts
  const switchViewWidth = 1000;

  // State management for UI elements
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVertical, setIsVertical] = useState(
    window.innerWidth <= switchViewWidth
  );
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    localStorage.getItem("theme") === "dark"
  );

  // Router and DOM references
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle window resizing for responsive layout
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

  // Theme switching logic with localStorage persistence
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <nav className={`navbar ${isVertical ? "vertical" : ""}`}>
      {/* Logo link (always visible) */}
      <Link
        to="/"
        className="navbar-logo"
        onClick={() => setIsDropdownOpen(false)}
      >
        <img
          src={BradyLogo}
          alt="Brady Corporation Logo"
          className="navbar-logo-img"
        />
      </Link>

      {/* Desktop layout navigation */}
      {!isVertical && (
        <div className="navbar-buttons">
          {/* Conditional rendering of navigation links */}
          {location.pathname !== "/" && (
            <Link to="/" className="home-link">
              Home
            </Link>
          )}

          {location.pathname !== "/" && (
            <>
              <Link
                to="/upload"
                className={location.pathname === "/upload" ? "active" : ""}
              >
                Upload
              </Link>
              <Link
                to="/camera"
                className={location.pathname === "/camera" ? "active" : ""}
              >
                Camera
              </Link>
              <Link
                to="/reports"
                className={location.pathname === "/reports" ? "active" : ""}
              >
                Reports
              </Link>
              <Link
                to="/pockethazmapp"
                className={
                  location.pathname === "/pockethazmapp" ? "active" : ""
                }
              >
                Pocket Hazmapp
              </Link>
            </>
          )}
        </div>
      )}

      {/* Theme toggle for desktop */}
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

      {/* Mobile layout dropdown menu */}
      {isVertical && (
        <div className="dropdown" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="dropdown-toggle"
            aria-label="Toggle menu"
          >
            ☰
          </button>

          {/* Dropdown menu content */}
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {/* Conditional home link */}
              {location.pathname !== "/" && (
                <Link
                  to="/"
                  className="home-link"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Home
                </Link>
              )}

              {/* Navigation links with active state */}
              {location.pathname !== "/" && (
                <>
                  <Link
                    to="/upload"
                    className={location.pathname === "/upload" ? "active" : ""}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Upload
                  </Link>
                  <Link
                    to="/camera"
                    className={location.pathname === "/camera" ? "active" : ""}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Camera
                  </Link>
                  <Link
                    to="/reports"
                    className={location.pathname === "/reports" ? "active" : ""}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Reports
                  </Link>
                  <Link
                    to="/pockethazmapp"
                    className={
                      location.pathname === "/pockethazmapp" ? "active" : ""
                    }
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Pocket Hazmapp
                  </Link>
                </>
              )}

              {/* Theme toggle for mobile */}
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
