import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { auth } from './lib/auth'

// Public pages
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/public/LoginPage'
import DashboardPage from './pages/public/DashboardPage'

// Admin pages
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated())
  const [isAdmin, setIsAdmin] = useState(auth.isAdmin())
  const navigate = useNavigate()

  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated())
    setIsAdmin(auth.isAdmin())
  }, [])

  const handleLogin = (redirect: string) => {
    setIsAuthenticated(true)
    setIsAdmin(auth.isAdmin())
    navigate(redirect)
  }

  const handleLogout = (isAdminLogout: boolean) => {
    auth.logout()
    setIsAuthenticated(false)
    setIsAdmin(false)
    navigate(isAdminLogout ? '/admin/login' : '/')
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage onLogin={() => handleLogin('/dashboard')} />} />
      <Route
        path="/dashboard"
        element={
          isAuthenticated && !isAdmin ? (
            <DashboardPage onLogout={() => handleLogout(false)} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage onLogin={() => handleLogin('/admin/dashboard')} />} />
      <Route
        path="/admin/dashboard"
        element={
          isAuthenticated && isAdmin ? (
            <AdminDashboardPage onLogout={() => handleLogout(true)} />
          ) : (
            <Navigate to="/admin/login" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
