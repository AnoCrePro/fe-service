import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useTheme } from '@mui/material/styles';
import { useLocation, Link } from 'react-router-dom'
import Connect from '../../shared/Connect';

const Header = () => {
  const location = useLocation()
  console.log(location)
  const theme = useTheme()
  
  return (
    <Box sx={{fontFamily: "Open Sans", height: "60px", backgroundColor: "black", display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: "100px", paddingRight: "100px"}}> 
      <Typography 
        sx={{
          fontFamily: theme.typography,
          color: theme.colors.light1,
          fontWeight: 1000,
          fontSize: "20px",
          border: "1px solid #e6f2ff",
          padding: "5px"
        }}>
          Credit Service
      </Typography>
      <Box sx={{display: "flex"}}>
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
          <Box sx={location.pathname === "/proof" ? {height: "3px", backgroundColor: "white", width: "100%", marginTop: "5px", borderRadius: "10px"} : ""}></Box>
        </Link>
      </Box>
      <Connect/>
    </Box>
  )
}

export default Header