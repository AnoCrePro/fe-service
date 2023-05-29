import React, {useContext, useEffect, useState} from 'react'
import { Button, Box, Typography, Dialog, DialogTitle } from '@mui/material'
import { GlobalContext } from '../../context/GlobalState';
import { LoadingButton } from '@mui/lab';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Web3 from "web3"
import {useTheme} from '@mui/material';
import { SERVER } from '../Constants/constants';
import { fetchData } from '../utils/database';
import MetaMaskIcon from "../../assets/th.jpeg"

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
        } 
        if(connect) {
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

  const handleClickConnect = () => {
    setOpen(true)
  }

  const handleCloseDialog = () => {
    setOpen(false)
  }

  const handleConnect = async () => {
    if(web3 || window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const account = accounts[0];
      const signature = await web3.eth.personal.sign("I am signing my one-time nonce: 939104\n\nNote: Sign to log into your Centic account. This is free and will not require a transaction.", account);
      const signingAddress = web3.eth.accounts.recover("I am signing my one-time nonce: 939104\n\nNote: Sign to log into your Centic account. This is free and will not require a transaction.", signature);
      if(signingAddress.toLowerCase() == account.toLowerCase()) {
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
        updateConnect(true)
      }
      else {
        console.log("Fail to sign!")
      }
    }
    else {
      console.log('MetaMask is not installed');
    }
  }
  return (
    <Box sx={{paddingTop: "5px"}}>
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
          lineHeight: "1.28571",
          justifyContent: "center",
          border: "1px solid rgba(0, 159, 219, 0.5)",
          alignItems: "center",
        }}> 
          <AccountBalanceWalletIcon sx={{fontSize: "20px", color:"rgb(0, 159, 219)", marginRight: "10px"}}/>
          <Typography sx={{
            fontSize: "0.875rem",
            fontWeight: "600",
            marginRight: "10px",
            color:"rgb(0, 159, 219)",
            fontFamily: theme.typography.fontFamily}}
          >
              {address.slice(0, 6) + "..." + address.slice(36, 42)}
          </Typography>
        </Box>
      : 
      <Box>
        <Button
          sx={{
            width: "170px", backgroundColor: theme.colors.btn, borderRadius: "10px", opacity: 1, height: "35px", color: "#fff", fontFamily: theme.typography.fontFamily, fontSize: "14px", fontWeight: "600", textTransform: "none"
          }}
          onClick={handleClickConnect}
        >
          Connect Wallet
        </Button>
        <Dialog
          open={open}
          onClose={handleCloseDialog}
          fullWidth
          PaperProps={{ 
            style: {
              backgroundColor: "#0D1921",
              position: "relative",
            }
          }}
        >
          <DialogTitle sx={{display: "flex", justifyItems: "center", flexDirection: "column", alignItems: "center"}}>
            <img class="metamask" src={MetaMaskIcon}/>
            <Typography
              variant="body2"
              sx={{ fontFamily: theme.typography.typography, fontSize: "16px", fontWeight: "600", color: theme.colors.color2, marginTop: "20px"}}
              mb={0.5}
              >
              Welcome to Centic!
            </Typography>
            <Typography
              variant="body2"
              textAlign={"center"}
              sx={{ fontFamily: theme.typography.typography, fontSize: "14px", fontWeight: "400", color: theme.colors.color2, marginTop: "20px"}}
              mb={0.5}
            >
              Sign to log into your Centic account. This is free and will not require a transaction.
            </Typography>
          </DialogTitle>
          <LoadingButton sx={{width: "80%", margin: "0 auto", backgroundColor: theme.colors.btn, borderRadius: "10px", opacity: 1, marginTop: "10px", marginBottom: "30px", height: "40px", color: "#fff", fontFamily: theme.typography.fontFamily, fontSize: "14px", fontWeight: "600", textTransform: "none"}}
              onClick={handleConnect}>
            Sign
          </LoadingButton>
        </Dialog>  
      </Box>} 
    </Box>
   
  )
}

export default Connect