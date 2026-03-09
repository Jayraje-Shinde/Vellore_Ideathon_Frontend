import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import ChatIcon from '@mui/icons-material/Chat'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import EngineeringIcon from '@mui/icons-material/Engineering'
import ConstructionIcon from '@mui/icons-material/Construction'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import StarIcon from '@mui/icons-material/Star'

const features = [
  {
    Icon: UploadFileIcon,
    title: 'Upload Your Building',
    desc: 'Submit building details, photos and your current construction certificate quickly.',
  },
  {
    Icon: EngineeringIcon,
    title: 'Expert Review',
    desc: '5-star certified engineers review your submission and identify areas to improve.',
  },
  {
    Icon: ChatIcon,
    title: 'Real-time Consultation',
    desc: 'Chat directly with your consultant, share images and discuss improvements live.',
  },
  {
    Icon: EmojiEventsIcon,
    title: 'Improve Your Rating',
    desc: 'Follow expert recommendations to upgrade from 1–4 stars to a 5-star certificate.',
  },
]

const steps = [
  { n: '01', title: 'Register as a Builder', desc: 'Create your account and complete your profile in minutes.' },
  { n: '02', title: 'Upload Building Details', desc: 'Add building info, photos, and your current certificate.' },
  { n: '03', title: 'Get Matched', desc: 'A certified consultant accepts your request and begins review.' },
  { n: '04', title: 'Chat & Improve', desc: 'Discuss improvements and achieve a higher construction rating.' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #1976D2 100%)',
          color: 'white',
          py: { xs: 8, md: 14 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute', top: -100, right: -100,
            width: 400, height: 400, borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.04)',
          }}
        />
        <Box
          sx={{
            position: 'absolute', bottom: -140, left: -80,
            width: 500, height: 500, borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.03)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                label="Construction Consultancy Platform"
                sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', mb: 3, fontWeight: 500 }}
              />

              <Typography
                variant="h2"
                fontWeight={800}
                sx={{ fontSize: { xs: '2rem', sm: '2.8rem', md: '3.4rem' }, lineHeight: 1.15, mb: 2.5 }}
              >
                Upgrade Your Building's
                <Box component="span" sx={{ color: '#FFB300', display: 'block' }}>
                  Construction Rating
                </Box>
              </Typography>

              <Typography
                variant="h6"
                sx={{ color: 'rgba(255,255,255,0.82)', fontWeight: 400, mb: 4, maxWidth: 520, lineHeight: 1.75 }}
              >
                Connect builders holding 1–4 star certificates with certified 5-star
                engineering consultants for professional guidance.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: '#E65100',
                    '&:hover': { bgcolor: '#BF360C' },
                    px: 4, py: 1.5, fontSize: '1rem', fontWeight: 600,
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    px: 4, py: 1.5,
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.06)' },
                  }}
                >
                  Sign In
                </Button>
              </Stack>

              <Stack direction="row" spacing={4} sx={{ mt: 6 }}>
                {[
                  ['500+', 'Buildings Rated'],
                  ['120+', 'Expert Consultants'],
                  ['98%', 'Satisfaction'],
                ].map(([v, l]) => (
                  <Box key={l}>
                    <Typography variant="h5" fontWeight={800} color="#FFB300">{v}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>{l}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>

            {/* Preview card */}
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                sx={{
                  bgcolor: 'rgba(255,255,255,0.09)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 3,
                  p: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                  <Avatar sx={{ bgcolor: '#E65100', width: 44, height: 44 }}>
                    <EngineeringIcon />
                  </Avatar>
                  <Box>
                    <Typography fontWeight={600} fontSize="0.9rem">Dr. Priya Sharma</Typography>
                    <Box sx={{ display: 'flex', gap: 0.25 }}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <StarIcon key={i} sx={{ fontSize: 14, color: '#FFB300' }} />
                      ))}
                    </Box>
                  </Box>
                  <Chip
                    label="5-Star Expert"
                    size="small"
                    sx={{ ml: 'auto', bgcolor: '#E65100', color: 'white' }}
                  />
                </Box>

                {[
                  ['Foundation Analysis', 'Completed', '#66BB6A'],
                  ['Structural Review', 'In Progress', '#FFB300'],
                  ['Safety Assessment', 'Pending', 'rgba(255,255,255,0.35)'],
                ].map(([task, stat, color]) => (
                  <Box
                    key={task}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      bgcolor: 'rgba(255,255,255,0.07)',
                      borderRadius: 1.5,
                      p: 1.5,
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: 16, color }} />
                      <Typography variant="body2">{task}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color }}>{stat}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography variant="overline" color="primary" fontWeight={600} letterSpacing={2}>
              How It Works
            </Typography>
            <Typography variant="h3" fontWeight={700} sx={{ mt: 1 }}>
              Everything You Need
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, maxWidth: 480, mx: 'auto' }}>
              A streamlined process to connect builders with the right certified experts.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map(({ Icon, title, desc }) => (
              <Grid item xs={12} sm={6} md={3} key={title}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 1,
                    transition: 'all 0.2s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 32px rgba(21,101,192,0.12)' },
                  }}
                >
                  <CardContent>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mx: 'auto', mb: 2 }}>
                      <Icon />
                    </Avatar>
                    <Typography variant="h6" fontWeight={600} gutterBottom>{title}</Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Steps */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.50' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography variant="overline" color="secondary" fontWeight={600} letterSpacing={2}>
              Builder Journey
            </Typography>
            <Typography variant="h3" fontWeight={700} sx={{ mt: 1 }}>
              Get Started in 4 Steps
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {steps.map(({ n, title, desc }) => (
              <Grid item xs={12} sm={6} key={n}>
                <Box sx={{ display: 'flex', gap: 2.5 }}>
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    color="primary.main"
                    sx={{ opacity: 0.2, minWidth: 48, lineHeight: 1 }}
                  >
                    {n}
                  </Typography>
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>{title}</Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{desc}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box
        sx={{
          py: { xs: 8, md: 11 },
          background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <ConstructionIcon sx={{ fontSize: 52, mb: 2, opacity: 0.75 }} />
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Ready to Improve Your Rating?
          </Typography>
          <Typography sx={{ opacity: 0.8, mb: 4 }}>
            Join hundreds of builders who've upgraded their certificates with expert guidance.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/register')}
            sx={{
              bgcolor: '#E65100',
              '&:hover': { bgcolor: '#BF360C' },
              px: 5, py: 1.5, fontSize: '1rem', fontWeight: 600,
            }}
          >
            Register Now — It's Free
          </Button>
        </Container>
      </Box>
    </Box>
  )
}
