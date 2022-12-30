import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: ["Ubuntu Condensed", "sans-serif"].join(","),
    fontSize: 15,
  },
  palette: {
    mode: "dark",
    primary: {
      light: "#0066ff",
      main: "#55AAff",
      // dark: will be calculated from palette.secondary.main,
      contrastText: "#393E46",
    },
    secondary: {
      main: "#b2dfdb",
      light: "#c1e5e2",
      contrastText: "#000",
    },
    background: {
      paper: "rgba(0, 0, 0, 0.1)",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      phone: 700,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          background: "linear-gradient(170deg, #192231 70%, #B6A19E 10%)",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        },
      },
    },
  },
});

export default theme;
