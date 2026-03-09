import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1565C0',
      light: '#1976D2',
      dark: '#0D47A1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#E65100',
      light: '#FF6D00',
      dark: '#BF360C',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F4F6F9',
      paper: '#FFFFFF',
    },
    success: { main: '#2E7D32', light: '#E8F5E9' },
    warning: { main: '#ED6C02', light: '#FFF3E0' },
    error: { main: '#C62828', light: '#FFEBEE' },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 6, padding: '8px 20px' },
        containedPrimary: {
          boxShadow: '0 2px 6px rgba(21,101,192,0.25)',
          '&:hover': { boxShadow: '0 4px 12px rgba(21,101,192,0.35)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 8px rgba(0,0,0,0.07)',
          border: '1px solid #EEEEEE',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': { borderRadius: 6 },
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 6 } },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px !important',
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
})

export default theme
