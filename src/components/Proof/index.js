import { Box, Container, Paper, Typography, Button, Grid } from '@mui/material'
import React, {useContext, useState, useEffect} from 'react'
import {useTheme} from '@mui/material'
import ExtensionIcon from '@mui/icons-material/Extension';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import { Link } from 'react-router-dom'
import { GlobalContext } from '../../context/GlobalState';

const Proof = () => {
  const theme = useTheme()
  const { address } = useContext(GlobalContext)

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
            <Grid container>
              <Grid item xs={6} sx={{padding: "50px", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "10px"}}>
                <Typography variant="body2"
                  sx={{ fontFamily: theme.typography, fontSize: "20px", fontWeight: "700"}}
                  mb={1}>
                  Generating proof with extension
                </Typography>
                <Box sx={{padding: "10px", display: "flex", justifyContent: "center", alignItems: "center", border: "5px solid #003366", marginBottom: "20px", marginTop: "10px"}}>
                  <ExtensionIcon  sx={{color: theme.colors.dark2, fontSize: "120px"}}/>
                </Box>
                <Link to="/generate/extension" style={{ textDecoration: 'none'}}>
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
                  >
                    Choose
                  </Button> 
                </Link>
              </Grid>
              <Grid item xs={6} sx={{padding: "50px", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "10px"}}>
                <Typography variant="body2"
                  sx={{ fontFamily: theme.typography, fontSize: "20px", fontWeight: "700"}}
                  mb={1}>
                  Continue generating credit proof online
                </Typography>
                <Box sx={{padding: "10px", display: "flex", justifyContent: "center", alignItems: "center", border: "5px solid #003366", marginBottom: "20px", marginTop: "10px"}}>
                  <OpenInBrowserIcon  sx={{color: theme.colors.dark2, fontSize: "120px"}}/>
                </Box>
                <Link to="/generate/web" style={{ textDecoration: 'none'}}>
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
                  >
                    Choose
                  </Button> 
                </Link>
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

export default Proof