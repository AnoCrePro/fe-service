import { Box, Container, Paper, Typography, Button } from '@mui/material'
import React, {useContext, useState, useEffect} from 'react'
import {useTheme} from '@mui/material'
import { GlobalContext } from '../../context/GlobalState'
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import GenDialog from './GenDialog';
import { toDayTime } from '../../shared/utils/others'
import { fetchData } from '../../shared/utils/database'
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { SERVER } from "../../shared/Constants/constants"

const Scoring = () => {
  const {address, refresh, updateRefresh} = useContext(GlobalContext)
  const [userInfo, setUserInfo] = useState({"credit_score": "?", "timestamp": "?"})
  const theme = useTheme()

  const [openGen, setOpenGen] = useState(false)
  const [open, setOpen] = useState(false)

  const handleOpenWebDialog = () => {
    setOpen(true)
  }
  const handleOpenGenDialog = () => {
    setOpenGen(true)
  }

  useEffect(() => {
    if (address) {
      fetchData({public_key: address}, SERVER + "centic/user/registerInfo/")
      .then(data => {
        setUserInfo({
          "credit_score": data.credit_score,
          "timestamp": data.timestamp
        })
      })
    }
  }, [address])

  const handleGetCreditScore = () => {
    const credit_score = Math.floor(Math.random() * 1000) + 1
    const timestamp = Math.floor(Date. now() / 1000)
    fetchData({credit_score: credit_score, timestamp: timestamp, public_key: address}, SERVER + "centic/user/updateRegisterInfo/")
      .then(data => {
        setUserInfo({
          "credit_score": data.credit_score,
          "timestamp": data.timestamp
        })
      })
    updateRefresh(!refresh)
  }

  return (
    <Box
      sx={{
        paddingTop: "70px",
      }}
      mb={5}
    >
      { address ? <Container> 
        <Box mt={2}>
        <Paper
          sx={{
            background: "#0D1921 0% 0% no-repeat padding-box",
            borderRadius: "15px",
            padding: "50px",
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
              sx={{ fontFamily: theme.typography.typography, fontSize: "30px", fontWeight: "700", color: "#97A8BC"}}
              mb={1}
            >
              Credit Scoring
            </Typography>
          </Box> 
          <Box sx={{display: "flex", padding: "40px", justifyContent: "space-around", alignItems: "center"}}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center"}}>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: theme.typography, fontSize: "25px", fontWeight: "700"}}
                >
                  Your credit score: 
                </Typography>
                <Box sx={{marginLeft: "20px", borderRadius: "10px", width: "50px", height: "50px", display: "flex", backgroundColor: "#5185AA", justifyContent: "center", alignItems: "center", paddingX: "10px"}}>
                  <Typography
                    variant="body2"
                    sx={{ 
                      fontFamily: theme.typography, 
                      fontSize: "25px", 
                      fontWeight: "700", 
                      color: theme.colors.light1}}
                  >
                    {userInfo.credit_score}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{padding: "20px", display: "flex", alignItems: "center"}}>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: theme.typography, fontSize: "20px", fontWeight: "700"}}
                >
                  Achieved at: 
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: theme.typography, fontSize: "20px", fontWeight: "700", color: "red", marginLeft: "10px"}}
                >
                  {userInfo.timestamp === "?" ? "?" : toDayTime(userInfo.timestamp)}
                </Typography>
              </Box>
            </Box>
            {/* <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
              <Typography variant="body2"
                sx={{ fontFamily: theme.typography, fontSize: "20px", fontWeight: "700"}}>
                  Click to get your current credit score
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
                  width: "300px",
                  fontWeight: "700",
                  marginRight: "20px",
                  marginTop: "20px",
                  fontFamily: theme.typography,
                  fontSize: "25px",
                  "&:hover": {
                    cursor: "pointer"
                  }
                }}
                onClick={handleGetCreditScore}
              >
                Get Credit Score
              </Button> 
            </Box> */}
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                  <Typography variant="body2"
                    sx={{ fontFamily: theme.typography, fontSize: "20px", fontWeight: "700"}}
                    mb={1}>
                    Generate Credit Proof
                  </Typography>
                  <Box sx={{padding: "10px", display: "flex", justifyContent: "center", alignItems: "center", border: "5px solid #E2EDFF", marginBottom: "20px", marginTop: "10px"}}>
                    <AccountTreeIcon  sx={{color: "#E2EDFF", fontSize: "120px"}}/>
                  </Box>
                    <Button
                      sx={{
                        backgroundColor: "#5185AA",
                        color: theme.colors.light1,
                        borderColor: theme.colors.light1,
                        border: "3px solid black",
                        borderRadius: "16px",
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
              </Box>
          </Box>
        </Paper>
        </Box>
      </Container> : 
      <Container> 
        <Box mt={2}>
          <Paper
            sx={{
              background: "#0D1921 0% 0% no-repeat padding-box",
              borderRadius: "15px",
              padding: "50px",
            }}
            elevation={1}
          >
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"
            // , backgroundColor: "black", height: "70px", width: "600px"
            }}>
              <LockPersonIcon  sx={{fontSize: "50px", color: "#E2EDFF", fontWeight: "800", marginRight: "30px"}} />
              <Typography sx={{fontFamily: theme.typography, color: theme.colors.dark2, fontSize: "25px", fontWeight: "800"}}variant>Please connect to use our application!</Typography>
            </Box>
          </Paper>
        </Box>
      </Container>}
    </Box>
  )
}

export default Scoring