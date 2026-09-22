import { NavLink, Route, Routes } from 'react-router-dom'
import Analyze from '@/pages/Analyze'
import Clean from '@/pages/Clean'
import Home from '@/pages/Home'
import Report from '@/pages/Report'

const routes = [
  { path: '/', label: 'Home' },
  { path: '/clean', label: 'Clean' },
  { path: '/analyze', label: 'Analyze' },
  { path: '/report', label: 'Report' },
]

function App() {
  return (
    <div>
      <nav className="flex gap-4 border-b border-border p-4">
        {routes.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            className={({ isActive }) =>
              isActive ? 'font-medium text-primary' : 'text-muted-foreground'
            }
          >
            {route.label}
          </NavLink>
        ))}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clean" element={<Clean />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </div>
  )
}

export default App
