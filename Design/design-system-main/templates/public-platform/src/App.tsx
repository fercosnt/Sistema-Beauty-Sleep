import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { auth } from './lib/auth'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

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
    navigate('/')
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <DashboardPage onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
