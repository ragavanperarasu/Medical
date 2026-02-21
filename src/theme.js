import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#ffffff",
      paper: "#f9f9f9",
    },
    primary: {
      main: "#10a37f", // ChatGPT green style
    },
  },
  typography: {
    fontFamily: "Arial",
  },
});

export default theme;