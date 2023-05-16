import { Box, Container, Paper, Typography, Button, Grid } from '@mui/material'
import React, {useContext, useState, useEffect} from 'react'
import {useTheme} from '@mui/material'
import LockPersonIcon from '@mui/icons-material/LockPerson';
import WebDialog from './WebDialog'
import DownloadIcon from '@mui/icons-material/Download';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SendTimeExtensionIcon from '@mui/icons-material/SendTimeExtension';
import { GlobalContext } from '../../context/GlobalState';
import { fetchData } from '../../shared/utils/database';
import { SERVER, CONTRACT_ADDRESS } from '../../shared/Constants/constants';
import { createContract } from '../../shared/utils/contract';
import contractAbi from "../../abi/contractAbi.json"
import { exportAuthData } from '../../shared/utils/others';
import { toSolidityInput } from '../../shared/utils/proof';
import GenDialog from './GenDialog';
import Web3 from "web3"

const GenerateProof = ({method}) => {
  const { address } = useContext(GlobalContext)
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const [openGen, setOpenGen] = useState(false)

  const handleOpenWebDialog = () => {
    setOpen(true)
  }
  const handleOpenGenDialog = () => {
    setOpenGen(true)
  }

  const handleDownloadData = async () => {
    try {
      await fetchData({public_key: address.toLowerCase()}, SERVER + "centic/user/info")
        .then(data => {
          exportAuthData(data)
          console.log(data)
        })
    } catch (err) {
      alert("Please provide authentication hash first!")
    }
  }

  const handleVerify = async () => {
    const web3 = new Web3(window.ethereum)
    let contract = await createContract(web3, contractAbi, CONTRACT_ADDRESS)
    let proof = {
      "pi_a": [
        "9293674316550103704445253032256274581693998355575739522492181251591656333992",
        "2852839945995302579860552356486003573615672185315237207447551758434039920156",
        "1"
      ],
      "pi_b": [
        [
          "9188301647405237528202486020099008902551620553174354904666123777790133659615",
          "7734086221226871937746767942158786185573953803144084250926822821308617497828"
        ],
        [
          "8690682401066719838695528595261156741822672126630502195693379437328885897022",
          "16258807357912319694631207779989220805859086551288209855159174509846315494253"
        ],
        [
          "1",
          "0"
        ]
      ],
      "pi_c": [
        "680289763469104465844695100038493212808896183937629900429536872679269588028",
        "12138268506131774586230021697310832165513540245724932580767847209766407660996",
        "1"
      ],
      "protocol": "groth16",
      "curve": "bn128",
      "publicSignals": [
        "1",
        "1682755902",
        "123",
        "200"
      ]
    }
    let contractInput = toSolidityInput(proof)
    contract.methods.verifyProof(contractInput.a, contractInput.b, contractInput.c, contractInput.publicSignals).send({from: address})
      .then(data => console.log(data))
      .catch(err => console.log(err))
  }

  return (
    <Box
      sx={{
        paddingTop: "70px",
      }}
      mb={5}
    >
      {address ? <Container> 
        <Box mt={2}>
        <Paper
          sx={{
            backgroundColor: "#E8E8E8",
            borderRadius: "15px",
            padding: "50px",
            boxShadow: "0 0 10px #265D97",
            backgroundColor: theme.colors.light1,
          }}
          elevation={1}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            mb={2}
          >
            <Typography
              variant="body2"
              sx={{ fontFamily: theme.typography, fontSize: "30px", fontWeight: "700"}}
              mb={1}
            >
              Credit Proof
              <Box sx={{width: "100%", height: "4px", backgroundColor: "black", borderRadius: "10px", marginTop: "10px"}}></Box>
            </Typography>
          </Box> 
          <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Typography variant="body2"
              sx={{ fontFamily: theme.typography, fontSize: "20px", fontWeight: "700", marginTop: "20px"}}
              mb={1}>
              If you haven't provided authentication hash, click here!
            </Typography>
            <Button
                sx={{
                  backgroundColor: theme.colors.dark2,
                  color: theme.colors.light1,
                  borderColor: theme.colors.light1,
                  border: "3px solid black",
                  borderRadius: "8px",
                  textTransform: "none",
                  height: "60px",
                  width: "400px",
                  fontWeight: "700",
                  marginRight: "20px",
                  fontFamily: theme.typography,
                  fontSize: "25px",
                  "&:hover": {
                    cursor: "pointer"
                  }
                }}
                onClick={handleOpenWebDialog}
              >
                Provide Authentication Hash
              </Button> 
              <WebDialog open={open} handleClose={() => setOpen(false)}/>
          </Box>
         <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px"}}>
            <Grid container>
         {method === "web" ? "": <Grid item xs={6} sx={{padding: "50px", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "10px"}}>
                <Typography variant="body2"
                  sx={{ fontFamily: theme.typography, fontSize: "20px", fontWeight: "700"}}
                  mb={1}>
                  Download authentication data
                </Typography>
                <Box sx={{padding: "10px", display: "flex", justifyContent: "center", alignItems: "center", border: "5px solid #003366", marginBottom: "20px", marginTop: "10px"}}>
                  <DownloadIcon  sx={{color: theme.colors.dark2, fontSize: "120px"}}/>
                </Box>
                  <Button
                    sx={{
                      backgroundColor: theme.colors.dark2,
                      color: theme.colors.light1,
                      borderColor: theme.colors.light1,
                      border: "3px solid black",
                      borderRadius: "8px",
                      textTransform: "none",
                      height: "60px",
                      width: "200px",
                      fontWeight: "700",
                      fontFamily: theme.typography,
                      fontSize: "25px",
                      "&:hover": {
                        cursor: "pointer"
                      }
                    }}
                    onClick={handleDownloadData}
                  >
                    Download
                  </Button> 
              </Grid>}
              <Grid item xs={method === "web" ? 12 : 6}>
                {method === "web" ? 
                <Box sx={{padding: "50px", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "10px"}}>
                  <Typography variant="body2"
                    sx={{ fontFamily: theme.typography, fontSize: "20px", fontWeight: "700"}}
                    mb={1}>
                    Generate Credit Proof
                  </Typography>
                  <Box sx={{padding: "10px", display: "flex", justifyContent: "center", alignItems: "center", border: "5px solid #003366", marginBottom: "20px", marginTop: "10px"}}>
                    <AccountTreeIcon  sx={{color: theme.colors.dark2, fontSize: "120px"}}/>
                  </Box>
                    <Button
                      sx={{
                        backgroundColor: theme.colors.dark2,
                        color: theme.colors.light1,
                        borderColor: theme.colors.light1,
                        border: "3px solid black",
                        borderRadius: "8px",
                        textTransform: "none",
                        height: "60px",
                        width: "200px",
                        fontWeight: "700",
                        fontFamily: theme.typography,
                        fontSize: "25px",
                        "&:hover": {
                          cursor: "pointer"
                        }
                      }}
                      onClick={handleOpenGenDialog}
                    >
                      Choose
                    </Button> 
                    <GenDialog open={openGen} handleClose={() => setOpenGen(false)}/>
                  </Box> : 
                  <Box sx={{padding: "50px", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "10px"}}>
                  <Typography variant="body2"
                    sx={{ fontFamily: theme.typography, fontSize: "20px", fontWeight: "700"}}
                    mb={1}>
                    Install Extension
                  </Typography>
                  <Box sx={{padding: "10px", display: "flex", justifyContent: "center", alignItems: "center", border: "5px solid #003366", marginBottom: "20px", marginTop: "10px"}}>
                    <SendTimeExtensionIcon  sx={{color: theme.colors.dark2, fontSize: "120px"}}/>
                  </Box>
                    <Button
                      sx={{
                        backgroundColor: theme.colors.dark2,
                        color: theme.colors.light1,
                        borderColor: theme.colors.light1,
                        border: "3px solid black",
                        borderRadius: "8px",
                        textTransform: "none",
                        height: "60px",
                        width: "200px",
                        fontWeight: "700",
                        fontFamily: theme.typography,
                        fontSize: "25px",
                        "&:hover": {
                          cursor: "pointer"
                        }
                      }}
                      onClick={handleVerify}
                    >
                      Install
                    </Button> 
                    <GenDialog open={openGen} handleClose={() => setOpenGen(false)}/>
                  </Box>}
              </Grid>
            </Grid>
          </Box>
        </Paper>
        </Box>
      </Container>: 
      <Container> 
        <Box mt={2}>
          <Paper
            sx={{
              backgroundColor: "#E8E8E8",
              borderRadius: "15px",
              padding: "50px",
              boxShadow: "0 0 10px #265D97",
              backgroundColor: theme.colors.light1
            }}
            elevation={1}
          >
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"
            // , backgroundColor: "black", height: "70px", width: "600px"
            }}>
              <LockPersonIcon  sx={{fontSize: "50px", color: theme.colors.dark2, fontWeight: "800", marginRight: "30px"}} />
              <Typography sx={{fontFamily: theme.typography, color: theme.colors.dark2, fontSize: "25px", fontWeight: "800"}}variant>Please connect to use our application!</Typography>
            </Box>
          </Paper>
        </Box>
      </Container>}
    </Box>
  )
}

export default GenerateProof