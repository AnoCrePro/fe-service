import { useState } from "react";
import { Box, Button, ButtonGroup } from "@mui/material";
import Header from "./components/Header";
import { createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { GlobalProvider } from "./context/GlobalState";
import { SnackbarProvider} from 'notistack';
import Scoring from "./components/Scoring";
// import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
// import { Web3Modal } from '@web3modal/react'
// import { configureChains, createConfig, WagmiConfig } from 'wagmi'
// import { arbitrum, mainnet, polygon } from 'wagmi/chains'

// const chains = [arbitrum, mainnet, polygon]
// const projectId = '8e72d5cc9c1d3d099e70d7bb0b89dc7b'

// const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
// const wagmiConfig = createConfig({
//   autoConnect: true,
//   connectors: w3mConnectors({ projectId, version: 1, chains }),
//   publicClient
// })
// const ethereumClient = new EthereumClient(wagmiConfig, chains)
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

  return (
    <>
      {/* <WagmiConfig config={wagmiConfig}> */}
        <GlobalProvider>
          <SnackbarProvider>
            <ThemeProvider theme={theme}>
              <Box className="App" sx={{minHeight: "100vh"}}>
                <BrowserRouter>
                  <Header/>
                  <Routes>
                    <Route path="/" element={<Scoring/>}/>
                    <Route path="/scoring" element={<Scoring/>}>
                      <Route path=":redirectParam" element={<Scoring/>} />
                    </Route>
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
          </SnackbarProvider>
        </GlobalProvider>
      {/* </WagmiConfig> */}
      {/* <Web3Modal projectId={projectId} ethereumClient={ethereumClient} /> */}
    </>
    
    );
}

export default Main;
