import { Link } from "react-router-dom";
import "./Home.css"; // ✅ Add a CSS file for styling

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Hazmapp</h1>
      
      {/* ✅ Navigation Buttons */}
      <div className="home-buttons">
        <Link to="/upload" className="home-button">Upload</Link>
        <Link to="/camera" className="home-button">Camera</Link>
        <Link to="/Reports" className="home-button">Reports</Link>
        <Link to="/pockethazmapp" className="home-button">Pocket Hazmapp</Link>
      </div>
    </div>
  );
};

export default Home;