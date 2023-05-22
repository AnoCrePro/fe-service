import { useState } from "react";
import { Box, Button, ButtonGroup } from "@mui/material";
import Header from "./components/Header";
import { createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { GlobalProvider } from "./context/GlobalState";
import Scoring from "./components/Scoring";
// import Proof from "./components/Proof";
// import GenerateProof from "./components/GenerateProof";

const theme = createTheme({
  typography: {
    fontFamily: "Montserrat",
  },
  colors: {
    color1: "#23B7EF",
    color2: "#97A8BC",
    color3: "#1FBDD9",
    color4: "#0D1921",
    color5: "#030B10",
    color6: "#6D8198",
    color7: "#5185AA",
    btn: "#009FDB",
    "light1": "white",
    "light2": "#e6f2ff",
    "dark1": "#004d99",
    "dark2": "#030B10",
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
              <Route path="/" element={<Scoring/>}/>
              <Route path="/:web2id/:condition" element={<Scoring/>}/>
            </Routes>
            {/* <Routes>
              <Route path="/" element={<Box>Main</Box>}/>
              <Route path="/scoring" element={<Scoring/>}/>
              <Route path="/proof" element={<Proof/>}/>
              <Route path="/generate/web" element={<GenerateProof method="web"/>}/>
              <Route path="/generate/extension" element={<GenerateProof method="extension"/>}/>
            </Routes> */}
          </BrowserRouter>
        </Box>
      </ThemeProvider>
    </GlobalProvider>
    );
}

export default Main;
