import { useState } from 'react';
import BradyLogo from './assets/bradyCorpLogo.png';
import './App.css';
import Home from './pages/home';
import ImageUpload from './components/ImageUpload';

function App() {
  const [view, setView] = useState('home');

  return (
    <>
      <div className="app-container">
        <img src={BradyLogo} alt="Brady Corporation Logo" className="logo" />

        <div className="button-container">
          <button onClick={() => setView('home')}>Home</button>
          <button onClick={() => setView('upload')}>Upload</button>
        </div>

        {view === 'home' && <Home />}
        {view === 'upload' && <ImageUpload />}
      </div>
    </>
  );
}

export default App;