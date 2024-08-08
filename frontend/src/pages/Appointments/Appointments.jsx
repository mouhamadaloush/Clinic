import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  Typography,
  Container,
  Button,
  IconButton,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SortIcon from "@mui/icons-material/Sort";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteAppointment,
  getUserAppointments,
} from "../../redux/actions/appointmentsAction";
import moment from "moment";
import {
  sortDateDescending,
  sortDateProgressive,
} from "../../Components/SortDate/sortDate";
import { useNavigate } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Appointments = () => {
  const dispatch = useDispatch();
  const { loading, appointment } = useSelector(
    (state) => state.userAppointments
  );

  console.log(appointment);

  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserAppointments());
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
    sortDateProgressive(appointment);
  } else {
    sortDateDescending(appointment);
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        backgroundImage: "linear-gradient(180deg, #003c44 0%,  #00929d 100%)",
        padding: { xs: "20px 0", sm: "20px" },
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      {loading === true ? (
        <h1>Loading...</h1>
      ) : (
        <Box sx={{ width: "100%" }}>
          <Container fixed sx={{ mt: 3 }}>
            <Typography
              variant="h4"
              component="h4"
              sx={{
                color: "white",
                fontSize: { xs: "24px", sm: "28px", md: "32px", lg: "40px" },
                textAlign: "center",
                mt: { xs: 1, sm: 0 },
              }}
            >
              The Booked Appointments
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
            <Grid
              container
              spacing={2}
              columnSpacing={{ xs: 1, sm: 2 }}
              sx={{ mt: { xs: 2, sm: 3 } }}
            >
              {appointment.map((ele, index) => (
                <Grid item xs={6} sm={6} md={4} lg={3} key={index}>
                  <Item
                    sx={{
                      backgroundColor: theme.palette.mainColor.button,
                    }}
                  >
                    <Typography
                      variant="h5"
                      component="h5"
                      sx={{
                        fontSize: { xs: "16px", sm: "20px", lg: "24px" },
                      }}
                    >
                      {moment(ele.chosen_date).format("MMMM Do YYYY")}
                    </Typography>
                    <Typography
                      variant="h4"
                      component="h4"
                      sx={{
                        color: theme.palette.mainColor.background,
                        fontSize: { xs: "27px", sm: "30px", lg: "40px" },
                        mt: 1,
                      }}
                    >
                      {moment(ele.chosen_date).format("hh:mm A")}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingX: "5px",
                      }}
                    >
                      <Button
                        sx={{
                          color: "white",
                          fontSize: "13px",
                        }}
                        onClick={() => navigate(`/appointments/${ele.id}`)}
                      >
                        View Record
                      </Button>
                      <IconButton
                        aria-label="delete"
                        onClick={() => {
                          dispatch(deleteAppointment(ele.id));
                        }}
                      >
                        <DeleteIcon
                          fontSize="inherit"
                          sx={{
                            fontSize: "22px",
                          }}
                        />
                      </IconButton>
                    </Box>
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default Appointments;
