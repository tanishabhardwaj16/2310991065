import { createTheme } from "@mui/material/styles";

// Dark theme using the bundled Geist fonts and high-contrast teal accent.
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#33c1cc",
      contrastText: "#021217",
    },
    secondary: {
      main: "#ff7b7b",
    },
    background: {
      default: "#041018",
      paper: "#071722",
    },
    text: {
      primary: "#e6f7f8",
      secondary: "#9fb3b8",
    },
  },
  typography: {
    // Use the bundled Geist fonts (declared in globals.css) with sensible fallbacks
    fontFamily: '"Geist Sans", "GeistVF", "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    h1: { fontWeight: 700, fontSize: "2rem", letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, fontSize: "1.6rem" },
    h3: { fontWeight: 600, fontSize: "1.25rem" },
    h4: { fontWeight: 600, fontSize: "1.1rem" },
    h5: { fontWeight: 600, fontSize: "1rem" },
    h6: { fontWeight: 600, fontSize: "0.95rem" },
    body1: { fontSize: "1rem", lineHeight: 1.6 },
    body2: { fontSize: "0.95rem", lineHeight: 1.5, color: "#46555f" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // Global dark background and smoothing for better legibility
        body: {
          background: "linear-gradient(180deg,#041018 0%, #071722 100%)",
          color: "#e6f7f8",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(3,10,14,0.6)",
          backgroundColor: "#0b2730",
          overflow: "hidden",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 10,
          padding: "8px 14px",
        },
        containedPrimary: {
          boxShadow: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: 'rgba(255,255,255,0.03)'
        },
      },
    },
  },
});

export default theme;
