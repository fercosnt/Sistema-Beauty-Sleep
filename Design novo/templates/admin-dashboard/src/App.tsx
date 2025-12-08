import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { auth } from './lib/auth'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated())
  const navigate = useNavigate()

  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated())
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
    navigate('/dashboard')
  }

  const handleLogout = () => {
    auth.logout()
    setIsAuthenticated(false)
    navigate('/login')
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardPage onLogout={handleLogout} />} />
      <Route path="/settings" element={<SettingsPage onLogout={handleLogout} />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
