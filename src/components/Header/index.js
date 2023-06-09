import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useTheme } from '@mui/material/styles';
import { useLocation, Link } from 'react-router-dom'
import Connect from '../../shared/Connect';
import CenticLogo from "../../assets/Logo-Centic_74x-82x.png"

const Header = () => {
  const location = useLocation()
  const theme = useTheme()
  
  return (
    <Box sx={{fontFamily: "Open Sans", height: "60px", backgroundColor: "black", display: "flex", flexDirection: {'xs': 'column', 'lg': 'row'}, alignItems: {'xs': "center", 'lg': 'space-between'}, justifyContent: {'xs': "center", 'lg': 'space-between'}, paddingLeft: "100px", paddingRight: "100px"}}> 
      <img class="header-logo" src={CenticLogo}/>
      {/* <Box sx={{display: "flex"}}>
        <Link to="/scoring" style={{ textDecoration: 'none'}}>
          <Typography 
            sx={{
              color: theme.colors.light1, 
              fontFamily: theme.typography, 
              marginLeft: "20px", 
              marginRight: "20px", 
              fontWeight: 1000, 
              fontSize: "20px"}}>
                Credit scoring
          </Typography>
          <Box sx={location.pathname === "/scoring" ? {height: "3px", backgroundColor: "white", width: "100%", marginTop: "5px", borderRadius: "10px"} : ""}></Box>
        </Link>
        <Link to="/proof" style={{ textDecoration: 'none' }}>
          <Typography 
            sx={{
              color: theme.colors.light1, 
              fontFamily: theme.typography, 
              marginLeft: "20px", 
              marginRight: "20px", 
              fontWeight: 1000, 
              fontSize: "20px"}}>
                Credit Proof
          </Typography>
          <Box sx={location.pathname === "/proof" || location.pathname.split("/")[1] === "generate" ? {height: "3px", backgroundColor: "white", width: "100%", marginTop: "5px", borderRadius: "10px"} : ""}></Box>
        </Link>
      </Box> */}
      <Connect/>
    </Box>
  )
}

export default Header