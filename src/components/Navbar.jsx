import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import LogoutIcon from '@mui/icons-material/Logout'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ConstructionIcon from '@mui/icons-material/Construction'
import EngineeringIcon from '@mui/icons-material/Engineering'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, isBuilder } = useAuth()
  const navigate = useNavigate()
  const [anchor, setAnchor] = useState(null)

  const dashPath = isBuilder ? '/builder/dashboard' : '/consultant/dashboard'

  const handleLogout = () => {
    logout()
    setAnchor(null)
    navigate('/')
  }

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: '1px solid', borderColor: 'grey.200', bgcolor: 'white' }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, minHeight: '64px !important' }}>
        {/* Logo */}
        <Box
          component={Link}
          to={user ? dashPath : '/'}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            textDecoration: 'none',
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              bgcolor: 'primary.main',
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ConstructionIcon sx={{ color: 'white', fontSize: 18 }} />
          </Box>
          <Typography
            variant="h6"
            fontWeight={700}
            color="primary.main"
            sx={{ letterSpacing: '-0.3px' }}
          >
            CivilBuild
          </Typography>
        </Box>

        {/* Right side */}
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip
              size="small"
              label={isBuilder ? 'Builder' : 'Consultant'}
              color={isBuilder ? 'primary' : 'secondary'}
              variant="outlined"
              icon={
                isBuilder ? (
                  <ConstructionIcon sx={{ fontSize: '14px !important' }} />
                ) : (
                  <EngineeringIcon sx={{ fontSize: '14px !important' }} />
                )
              }
              sx={{ display: { xs: 'none', sm: 'flex' }, fontSize: '0.75rem' }}
            />

            <Button
              onClick={(e) => setAnchor(e.currentTarget)}
              endIcon={<KeyboardArrowDownIcon />}
              sx={{ color: 'text.primary', gap: 1, px: 1, '&:hover': { bgcolor: 'grey.50' } }}
            >
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: 'primary.main',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                {user.name}
              </Typography>
            </Button>

            <Menu
              anchorEl={anchor}
              open={Boolean(anchor)}
              onClose={() => setAnchor(null)}
              PaperProps={{
                elevation: 3,
                sx: { mt: 1, minWidth: 200, borderRadius: 2 },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="body2" fontWeight={600}>
                  {user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem
                onClick={() => {
                  navigate(dashPath)
                  setAnchor(null)
                }}
              >
                <DashboardIcon sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary' }} />
                <Typography variant="body2">Dashboard</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <LogoutIcon sx={{ fontSize: 18, mr: 1.5 }} />
                <Typography variant="body2">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="text" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button variant="contained" onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}
