import { Box, Container, Button, Typography, TextField, Grid, Link, Paper, Tooltip} from '@mui/material'
import React, {useContext, useState, useEffect} from 'react'
import {useTheme} from '@mui/material'
import { GlobalContext } from '../../context/GlobalState'
import { toDayTime } from '../../shared/utils/others'
import { fetchData } from '../../shared/utils/database'
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LockIcon from '@mui/icons-material/Lock';
import {generateProof} from '../../shared/utils/proof';
import { LoadingButton } from '@mui/lab';
import { useSearchParams } from 'react-router-dom';
import { SERVER, CENTIC_SERVER } from "../../shared/Constants/constants";
import { mimc7 } from "circomlib";
import QRCode from 'qrcode.react'
import { create } from 'ipfs-http-client';
import { enqueueSnackbar } from 'notistack';
import { useAccount, useContract } from 'wagmi'
const BigInt = require("big-integer");

const Scoring = (props) => {
  const {address, refresh, updateRefresh} = useContext(GlobalContext)
  const [pass, setPass] = useState("")
  const [web2ID, setWeb2ID] = useState("")
  const [condition, setCondition] = useState("")
  const [valid, setValid] = useState(true)
  const [thirdPartyId, setThirdPartyId] = useState("") 
  const [userInfo, setUserInfo] = useState({"credit_score": "?", "timestamp": "?"})
  const [loading, setLoading] = useState(false)
  const [leafExisted, setLeafExisted] = useState(false)
  const [url, setUrl] = useState(null)
  const theme = useTheme()
  const [searchParams, setSearchParams] = useSearchParams();
  const account = useAccount()

  const projectId = '2PyRVePShrDRMUhgHdpf6zW7NSw';
  const projectSecret = '69325cd9fa06b38d50d44dcfcb5e0e56';
  const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');


  const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    apiPath: '/api/v0',
    headers: {
      authorization: auth,
    }
  })

  useEffect(() => {
    fetchData({"app_url": window.location.href}, CENTIC_SERVER + "services/verifyUrl")
      .then(data => {
        setValid(data.valid)
      })
  }, [])

  useEffect(() => {
    if (account.address) {
      fetchData({public_key: account.address.toLowerCase()}, SERVER + "centic/user/registerInfo/")
      .then(data => {
        if(data !== null) {
          setUserInfo({
            "credit_score": data.credit_score,
            "timestamp": data.timestamp
          })
        } else {
          let timestamp = Math.floor(new Date().getTime() / 1000)
          let data = {
              "name": "new",
              "credit_score": 500,
              "timestamp": timestamp,
              "public_key": account.address.toLowerCase()
          }
          fetchData(data, SERVER + "centic/user/register")
          .then(() => {
            setUserInfo({
              "credit_score": 500,
              "timestamp": timestamp
            })
          })
        }
      })
      fetchData({public_key: account.address.toLowerCase()}, SERVER + "centic/user/checkUserLeaf/")
        .then(data => {
          if(data !== null) {
            setLeafExisted(true)
          }
        })
    }
    else {
      setUserInfo({"credit_score": "?", "timestamp": "?"})
    }
    setWeb2ID(searchParams.get("web2ID"))
    setCondition(searchParams.get("condition"))
    setThirdPartyId(searchParams.get("thirdPartyID"))
  }, [account.address])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
        // Alert the user that the action took place.
        // Nobody likes hidden stuff being done under the hood!
        alert("Copied to clipboard");
    });
  }

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const handleGetCreditScore = () => {
    const credit_score = Math.floor(Math.random() * 1000) + 1
    const timestamp = Math.floor(Date. now() / 1000)
    fetchData({credit_score: credit_score, timestamp: timestamp, public_key: account.address.toLowerCase()}, SERVER + "centic/user/updateRegisterInfo/")
      .then(data => {
        setUserInfo({
          "credit_score": data.credit_score,
          "timestamp": data.timestamp
        })
      })
    updateRefresh(!refresh)
  }

  const handleProvideAuthHash = async () => {
    let hash = mimc7.multiHash([BigInt(account.address.toLowerCase().replace("0x", ""), 16).value, BigInt(web2ID, 16).value, BigInt(pass, 10).value]).toString()
    console.log(hash)
    await fetchData({auth_hash: hash, public_key: account.address.toLowerCase(), bank_id: thirdPartyId}, SERVER + "centic/user/provideAuthHash")
      .then(data => {
          console.log(data)
      })
  }

  const handleGenerateProof = async () => {
    setLoading(true)
    try {
      if(leafExisted === false ) {
        await handleProvideAuthHash()
        await sleep(10000);
      } 
      let start = Date.now();
      let currentTimestamp = Math.floor(new Date().getTime() / 1000)
      let data = await fetchData({public_key: account.address.toLowerCase()}, SERVER + "centic/user/info")
      const input = {
        "mainPub": account.address.toLowerCase(),
        "subPub": "0x" + web2ID,
        "userInfo": pass,
        "authHash": data.auth_hash,
        "creditScore": data.credit_score.toString(),
        "timestamp": data.timestamp,
        "root": data.root,
        "verifyTimestamp": currentTimestamp.toString(),
        "condition": condition,
        "direction":data.direction,
        "siblings": data.siblings
      }
      let proof = await generateProof(input)
      console.log(Date.now() - start);
      if(proof != -1) {
        const jsonText = JSON.stringify(proof, null, "\t");
        const added  = await client.add(jsonText)
        setUrl("https://ipfs.io/ipfs/" + added.path)
        console.log(Date.now() - start);
        enqueueSnackbar("Create proof successfully!", {variant: "success", autoHideDuration: 2000})
      }
      else {
        enqueueSnackbar("Wrong password!", {variant: "error", autoHideDuration: 2000})
      }
      
      
    } catch(err) {
      enqueueSnackbar("Create proof unsuccessfully!", {variant: "error", autoHideDuration: 2000})
    }
    
    setLoading(false)
  }

  return (
    <Box
      mb={5}
      sx={{paddingTop: "20px"}}
    >
      {/* { address ?  */}
      <Container> 
        { valid ? <Box mt={2} sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <Typography
              variant="body2"
              sx={{ fontFamily: theme.typography.typography, color: theme.colors.color1, fontSize: "34px", fontWeight: "600"}}
              mb={6}
            >
              CREDIT SCORING
          </Typography>
          <Box sx={{width: "100%"}}>
            <Grid container sx={{display: "flex", justifyContent: "center"}}>
              <Grid item xs={12} md={6} sx={{paddingBottom: {'xs': '20px', 'lg': 0}, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundImage: `url(${"../../assets/Fico3@2x.png "})`}}>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: theme.typography.typography, fontSize: "16px", fontWeight: "600", color: theme.colors.color2}}
                  mb={0.5}
                >
                  Your credit score
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: theme.typography.typography, fontSize: "12px", fontWeight: "400", color: theme.colors.color2}}
                  mb={0.5}
                >
                  Top 7% score
                </Typography>
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: theme.typography.typography, fontSize: "44px", fontWeight: "700", color: theme.colors.color3}}
                  >
                    {userInfo.credit_score}
                  </Typography>
                  {/* <img class="podium-icon" src={PodiumIcon}/> */}
                </Box>
                <img class="scoring-podium" src="./Group 16682@2x.png"/>
                
                <Typography
                  variant="body2"
                  sx={{ fontFamily: theme.typography.typography, fontSize: "14px", fontWeight: "400", color: theme.colors.color2}}
                  mt={5}
                >
                  {/* Last sync: 1:46pm 16/05/2023 */}
                  Last sync: {toDayTime(userInfo.timestamp)}
                </Typography>
              </Grid>
              {url == null ? <Grid item xs={12} md={6}  sx={{backgroundColor: theme.colors.color4, padding: "40px"}}>
                <Typography
                    variant="body2"
                    sx={{ fontFamily: theme.typography.typography, fontSize: "20px", fontWeight: "700", color: theme.colors.color2, boxShadow: "0px 2px 2px #0000004D", borderRadius: "16px", "opacity": 1}}
                  >
                    Generate Credit Proof
                  </Typography>
                    <TextField sx={{input: { paddingLeft: "20px", color: '#E2EDFF'}, '& .MuiOutlinedInput-root': {'& fieldset': {borderRadius: "10px"},'&:hover fieldset': {
                    borderColor: theme.colors.color3, color: '#E2EDFF'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6F7E8C',
                  }, } ,  width: "100%", marginTop: "25px", backgroundColor: theme.colors.color5, borderRadius: "10px"}} InputLabelProps={{style: {color: theme.colors.color6 },}} value={thirdPartyId} label="Third pary ID" variant="outlined" />
                        <TextField sx={{input: { paddingLeft: "20px", color: '#E2EDFF'}, '& .MuiOutlinedInput-root': {'& fieldset': {borderRadius: "10px"},'&:hover fieldset': {
                    borderColor: theme.colors.color3, color: '#E2EDFF'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6F7E8C',
                  }, } ,  width: "100%", marginTop: "25px", backgroundColor: theme.colors.color5, borderRadius: "10px"}} InputLabelProps={{style: {color: theme.colors.color6 },}} value={web2ID} label="Web2 ID" variant="outlined" />
                    {/* {leafExisted === false && address ? <Typography
                          variant="body2"
                          sx={{ fontFamily: theme.typography.typography, fontSize: "14px", fontWeight: "600", color: theme.colors.color2, marginTop: "15px", marginBottom: "15px"}}
                        >
                          First time using
                        </Typography> : ""} */}
                      {leafExisted ? <TextField sx={{input: { paddingLeft: "20px", color: '#E2EDFF' }, '& .MuiOutlinedInput-root': {'& fieldset': {borderRadius: "10px"}, '&:hover fieldset': {
                    borderColor: theme.colors.color3,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6F7E8C',
                  },} ,  width: "100%", marginTop: "25px", backgroundColor: theme.colors.color5, borderRadius: "10px"}} InputLabelProps={{style: {color: theme.colors.color6 },}} value={pass} onChange={(e) => setPass(e.target.value)} label="Password" variant="outlined" />
                :
                        <Tooltip title={<Box sx={{display: "flex", flexDirection: "column", padding: "10px", width: "200px"}}>
                          <Box sx={{display: "flex", alignItems: "center"}}>
                            <WarningAmberIcon sx={{fontSize: "16px"}}/>
                            <Typography variant="body2" sx={{ fontFamily: theme.typography.typography, fontSize: "16px", fontWeight: "600", color: "white"}}>
                              WARNING!
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontFamily: theme.typography.typography, fontSize: "12px", fontWeight: "400", color: "white"}}>
                            Your password is permenant and cannot be changed later. Please save it!
                          </Typography>
                        </Box>} placement="left">
                        
                        <TextField sx={{input: { paddingLeft: "20px", color: '#E2EDFF' }, '& .MuiOutlinedInput-root': {'& fieldset': {borderRadius: "10px"}, '&:hover fieldset': {
                    borderColor: theme.colors.color3,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6F7E8C',
                  },} ,  width: "100%", marginTop: "25px", backgroundColor: theme.colors.color5, borderRadius: "10px"}} InputLabelProps={{style: {color: theme.colors.color6 },}} value={pass} onChange={(e) => setPass(e.target.value)} label="Password" variant="outlined" />
                      </Tooltip>}
                        
                        <TextField sx={{input: { paddingLeft: "20px", color: '#E2EDFF' }, '& .MuiOutlinedInput-root': {'& fieldset': {borderRadius: "10px"}, '&:hover fieldset': {
                    borderColor: theme.colors.color3,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6F7E8C',
                  },} ,  width: "100%", marginTop: "25px", backgroundColor: theme.colors.color5, borderRadius: "10px"}} InputLabelProps={{style: { color: theme.colors.color6 },}} value={condition} label="Condition" variant="outlined" />
                  <LoadingButton sx={{width: "100%", backgroundColor: theme.colors.btn, borderRadius: "10px", opacity: 1, marginTop: "30px", height: "40px", color: "#fff", fontFamily: theme.typography.fontFamily, fontSize: "14px", fontWeight: "600", textTransform: "none"}}
                    onClick={handleGenerateProof}
                    loading={loading}>
                    Generate
                  </LoadingButton>
              </Grid> 
              : <Grid item xs={12} lg={6} sx={{backgroundColor: theme.colors.color4, width: "100%", padding: "40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                  <QRCode
                    id='qrcode'
                    value={url}
                    size={280}
                    level={'H'}
                    includeMargin={true}
                  /> <Box sx={{display: "flex", alignItems: "center", paddingTop: "20px"}}>
                    <Typography
                      variant="body2"
                      textAlign={"center"}
                      sx={{ fontFamily: theme.typography.typography, fontSize: "12px", fontWeight: "700", color: theme.colors.color3,}}
                    >
                      Proof IPFS url
                    </Typography>
                    
                    <Button sx={{ minWidth: 0, borderRadius: "5px", opacity: 1, height: "20px", color: "#fff", fontFamily: theme.typography.fontFamily, fontSize: "10px", fontWeight: "600", textTransform: "none", marginLeft: "5px"}}
                      onClick={copyToClipboard}
                    >
                      {/* <ContentCopyIcon sx={{fontSize: "15px"}}/>  */}
                    </Button>
                  </Box>
                  <Link href={url} sx={{fontFamily: theme.typography.typography, width: "100%", fontSize: "12px", fontWeight: "400", color: theme.colors.color2, textDecoration: "none"}}>
                    <Typography
                      variant="body2"
                      textAlign={"center"}
                      multiline
                      sx={{display: "-webkit-box",
                      boxOrient: "vertical",
                      lineClamp: 2,
                      wordBreak: "break-all",
                      overflow: "hidden", fontFamily: theme.typography.typography, fontSize: "12px", fontWeight: "400", color: theme.colors.color2, textDecoration: "none"}}
                    >
                      {url}
                    </Typography>
                  </Link>
              </Grid>}
            </Grid>
          </Box>
          </Box> : <Box sx={{minHeight: "60vh"}}>
            <Paper  sx={{backgroundColor: theme.colors.color4, padding: "80px 40px", marginTop: "100px", borderRadius: "20px", display: "flex", justifyContent: "center", alignItems: "center"}}>
              <LockIcon sx={{ fontFamily: theme.typography.typography, color: theme.colors.color1, fontSize: "36px", fontWeight: "600", marginRight: "15px"}}/>
              <Typography
                  variant="body2"
                  sx={{ fontFamily: theme.typography.typography, color: theme.colors.color1, fontSize: "34px", fontWeight: "600"}}
                >
                  INVALID URL
              </Typography>
            </Paper>
          </Box>}
      </Container> 
      <Box sx={{display: "flex", justifyContent: "flex-end", paddingTop: "10px"}}>
        <Typography
            variant="body2"
            sx={{ fontFamily: theme.typography.typography, fontSize: "10px", fontWeight: "400", color: theme.colors.color6, marginRight: "20px", marginTop: "30px"}}
          >
            Copyright © 2023 Centic
        </Typography>
      </Box>
    </Box>
    
  )
}

export default Scoring