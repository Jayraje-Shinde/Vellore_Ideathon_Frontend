import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import BuilderDashboard from './pages/builder/BuilderDashboard';
import UploadBuilding from './pages/builder/UploadBuilding';
import ConsultantDashboard from './pages/consultant/ConsultantDashboard';
import BuildingDetails from './pages/BuildingDetails';
import Chat from './pages/Chat';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1 }}>
        <Routes>
          {/* Public */}
          <Route path="/" element={
            user
              ? <Navigate to={user.role === 'builder' ? '/builder/dashboard' : '/consultant/dashboard'} replace />
              : <Landing />
          } />
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />

          {/* Builder routes */}
          <Route path="/builder/dashboard" element={
            <ProtectedRoute role="builder"><BuilderDashboard /></ProtectedRoute>
          } />
          <Route path="/builder/upload" element={
            <ProtectedRoute role="builder"><UploadBuilding /></ProtectedRoute>
          } />

          {/* Consultant routes */}
          <Route path="/consultant/dashboard" element={
            <ProtectedRoute role="consultant"><ConsultantDashboard /></ProtectedRoute>
          } />

          {/* Shared protected routes */}
          <Route path="/buildings/:id" element={
            <ProtectedRoute><BuildingDetails /></ProtectedRoute>
          } />
          <Route path="/chat/:buildingId" element={
            <ProtectedRoute><Chat /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
