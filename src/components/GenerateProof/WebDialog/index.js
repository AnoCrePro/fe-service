import React, {useState, useEffect, useContext}from 'react'
import {
  Button,
  Dialog,
  Box,
  DialogContent,
  DialogTitle,
  Typography,
  TextField
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { exportAuthHash } from '../../../shared/utils/others';
import { fetchData } from '../../../shared/utils/database';
import CopyToClipboard from "react-copy-to-clipboard";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import DownloadIcon from '@mui/icons-material/Download';
import {useTheme} from '@mui/material';
import { SERVER } from '../../../shared/Constants/constants';
import { mimc7 } from "circomlib";
import { GlobalContext } from '../../../context/GlobalState';
import DoneDialog from '../../../shared/DoneDialog';
const BigInt = require("big-integer");

const WebDialog = ({open, handleClose}) => {
  const theme = useTheme()
  const { address } = useContext(GlobalContext)
  const [loading, setLoading] = useState(false);
  const [mainPub, setMainPub] = useState("")
  const [absPub, setAbsPub] = useState("")
  const [pass, setPass] = useState("")
  const [authHash, setAuthHash] = useState("")
  const [copied, setCopied] = useState(false)
  const [openDone, setOpenDone] = useState(false)

  const handleChangeMainPub = (e) => {
    setMainPub(e.target.value)
  }

  const handleChangeAbsPub = (e) => {
    setAbsPub(e.target.value)
  }

  const handleChangePass = (e) => {
    setPass(e.target.value) 
  }

  const handleCopyHash = () => {
    setCopied(true)
  }

  const genAuthHash = async () => {
    let hash = mimc7.multiHash([BigInt(mainPub.replace("0x", ""), 16).value, BigInt(absPub.replace("0x", ""), 16).value, BigInt(pass, 10).value]).toString()
    console.log(hash)
    setAuthHash(hash)
    // exportAuthHash({"authentication_hash": hash})
  }

  const handleCloseDone = () => {
    handleCloseDialog()
    setOpenDone(false)
  }

  const handleProvideAuthHash = async () => {
    await fetchData({auth_hash: authHash, public_key: address}, SERVER + "centic/user/provideAuthHash")
      .then(data => {
          console.log(data)
      })
    setOpenDone(true)
  }

  const handleCloseDialog = () => {
    setMainPub("")
    setAbsPub("")
    setPass("")
    setAuthHash("")
    handleClose();
  }


  return (
    <Dialog
    open={open}
    onClose={loading ? "" : handleCloseDialog}
    fullWidth
    PaperProps={{
      padding: "100px",
      backgroundColor: "#DCDCDC",
      position: "relative",
    }}
  >
    <DialogTitle sx={{ textAlign: "center" }} mt={3}>
        <Typography variant="h4" sx={{fontFamily: theme.typography, fontSize: "30px", fontWeight: 700, }}>Generate Authentication Hash</Typography>
      </DialogTitle>
      <CloseIcon
        sx={{ position: "absolute", top: "20px", right: "20px" }}
        onClick={loading ? "" : handleCloseDialog}
      />
      {authHash !== "" ?
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "90%",
            margin: "0 5%",
          }}
        >
          <Typography variant="h4" sx={{fontFamily: theme.typography, fontSize: "15px", fontWeight: 500}} mb={2}>
            Here is your Authentication Hash, please keep it private
          </Typography>
          <Typography variant="h4" sx={{fontFamily: theme.typography, fontSize: "25px", fontWeight: 600, display: "flex", alignItems: "center", border: "2px solid black", padding: "10px"}} mb={2}>
            {authHash.slice(0,10) + "..." + authHash.slice(67,78)}
            <CopyToClipboard text={authHash}>
              {copied ? <DoneIcon sx={{fontFamily: theme.typography, fontSize: "25px",marginLeft: "10px"}}/> : <ContentCopyIcon sx={{fontFamily: theme.typography, fontSize: "25px",marginLeft: "10px"}} onClick={handleCopyHash}/>}
            </CopyToClipboard>
            <DownloadIcon sx={{fontFamily: theme.typography, fontSize: "25px",marginLeft: "10px"}} onClick={() => exportAuthHash({"authentication_hash": authHash})}/>
          </Typography>
        </Box>
        <Button
          sx={{
            fontFamily: theme.typography,
            color: "white",
            backgroundColor: loading ? "#E8E8E8" : "black",
            border: loading ? "1px solid #E8E8E8" : "1px solid #909090",
            borderRadius: "20px",
            textTransform: "none",
            width: "90%",
            fontSize: "20px",
            fontWeight: "800",
            margin: "0 5%",
            padding: "12px 0",
            marginBottom: "20px",
            marginTop: "20px"
          }}
          onClick={handleProvideAuthHash}
        >
          {loading ? <RestartAltIcon /> : "Provide Authentication Hash"}
        </Button> 
        <DoneDialog open={openDone} handleClose={handleCloseDone}/>
      </DialogContent>
      :
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "90%",
            margin: "0 5%",
            marginTop: "20px",
          }}
        >
          <Typography variant="h4" sx={{fontSize: "15px", fontWeight: 500}} mb={2}>
            Please enter the condition of the Proof
          </Typography>
        </Box>
        <Box sx={{width: "90%", margin: "0 auto"}}>
          <TextField sx={{fontFamily: theme.typography, width: "100%", marginTop: "15px"}} value={mainPub} onChange={handleChangeMainPub} label="Main Account" variant="outlined" />
          <TextField sx={{fontFamily: theme.typography, width: "100%", marginTop: "15px"}} value={absPub} onChange={handleChangeAbsPub} label="Abstract Account" variant="outlined" />
          <TextField sx={{fontFamily: theme.typography, width: "100%", marginTop: "15px"}} value={pass} onChange={handleChangePass} label="Password" variant="outlined" />
        </Box>
      <Button
          sx={{
            fontFamily: theme.typography,
            color: "white",
            backgroundColor: loading ? "#E8E8E8" : "black",
            border: loading ? "1px solid #E8E8E8" : "1px solid #909090",
            borderRadius: "20px",
            textTransform: "none",
            width: "90%",
            fontSize: "20px",
            fontWeight: "800",
            margin: "0 5%",
            padding: "12px 0",
            marginBottom: "20px",
            marginTop: "20px"
          }}
          onClick={genAuthHash}
        >
          {loading ? <RestartAltIcon /> : "Proceed"}
        </Button> 
      </DialogContent>}
  </Dialog>  
  )
}

export default WebDialog