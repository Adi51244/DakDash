import { createTheme } from '@mui/material/styles';

/**
 * DakDash Theme Configuration
 * Brand colors matching India Post identity
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#C62828', // India Post Red
      light: '#EF5350',
      dark: '#B71C1C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F9A825', // Amber
      light: '#FDD835',
      dark: '#F57F17',
    },
    success: {
      main: '#2E7D32', // Green for delivered
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    error: {
      main: '#D32F2F', // Red for exceptions
      light: '#EF5350',
      dark: '#C62828',
    },
    warning: {
      main: '#F9A825', // Amber for in-transit
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E1E1E', // Charcoal
      secondary: '#616161',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h1: {
      fontFamily: '"Poppins", "Inter", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Poppins", "Inter", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Poppins", "Inter", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(0,0,0,0.1)',
    '0px 12px 24px rgba(0,0,0,0.12)',
    ...Array(20).fill('0px 16px 32px rgba(0,0,0,0.15)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
