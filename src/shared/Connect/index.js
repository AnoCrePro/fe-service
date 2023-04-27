import React, {useContext, useEffect, useState} from 'react'
import { Button, Box, Typography, Paper } from '@mui/material'
import { GlobalContext } from '../../context/GlobalState';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Web3 from "web3"
import {useTheme} from '@mui/material';
import { SERVER } from '../Constants/constants';
import { fetchData } from '../utils/database';

const Connect = () => {
  const theme = useTheme()
  const {updateConnect, connect, updateAddress, address, updateWeb3, web3} = useContext(GlobalContext)
  const [open, setOpen] = useState(false)
  const [userInfo, setUserInfo] = useState({"credit_score": "?", "timestamp": "?"})
  const [openUserInfo, setOpenUserInfo] = useState(false)
  

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      updateWeb3(web3)
      // Listen update account
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          updateAddress(null);
          updateConnect(false)
        } else {
          updateAddress(accounts[0]);
          fetchData({public_key: accounts[0]}, SERVER + "/user/registerInfo")
            .then(data => {
              console.log(data)
              if(data !== null) {
                setUserInfo({
                  "credit_score": data.credit_score,
                  "timestamp": data.timestamp
                })
              } 
            })
        }
      });
    } else {
      console.log('MetaMask is not installed');
    }
  }, [])

  const handleOpenUserInfo = () => {
    setOpen(false)
    setOpenUserInfo(true)
  }

  const handleCloseUserInfo = (e) => {
    e.stopPropagation()
    setOpenUserInfo(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConnect = async () => {
    if(web3 || window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      .then((accounts) => {
        const account = accounts[0];
        updateAddress(account)
        fetchData({public_key: account}, SERVER + "centic/user/registerInfo")
            .then(data => {
              if(data !== null) {
                setUserInfo({
                  "credit_score": data.credit_score,
                  "timestamp": data.timestamp
                })
              } 
            })
        // Update ETH Balance
      }).catch((error) => {
        console.log(error);
      });
      updateConnect(true)
    }
    else {
      console.log('MetaMask is not installed');
    }
  }
  return (
    <Box>
      {connect ? <Box sx={{
          backgroundColor: "black",
          color: theme.colors.light1,
          fontFamily: theme.typography,
          borderTop: "0 px solid #1E90FF",
          borderRadius: "10px",
          textTransform: "none",
          width: "200px",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}> 
          <Typography sx={{
            fontSize: "16px",
            fontWeight: "500",
            marginRight: "10px",
            fontWeight: 600}}
          >
              {address.slice(0, 6) + "..." + address.slice(36, 42)}
          </Typography>
          <Box>
            <Box sx={{display: "flex", alignItems: "center"}}>
              {open ? <CloseIcon sx={{
                "&:hover": {
                  cursor: "pointer"
                }
              }}onClick={handleClose}/> : <MenuIcon  sx={{
                "&:hover": {
                  cursor: "pointer"
                }
              }} onClick={handleOpen}/> }
            </Box>
            <Box sx={open? {position: "absolute"} : {display: "none"}}>            
              <Paper elevation={1} sx={{
                width: "100px",
                backgroundColor: "#1E90FF", 
                padding: "5px",
                "&:hover": {
                  cursor: "pointer"
                }}}
                onClick={() => handleOpenUserInfo()}
                >
                <Typography textAlign={"center"} variant="body2" sx={{color: "white", height: "20px", fontSize: "14px"}}>
                  My Credit Info
                </Typography>
                {/* <UserInfoDialog open={openUserInfo} handleClose={handleCloseUserInfo}/> */}
              </Paper>  
            </Box>
          </Box> 
        </Box>
      : 
      <Button
        sx={{
          backgroundColor: "black",
          color: theme.colors.light1,
          borderColor: theme.colors.light1,
          border: "1px solid #e6f2ff",
          borderRadius: "8px",
          textTransform: "none",
          height: "30px",
          width: "170px",
          fontSize: "18px",
          fontWeight: "700",
          marginRight: "20px",
          fontFamily: theme.typography,
          "&:hover": {
            cursor: "pointer"
          }
        }}
        onClick={handleConnect}
      >
        <AccountBalanceWalletIcon sx={{marginRight: "15px"}}/> Connect Wallet
      </Button> } 
    </Box>
   
  )
}

export default Connect