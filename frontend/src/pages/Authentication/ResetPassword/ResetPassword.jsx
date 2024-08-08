import React from "react";
import {
  Avatar,
  Box,
  Button,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import emailImg from "../../../images/email.jpg";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: { sm: "0px", lg: "80px" },
        backgroundImage: "linear-gradient(180deg, #003c44 0%,  #00929d 100%)",
        padding: "20px",
        overflowX: "hidden",
      }}
    >
      <Toolbar
        sx={{
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          display: { md: "flex" },
        }}
      >
        <Box sx={{ textAlign: "center", mt: "0px" }}>
          <Typography
            variant="h4"
            component="h4"
            color="white"
            sx={{ color: "yellow" }}
          >
            Email has been sent!
          </Typography>
          <Typography
            variant="h6"
            color="white"
            sx={{
              fontSize: "18px",
              mt: 1,
              fontStyle: "italic",
            }}
          >
            Please check your inbox and click and in the received link to reset
            the password
          </Typography>
        </Box>
        <Avatar
          className="image-email"
          src={emailImg}
          sx={{
            width: { xs: "350px", sm: "481px" },
            height: { xs: "400px", sm: "500px" },
            mt: -1,
            opacity: "0.6",
          }}
        />
        <Box
          sx={{
            bgcolor: theme.palette.mainColor.main,
            borderRadius: "25px",
            overflow: "hidden",
            textAlign: "center",
            mt: { xs: -4, sm: -5 },
            mb: 2,
            boxShadow: "2px 2px 3px 1px rgba(0,0,0,0.7)",
            width: { xs: "90%", sm: "436px" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: { xs: "40px", sm: "auto" },
          }}
        >
          <Button
            sx={{
              color: "yellow",
              fontSize: "17px",
              width: { xs: "80%", sm: "436px" },
              fontWeight: "600 !important",
              letterSpacing: "1.2px",
            }}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </Box>
  );
};

export default ResetPassword;
