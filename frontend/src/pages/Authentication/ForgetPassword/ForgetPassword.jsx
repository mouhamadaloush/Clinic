import React from "react";
import { Avatar, Box, Typography, Button, InputLabel } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MailIcon from "@mui/icons-material/Mail";
import { useNavigate } from "react-router-dom";
import forgetPassword from "../../../images/forget-password.png";
import "./ForgetPassword.css";

const ForgetPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "linear-gradient(180deg, #003c44 0%,  #00929d 100%)",
        padding: "20px",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{ textAlign: "center", paddingBottom: { xs: "15px", sm: "40px" } }}
      >
        <Typography
          variant="h4"
          component="h4"
          color="white"
          sx={{ fontSize: { xs: "3vmax", lg: "34px" } }}
        >
          Forget Your Password ?
        </Typography>
        <Typography
          variant="div"
          component="div"
          color="#00f7ff"
          sx={{
            fontSize: { xs: "2vmax", lg: "20px" },
            fontWeight: "500",
            letterSpacing: "1px",
          }}
          mt={2}
        >
          Don't Worry Enter Your Registered Email To Receive Password Link
        </Typography>
      </Box>
      <Avatar
        className="forget-password-img"
        src={forgetPassword}
        sx={{
          width: { xs: "85%", sm: "400px" },
          height: { xs: "85%", sm: "400px" },
          opacity: "0.7",
          mt: 2,
        }}
      ></Avatar>
      <Box
        sx={{ width: { xs: "90%", sm: "436px" }, position: "relative", mt: 2 }}
      >
        <InputLabel>Email</InputLabel>
        <Box>
          <MailIcon
            sx={{
              position: "absolute",
              left: "15px",
              top: "53%",
              color: "yellow",
            }}
          />
          <input
            placeholder="Enter Your Email"
            type="email"
            style={{ width: "100%" }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          bgcolor: theme.palette.mainColor.main,
          borderRadius: "25px",
          overflow: "hidden",
          textAlign: "center",
          mt: 2,
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
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ForgetPassword;
