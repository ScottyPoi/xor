import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#9c27b0",
    },
    background: {
      default: "#0b0f1a",
      paper: "#111827",
    },
    text: {
      primary: "#f9fafb",
      secondary: "#d1d5db",
    },
  },
  typography: {
    fontFamily: ["Roboto", "Segoe UI", "Helvetica", "Arial", "sans-serif"].join(
      ","
    ),
  },
  shape: {
    borderRadius: 10,
  },
});

export default theme;
