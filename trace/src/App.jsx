import AboutPage from './pages/AboutPage'
import HomePage from './pages/Home/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import MakePage from './pages/Make/Make'
import './App.css'
import Gallery from './pages/Gallery/Gallery'
import TraceLearningBoard from './pages/Learn/TraceLearningBoard'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import TopHoverMenu from './components/TopHoverMenu/TopHoverMenu'

const ROUTES = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/gallery',
    element: <Gallery />,
  },
  {
    path: '/learn',
    element: <TraceLearningBoard />,
  },
  {
    path: '/make',
    element: <MakePage />,
  }
]

function App() {
  return (
    <BrowserRouter>
      <TopHoverMenu />
      <Routes>
        {ROUTES.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        <Route path="/Learn" element={<Navigate to="/learn" replace />} />
        <Route path="/Gallery" element={<Navigate to="/gallery" replace />} />
        <Route path="/Make" element={<Navigate to="/make" replace />} />
        <Route path="/Homepage" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
