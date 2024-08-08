import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Avatar, InputLabel, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import funDoctor from "../../../images/fun-doctor.png";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../redux/actions/RegisterAction";
import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CallIcon from "@mui/icons-material/Call";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import WcIcon from "@mui/icons-material/Wc";
import MedicationIcon from "@mui/icons-material/Medication";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  notifySuccess,
  notifyError,
  notifyWarning,
} from "../../../Components/Toastify/Toastify";
import "./Register.css";

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [inputType, setInputType] = useState("password");

  const changeVisibility = (e) => {
    setInputType(inputType === "password" ? "text" : "password");
  };

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [medical_history, setMedicalHistory] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDate] = useState("");

  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.register);

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

    if (first_name === "") {
      return notifyWarning("First Name is required");
    }

    if (last_name === "") {
      return notifyWarning("LastName is required");
    }

    if (email === "") {
      return notifyWarning("Email is required");
    }

    if (!isValidEmail(email)) {
      return notifyWarning("Invalid Email Format");
    }

    if (phone === "") {
      return notifyWarning("Phone is required");
    }

    if (password.trim() === "") {
      return notifyWarning("Password is required");
    }

    if (!isPasswordStrong(password)) {
      return notifyWarning(
        "Weak password. Password should contain at least 8 characters, including uppercase, lowercase, numbers, and special characters."
      );
    }

    if (medical_history === "") {
      return notifyWarning("MedicalHistory is required");
    }

    if (gender === "") {
      return notifyWarning("Gender is required");
    }

    if (dob === "") {
      return notifyWarning("Date is required");
    }

    console.log(
      first_name,
      last_name,
      email,
      phone,
      password,
      medical_history,
      gender,
      dob
    );

    dispatch(
      registerUser({
        first_name,
        last_name,
        email,
        phone,
        password,
        medical_history: { text: medical_history },
        gender,
        dob,
      })
    );
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: { sm: "10px", lg: "100px" },
        backgroundImage: "linear-gradient(180deg, #003c44 0%,  #00929d 100%)",
        padding: "20px 0",
        overflowX: "hidden",
      }}
    >
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
        <Toolbar sx={{ gap: { xs: 1, sm: 2 }, justifyContent: "center" }}>
          <Box
            sx={{ width: { xs: "46.5%", sm: "210px" }, position: "relative" }}
          >
            <InputLabel>First Name</InputLabel>
            <Box>
              <PersonIcon
                sx={{
                  position: "absolute",
                  left: "15px",
                  top: "53%",
                  color: "yellow",
                }}
              />
              <input
                placeholder="First Name"
                type="text"
                style={{ width: "100%" }}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Box>
          </Box>
          <Box
            sx={{ width: { xs: "46.5%", sm: "210px" }, position: "relative" }}
          >
            <InputLabel>Last Name</InputLabel>
            <Box>
              <PersonIcon
                sx={{
                  position: "absolute",
                  left: "15px",
                  top: "53%",
                  color: "yellow",
                }}
              />
              <input
                className="name"
                placeholder="Last Name"
                type="text"
                style={{ width: "100%" }}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Box>
          </Box>
        </Toolbar>
        <Box
          mt={{ xs: 1, sm: 2 }}
          sx={{ width: { xs: "90%", sm: "436px" }, position: "relative" }}
        >
          <InputLabel>Email</InputLabel>
          <MailIcon
            sx={{
              position: "absolute",
              top: "53%",
              left: "15px",
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
        <Box
          mt={{ xs: 1, sm: 2 }}
          sx={{ width: { xs: "90%", sm: "436px" }, position: "relative" }}
        >
          <InputLabel>Phone</InputLabel>
          <Box>
            <CallIcon
              sx={{
                position: "absolute",
                left: "15px",
                top: "53%",
                color: "yellow",
              }}
            />
            <input
              placeholder="Enter Your Phone"
              type="text"
              style={{ width: "100%" }}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Box>
        </Box>
        <Box
          mt={{ xs: 1, sm: 2 }}
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
              style={{ width: "100%", paddingRight: "50px" }}
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
        <Box
          mt={{ xs: 1, sm: 2 }}
          sx={{ width: { xs: "90%", sm: "436px" }, position: "relative" }}
        >
          <InputLabel>Medical History</InputLabel>
          <Box>
            <MedicationIcon
              sx={{
                position: "absolute",
                left: "15px",
                top: "53%",
                color: "yellow",
              }}
            />
            <input
              placeholder="Enter Your Medical History"
              type="text"
              style={{ width: "100%" }}
              onChange={(e) => setMedicalHistory(e.target.value)}
            />
          </Box>
        </Box>
        <Toolbar
          sx={{
            gap: { xs: 1, sm: 2 },
            mt: { xs: 1, sm: 2 },
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Box sx={{ width: { xs: "47%", sm: "210px" }, position: "relative" }}>
            <InputLabel>Gender</InputLabel>
            <Box>
              <WcIcon
                sx={{
                  position: "absolute",
                  left: "15px",
                  top: "53%",
                  color: "yellow",
                }}
              />
              <select
                className="gender"
                style={{ width: "100%" }}
                onChange={(e) => setGender(e.target.value)}
              >
                <option style={{ color: "white" }} value="">
                  Select Gender
                </option>
                <option style={{ color: "white" }} value="M">
                  Male
                </option>
                <option style={{ color: "white" }} value="F">
                  Female
                </option>
              </select>
            </Box>
          </Box>
          <Box sx={{ width: { xs: "47%", sm: "210px" }, position: "relative" }}>
            <InputLabel>Date of Birth</InputLabel>
            <Box>
              <HistoryToggleOffIcon
                sx={{
                  position: "absolute",
                  left: "15px",
                  top: "53%",
                  color: "yellow",
                }}
              />
              <input
                className="date"
                placeholder="Date of Birth"
                type="date"
                style={{ width: "100%" }}
                onChange={(e) => setDate(e.target.value)}
              />
            </Box>
          </Box>
        </Toolbar>
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
            onClick={(e) => formSubmitHandler(e)}
          >
            Register
          </Button>
        </Box>
        <Typography
          variant="div"
          component="div"
          sx={{ color: "white", fontSize: { xs: "16px", sm: "20px" } }}
        >
          Do You Have Account ?{" "}
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
            onClick={() => navigate("/login")}
          >
            Login
          </Typography>
        </Typography>
      </Typography>

      <Toolbar
        sx={{
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          display: { xs: "none", md: "flex" },
        }}
      >
        <Box sx={{ textAlign: "center", mt: "40px" }}>
          <Typography variant="h4" color="white">
            New here ?
          </Typography>
          <Typography
            variant="h6"
            color="white"
            sx={{ fontSize: "18px", mt: 1, fontStyle: "italic" }}
          >
            Welcome to Our Clinic Dentist, Register And Join To Our World...
          </Typography>
        </Box>
        <Avatar
          className="images"
          src={funDoctor}
          sx={{
            width: { md: "375px", lg: "444px" },
            height: { md: "500px", lg: "562px" },
            opacity: "0.9",
            mt: 3,
          }}
        />
        <ToastContainer />
      </Toolbar>
    </Box>
  );
};

export default Register;
