import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <img src="/path/to/logo.png" alt="Logo" className="navbar-logo" />
      <div className="navbar-links">
        <Link to="/home">Home</Link>
        <Link to="./upload">Upload</Link>
        <Link to="/camera">Camera</Link>
        <Link to="/violation">Display Violation</Link>
      </div>
    </nav>
  );
};

export default Navbar;
