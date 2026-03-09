import { useNavigate } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PersonIcon from '@mui/icons-material/Person'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ChatIcon from '@mui/icons-material/Chat'
import EngineeringIcon from '@mui/icons-material/Engineering'
import StarRating from './StarRating'
import StatusChip from './StatusChip'

export default function BuildingCard({ building, role, onAssign }) {
  const navigate = useNavigate()
  const {
    _id,
    building_name,
    location,
    rating,
    status,
    description,
    builder_id,
    createdAt,
    photos,
  } = building

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        },
      }}
    >
      {/* Cover */}
      {photos?.length > 0 ? (
        <Box
          component="img"
          src={photos[0].url}
          alt={building_name}
          sx={{
            width: '100%',
            height: 148,
            objectFit: 'cover',
            borderRadius: '12px 12px 0 0',
          }}
        />
      ) : (
        <Box
          sx={{
            height: 90,
            borderRadius: '12px 12px 0 0',
            background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <EngineeringIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 40 }} />
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        {/* Title + Status */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 1.5,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{
              lineHeight: 1.3,
              flex: 1,
              pr: 1,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {building_name}
          </Typography>
          <StatusChip status={status} />
        </Box>

        {/* Stars */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
          <StarRating value={rating} max={5} />
          <Typography variant="caption" color="text.secondary">
            {rating}/5 Stars
          </Typography>
        </Box>

        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: description ? 1.25 : 0 }}>
          <LocationOnIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {location}
          </Typography>
        </Box>

        {/* Description */}
        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </Typography>
        )}

        <Divider sx={{ my: 1.5 }} />

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PersonIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
            <Typography variant="caption" color="text.secondary">
              {builder_id?.name || 'Builder'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarTodayIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
            <Typography variant="caption" color="text.secondary">
              {new Date(createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <Divider />
      <CardActions sx={{ p: 2, gap: 1 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<VisibilityIcon />}
          onClick={() => navigate(`/buildings/${_id}`)}
          sx={{ flex: 1 }}
        >
          View
        </Button>

        {role === 'consultant' && status === 'pending' && (
          <Button
            size="small"
            variant="contained"
            startIcon={<EngineeringIcon />}
            onClick={() => onAssign?.(_id)}
            sx={{ flex: 1 }}
          >
            Consult
          </Button>
        )}

        {(status === 'in_consultation' || status === 'completed') && (
          <Button
            size="small"
            variant="contained"
            color="secondary"
            startIcon={<ChatIcon />}
            onClick={() => navigate(`/chat/${_id}`)}
            sx={{ flex: 1 }}
          >
            Chat
          </Button>
        )}
      </CardActions>
    </Card>
  )
}
