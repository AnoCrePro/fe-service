import { Box, Container, Paper, Typography, Button, Grid } from '@mui/material'
import React, {useContext, useState, useEffect} from 'react'
import {useTheme} from '@mui/material'
import LockPersonIcon from '@mui/icons-material/LockPerson';
import WebDialog from './WebDialog'
import { GlobalContext } from '../../context/GlobalState';

const GenerateProof = ({method}) => {
  console.log(method)
  const { address } = useContext(GlobalContext)
  const theme = useTheme()
  const [open, setOpen] = useState(false)

  const handleOpenWebDialog = () => {
    setOpen(true)
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