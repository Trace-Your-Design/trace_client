import MainLayout from './layouts/MainLayout'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'
import Gallery from './pages/Gallery/Gallery'
import TraceLearningBoard from './pages/Learn/TraceLearningBoard'
import { BrowserRouter, Routes, Route, } from 'react-router-dom'


const ROUTES = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
]

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<TraceLearningBoard />} />
        <Route path="/HomePage" element={<Gallery />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
