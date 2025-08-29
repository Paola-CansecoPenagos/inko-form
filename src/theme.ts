import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2c5282', // Azul sobrio profesional
      light: '#4a90a4',
      dark: '#1a365d',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ed8936', // Naranja complementario
      light: '#f6ad55',
      dark: '#c05621',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f7fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3748',
      secondary: '#4a5568',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    h4: {
      fontWeight: 600,
      color: '#1a202c',
    },
    h5: {
      fontWeight: 500,
      color: '#2d3748',
    },
    h6: {
      fontWeight: 500,
      color: '#2d3748',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          '&:disabled': {
            backgroundColor: '#e2e8f0',
            color: '#a0aec0',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});