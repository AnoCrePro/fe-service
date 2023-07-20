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
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
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
      sx={{paddingTop: "20px", backgroundColor: "#FFFFF1", marginTop: "100px"}}
    >
      {/* { address ?  */}
      <Container> 
        { valid ? <Box mt={2} sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <Box sx={{width: "100%"}}>
            <Grid container sx={{display: "flex", justifyContent: "center"}}>
              <Grid item xs={12} md={6} sx={{paddingBottom: {'xs': '20px', 'lg': 0}, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundImage: `url(${"../../assets/Fico3@2x.png "})`}}>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: theme.typography.typography, fontSize: "16px", fontWeight: "600", color: "#004aad"}}
                  mb={0.5}
                >
                  Số dư Bitcoin
                </Typography>
                <Box sx={{display: "flex", alignItems: "center"}}>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: theme.typography.typography, fontSize: "80px", fontWeight: "700", color: "#004aad"}}
                  >
                    5.06
                  </Typography>
                  <CurrencyBitcoinIcon sx={{fontSize: "80px", color: "#FFC700"}}/>
                </Box>
                
                <Typography
                  variant="body2"
                  sx={{ fontFamily: theme.typography.typography, fontSize: "14px", fontWeight: "400", color: "#004aad"}}
                  mt={5}
                >
                  {/* Last sync: 1:46pm 16/05/2023 */}
                  Cập nhật lần cuối: {toDayTime(userInfo.timestamp)}
                </Typography>
              </Grid>
              {url == null ? <Grid item xs={12} md={6}  sx={{backgroundColor: "#004aad", padding: "40px", borderRadius: "10px"}}>
                <Typography
                    variant="body2"
                    sx={{ fontFamily: theme.typography.typography, fontSize: "20px", fontWeight: "700", color: "white"}}
                  >
                    Tạo bằng chứng tài sản
                  </Typography>
                    <TextField sx={{input: { paddingLeft: "20px", color: 'black', fontWeight: 500}, '& .MuiOutlinedInput-root': {'& fieldset': {borderRadius: "10px", fontWeight: 500},'&:hover fieldset': {
                    borderColor: theme.colors.color3, color: 'white'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6F7E8C',
                  }, } ,  width: "100%", marginTop: "25px", backgroundColor: "white", borderRadius: "10px"}} InputLabelProps={{style: {color: "black"}}} value={thirdPartyId} label="Số tài khoản TD Bank" variant="outlined" />
                        <TextField sx={{input: { paddingLeft: "20px", color: 'black'}, '& .MuiOutlinedInput-root': {'& fieldset': {borderRadius: "10px"},'&:hover fieldset': {
                    borderColor: theme.colors.color3, color: '#E2EDFF'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6F7E8C',
                  }, } ,  width: "100%", marginTop: "25px", backgroundColor: "white", borderRadius: "10px"}} InputLabelProps={{style: {color: "black" },}} value={web2ID} label="Mật khẩu" variant="outlined" />
                  <LoadingButton sx={{width: "100%", backgroundColor: theme.colors.btn, borderRadius: "10px", opacity: 1, marginTop: "30px", height: "40px", color: "#fff", fontFamily: theme.typography.fontFamily, fontSize: "14px", fontWeight: "600", textTransform: "none"}}
                    onClick={handleGenerateProof}
                    loading={loading}>
                    Tạo bằng chứng
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
            Copyright © 2023 CryptoScan
        </Typography>
      </Box>
    </Box>
    
  )
}

export default Scoring