import { Route, Routes } from 'react-router-dom'
import Analyze from '@/pages/Analyze'
import Clean from '@/pages/Clean'
import Home from '@/pages/Home'
import Report from '@/pages/Report'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/clean" element={<Clean />} />
      <Route path="/analyze" element={<Analyze />} />
      <Route path="/report" element={<Report />} />
    </Routes>
  )
}

export default App
