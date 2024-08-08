import React, { useState } from "react";
import { Avatar, Box, Typography, Button, InputLabel } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import changedPassword from "../../../images/change-password.png";
import { useDispatch } from "react-redux";
import "./ChangePassword.css";
import { notifyWarning } from "../../../Components/Toastify/Toastify";
import { changePassword } from "../../../redux/actions/PasswordAction";

const ChangePassword = () => {
  const dispatch = useDispatch();

  const [oldPasswordType, setOldPasswordType] = useState("password");
  const [newPasswordType, setNewPasswordType] = useState("password");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const changeVisibilityOldPassword = (e) => {
    setOldPasswordType(oldPasswordType === "password" ? "text" : "password");
  };

  const changeVisibilityNewPassword = (e) => {
    setNewPasswordType(newPasswordType === "password" ? "text" : "password");
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();

    const isPasswordStrong = (password) => {
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
        password
      );

      return (
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar
      );
    };

    if (oldPassword.trim() === "") {
      return notifyWarning("Password is required");
    }

    if (newPassword.trim() === "") {
      return notifyWarning("Password is required");
    }

    if (oldPassword.trim() === "") {
      return notifyWarning("Old password is required");
    }

    if (newPassword.trim() === "") {
      return notifyWarning("New password is required");
    }

    if (!isPasswordStrong(newPassword)) {
      return notifyWarning(
        "Weak password. Password should contain at least 8 characters, including uppercase, lowercase, numbers, and special characters."
      );
    }

    // Continue with the rest of your code...
    dispatch(changePassword(oldPassword, newPassword));
  };

  const theme = useTheme();

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
          sx={{
            fontSize: { xs: "2.7vmax", lg: "34px" },
            mt: -2,
            mb: { xs: 4.5, sm: 2 },
          }}
        >
          You Can Change Your Password
        </Typography>
      </Box>
      <Avatar
        className="change-password-img"
        src={changedPassword}
        sx={{
          width: { xs: "85%", sm: "350px" },
          height: { xs: "85%", sm: "350px" },
          opacity: "0.7",
          mt: -3,
          mb: { xs: 3, ms: 2 },
        }}
      ></Avatar>
      <Box
        sx={{
          width: { xs: "90%", sm: "436px" },
          position: "relative",
          mt: 2,
        }}
      >
        <InputLabel>Current Password</InputLabel>
        <Box>
          <LockIcon
            sx={{
              position: "absolute",
              left: "15px",
              top: "53%",
              color: "yellow",
            }}
          />
          <input
            placeholder="Enter Your Old Password"
            type={oldPasswordType}
            style={{ width: "100%", paddingLeft: "50px" }}
            onChange={(e) => setOldPassword(e.target.value)}
            id="password"
          />
          {oldPasswordType === "password" ? (
            <VisibilityOffIcon
              sx={{
                position: "absolute",
                right: "15px",
                top: "53%",
                color: "yellow",
                cursor: "pointer",
              }}
              onClick={changeVisibilityOldPassword}
            />
          ) : (
            <VisibilityIcon
              sx={{
                position: "absolute",
                right: "15px",
                top: "53%",
                color: "yellow",
                cursor: "pointer",
              }}
              onClick={changeVisibilityOldPassword}
            />
          )}
        </Box>
      </Box>
      <Box
        sx={{ width: { xs: "90%", sm: "436px" }, position: "relative", mt: 2 }}
      >
        <InputLabel>New Password</InputLabel>
        <Box>
          <LockIcon
            sx={{
              position: "absolute",
              left: "15px",
              top: "53%",
              color: "yellow",
            }}
          />
          <input
            placeholder="Enter Your New Password"
            type={newPasswordType}
            style={{ width: "100%", paddingLeft: "50px" }}
            onChange={(e) => setNewPassword(e.target.value)}
            id="password"
          />
          {newPasswordType === "password" ? (
            <VisibilityOffIcon
              sx={{
                position: "absolute",
                right: "15px",
                top: "53%",
                color: "yellow",
                cursor: "pointer",
              }}
              onClick={() => setNewPasswordType()}
            />
          ) : (
            <VisibilityIcon
              sx={{
                position: "absolute",
                right: "15px",
                top: "53%",
                color: "yellow",
                cursor: "pointer",
              }}
              onClick={() => changeVisibilityNewPassword()}
            />
          )}
        </Box>
      </Box>
      <Box
        sx={{
          bgcolor: theme.palette.mainColor.main,
          borderRadius: "25px",
          overflow: "hidden",
          textAlign: "center",
          mt: 3,
          mb: 2,
          boxShadow: "2px 2px 3px 1px rgba(0,0,0,0.7)",
          width: { xs: "90%", sm: "436px" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: { xs: "40px", sm: "auto" },
        }}
        onClick={(e) => formSubmitHandler(e)}
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

export default ChangePassword;
