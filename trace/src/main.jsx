import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import Gallery from './pages/Gallery/Gallery.jsx'
import TraceLearningBoard from './pages/Learn/TraceLearningBoard.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      {/* <Gallery /> */}
      <App />
  </StrictMode>,
)
