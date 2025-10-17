import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#F57663',
    },
    secondary: {
      main: '#FFA546',
    },
  },
  custom: {
    canvas: {
      width: 800,
      height: 800,
    },
  },
});
