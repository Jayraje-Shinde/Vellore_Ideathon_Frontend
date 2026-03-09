import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'

import theme from './theme'
import { AuthProvider, useAuth } from './context/AuthContext'

import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import BuilderDashboard from './pages/builder/BuilderDashboard'
import UploadBuilding from './pages/builder/UploadBuilding'
import ConsultantDashboard from './pages/consultant/ConsultantDashboard'
import BuildingDetails from './pages/BuildingDetails'
import Chat from './pages/Chat'

function AppRoutes() {
  const { user } = useAuth()
  const defaultDash =
    user?.role === 'builder' ? '/builder/dashboard' : '/consultant/dashboard'

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1 }}>
        <Routes>
          {/* Public */}
          <Route
            path="/"
            element={user ? <Navigate to={defaultDash} replace /> : <Landing />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to={defaultDash} replace /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to={defaultDash} replace /> : <Register />}
          />

          {/* Builder */}
          <Route
            path="/builder/dashboard"
            element={
              <ProtectedRoute role="builder">
                <BuilderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/builder/upload"
            element={
              <ProtectedRoute role="builder">
                <UploadBuilding />
              </ProtectedRoute>
            }
          />

          {/* Consultant */}
          <Route
            path="/consultant/dashboard"
            element={
              <ProtectedRoute role="consultant">
                <ConsultantDashboard />
              </ProtectedRoute>
            }
          />

          {/* Shared protected */}
          <Route
            path="/buildings/:id"
            element={
              <ProtectedRoute>
                <BuildingDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:buildingId"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  )
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
