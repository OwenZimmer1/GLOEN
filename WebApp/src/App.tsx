import { useState } from 'react'
import viteLogo from './assets/bradyCorpLogo.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>OSHA Violaters</h1>
    </>
  )
}

export default App
