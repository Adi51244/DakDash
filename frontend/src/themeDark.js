/**
 * Dark Theme Configuration
 * India Post branded dark mode
 */
import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#EF5350', // Lighter red for dark mode
      light: '#FF8A80',
      dark: '#C62828',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFB74D', // Lighter amber
      light: '#FFD54F',
      dark: '#F9A825',
    },
    success: {
      main: '#66BB6A', // Lighter green
      light: '#81C784',
      dark: '#388E3C',
    },
    error: {
      main: '#EF5350',
      light: '#E57373',
      dark: '#D32F2F',
    },
    warning: {
      main: '#FFB74D',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0',
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
          boxShadow: '0px 4px 12px rgba(0,0,0,0.4)',
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default darkTheme;
