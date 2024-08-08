import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../redux/actions/LoginAction";
import {
  Avatar,
  Box,
  InputLabel,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import emailImg from "../../../images/email.jpg";
import funDoctor2 from "../../../images/fun-doctor2.png";
import google from "../../../images/google.png";
import facebook from "../../../images/facebook.png";
import MailIcon from "@mui/icons-material/Mail";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  notifySuccess,
  notifyError,
  notifyWarning,
} from "../../../Components/Toastify/Toastify";
import "./Login.css";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [inputType, setInputType] = useState("password");

  const changeVisibility = (e) => {
    setInputType(inputType === "password" ? "text" : "password");
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const { loading, user } = useSelector((state) => state.login);

  const formSubmitHandler = (e) => {
    e.preventDefault();

    const isValidEmail = (email) => {
      // Regular expression pattern to validate email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      return emailPattern.test(email);
    };

    const isPasswordStrong = (password) => {
      // Password strength criteria
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
        password
      );

      // Check if password meets all criteria
      return (
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar
      );
    };

    if (email === "") {
      return notifyWarning("Please Enter Your Email");
    }
    // if (!isValidEmail(email)) {
    //   // Utilizing the email validation function
    //   return notifyWarning("Invalid Email Format");
    // }
    if (password.trim() === "") {
      return notifyWarning("Password is required");
    }
    // if (!isPasswordStrong(password)) {
    //   // Utilizing the password strength check function
    //   return notifyWarning(
    //     "Weak password. Password should contain at least 8 characters, including uppercase, lowercase, numbers, and special characters."
    //   );
    // }

    // Continue with the rest of your code...
    dispatch(loginUser(email, password));
  };

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
          display: { xs: "none", md: "flex" },
        }}
      >
        <Box sx={{ textAlign: "center", mt: "0px" }}>
          <Typography variant="h4" component="h4" color="white">
            One of us ?
          </Typography>
          <Typography
            variant="h6"
            color="white"
            sx={{ fontSize: "18px", mt: 1, fontStyle: "italic" }}
          >
            Welcome to Our Clinic Dentist, Login And Continue Your Join In Our
            World...
          </Typography>
        </Box>
        <Avatar
          className="images-login"
          src={funDoctor2}
          sx={{
            width: { xs: "380px", lg: "423px" },
            height: { xs: "500px", lg: "580px" },
            opacity: "0.9",
            mt: 3,
          }}
        />
      </Toolbar>
      <Typography
        component="from"
        variant="form"
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: { xs: "100%", sm: "auto" },
        }}
      >
        <Box sx={{ width: { xs: "90%", sm: "436px" }, position: "relative" }}>
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
              onChange={(e) => setEmail(e.target.value)}
              id="email"
            />
          </Box>
        </Box>

        <Box
          mt={{ xs: 3, sm: 5 }}
          sx={{ width: { xs: "90%", sm: "436px" }, position: "relative" }}
        >
          <InputLabel>Password</InputLabel>
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
              placeholder="Enter Your Password"
              type={inputType}
              style={{ width: "100%", paddingLeft: "50px" }}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
            />
            {inputType === "password" ? (
              <VisibilityOffIcon
                sx={{
                  position: "absolute",
                  right: "15px",
                  top: "53%",
                  color: "yellow",
                  cursor: "pointer",
                }}
                onClick={changeVisibility}
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
                onClick={changeVisibility}
              />
            )}
          </Box>
        </Box>

        <Typography
          variant="div"
          component="div"
          onClick={() => navigate("/forget")}
          sx={{
            color: "white",
            textAlign: "end",
            mt: 2,
            mr: { xs: 9, sm: 4 },
            fontWeight: "500",
            letterSpacing: "1px",
            cursor: "pointer",
            width: "100%",
            transition: "0.3s",
            "&:hover": { color: theme.palette.mainColor.mainFont },
          }}
        >
          Forget Password ?
        </Typography>

        <Toolbar
          sx={{
            mt: "20px",
            justifyContent: { xs: "center", sm: "center" },
            width: "100%",
            padding: { xs: "0 30px", sm: "0 20px" },
            gap: "30px",
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "30%",
              cursor: "pointer",
            }}
          >
            <Avatar
              src={google}
              sx={{
                width: { xs: "50px", sm: "65px" },
                height: { xs: "50px", sm: "65px" },
              }}
            />
          </Box>
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "30%",
              cursor: "pointer",
            }}
          >
            <Avatar
              src={facebook}
              sx={{
                width: { xs: "52px", sm: "65px" },
                height: { xs: "52px", sm: "65px" },
              }}
            />
          </Box>
        </Toolbar>

        <Box
          sx={{
            bgcolor: theme.palette.mainColor.main,
            borderRadius: "25px",
            overflow: "hidden",
            textAlign: "center",
            mt: 3.5,
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
            onClick={(e) => formSubmitHandler(e)}
          >
            Login
          </Button>
        </Box>
        <Typography
          variant="div"
          component="div"
          sx={{ color: "white", fontSize: { xs: "16px", sm: "20px" } }}
        >
          You Don't Have Account ?{" "}
          <Typography
            variant="span"
            component="span"
            sx={{
              color: theme.palette.mainColor.mainIcon,
              fontWeight: "700",
              cursor: "pointer",
              transition: "0.3s",
              "&:hover": { color: theme.palette.mainColor.navbar },
              fontStyle: "italic",
            }}
            onClick={() => navigate("/register")}
          >
            Register
          </Typography>
        </Typography>
        <ToastContainer />
      </Typography>
    </Box>
  );
};

export default Login;
