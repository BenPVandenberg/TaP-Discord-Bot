import { createTheme, responsiveFontSizes } from '@mui/material';

// dark theme
export const darkTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: 'rgba(207,72,68,255)',
      },
      secondary: {
        main: 'rgb(253,205,94)',
      },
      background: {
        default: 'rgba(40, 44, 52, 1)',
      },
    },
    typography: {
      fontFamily: 'Roboto',
    },
  })
);
