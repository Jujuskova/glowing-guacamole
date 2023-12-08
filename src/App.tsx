import { Box, createTheme, ThemeProvider } from "@mui/material";


import Header from "./components/Header";
import Display from "./Display";

import "./index.css";

function App() {
  const theme = createTheme({});

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={(tm) => ({
          height: "100vh",
          width: "100vw",
          background: tm.palette.grey[200],
        })}
      >
        <Header />

       <Display />
      </Box>
    </ThemeProvider>
  );
}

export default App;
