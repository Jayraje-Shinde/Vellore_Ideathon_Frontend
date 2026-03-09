import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Card, CardContent, Typography, TextField,
  Button, Alert, CircularProgress, Grid, Slider, Rating,
  Divider, IconButton, ImageList, ImageListItem, ImageListItemBar
} from '@mui/material';
import {
  CloudUpload, Close, ArrowBack, Construction, CheckCircle
} from '@mui/icons-material';
import { buildingAPI } from '../../services/api';

const marks = [1,2,3,4].map(v => ({ value: v, label: `${v}★` }));

const UploadBuilding = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    building_name: '', location: '', rating: 2, description: ''
  });
  const [certificate, setCertificate] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(prev => [...prev, ...files].slice(0, 10));
    const previews = files.map(f => URL.createObjectURL(f));
    setPhotoPreviews(prev => [...prev, ...previews].slice(0, 10));
  };

  const removePhoto = (i) => {
    setPhotos(prev => prev.filter((_, idx) => idx !== i));
    setPhotoPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (certificate) fd.append('certificate', certificate);
      photos.forEach(p => fd.append('photos', p));
      await buildingAPI.create(fd);
      setSuccess(true);
      setTimeout(() => navigate('/builder/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" fontWeight={700} gutterBottom>Building Uploaded!</Typography>
          <Typography color="text.secondary">Redirecting to your dashboard…</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/builder/dashboard')} sx={{ mb: 3 }}>
          Back to Dashboard
        </Button>

        <Typography variant="h4" fontWeight={700} gutterBottom>Upload Building</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Provide your building details so a consultant can review and guide improvements.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic info */}
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Construction color="primary" /> Building Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={2.5}>
                    <Grid item xs={12}>
                      <TextField label="Building Name" name="building_name" fullWidth required
                        value={form.building_name} onChange={handleChange}
                        placeholder="e.g. Sunrise Apartments Block A" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Location / Address" name="location" fullWidth required
                        value={form.location} onChange={handleChange}
                        placeholder="e.g. Andheri West, Mumbai, Maharashtra" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Description" name="description" fullWidth multiline rows={3}
                        value={form.description} onChange={handleChange}
                        placeholder="Describe the building — type, floors, current issues, what you want improved…" />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" fontWeight={500} gutterBottom>
                        Current Certificate Rating
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                        Only buildings with 1–4 star certificates are eligible for consultation.
                      </Typography>
                      <Box sx={{ px: 2 }}>
                        <Slider
                          value={form.rating}
                          min={1} max={4} step={1}
                          marks={marks}
                          onChange={(_, v) => setForm({ ...form, rating: v })}
                          valueLabelDisplay="auto"
                          color="secondary"
                          sx={{ '& .MuiSlider-markLabel': { fontWeight: 500 } }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                        <Rating value={form.rating} max={4} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">{form.rating}/4 stars selected</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Certificate upload */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>Certificate File</Typography>
                  <Divider sx={{ mb: 2.5 }} />
                  <Button
                    component="label" variant="outlined" startIcon={<CloudUpload />}
                    fullWidth sx={{ py: 2.5, borderStyle: 'dashed', flexDirection: 'column', gap: 0.5 }}
                  >
                    <Typography variant="body2">{certificate ? certificate.name : 'Upload Certificate'}</Typography>
                    <Typography variant="caption" color="text.secondary">PDF, JPG or PNG</Typography>
                    <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png"
                      onChange={e => setCertificate(e.target.files[0])} />
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Photo upload */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Building Photos
                    <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      ({photos.length}/10)
                    </Typography>
                  </Typography>
                  <Divider sx={{ mb: 2.5 }} />
                  {photos.length < 10 && (
                    <Button
                      component="label" variant="outlined" startIcon={<CloudUpload />}
                      fullWidth sx={{ py: 2, borderStyle: 'dashed', mb: 2 }}
                    >
                      Add Photos
                      <input type="file" hidden multiple accept=".jpg,.jpeg,.png,.webp"
                        onChange={handlePhotos} />
                    </Button>
                  )}
                  {photoPreviews.length > 0 && (
                    <ImageList cols={3} rowHeight={80} gap={6}>
                      {photoPreviews.map((src, i) => (
                        <ImageListItem key={i} sx={{ borderRadius: 1, overflow: 'hidden', position: 'relative' }}>
                          <img src={src} alt={`preview-${i}`} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                          <ImageListItemBar
                            actionIcon={
                              <IconButton size="small" onClick={() => removePhoto(i)} sx={{ color: 'white', p: 0.25 }}>
                                <Close fontSize="small" />
                              </IconButton>
                            }
                            sx={{ background: 'transparent' }}
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant="outlined" onClick={() => navigate('/builder/dashboard')} size="large">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ px: 4, fontWeight: 600 }}>
                  {loading ? <CircularProgress size={22} color="inherit" /> : 'Submit Building'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default UploadBuilding;
