import MainLayout from './layouts/MainLayout'
import AboutPage from './pages/AboutPage'
import HomePage from './pages/Home/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import MakePage from './pages/Make/Make'
import './App.css'
import Gallery from './pages/Gallery/Gallery'
import TraceLearningBoard from './pages/Learn/TraceLearningBoard'
import { BrowserRouter, Routes, Route, } from 'react-router-dom'
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
    path: '/make',
    element: <MakePage />,
  },
  {
    path: '/learn',
    element: <TraceLearningBoard />,
  }
]

function App() {
  return (
    <BrowserRouter>
      <TopHoverMenu />
      <Routes>
        <Route path='/Learn' element={<TraceLearningBoard />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/Gallery" element={<Gallery />} />
        <Route path="/Make" element={<MakePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
