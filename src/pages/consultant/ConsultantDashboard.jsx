import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Snackbar from '@mui/material/Snackbar'
import SearchIcon from '@mui/icons-material/Search'
import EngineeringIcon from '@mui/icons-material/Engineering'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ScheduleIcon from '@mui/icons-material/Schedule'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { buildingAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import BuildingCard from '../../components/BuildingCard'

function StatCard({ icon, label, value, color }) {
  return (
    <Card>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
        <Box
          sx={{
            bgcolor: `${color}.light`,
            borderRadius: 2,
            p: 1.5,
            color: `${color}.main`,
            display: 'flex',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h4" fontWeight={700}>{value}</Typography>
          <Typography variant="body2" color="text.secondary">{label}</Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function ConsultantDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [buildings, setBuildings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [tab, setTab] = useState('pending')
  const [search, setSearch] = useState('')
  const [ratingFilter, setRatingFilter] = useState('all')

  useEffect(() => {
    fetchBuildings()
  }, [])

  const fetchBuildings = async () => {
    try {
      const res = await buildingAPI.getAll()
      setBuildings(res.data.buildings)
    } catch {
      setError('Failed to load building requests.')
    } finally {
      setLoading(false)
    }
  }

  const handleAssign = async (id) => {
    try {
      await buildingAPI.assign(id)
      setToast('Consultation started! Redirecting to chat…')
      await fetchBuildings()
      navigate(`/chat/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign.')
    }
  }

  const counts = {
    pending: buildings.filter((b) => b.status === 'pending').length,
    in_consultation: buildings.filter((b) => b.status === 'in_consultation').length,
    completed: buildings.filter((b) => b.status === 'completed').length,
    mine: buildings.filter(
      (b) => b.consultant_id?._id === user?.id || b.consultant_id === user?.id
    ).length,
  }

  const filtered = buildings
    .filter((b) => {
      if (tab === 'mine')
        return b.consultant_id?._id === user?.id || b.consultant_id === user?.id
      return b.status === tab
    })
    .filter((b) => ratingFilter === 'all' || b.rating === Number(ratingFilter))
    .filter(
      (b) =>
        !search ||
        b.building_name.toLowerCase().includes(search.toLowerCase()) ||
        b.location.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700}>Consultant Dashboard</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Welcome, {user?.name} — review and accept building consultation requests
          </Typography>
        </Box>

        {/* Stats */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          <Grid item xs={6} md={3}>
            <StatCard icon={<ScheduleIcon />} label="Awaiting Review" value={counts.pending} color="warning" />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatCard icon={<EngineeringIcon />} label="In Progress" value={counts.in_consultation} color="primary" />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatCard icon={<CheckCircleIcon />} label="Completed" value={counts.completed} color="success" />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatCard icon={<AssignmentIcon />} label="My Cases" value={counts.mine} color="secondary" />
          </Grid>
        </Grid>

        <Card>
          <Box
            sx={{
              px: 3,
              pt: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label={`Pending (${counts.pending})`} value="pending" />
              <Tab label={`In Consultation (${counts.in_consultation})`} value="in_consultation" />
              <Tab label={`Completed (${counts.completed})`} value="completed" />
              <Tab label={`Mine (${counts.mine})`} value="mine" />
            </Tabs>

            <Box sx={{ display: 'flex', gap: 1.5, pb: 1 }}>
              <TextField
                placeholder="Search buildings…"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 200 }}
              />
              <FormControl size="small" sx={{ minWidth: 130 }}>
                <InputLabel>Rating</InputLabel>
                <Select
                  value={ratingFilter}
                  label="Rating"
                  onChange={(e) => setRatingFilter(e.target.value)}
                >
                  <MenuItem value="all">All Ratings</MenuItem>
                  {[1, 2, 3, 4].map((r) => (
                    <MenuItem key={r} value={r}>{r} Star</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          <CardContent sx={{ p: 3 }}>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {loading ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : filtered.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <EngineeringIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">No buildings found</Typography>
                <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                  Try adjusting filters or check back later.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filtered.map((b) => (
                  <Grid item xs={12} sm={6} lg={4} key={b._id}>
                    <BuildingCard building={b} role="consultant" onAssign={handleAssign} />
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      </Container>

      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast('')}
        message={toast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  )
}
