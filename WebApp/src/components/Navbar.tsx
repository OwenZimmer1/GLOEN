import React, { useState, useEffect } from "react";
import BradyLogo from "../assets/bradyCorpLogo.png";

interface NavBarProps {
  onViewChange: (view: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ onViewChange }) => {
  const switchViewWidth = 768;
  const [activeView, setActiveView] = useState("home");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVertical, setIsVertical] = useState(
    window.innerWidth <= switchViewWidth
  );

  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerWidth <= switchViewWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleViewChange = (view: string) => {
    setActiveView(view);
    onViewChange(view);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const renderButtons = () => (
    <>
      <button
        className={activeView === "home" ? "active" : ""}
        onClick={() => handleViewChange("home")}
      >
        Home
      </button>
      <button
        className={activeView === "upload" ? "active" : ""}
        onClick={() => handleViewChange("upload")}
      >
        Upload
      </button>
      <button
        className={activeView === "camera" ? "active" : ""}
        onClick={() => handleViewChange("camera")}
      >
        Camera
      </button>
      <button
        className={activeView === "violation" ? "active" : ""}
        onClick={() => handleViewChange("violation")}
      >
        Display Violation
      </button>
    </>
  );

  return (
    <nav className={`navbar ${isVertical ? "vertical" : ""}`}>
      <img
        src={BradyLogo}
        alt="Brady Corporation Logo"
        className="navbar-logo"
      />
      {isVertical ? (
        <div className="dropdown">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            Menu
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">{renderButtons()}</div>
          )}
        </div>
      ) : (
        <div className="navbar-buttons">{renderButtons()}</div>
      )}
    </nav>
  );
};

export default NavBar;
