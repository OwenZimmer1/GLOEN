import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import BradyLogo from "../assets/bradyCorpLogo.png";

const NavBar: React.FC = () => {
  const switchViewWidth = 768;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVertical, setIsVertical] = useState(
    window.innerWidth <= switchViewWidth
  );
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerWidth <= switchViewWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const renderButtons = () => (
    <>
      <Link to="/" className={location.pathname === "/" ? "active" : ""}>
        Home
      </Link>
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
        to="/history"
        className={location.pathname === "/history" ? "active" : ""}
      >
        History
      </Link>
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
