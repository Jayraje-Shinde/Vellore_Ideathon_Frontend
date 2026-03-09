import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Container, Card, CardContent, Typography,
  TextField, Button, Alert, InputAdornment, IconButton,
  Divider, CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, Construction } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'builder' ? '/builder/dashboard' : '/consultant/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', display: 'flex', alignItems: 'center', py: 4 }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Box sx={{ bgcolor: 'primary.main', borderRadius: 1, p: 0.75, display: 'flex' }}>
              <Construction sx={{ color: 'white', fontSize: 22 }} />
            </Box>
            <Typography variant="h5" fontWeight={700} color="primary.main">CivilBuild</Typography>
          </Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>Welcome back</Typography>
          <Typography variant="body2" color="text.secondary">Sign in to your account to continue</Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Email Address" name="email" type="email"
                fullWidth required value={form.email}
                onChange={handleChange}
                sx={{ mb: 2.5 }}
                autoComplete="email"
              />

              <TextField
                label="Password" name="password" type={showPwd ? 'text' : 'password'}
                fullWidth required value={form.password}
                onChange={handleChange}
                sx={{ mb: 3 }}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPwd(!showPwd)} edge="end" size="small">
                        {showPwd ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button
                type="submit" variant="contained" fullWidth size="large"
                disabled={loading}
                sx={{ py: 1.5, fontSize: '1rem', fontWeight: 600 }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="body2" color="text.secondary" textAlign="center">
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#1565C0', fontWeight: 500, textDecoration: 'none' }}>
                Create one
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
