import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Container, Card, CardContent, Typography, TextField,
  Button, Alert, ToggleButton, ToggleButtonGroup, InputAdornment,
  IconButton, CircularProgress, Divider
} from '@mui/material';
import {
  Visibility, VisibilityOff, Construction, Engineering,
  CloudUpload
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'builder' });
  const [certFile, setCertFile] = useState(null);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (form.role === 'consultant' && certFile) formData.append('certification_file', certFile);
      const user = await register(formData);
      navigate(user.role === 'builder' ? '/builder/dashboard' : '/consultant/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', display: 'flex', alignItems: 'center', py: 5 }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Box sx={{ bgcolor: 'primary.main', borderRadius: 1, p: 0.75, display: 'flex' }}>
              <Construction sx={{ color: 'white', fontSize: 22 }} />
            </Box>
            <Typography variant="h5" fontWeight={700} color="primary.main">CivilBuild</Typography>
          </Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>Create your account</Typography>
          <Typography variant="body2" color="text.secondary">Join the platform to improve your construction rating</Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              {/* Role selector */}
              <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>I am a</Typography>
              <ToggleButtonGroup
                value={form.role}
                exclusive
                onChange={(_, v) => v && setForm({ ...form, role: v })}
                fullWidth
                sx={{ mb: 3 }}
              >
                <ToggleButton value="builder" sx={{ py: 1.5, gap: 1 }}>
                  <Construction fontSize="small" />
                  Builder
                </ToggleButton>
                <ToggleButton value="consultant" sx={{ py: 1.5, gap: 1 }}>
                  <Engineering fontSize="small" />
                  Consultant
                </ToggleButton>
              </ToggleButtonGroup>

              <TextField
                label="Full Name" name="name" fullWidth required
                value={form.name} onChange={handleChange} sx={{ mb: 2.5 }}
              />
              <TextField
                label="Email Address" name="email" type="email" fullWidth required
                value={form.email} onChange={handleChange} sx={{ mb: 2.5 }}
                autoComplete="email"
              />
              <TextField
                label="Password" name="password"
                type={showPwd ? 'text' : 'password'}
                fullWidth required value={form.password}
                onChange={handleChange}
                helperText="Minimum 6 characters"
                sx={{ mb: form.role === 'consultant' ? 2.5 : 3 }}
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

              {/* Consultant certification upload */}
              {form.role === 'consultant' && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" fontWeight={500} gutterBottom>
                    Certification Document <Typography component="span" color="text.secondary" variant="caption">(PDF or image)</Typography>
                  </Typography>
                  <Button
                    component="label" variant="outlined" startIcon={<CloudUpload />}
                    fullWidth sx={{ py: 1.5, borderStyle: 'dashed' }}
                  >
                    {certFile ? certFile.name : 'Upload Certification File'}
                    <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setCertFile(e.target.files[0])} />
                  </Button>
                </Box>
              )}

              <Button
                type="submit" variant="contained" fullWidth size="large"
                disabled={loading}
                sx={{ py: 1.5, fontSize: '1rem', fontWeight: 600 }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#1565C0', fontWeight: 500, textDecoration: 'none' }}>
                Sign in
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
