import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Grid, Card, CardContent,
  Avatar, Chip, Stack
} from '@mui/material';
import {
  Upload, Chat, EmojiEvents, Engineering, Construction,
  CheckCircle, ArrowForward, Star
} from '@mui/icons-material';

const features = [
  { icon: <Upload />, title: 'Upload Your Building', desc: 'Submit building details, photos, and your current construction certificate easily.' },
  { icon: <Engineering />, title: 'Expert Review', desc: '5-star certified engineers review your submission and identify improvement areas.' },
  { icon: <Chat />, title: 'Real-time Consultation', desc: 'Chat directly with your assigned consultant. Share images and discuss improvements.' },
  { icon: <EmojiEvents />, title: 'Improve Your Rating', desc: 'Follow expert recommendations to upgrade your construction certificate from 1–4 to 5 stars.' },
];

const steps = [
  { n: '01', label: 'Register as a Builder', desc: 'Create your account and complete your profile.' },
  { n: '02', label: 'Upload Building Details', desc: 'Add your building info, photos, and current certificate.' },
  { n: '03', label: 'Get Matched', desc: 'A certified consultant accepts your request and begins review.' },
  { n: '04', label: 'Chat & Improve', desc: 'Discuss improvements and achieve a higher construction rating.' },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 40%, #1976D2 100%)',
        color: 'white', py: { xs: 8, md: 14 }, position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', top: -80, right: -80, width: 360, height: 360, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
        <Box sx={{ position: 'absolute', bottom: -120, left: -60, width: 480, height: 480, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)' }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip label="Construction Consultancy Platform" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', mb: 3, fontWeight: 500 }} />
              <Typography variant="h2" fontWeight={800} sx={{ fontSize: { xs: '2.2rem', md: '3.2rem' }, lineHeight: 1.15, mb: 2.5 }}>
                Upgrade Your Building's<br />
                <Box component="span" sx={{ color: '#FFB300' }}>Construction Rating</Box>
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 400, mb: 4, maxWidth: 520, lineHeight: 1.7 }}>
                Connect builders with 1–4 star certificates to certified 5-star engineering consultants for professional guidance and improvement.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained" size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/register')}
                  sx={{ bgcolor: '#FF6F00', '&:hover': { bgcolor: '#E65100' }, px: 4, py: 1.5, fontSize: '1rem', fontWeight: 600 }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined" size="large"
                  onClick={() => navigate('/login')}
                  sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white', px: 4, py: 1.5, '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}
                >
                  Sign In
                </Button>
              </Stack>
              <Stack direction="row" spacing={3} sx={{ mt: 5 }}>
                {[['500+', 'Buildings Rated'], ['120+', 'Expert Consultants'], ['98%', 'Satisfaction Rate']].map(([val, lbl]) => (
                  <Box key={lbl}>
                    <Typography variant="h5" fontWeight={700} color="#FFB300">{val}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>{lbl}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{
                bgcolor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: 3, p: 3
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                  <Avatar sx={{ bgcolor: '#FF6F00', width: 44, height: 44 }}><Engineering /></Avatar>
                  <Box>
                    <Typography fontWeight={600} fontSize="0.9rem">Dr. Priya Sharma</Typography>
                    <Box sx={{ display: 'flex', gap: 0.25 }}>
                      {[1,2,3,4,5].map(i => <Star key={i} sx={{ fontSize: 14, color: '#FFB300' }} />)}
                    </Box>
                  </Box>
                  <Chip label="Expert" size="small" sx={{ ml: 'auto', bgcolor: '#FF6F00', color: 'white' }} />
                </Box>
                {[
                  ['Foundation Analysis', 'Completed'],
                  ['Structural Review', 'In Progress'],
                  ['Safety Assessment', 'Pending'],
                ].map(([task, stat]) => (
                  <Box key={task} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 1.5, p: 1.5, mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle sx={{ fontSize: 16, color: stat === 'Completed' ? '#66BB6A' : 'rgba(255,255,255,0.3)' }} />
                      <Typography variant="body2">{task}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: stat === 'Completed' ? '#66BB6A' : stat === 'In Progress' ? '#FFB300' : 'rgba(255,255,255,0.4)' }}>{stat}</Typography>
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
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="overline" color="primary" fontWeight={600} letterSpacing={2}>How It Works</Typography>
            <Typography variant="h3" fontWeight={700} sx={{ mt: 1 }}>Everything You Need</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, maxWidth: 500, mx: 'auto' }}>
              A streamlined process to connect builders with the right experts.
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {features.map((f) => (
              <Grid item xs={12} sm={6} md={3} key={f.title}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 1, transition: 'all 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 32px rgba(21,101,192,0.12)' } }}>
                  <CardContent>
                    <Avatar sx={{ bgcolor: 'primary.light', color: 'white', width: 56, height: 56, mx: 'auto', mb: 2 }}>
                      {f.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight={600} gutterBottom>{f.title}</Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{f.desc}</Typography>
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
            <Typography variant="overline" color="secondary" fontWeight={600} letterSpacing={2}>Builder Journey</Typography>
            <Typography variant="h3" fontWeight={700} sx={{ mt: 1 }}>Get Started in 4 Steps</Typography>
          </Box>
          <Grid container spacing={3}>
            {steps.map((s, i) => (
              <Grid item xs={12} sm={6} key={s.n}>
                <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
                  <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ opacity: 0.2, minWidth: 48 }}>{s.n}</Typography>
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>{s.label}</Typography>
                    <Typography variant="body2" color="text.secondary">{s.desc}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ py: { xs: 8, md: 10 }, background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)', color: 'white', textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Construction sx={{ fontSize: 52, mb: 2, opacity: 0.8 }} />
          <Typography variant="h3" fontWeight={700} gutterBottom>Ready to Improve Your Rating?</Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, mb: 4 }}>
            Join hundreds of builders who've upgraded their construction certificates with expert guidance.
          </Typography>
          <Button
            variant="contained" size="large" endIcon={<ArrowForward />}
            onClick={() => navigate('/register')}
            sx={{ bgcolor: '#FF6F00', '&:hover': { bgcolor: '#E65100' }, px: 5, py: 1.5, fontSize: '1rem', fontWeight: 600 }}
          >
            Register Now — It's Free
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
