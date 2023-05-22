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
import { exportAuthHash, exportProof } from '../../../shared/utils/others';
import { fetchData } from '../../../shared/utils/database';
import CopyToClipboard from "react-copy-to-clipboard";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import DownloadIcon from '@mui/icons-material/Download';
import {useTheme} from '@mui/material';
import { GlobalContext } from '../../../context/GlobalState';
import DoneDialog from '../../../shared/DoneDialog';
import {generateProof} from '../../../shared/utils/proof';
import { SERVER } from '../../../shared/Constants/constants';
import { mimc7 } from "circomlib";
const BigInt = require("big-integer");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const GenDialog = ({open, handleClose}) => {
  const theme = useTheme()
  const { address } = useContext(GlobalContext)
  const [loading, setLoading] = useState(false);
  const [subPub, setSubPub] = useState("")
  const [pass, setPass] = useState("")
  const [authHash, setAuthHash] = useState("")
  const [creditScore, setCreditScore] = useState(0)
  const [timestamp, setTimestamp] = useState("")
  const [root, setRoot] = useState("")
  const [condition, setCondition] = useState(0)
  const [siblings, setSiblings] = useState([""])
  const [direction, setDirections] = useState([1])
  const [copied, setCopied] = useState(false)
  const [openDone, setOpenDone] = useState(false)

  const onChangeFile = async (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      const updatedJSON = e.target.files[0];
      fileReader.readAsText(updatedJSON, "UTF-8");
      console.log("Hehe")
      fileReader.onload = e => {
        var obj = JSON.parse(e.target.result);
        setAuthHash(obj.auth_hash)
        setCreditScore(obj.credit_score)
        setRoot(obj.root)
        setTimestamp(obj.timestamp)
        setSiblings(obj.siblings)
        setDirections(obj.direction)
      };
    };
  };

  const handleProvideAuthHash = async () => {
    let hash = mimc7.multiHash([BigInt(address.replace("0x", ""), 16).value, BigInt(subPub, 16).value, BigInt(pass, 10).value]).toString()
    await fetchData({auth_hash: hash, public_key: address}, SERVER + "centic/user/provideAuthHash")
      .then(data => {
          console.log(data)
      })
    setOpenDone(true)
  }

  const handleGenerateProof = async () => {
    await handleProvideAuthHash()
    await sleep(10000);
    let currentTimestamp = Math.floor(new Date().getTime() / 1000)
    let data = await fetchData({public_key: address.toLowerCase()}, SERVER + "centic/user/info")
    const input = {
      "mainPub": address,
      "subPub": subPub,
      "userInfo": pass,
      "authHash": data.auth_hash,
      "creditScore": data.credit_score.toString(),
      "timestamp": data.timestamp,
      "root": data.root,
      "signature": "123",
      "verifyTimestamp": currentTimestamp.toString(),
      "condition": condition,
      "direction":data.direction,
      "siblings": data.siblings
    }
    let proof = await generateProof(input)
    exportProof(proof)
    console.log(proof)
  }


  const handleCopyHash = () => {
    setCopied(true)
  }

  const handleCloseDone = () => {
    handleCloseDialog()
    setOpenDone(false)
  }

  const handleCloseDialog = () => {
    setSubPub("")
    setPass("")
    setAuthHash("")
    setCreditScore(0)
    setTimestamp("")
    setRoot("")
    setCondition(0)
    setSiblings([""])
    setDirections([1])
    handleClose();
  }

  const handleAddSiblings = () => {
    setSiblings([...siblings, ""])
    setDirections([...direction, 1])
  }

  const handleRemoveSiblings = () => {
    setSiblings(siblings.slice(0, -1))
    setDirections(direction.slice(0, -1))
  }

  return (
    <Dialog
    open={open}
    onClose={loading ? "" : handleCloseDialog}
    fullWidth
    PaperProps={{ 
      style: {
        backgroundColor: "#0D1921",
        position: "relative",
      }
    }}
  >
    <DialogTitle sx={{ textAlign: "center" }} mt={3}>
        <Typography variant="h4" sx={{fontFamily: theme.typography, fontSize: "30px", fontWeight: 700, }}>Generate Credit Proof</Typography>
      </DialogTitle>
      <CloseIcon
        sx={{ position: "absolute", top: "20px", right: "20px", color: "#5E84A7"}}
        onClick={loading ? "" : handleCloseDialog}
      />
      <DialogContent>
        <Box sx={{width: "90%", margin: "0 auto"}}>
          <TextField sx={{input: { color: '#E2EDFF' }, '& .MuiOutlinedInput-root': {'& fieldset': {borderColor: '#479DD6', borderRadius: "10px"},'&:hover fieldset': {
      borderColor: '#B2BAC2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6F7E8C',
    }, } ,  width: "100%", marginTop: "15px"}} InputLabelProps={{style: { color: '#479DD6' },}} value={subPub} onChange={(e) => setSubPub(e.target.value)} label="Abstract Account" variant="outlined" />
          <TextField sx={{input: { color: '#E2EDFF' }, '& .MuiOutlinedInput-root': {'& fieldset': {borderColor: '#479DD6', borderRadius: "10px"}, '&:hover fieldset': {
      borderColor: '#B2BAC2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6F7E8C',
    },} ,  width: "100%", marginTop: "15px"}} InputLabelProps={{style: { color: '#479DD6' },}} value={pass} onChange={(e) => setPass(e.target.value)} label="Password" variant="outlined" />
          <TextField sx={{input: { color: '#E2EDFF' }, '& .MuiOutlinedInput-root': {'& fieldset': {borderColor: '#479DD6', borderRadius: "10px"}, '&:hover fieldset': {
      borderColor: '#B2BAC2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6F7E8C',
    },} ,  width: "100%", marginTop: "15px"}} InputLabelProps={{style: { color: '#479DD6' },}} value={condition} onChange={(e) => setCondition(e.target.value)} label="Condition" variant="outlined" />
        </Box>
      <Button
          sx={{
            fontFamily: theme.typography,
            color: "white",
            backgroundColor: "#5185AA",
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
          onClick={handleGenerateProof}
        >
          {loading ? <RestartAltIcon /> : "Generate Proof"}
        </Button> 
      </DialogContent>
  </Dialog>  
  )
}

export default GenDialog