import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import PersonIcon from "@mui/icons-material/Person";
import { logoutUser } from "../redux/actions/LogoutAction";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getSingleUser } from "../redux/actions/UsersActions";

const drawerWidth = 240;
const navItems = ["Home", "About", "Services"];
const navLogin = ["Home", "About", "MyAppointments", "Services"];
const navLoginAdmin = ["Home", "About", "Appointments", "Users", "Services"];

export default function DrawerAppBar() {
  const navigate = useNavigate();
  // useTheme Color
  const theme = useTheme();

  const dispatch = useDispatch();

  // Start Speed Dial
  const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
    position: "relative",

    "&.MuiBox-root, &.css-q2y3yl": {
      width: "47px",
      height: "48px",
    },

    "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
      top: theme.spacing(0),
    },
    ".css-7dv1rb-MuiButtonBase-root-MuiFab-root-MuiSpeedDial-fab": {
      // Add your custom styles here
      // Example
      backgroundColor: "transparent",
      boxShadow: "none",
      width: "47px",
      height: "48px",
      transition: "0.2s !important",
      // Adjust other styles as needed
    },
    ".css-7dv1rb-MuiButtonBase-root-MuiFab-root-MuiSpeedDial-fab:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
      // Adjust other styles as needed
    },
    ".css-i4bv87-MuiSvgIcon-root": {
      fontSize: "23px",
    },
    ".MuiSpeedDial-actions": {
      marginTop: "-40px",
    },

    ".MuiSpeedDial-actions button": {
      backgroundColor: theme.palette.mainColor.button,
    },

    ".MuiSpeedDial-actions button svg": {
      color: "white",
    },
  }));
  const registerActions = [
    { icon: <AppRegistrationIcon />, name: "Register", Link: "register" },
    { icon: <LoginIcon />, name: "Login", Link: "login" },
  ];

  const loginActions = [
    { icon: <PersonIcon />, name: "Profile", Link: "profile" },
    { icon: <LogoutIcon />, name: "Logout", Link: "logout" },
  ];

  // mobile responsive
  const paddingNavbar = "0 10px";

  useEffect(() => {
    if (localStorage.getItem("userId-dentist-clinic") !== null) {
      dispatch(getSingleUser(localStorage.getItem("userId-dentist-clinic")));
      console.log("ll");
    }
  }, []);

  const { loading, user } = useSelector((state) => state.singleUser);

  // Start Drawer
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        variant="h6"
        sx={{
          my: 2,
          fontStyle: "italic",
          color: theme.palette.mainColor.mainIcon,
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        SrMedical
      </Typography>
      <Divider />
      <List>
        {loading === true
          ? null
          : user === null
          ? navItems.map((item) => (
              <ListItem key={item} disablePadding sx={{ overflow: "hidden" }}>
                <ListItemButton
                  sx={{
                    textAlign: "center",
                    transition: "all 0.3s",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                  onClick={() =>
                    item === "Home"
                      ? navigate("/")
                      : navigate(`/${item.toLowerCase()}`)
                  }
                >
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ))
          : user?.data?.is_staff === true
          ? navLoginAdmin.map((item) => (
              <ListItem key={item} disablePadding sx={{ overflow: "hidden" }}>
                <ListItemButton
                  sx={{
                    textAlign: "center",
                    transition: "all 0.3s",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                  onClick={() =>
                    item === "Home"
                      ? navigate("/")
                      : navigate(`/${item.toLowerCase()}`)
                  }
                >
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ))
          : navLogin.map((item) => (
              <ListItem key={item} disablePadding sx={{ overflow: "hidden" }}>
                <ListItemButton
                  sx={{
                    textAlign: "center",
                    transition: "all 0.3s",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                  onClick={() =>
                    item === "Home"
                      ? navigate("/")
                      : navigate(`/${item.toLowerCase()}`)
                  }
                >
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ))}
      </List>
    </Box>
  );
  const container = window.document.body;
  // End Drawer

  return (
    <Box sx={{ display: "flex", pb: "64px" }}>
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{
          height: "64px",
          padding: { xs: `${paddingNavbar}`, md: "0 30px" },
          bgcolor: theme.palette.mainColor.navbar,
          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            height: "100%",
            justifyContent: "space-between",
            padding: "0",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              display: { md: "none" },
              textAlign: "center",
              ml: "2px",
            }}
          >
            <MenuIcon sx={{ fontSize: "35px" }} />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              display: { xs: "none", md: "block" },
              fontSize: "25px",
              cursor: "pointer",
              fontStyle: "italic",
              color: theme.palette.mainColor.mainFont,
            }}
            pr={2}
            onClick={() => navigate("/")}
          >
            SrMedical
          </Typography>

          {loading === true ? null : (
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              {user === null
                ? navItems.map((item) => (
                    <Button
                      key={item}
                      sx={{
                        color: "#fff",
                        fontSize: "15px",
                        width: "fit-content",
                        mx: { md: "5px", lg: "12px" },
                        transition: "0.3s",
                        "&:hover": { transform: "scale(1.1)" },
                      }}
                      onClick={() =>
                        item === "Home"
                          ? navigate("/")
                          : navigate(`/${item.toLowerCase()}`)
                      }
                    >
                      {item}
                    </Button>
                  ))
                : user?.data?.is_staff === true
                ? navLoginAdmin.map((item) => (
                    <Button
                      key={item}
                      sx={{
                        color: "#fff",
                        fontSize: "15px",
                        width: "fit-content",
                        mx: { md: "5px", lg: "12px" },
                        transition: "0.3s",
                        "&:hover": { transform: "scale(1.1)" },
                      }}
                      onClick={() =>
                        item === "Home"
                          ? navigate("/")
                          : navigate(`/${item.toLowerCase()}`)
                      }
                    >
                      {item}
                    </Button>
                  ))
                : navLogin.map((item) => (
                    <Button
                      key={item}
                      sx={{
                        color: "#fff",
                        fontSize: "15px",
                        width: "fit-content",
                        mx: { md: "5px", lg: "12px" },
                        transition: "0.3s",
                        "&:hover": { transform: "scale(1.1)" },
                      }}
                      onClick={() =>
                        item === "Home"
                          ? navigate("/")
                          : navigate(`/${item.toLowerCase()}`)
                      }
                    >
                      {item}
                    </Button>
                  ))}
            </Box>
          )}

          {/* Icons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              height: "48px",
            }}
          >
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
              sx={{}}
            >
              <Badge badgeContent={4} color="error">
                <MailIcon sx={{ fontSize: "23px" }} />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon sx={{ fontSize: "23px" }} />
              </Badge>
            </IconButton>
            <Box
              size="large"
              ariaLabel="SpeedDial playground example"
              direction={"down"}
              color="inherit"
            >
              <StyledSpeedDial
                ariaLabel="SpeedDial playground example"
                icon={<AccountCircle />}
                direction={"down"}
                sx={{
                  width: "47px",
                }}
              >
                {user === null
                  ? registerActions.map((action) => (
                      <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        sx={{ textAlign: "center" }}
                        onClick={() => navigate(`/${action.Link}`)}
                      />
                    ))
                  : loginActions.map((action) => (
                      <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        sx={{ textAlign: "center" }}
                        onClick={
                          action.Link !== "logout"
                            ? () => navigate(`/${action.Link}`)
                            : () => dispatch(logoutUser())
                        }
                      />
                    ))}
              </StyledSpeedDial>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: theme.palette.mainColor.navbar,
              color: "white",
            },
          }}
        >
          {drawer}
        </Drawer>
        <ToastContainer />
      </nav>
    </Box>
  );
}
