import { Box, Container, Button, Typography, TextField, Grid, Link, Paper, Tooltip} from '@mui/material'
import React, {useContext, useState, useEffect} from 'react'
import {useTheme} from '@mui/material'
import { GlobalContext } from '../../context/GlobalState'
import { toDayTime } from '../../shared/utils/others'
import { fetchData } from '../../shared/utils/database'
import {generateProof} from '../../shared/utils/proof';
import { LoadingButton } from '@mui/lab';
import { useSearchParams } from 'react-router-dom';
import { SERVER } from "../../shared/Constants/constants";
import { mimc7 } from "circomlib";
import QRCode from 'qrcode.react'
import { create } from 'ipfs-http-client';
import Web3 from "web3"
import { enqueueSnackbar } from 'notistack';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import BigNumber from 'bignumber.js'
const BigInt = require("big-integer");

const Scoring = () => {
  const {address, refresh, updateRefresh} = useContext(GlobalContext)
  const [pass, setPass] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [userInfo, setUserInfo] = useState({"balance": "?", "timestamp": "?"})
  const [loading, setLoading] = useState(false)
  const [leafExisted, setLeafExisted] = useState(false)
  const [url, setUrl] = useState(null)
  const theme = useTheme()
  const [searchParams, setSearchParams] = useSearchParams();
  const [step, setStep] = useState(0)

  const projectId = '2PyRVePShrDRMUhgHdpf6zW7NSw';
  const projectSecret = '69325cd9fa06b38d50d44dcfcb5e0e56';
  const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
  const web3 = new Web3(window.ethereum)


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
    if (address) {
      fetchData({public_key: address.toLowerCase()}, SERVER + "cryptoscan/user/registerInfo/")
      .then(data => {
        if(data !== null) {
          setUserInfo({
            "balance": data.balance,
            "timestamp": data.timestamp
          })
        } else {
          let timestamp = Math.floor(new Date().getTime() / 1000)
          web3.eth.getBalance(address)
          .then(res => {
            let balance = res.toString()
            let data = {
              "balance": balance,
              "timestamp": timestamp,
              "public_key": address
            }
            fetchData(data, SERVER + "cryptoscan/user/register")
            .then(() => {
              setUserInfo({
                "balance": balance,
                "timestamp": timestamp
              })
            })
          })
          
        }
      })
      fetchData({public_key: address.toLowerCase()}, SERVER + "cryptoscan/user/checkUserLeaf/")
        .then(data => {
          if(data !== null) {
            setLeafExisted(true)
          }
        })
    }
    else {
      setUserInfo({"balance": "?", "timestamp": "?"})
    }
  }, [address])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
        // Alert the user that the action took place.
        // Nobody likes hidden stuff being done under the hood!
        alert("Copied to clipboard");
    });
  }

  const test = async () => {
    for(let i = 2550; i < 10000; ++i) {
      if(i % 100 == 0) {
        console.log(i)
      }
      let newAddress = address + "e" + i.toString()
      let balance = "400000000000000000"
      let timestamp = Math.floor(new Date().getTime() / 1000)
      let data = {
        "balance": balance,
        "timestamp": timestamp,
        "public_key": newAddress
      }

      await fetchData(data, SERVER + "cryptoscan/user/register")
      let hash = "6860431624003262274612365754919729654340955489539293521402154666865381825784"
      await fetchData({auth_hash: hash, public_key: newAddress}, SERVER + "cryptoscan/user/provideAuthHash")
    }
    
  }

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleProvideAuthHash = async () => {
    let hash = mimc7.multiHash([BigInt(address.toLowerCase().replace("0x", ""), 16).value, BigInt(accountNumber, 10).value, BigInt(pass, 10).value]).toString()
    console.log(hash)
    await fetchData({auth_hash: hash, public_key: address.toLowerCase()}, SERVER + "cryptoscan/user/provideAuthHash")
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
      let data = await fetchData({public_key: address.toLowerCase()}, SERVER + "cryptoscan/user/info")
      const input = {
        "publicKey": address.toLowerCase(),
        "pass": pass,
        "accountNumber": accountNumber,
        "authHash": data.authHash,
        "balance": data.balance,
        "timestamp": data.timestamp,
        "condition": "500000000000000000",
        "root": data.root,
        "verifyTimestamp": currentTimestamp.toString(),
        "direction": data.direction,
        "siblings": data.siblings
      }
      let proof = await generateProof(input)
      console.log(Date.now() - start);
      if(proof != -1) {
        const jsonText = JSON.stringify(proof, null, "\t");
        const added  = await client.add(jsonText)
        setUrl("https://ipfs.io/ipfs/" + added.path)
        console.log(Date.now() - start);
        enqueueSnackbar("Create proof successfully!", {variant: "success", autoHideDuration: 20000})
      }
      else {
        enqueueSnackbar("Wrong password!", {variant: "error", autoHideDuration: 5000})
      }
      
      
    } catch(err) {
      enqueueSnackbar("Create proof unsuccessfully!", {variant: "error", autoHideDuration: 5000})
    }
    
    setLoading(false)
  }

  const handleUpdateBalance = () => { 
    setLoading(true)
    let timestamp = Math.floor(new Date().getTime() / 1000)
    web3.eth.getBalance(address)
      .then(res => {
        let balance = res.toString()
        let data = {
          "balance": balance,
          "timestamp": timestamp,
          "public_key": address
        }
        fetchData(data, SERVER + "cryptoscan/user/updateRegisterInfo")
          .then(() => {
            setUserInfo({
              "balance": balance,
              "timestamp": timestamp
            })
          })
        })
      setLoading(false)
  }

  return (
    <Box
      mb={5}
      sx={{paddingTop: "20px", backgroundColor: "white", marginTop: "70px"}}
    >
      { address ? 
      <Container> 
        <Box mt={2} sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <Box sx={{width: "100%"}}>
            <Grid container sx={{display: "flex", justifyContent: "center"}}>
              <Grid item xs={12} md={6} sx={{paddingBottom: {'xs': '20px', 'lg': 0}, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundImage: `url(${"../../assets/Fico3@2x.png "})`}}>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: theme.typography.typography, fontSize: "40px", fontWeight: "600", color: "#004aad"}}
                  mb={0.5}
                >
                  Số dư Bitcoin
                </Typography>
                <Box sx={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: theme.typography.typography, fontSize: "120px", fontWeight: "700", color: "#004aad"}}
                  >
                    {/* {userInfo.balance === "?" ? "?" : new BigNumber(userInfo.balance).dividedBy(1000000000000000000).toFixed(4)} */}
                    0.7571
                  </Typography>
                  <CurrencyBitcoinIcon sx={{fontSize: "120px", color: "#FFC700"}}/>
                </Box>
                
                <Typography
                  variant="body2"
                  sx={{ fontFamily: theme.typography.typography, fontSize: "23px", fontWeight: "500", color: "#004aad"}}
                  mt={3}
                >
                  {/* Last sync: 1:46pm 16/05/2023 */}
                  Cập nhật lần cuối: {userInfo.timestamp === "?" ? "?" : toDayTime(userInfo.timestamp)}
                </Typography>
                {address ? <LoadingButton
                    loading={loading}
                    sx={{
                      backgroundColor: "#004aad",
                      color: "#FFFFFF",
                      textTransform: "none",
                      height: "60px",
                      width: "250px",
                      fontWeight: "700",
                      marginTop: "20px",
                      fontFamily: theme.typography,
                      fontSize: "25px",
                      "&:hover": {
                        cursor: "pointer"
                      }
                    }}
                    onClick={handleUpdateBalance}
                  >
                    Cập nhật
                  </LoadingButton> : ""}
              </Grid>
              {url == null ? <Grid item xs={12} md={6}  sx={{backgroundColor: "white", padding: "40px", borderRadius: "10px", border: "10px solid #004aad"}}>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: theme.typography.typography, fontSize: "30px", fontWeight: "700", color: "#004aad"}}
                >
                  Tạo bằng chứng tài sản
                </Typography>
                {step == 0 ? <Box>
                    <Button
                      sx={{
                        backgroundColor: "#004aad",
                        color: "white",
                        textTransform: "none",
                        height: "60px",
                        width: "400px",
                        display: "block",
                        fontWeight: "700",
                        margin: "0 auto",
                        marginTop: "50px",
                        fontFamily: theme.typography,
                        fontSize: "25px",
                        "&:hover": {
                          cursor: "pointer",
                          backgroundColor: "white"
                        },
                      }}
                      onClick={() => setStep(1)}
                    >
                      Tiến hành tạo bằng chứng  
                    </Button> 
                    <Typography
                      variant="body2"
                      align={"center"}
                      sx={{ fontFamily: theme.typography.typography, fontSize: "23px", fontWeight: "600", color: "red"}}
                      mt={5}
                    >
                      * Yêu cầu: Số dư Bitcoin lớn hơn 0.5 BTC!
                    </Typography>
                  </Box>: ""}
                {step == 1 ? <Box>
                  {leafExisted ? <Box>
                    <TextField sx={{input: { paddingLeft: "20px", color: 'black', fontWeight: 500, height: "30px"}, '& .MuiOutlinedInput-root': {'& fieldset': {borderRadius: "10px", fontWeight: 500},'&:hover fieldset': {
                        borderColor: theme.colors.color3, color: 'white'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#6F7E8C',
                    }, } ,  width: "100%", marginTop: "25px", backgroundColor: "white", borderRadius: "10px"}} InputLabelProps={{style: {color: "black"}}} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} label="Số tài khoản TD Bank" variant="filled" />
                    <TextField sx={{input: { paddingLeft: "20px", color: 'black', fontWeight: 500, height: "30px"}, '& .MuiOutlinedInput-root': {'& fieldset': {borderRadius: "10px"},'&:hover fieldset': {
                      borderColor: theme.colors.color3, color: '#E2EDFF'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#6F7E8C',
                    }, } ,  width: "100%", marginTop: "25px", backgroundColor: "white", borderRadius: "10px"}} InputLabelProps={{style: {color: "black" },}} value={pass} onChange={(e) => setPass(e.target.value)} label="Mật khẩu" variant="filled" />
                    <LoadingButton sx={{width: "100%", backgroundColor: theme.colors.btn, opacity: 1, marginTop: "20px", height: "60px", color: "#fff", fontFamily: theme.typography.fontFamily, fontSize: "20px", fontWeight: "600", textTransform: "none"}}
                      onClick={handleGenerateProof}
                      loading={loading}>
                      Tạo bằng chứng
                    </LoadingButton>
                  </Box> : 
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: theme.typography.typography, fontSize: "14px", fontWeight: "600", color: "red"}}
                      mt={2}
                    >
                      * Đây là lần đầu tiên bạn tạo bằng chứng tài sản. Vui lòng cung cấp số tài khoản, mật khẩu cho quá trình tạo bằng chứng!
                    </Typography>
                    <TextField sx={{input: { paddingLeft: "20px", color: 'black', fontWeight: 500, height: "30px"}, '& .MuiOutlinedInput-root': {'& fieldset': {borderRadius: "10px", fontWeight: 500},'&:hover fieldset': {
                        borderColor: theme.colors.color3, color: 'white'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#6F7E8C',
                    }, } ,  width: "100%", marginTop: "25px", backgroundColor: "white", borderRadius: "10px"}} InputLabelProps={{style: {color: "black", fontSize: "22px", marginBottom: "5px"}}} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} label="Số tài khoản TD Bank" variant="filled" />
                    <TextField sx={{input: { paddingLeft: "20px", color: 'black', fontWeight: 500, height: "30px"}, '& .MuiOutlinedInput-root': {'& fieldset': {borderRadius: "10px"},'&:hover fieldset': {
                      borderColor: theme.colors.color3, color: '#E2EDFF'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#6F7E8C',
                    }, } ,  width: "100%", marginTop: "25px", backgroundColor: "white", borderRadius: "10px"}} InputLabelProps={{style: {color: "black", fontSize: "22px" },}} value={pass} onChange={(e) => setPass(e.target.value)} label="Mật khẩu" variant="filled" />
                    <LoadingButton sx={{width: "100%", backgroundColor: theme.colors.btn, opacity: 1, marginTop: "20px", height: "60px", color: "#fff", fontFamily: theme.typography.fontFamily, fontSize: "20px", fontWeight: "600", textTransform: "none"}}
                      onClick={handleGenerateProof}
                      loading={loading}>
                      Cung cấp thông tin và tạo bằng chứng
                    </LoadingButton>
                  </Box>}
                </Box>: ""}

              </Grid> 
              : <Grid item xs={12} lg={6} sx={{backgroundColor: "#004aad", borderRadius: "10px", width: "100%", padding: "40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
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
                      sx={{ fontFamily: theme.typography.typography, fontSize: "25px", fontWeight: "700", color: "white",}}
                    >
                      Proof IPFS url
                    </Typography>
                    
                    <Button sx={{ minWidth: 0, borderRadius: "5px", opacity: 1, height: "20px", color: "#fff", fontFamily: theme.typography.fontFamily, fontSize: "20px", fontWeight: "600", textTransform: "none", marginLeft: "5px"}}
                      onClick={copyToClipboard}
                    >
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
                      overflow: "hidden", fontFamily: theme.typography.typography, fontSize: "12px", fontWeight: "400", color: "white", textDecoration: "none"}}
                    >
                      {url}
                    </Typography>
                  </Link>
              </Grid>}
            </Grid>
          </Box>
        </Box>
      </Container> : <Container> 
        <Paper sx={{backgroundColor: "#004aad", height: "200px", padding: "50px", display: "flex", justifyContent: "center", alignItems: "center", transition: ".3s"}}>
          <LockPersonIcon sx={{color: "white", fontSize: "40px", marginRight: "10px"}}/>
          <Typography
            variant="body2"
            sx={{ fontFamily: theme.typography.typography, fontSize: "40px", fontWeight: "700", color: "white"}}
          >
            Vui lòng kết nối ví để sử dụng dịch vụ!
          </Typography>
        </Paper>
      </Container>}
      <Box sx={{display: "flex", justifyContent: "flex-end", paddingTop: "10px"}}>
        <Typography
            variant="body2"
            sx={{ fontFamily: theme.typography.typography, fontSize: "15px", fontWeight: "400", color: theme.colors.color6, marginRight: "20px", marginTop: "30px"}}
          >
            Copyright © 2023 cryptoscan
        </Typography>
      </Box>
    </Box>
    
  )
}

export default Scoring