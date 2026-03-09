import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import ConstructionIcon from '@mui/icons-material/Construction'
import EngineeringIcon from '@mui/icons-material/Engineering'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useAuth } from '../../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'builder' })
  const [certFile, setCertFile] = useState(null)
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (form.role === 'consultant' && certFile) fd.append('certification_file', certFile)
      const user = await register(fd)
      navigate(user.role === 'builder' ? '/builder/dashboard' : '/consultant/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'grey.50',
        display: 'flex',
        alignItems: 'center',
        py: 5,
      }}
    >
      <Container maxWidth="sm">
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Box sx={{ bgcolor: 'primary.main', borderRadius: 1.5, p: 0.8, display: 'flex' }}>
              <ConstructionIcon sx={{ color: 'white', fontSize: 22 }} />
            </Box>
            <Typography variant="h5" fontWeight={700} color="primary.main">
              CivilBuild
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Create your account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join the platform to improve your construction rating
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              {/* Role toggle */}
              <Typography variant="body2" fontWeight={500} gutterBottom color="text.secondary">
                I am a
              </Typography>
              <ToggleButtonGroup
                value={form.role}
                exclusive
                fullWidth
                onChange={(_, v) => v && setForm({ ...form, role: v })}
                sx={{ mb: 3 }}
              >
                <ToggleButton value="builder" sx={{ py: 1.5, gap: 1 }}>
                  <ConstructionIcon fontSize="small" /> Builder
                </ToggleButton>
                <ToggleButton value="consultant" sx={{ py: 1.5, gap: 1 }}>
                  <EngineeringIcon fontSize="small" /> Consultant
                </ToggleButton>
              </ToggleButtonGroup>

              <TextField
                label="Full Name"
                name="name"
                fullWidth
                required
                value={form.name}
                onChange={handleChange}
                sx={{ mb: 2.5 }}
              />
              <TextField
                label="Email Address"
                name="email"
                type="email"
                fullWidth
                required
                value={form.email}
                onChange={handleChange}
                sx={{ mb: 2.5 }}
                autoComplete="email"
              />
              <TextField
                label="Password"
                name="password"
                type={showPwd ? 'text' : 'password'}
                fullWidth
                required
                value={form.password}
                onChange={handleChange}
                helperText="Minimum 6 characters"
                sx={{ mb: form.role === 'consultant' ? 2.5 : 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPwd(!showPwd)} edge="end" size="small">
                        {showPwd ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {form.role === 'consultant' && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" fontWeight={500} gutterBottom>
                    Certification Document
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 0.75 }}
                    >
                      (PDF or image)
                    </Typography>
                  </Typography>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{ py: 2, borderStyle: 'dashed', flexDirection: 'column', gap: 0.5 }}
                  >
                    <Typography variant="body2">
                      {certFile ? certFile.name : 'Click to upload certification file'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      PDF, JPG or PNG
                    </Typography>
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setCertFile(e.target.files[0])}
                    />
                  </Button>
                </Box>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ py: 1.4, fontWeight: 600, fontSize: '1rem' }}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Already have an account?{' '}
              <Link
                to="/login"
                style={{ color: '#1565C0', fontWeight: 600, textDecoration: 'none' }}
              >
                Sign in
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}
