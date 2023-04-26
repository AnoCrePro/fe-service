import { Box, Container, Paper, Typography } from '@mui/material'
import React, {useContext} from 'react'
import {useTheme} from '@mui/material'
import { GlobalContext } from '../../context/GlobalState'

const Scoring = () => {
  const {userInfo} = useContext(GlobalContext)
  const theme = useTheme()
  return (
    <Box
      sx={{
        paddingTop: "20px",
      }}
      mb={5}
    >
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
              Credit Scoring
              <Box sx={{width: "100%", height: "4px", backgroundColor: "black", borderRadius: "10px", marginTop: "10px"}}></Box>
            </Typography>
          </Box> 
          <Box sx={{padding: "20px", display: "flex", alignItems: "center"}}>
            <Typography
              variant="body2"
              sx={{ fontFamily: theme.typography, fontSize: "25px", fontWeight: "700"}}
            >
              Your credit score: 
            </Typography>
            <Box sx={{marginLeft: "20px", borderRadius: "10px", width: "50px", height: "50px", display: "flex", backgroundColor: theme.colors.dark2, justifyContent: "center", alignItems: "center"}}>
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
              Achieved at: {userInfo.timestamp}
            </Typography>
          </Box>
        </Paper>
        </Box>
      </Container>
    </Box>
  )
}

export default Scoring