import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ChatIcon from '@mui/icons-material/Chat'
import EngineeringIcon from '@mui/icons-material/Engineering'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DescriptionIcon from '@mui/icons-material/Description'
import { buildingAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import StarRating from '../components/StarRating'
import StatusChip from '../components/StatusChip'

export default function BuildingDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isConsultant } = useAuth()

  const [building, setBuilding] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lightbox, setLightbox] = useState(null)
  const [assigning, setAssigning] = useState(false)

  useEffect(() => {
    buildingAPI
      .getById(id)
      .then((r) => setBuilding(r.data.building))
      .catch(() => setError('Building not found or access denied.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAssign = async () => {
    setAssigning(true)
    try {
      await buildingAPI.assign(id)
      navigate(`/chat/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start consultation.')
      setAssigning(false)
    }
  }

  const handleComplete = async () => {
    try {
      await buildingAPI.complete(id, { consultant_notes: '' })
      setBuilding((prev) => ({ ...prev, status: 'completed' }))
    } catch {
      setError('Failed to mark as completed.')
    }
  }

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 14 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  const {
    building_name,
    location,
    rating,
    description,
    status,
    certificate_file,
    photos,
    builder_id,
    consultant_id,
    consultant_notes,
    createdAt,
  } = building

  const isAssignedConsultant =
    consultant_id?._id === user?.id || consultant_id === user?.id

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          Back
        </Button>

        <Grid container spacing={3}>
          {/* ── Left column ── */}
          <Grid item xs={12} md={8}>
            {/* Main info card */}
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2.5,
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  <Typography variant="h4" fontWeight={700}>
                    {building_name}
                  </Typography>
                  <StatusChip status={status} size="medium" />
                </Box>

                <Box sx={{ display: 'flex', gap: 3, mb: 2.5, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">{location}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: description ? 2.5 : 0 }}>
                  <StarRating value={rating} max={5} size="medium" />
                  <Typography variant="body1" fontWeight={500} color="warning.main">
                    {rating}/5 Star Certificate
                  </Typography>
                </Box>

                {description && (
                  <>
                    <Divider sx={{ mb: 2.5 }} />
                    <Typography variant="body1" color="text.secondary" lineHeight={1.85}>
                      {description}
                    </Typography>
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
                      <ImageListItem
                        key={i}
                        sx={{ cursor: 'zoom-in', borderRadius: 1, overflow: 'hidden' }}
                        onClick={() => setLightbox(p.url)}
                      >
                        <img
                          src={p.url}
                          alt={`photo-${i + 1}`}
                          style={{
                            objectFit: 'cover',
                            width: '100%',
                            height: '100%',
                            transition: 'transform 0.2s',
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
                          onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                        />
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
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <DescriptionIcon color="primary" fontSize="small" />
                    Consultant Notes
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" color="text.secondary" lineHeight={1.85}>
                    {consultant_notes}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* ── Right column ── */}
          <Grid item xs={12} md={4}>
            {/* Actions */}
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Actions
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {(status === 'in_consultation' || status === 'completed') && (
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    startIcon={<ChatIcon />}
                    onClick={() => navigate(`/chat/${id}`)}
                    sx={{ mb: 1.5 }}
                  >
                    Open Chat
                  </Button>
                )}

                {isConsultant && status === 'pending' && (
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<EngineeringIcon />}
                    onClick={handleAssign}
                    disabled={assigning}
                  >
                    {assigning ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      'Start Consultation'
                    )}
                  </Button>
                )}

                {isAssignedConsultant && status === 'in_consultation' && (
                  <Button
                    fullWidth
                    variant="outlined"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={handleComplete}
                    sx={{ mt: 1 }}
                  >
                    Mark as Completed
                  </Button>
                )}

                {certificate_file && (
                  <Button
                    fullWidth
                    variant="outlined"
                    href={certificate_file}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ mt: 1.5 }}
                  >
                    View Certificate
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Builder info */}
            <Card sx={{ mb: consultant_id ? 3 : 0 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Builder
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontWeight: 700 }}>
                    {builder_id?.name?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={500}>{builder_id?.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {builder_id?.email}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Assigned consultant */}
            {consultant_id && (
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Assigned Consultant
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Avatar
                      sx={{ bgcolor: 'secondary.main', width: 40, height: 40, fontWeight: 700 }}
                    >
                      {consultant_id?.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={500}>{consultant_id?.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {consultant_id?.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip label="5-Star Certified" size="small" color="secondary" />
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Lightbox */}
      <Dialog open={!!lightbox} onClose={() => setLightbox(null)} maxWidth="lg">
        <DialogContent sx={{ p: 0, position: 'relative', bgcolor: '#000', lineHeight: 0 }}>
          <IconButton
            onClick={() => setLightbox(null)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.55)',
              zIndex: 1,
              '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' },
            }}
          >
            <CloseIcon />
          </IconButton>
          {lightbox && (
            <img
              src={lightbox}
              alt="fullsize"
              style={{ maxWidth: '90vw', maxHeight: '85vh', display: 'block' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}
