import { useState } from "react";
import { Box, Button, ButtonGroup } from "@mui/material";
import Header from "./components/Header";
import { createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { GlobalProvider } from "./context/GlobalState";
import Scoring from "./components/Scoring";
import Proof from "./components/Proof";
import GenerateProof from "./components/GenerateProof";

const theme = createTheme({
  typography: {
    fontFamily: "Open Sans"
  },
  colors: {
    "light1": "white",
    "light2": "#e6f2ff",
    "dark1": "#004d99",
    "dark2": "#003366",
  }
})

function Main() {

  const [curNav, setCurNav] = useState("DEPOSIT");
  const handleChangeNav = (nav) => {
    setCurNav(nav);
  };


  return (
    <GlobalProvider>
      <ThemeProvider theme={theme}>
        <Box className="App" sx={{backgroundColor: theme.colors.dark2, minHeight: "100vh"}}>
          <BrowserRouter>
            <Header/>
            <Routes>
              <Route path="/" element={<Box>Main</Box>}/>
              <Route path="/scoring" element={<Scoring/>}/>
              <Route path="/proof" element={<Proof/>}/>
              <Route path="/generate/web" element={<GenerateProof method="web"/>}/>
              <Route path="/generate/extension" element={<GenerateProof method="extension"/>}/>
            </Routes>
          </BrowserRouter>
        </Box>
      </ThemeProvider>
    </GlobalProvider>
    );
}

export default Main;
