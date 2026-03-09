import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Grid, Typography, Button, Card, CardContent,
  Alert, CircularProgress, Divider, Chip, Tabs, Tab
} from '@mui/material';
import { Add, Construction, Engineering, CheckCircle, Schedule } from '@mui/icons-material';
import { buildingAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import BuildingCard from '../../components/BuildingCard';

const StatCard = ({ icon, label, value, color }) => (
  <Card>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
      <Box sx={{ bgcolor: `${color}.light`, borderRadius: 2, p: 1.5, color: `${color}.main`, display: 'flex' }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="h4" fontWeight={700}>{value}</Typography>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
      </Box>
    </CardContent>
  </Card>
);

const BuilderDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('all');

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      const res = await buildingAPI.getMine();
      setBuildings(res.data.buildings);
    } catch {
      setError('Failed to load buildings.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = tab === 'all' ? buildings : buildings.filter(b => b.status === tab);

  const counts = {
    all: buildings.length,
    pending: buildings.filter(b => b.status === 'pending').length,
    in_consultation: buildings.filter(b => b.status === 'in_consultation').length,
    completed: buildings.filter(b => b.status === 'completed').length,
  };

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700}>My Dashboard</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Welcome back, {user?.name} — manage your building consultations
            </Typography>
          </Box>
          <Button
            variant="contained" startIcon={<Add />} size="large"
            onClick={() => navigate('/builder/upload')}
            sx={{ px: 3 }}
          >
            Upload Building
          </Button>
        </Box>

        {/* Stat cards */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          <Grid item xs={6} md={3}><StatCard icon={<Construction />} label="Total Buildings" value={counts.all} color="primary" /></Grid>
          <Grid item xs={6} md={3}><StatCard icon={<Schedule />} label="Pending" value={counts.pending} color="warning" /></Grid>
          <Grid item xs={6} md={3}><StatCard icon={<Engineering />} label="In Consultation" value={counts.in_consultation} color="info" /></Grid>
          <Grid item xs={6} md={3}><StatCard icon={<CheckCircle />} label="Completed" value={counts.completed} color="success" /></Grid>
        </Grid>

        {/* Buildings list */}
        <Card>
          <Box sx={{ px: 3, pt: 2 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab label={`All (${counts.all})`} value="all" />
              <Tab label={`Pending (${counts.pending})`} value="pending" />
              <Tab label={`In Consultation (${counts.in_consultation})`} value="in_consultation" />
              <Tab label={`Completed (${counts.completed})`} value="completed" />
            </Tabs>
          </Box>

          <CardContent sx={{ p: 3 }}>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {loading ? (
              <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress /></Box>
            ) : filtered.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Construction sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {tab === 'all' ? 'No buildings uploaded yet' : `No ${tab.replace('_', ' ')} buildings`}
                </Typography>
                {tab === 'all' && (
                  <Button variant="contained" startIcon={<Add />} sx={{ mt: 2 }} onClick={() => navigate('/builder/upload')}>
                    Upload Your First Building
                  </Button>
                )}
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filtered.map(b => (
                  <Grid item xs={12} sm={6} lg={4} key={b._id}>
                    <BuildingCard building={b} role="builder" />
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default BuilderDashboard;
