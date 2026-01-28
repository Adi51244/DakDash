import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import TrackingPage from './pages/TrackingPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/track" element={<TrackingPage />} />
    </Routes>
  )
}

export default App
