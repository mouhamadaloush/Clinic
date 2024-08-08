import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAppointment,
  getAllAppointments,
} from "../../redux/actions/appointmentsAction";
import moment from "moment";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import {
  sortDateDescending,
  sortDateProgressive,
} from "../../Components/SortDate/sortDate";
import SortIcon from "@mui/icons-material/Sort";

const AllAppointments = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allAppointments, loading } = useSelector(
    (state) => state.allAppointments
  );

  console.log(allAppointments);

  useEffect(() => {
    dispatch(getAllAppointments());
  }, []);

  const [sortDate, setSortDate] = useState("default");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortAndClose = (value) => {
    setAnchorEl(null);
    setSortDate(value);
  };

  if (sortDate === "default" || sortDate === "progressive") {
    sortDateProgressive(allAppointments);
  } else {
    sortDateDescending(allAppointments);
  }

  return (
    <Box
      sx={{
        backgroundImage: "linear-gradient(180deg, #003c44 0%,  #00929d 100%)",
        minHeight: "calc(100vh - 64px)",
        padding: "20px 0",
      }}
    >
      <Container>
        <Typography
          sx={{
            textAlign: "center",
            color: "white",
            pb: 1,
            fontSize: { xs: "30px", sm: "48px" },
          }}
          variant="h3"
          component="h3"
        >
          All Appointments
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "40px",
            mt: 4,
          }}
        >
          <Button
            sx={{
              mt: 1,
              backgroundColor: theme.palette.mainColor.button,
              color: theme.palette.mainColor.background,
              fontSize: { xs: "13px", md: "14px", lg: "16px" },
              fontWeight: "bold",
              borderRadius: "none !important",
              paddingX: { xs: "5px", sm: "8px", md: "12px", lg: "15px" },
              width: { xs: "200px", md: "auto" },
              "&:hover": {
                backgroundColor: "#009aaa",
              },
            }}
            onClick={() => navigate("/appointments/makeAppointments")}
          >
            Make Appointment
          </Button>

          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{
              mt: 1,
              backgroundColor: theme.palette.mainColor.button,
              color: theme.palette.mainColor.background,
              "&:hover": {
                backgroundColor: "#009aaa",
              },
            }}
          >
            <SortIcon sx={{ mr: 0.5 }} /> Sort
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            sx={{
              ml: { xs: -0.42, sm: 0 },
            }}
          >
            <MenuItem onClick={() => handleSortAndClose("default")}>
              Default
            </MenuItem>
            <MenuItem onClick={() => handleSortAndClose("progressive")}>
              Progressive
            </MenuItem>
            <MenuItem onClick={() => handleSortAndClose("descending")}>
              Descending
            </MenuItem>
          </Menu>
        </Box>
        <Grid container columnSpacing={2}>
          {allAppointments.map((ap) => (
            <Grid key={ap.id} item xs={12} sm={6} md={4} lg={3} sx={{ mt: 2 }}>
              <Paper
                sx={{
                  width: "100%",
                  backgroundColor: theme.palette.mainColor.button,
                  padding: "5px 10px",
                  minHeight: "230px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                elevation={3}
              >
                <Box>
                  <Typography
                    component="div"
                    variant="div"
                    sx={{
                      textAlign: "center",
                      color: theme.palette.mainColor.navbar,
                      fontSize: "24px",
                    }}
                  >
                    {moment(ap.chosen_date).format("MMMM Do YYYY")}
                  </Typography>

                  <Typography
                    component="div"
                    variant="div"
                    sx={{
                      color: "white",
                      fontSize: "45px",
                      textAlign: "center",
                    }}
                  >
                    {moment(ap.chosen_date).format("hh:mm a")}
                  </Typography>

                  <Typography component="div" variant="div" sx={{}}>
                    <Typography
                      variant="div"
                      component="div"
                      sx={{
                        color: "yellow",
                        fontStyle: "italic",
                        textAlign: "center",
                      }}
                    >
                      reason of appointment
                    </Typography>
                    <Typography
                      component="div"
                      variant="div"
                      sx={{
                        ml: 0.5,
                        color: "white",
                        fontStyle: "normal",
                        fontSize: "14px",
                        mt: 0.2,
                        textAlign: "center",
                      }}
                    >
                      {ap.reason_of_appointment}
                    </Typography>
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    sx={{
                      color: "white",
                      backgroundColor: "transparent",
                      fontSize: "12px",
                      padding: "2px 7px",
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    user details
                  </Button>
                  <Box>
                    <IconButton
                      onClick={() =>
                        navigate(`/appointments/makeRecord/${ap.id}`)
                      }
                    >
                      <AddCircleIcon
                        sx={{
                          fontSize: "25px",
                          color: theme.palette.mainColor.navbar,
                        }}
                      />
                    </IconButton>
                    <IconButton
                      onClick={() => dispatch(deleteAppointment(ap.id))}
                    >
                      <DeleteIcon
                        sx={{
                          fontSize: "25px",
                          color: theme.palette.mainColor.navbar,
                        }}
                      />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AllAppointments;
