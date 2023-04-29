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
import FiberSmartRecordIcon from '@mui/icons-material/FiberSmartRecord';
import DoneIcon from '@mui/icons-material/Done';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {useTheme} from '@mui/material';
import { GlobalContext } from '../../../context/GlobalState';
import DoneDialog from '../../../shared/DoneDialog';
import generateProof from '../../../shared/utils/proof';

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

  const handleGenerateProof = async () => {
    let currentTimestamp = Math.floor(new Date().getTime() / 1000)
    const input = {
      "mainPub": address,
      "subPub": subPub,
      "userInfo": pass,
      "authHash": authHash,
      "creditScore": creditScore.toString(),
      "timestamp": timestamp,
      "root": root,
      "signature": "123",
      "verifyTimestamp": currentTimestamp.toString(),
      "condition": condition,
      "direction":direction,
      "siblings": siblings
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
      padding: "100px",
      backgroundColor: "#DCDCDC",
      position: "relative",
    }}
  >
    <DialogTitle sx={{ textAlign: "center" }} mt={3}>
        <Typography variant="h4" sx={{fontFamily: theme.typography, fontSize: "30px", fontWeight: 700, }}>Generate Credit Proof</Typography>
      </DialogTitle>
      <CloseIcon
        sx={{ position: "absolute", top: "20px", right: "20px" }}
        onClick={loading ? "" : handleCloseDialog}
      />
      {authHash == "4342" ?
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
            width: "90%",
            margin: "0 5%",
            marginTop: "20px",
          }}
        >
          <Typography variant="h4" sx={{fontSize: "15px", fontWeight: 500}} mb={2}>
            Please enter the information or 
          </Typography>
          <Button
            component="label"
            sx={{
              backgroundColor: theme.colors.dark2,
              color: theme.colors.light1,
              borderColor: theme.colors.light1,
              border: "3px solid black",
              borderRadius: "5px",
              textTransform: "none",
              height: "20px",
              width: "150px",
              fontWeight: "700",
              marginRight: "20px",
              marginLeft: "10px",
              fontFamily: theme.typography,
              fontSize: "15px",
              "&:hover": {
                cursor: "pointer"
                }
              }}
              >
                Load From Local
                <input
                  type="file"
                  hidden
                  onChange={onChangeFile}
                />
          </Button> 
        </Box>
        <Box sx={{width: "90%", margin: "0 auto"}}>
          <TextField sx={{fontFamily: theme.typography, width: "100%", marginTop: "15px"}} value={subPub} onChange={(e) => setSubPub(e.target.value)} label="Abstract Account" variant="outlined" />
          <TextField sx={{fontFamily: theme.typography, width: "100%", marginTop: "15px"}} value={pass} onChange={(e) => setPass(e.target.value)} label="Password" variant="outlined" />
          <TextField sx={{fontFamily: theme.typography, width: "100%", marginTop: "15px"}} value={authHash} onChange={(e) => setAuthHash(e.target.value)} label="Authentication Hash" variant="outlined" />
          <TextField sx={{fontFamily: theme.typography, width: "100%", marginTop: "15px"}} value={creditScore} onChange={(e) => setCreditScore(e.target.value)} label="CreditScore" variant="outlined" />
          <TextField sx={{fontFamily: theme.typography, width: "100%", marginTop: "15px"}} value={timestamp} onChange={(e) => setTimestamp(e.target.value)} label="Timestamp" variant="outlined" />
          <TextField sx={{fontFamily: theme.typography, width: "100%", marginTop: "15px"}} value={root} onChange={(e) => setRoot(e.target.value)} label="Root" variant="outlined" />
          <TextField sx={{fontFamily: theme.typography, width: "100%", marginTop: "15px"}} value={condition} onChange={(e) => setCondition(e.target.value)} label="Condition" variant="outlined" />
          <Box sx={{display: "flex", alignItems: "center", marginTop: "15px"}}>
            <FiberSmartRecordIcon sx={{marginRight: "10px", marginLeft: "10px", fontSize: "15px"}}/>
            <Typography variant="h4" sx={{fontSize: "15px", fontWeight: 500}}>
              Siblings
            </Typography>
            <AddIcon sx={{marginRight: "10px", marginLeft: "10px", fontSize: "15px", padding: "3px", backgroundColor: theme.colors.dark2, color: "white", borderRadius: "5px", fontWeight: 1000}}
              onClick={handleAddSiblings}/>
            <RemoveIcon sx={{marginRight: "10px", marginLeft: "10px", fontSize: "15px", padding: "3px", backgroundColor: theme.colors.dark2, color: "white", borderRadius: "5px", fontWeight: 1000}}
              onClick={handleRemoveSiblings}/>
          </Box>
          
          {siblings.map((sibling, key) => (
            <Box sx={{display: "flex", justifyContent: "space-between"}} key={key}>
              <TextField sx={{fontFamily: theme.typography, width: "70%", marginTop: "15px"}} value={siblings[key]} onChange={(e) => setSubPub(e.target.value)} label={"Sibling " + (key + 1)} variant="outlined" />
              <TextField sx={{fontFamily: theme.typography, width: "25%", marginTop: "15px"}} value={direction[key]} onChange={(e) => setSubPub(e.target.value)} label={"Direction " + (key + 1)} variant="outlined" />
            </Box>
          ))}
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
          onClick={handleGenerateProof}
        >
          {loading ? <RestartAltIcon /> : "Generate Proof"}
        </Button> 
      </DialogContent>}
  </Dialog>  
  )
}

export default GenDialog