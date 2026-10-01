import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ConfigError from './components/ConfigError.jsx'
import { configProblems } from './config.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {configProblems.length > 0 ? (
      <ConfigError problems={configProblems} />
    ) : (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )}
  </StrictMode>,
)
