import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Grid, Card, CardContent, Typography, Button,
  Alert, CircularProgress, Divider, ImageList, ImageListItem,
  Dialog, DialogContent, IconButton, Chip, Avatar
} from '@mui/material';
import {
  ArrowBack, LocationOn, CalendarToday, Person, Chat,
  Engineering, ZoomIn, Close, CheckCircle, Description
} from '@mui/icons-material';
import { buildingAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/StarRating';
import StatusChip from '../../components/StatusChip';

const BuildingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isConsultant } = useAuth();
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightbox, setLightbox] = useState(null);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    buildingAPI.getById(id)
      .then(r => setBuilding(r.data.building))
      .catch(() => setError('Building not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAssign = async () => {
    setAssigning(true);
    try {
      await buildingAPI.assign(id);
      navigate(`/chat/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start consultation.');
    } finally {
      setAssigning(false);
    }
  };

  const handleComplete = async () => {
    try {
      await buildingAPI.complete(id, { consultant_notes: building.consultant_notes || '' });
      setBuilding(prev => ({ ...prev, status: 'completed' }));
    } catch {
      setError('Failed to complete consultation.');
    }
  };

  if (loading) return <Box sx={{ textAlign: 'center', py: 12 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ py: 8 }}><Container><Alert severity="error">{error}</Alert></Container></Box>;

  const { building_name, location, rating, description, status,
    certificate_file, photos, builder_id, consultant_id, consultant_notes, createdAt } = building;

  const isAssignedConsultant = consultant_id?._id === user?.id || consultant_id === user?.id;

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>Back</Button>

        <Grid container spacing={3}>
          {/* Main details */}
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="h4" fontWeight={700}>{building_name}</Typography>
                  <StatusChip status={status} size="medium" />
                </Box>

                <Box sx={{ display: 'flex', gap: 3, mb: 2.5, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">{location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                  <StarRating value={rating} max={5} size="medium" />
                  <Typography variant="body1" fontWeight={500} color="warning.main">{rating}/5 Star Certificate</Typography>
                </Box>

                {description && (
                  <>
                    <Divider sx={{ mb: 2.5 }} />
                    <Typography variant="body1" color="text.secondary" lineHeight={1.8}>{description}</Typography>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Photos */}
            {photos?.length > 0 && (
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Building Photos ({photos.length})
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <ImageList cols={3} gap={8} rowHeight={160}>
                    {photos.map((p, i) => (
                      <ImageListItem key={i} sx={{ cursor: 'zoom-in', borderRadius: 1, overflow: 'hidden' }}
                        onClick={() => setLightbox(p.url)}>
                        <img src={p.url} alt={`photo-${i + 1}`} style={{ objectFit: 'cover', width: '100%', height: '100%', transition: 'transform 0.2s' }}
                          onMouseOver={e => e.target.style.transform = 'scale(1.04)'}
                          onMouseOut={e => e.target.style.transform = 'scale(1)'} />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </CardContent>
              </Card>
            )}

            {/* Consultant notes */}
            {consultant_notes && (
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Description color="primary" /> Consultant Notes
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" color="text.secondary" lineHeight={1.8}>{consultant_notes}</Typography>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Actions */}
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>Actions</Typography>
                <Divider sx={{ mb: 2 }} />

                {(status === 'in_consultation' || status === 'completed') && (
                  <Button fullWidth variant="contained" color="secondary" startIcon={<Chat />}
                    onClick={() => navigate(`/chat/${id}`)} sx={{ mb: 1.5 }}>
                    Open Chat
                  </Button>
                )}

                {isConsultant && status === 'pending' && (
                  <Button fullWidth variant="contained" startIcon={<Engineering />}
                    onClick={handleAssign} disabled={assigning}>
                    {assigning ? <CircularProgress size={20} color="inherit" /> : 'Start Consultation'}
                  </Button>
                )}

                {isAssignedConsultant && status === 'in_consultation' && (
                  <Button fullWidth variant="outlined" color="success" startIcon={<CheckCircle />}
                    onClick={handleComplete} sx={{ mt: 1 }}>
                    Mark as Completed
                  </Button>
                )}

                {certificate_file && (
                  <Button fullWidth variant="outlined" href={certificate_file} target="_blank"
                    sx={{ mt: 1.5 }}>
                    View Certificate
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Builder info */}
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>Builder</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontSize: 16, fontWeight: 700 }}>
                    {builder_id?.name?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={500}>{builder_id?.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{builder_id?.email}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Consultant info */}
            {consultant_id && (
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>Assigned Consultant</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40, fontSize: 16, fontWeight: 700 }}>
                      {consultant_id?.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={500}>{consultant_id?.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{consultant_id?.email}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.25, mt: 1 }}>
                    {[1,2,3,4,5].map(i => <StarRating key={i} value={5} max={5} size="small" />).slice(0,1)}
                  </Box>
                  <Chip label="5-Star Certified" size="small" color="secondary" sx={{ mt: 1 }} />
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Lightbox */}
      <Dialog open={!!lightbox} onClose={() => setLightbox(null)} maxWidth="lg">
        <DialogContent sx={{ p: 0, position: 'relative', bgcolor: 'black' }}>
          <IconButton onClick={() => setLightbox(null)}
            sx={{ position: 'absolute', top: 8, right: 8, color: 'white', bgcolor: 'rgba(0,0,0,0.5)', zIndex: 1 }}>
            <Close />
          </IconButton>
          <img src={lightbox} alt="fullscreen" style={{ maxWidth: '90vw', maxHeight: '85vh', display: 'block' }} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default BuildingDetails;
