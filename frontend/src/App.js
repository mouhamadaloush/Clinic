import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Home from "./pages/Home/Home";
import DrawerAppBar from "./MUI-Components/DrawerAppBar";
import Login from "./pages/Authentication/Login/Login";
import { useDispatch, useSelector } from "react-redux";
import Register from "./pages/Authentication/Register/Register";
import ForgetPassword from "./pages/Authentication/ForgetPassword/ForgetPassword";
import ResetPassword from "./pages/Authentication/ResetPassword/ResetPassword";
import ChangePassword from "./pages/Authentication/ChanhePassword/ChangePassword";
import Appointments from "./pages/Appointments/Appointments";
import MakeAppointments from "./pages/Appointments/MakeAppointments";
import SingleAppointment from "./pages/Appointments/SingleAppointment";
import AllUsers from "./pages/Users/AllUsers";
import Profile from "./pages/Profile/Profile";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import MakeRecordAppointment from "./pages/Appointments/MakeRecordAppointment";
import AllAppointments from "./pages/Appointments/AllAppointments";

const App = () => {
  const { loading, user } = useSelector((state) => state.login);
  const [mode, setMode] = useState();
  const theme = createTheme({
    palette: {
      mode: "light",
      ...(mode === "light"
        ? {
            mainColor: {
              main: "#003c44",
              navbar: "#00545d",
              button: "#00929d",
              mainFont: "#3ed8dd",
              font: "#5f8f94",
              mainIcon: "#35c4c9",
              background: "#d9fbfb",
            },
          }
        : {
            mainColor: {
              main: "#003c44",
              navbar: "#00545d",
              button: "#00929d",
              mainFont: "#3ed8dd",
              font: "#5f8f94",
              mainIcon: "#35c4c9",
              background: "#d9fbfb",
            },
          }),
    },
  });

  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <DrawerAppBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                // token !== null ? <Navigate to="/" /> :
                <Login />
              }
            />
            <Route
              path="/register"
              element={
                // token !== null ? <Navigate to="/" /> :
                <Register />
              }
            />
            <Route path="/forget" element={<ForgetPassword />} />
            <Route path="/reset" element={<ResetPassword />} />
            <Route path="/changePassword" element={<ChangePassword />} />
            <Route path="/myappointments" element={<Appointments />} />
            <Route
              path="/appointments/makeAppointments"
              element={<MakeAppointments />}
            />
            <Route path="/appointments/:id" element={<SingleAppointment />} />
            <Route
              path="/appointments/makeRecord/:id"
              element={<MakeRecordAppointment />}
            />
            <Route path="/users" element={<AllUsers />} />
            <Route path="/appointments" element={<AllAppointments />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
};

export default App;
