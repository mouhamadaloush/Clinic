import React, { useEffect, useState } from "react";
import { Calendar } from "primereact/calendar";
import dayjs from "dayjs";
import {
  Box,
  styled,
  Paper,
  Button,
  Container,
  Card,
  Avatar,
  Typography,
  TextField,
} from "@mui/material";
import "./MakeAppointments.css";
import {
  getUnavailableDates,
  MakeNewAppointments,
} from "../../redux/actions/appointmentsAction";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { useTheme } from "@emotion/react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import makeAppointment from "../../images/makeAppointment.JPG";

const MakeAppointments = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { loading, appointment } = useSelector((state) => state.appoint);

  useEffect(() => {
    // dispatch(getUnavailableDates());
  }, []);

  const [time, setTime] = useState(null);
  const [date, setDate] = useState(null);

  const [reason, setReason] = useState("");

  const handleDateChange = (newValue) => {
    setDate(newValue);
  };

  const handleTimeChange = (newValue) => {
    setTime(newValue);
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();

    const finalDate =
      moment(date.$d).format("YYYY-M-D") +
      " " +
      moment(time.$d).format("HH:mm");

    console.log(finalDate);
    console.log(reason);

    dispatch(MakeNewAppointments(finalDate, reason));
  };

  return (
    <div>
      {loading === true ? (
        <h1>Loading...</h1>
      ) : (
        <Box
          sx={{
            backgroundImage:
              "linear-gradient(180deg, #003c44 0%,  #00929d 100%)",
            overflowX: "hidden",
            minHeight: "calc(100vh - 64px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: { xs: "12px", sm: "20px" },
          }}
        >
          <Typography
            variant="h3"
            component="h3"
            sx={{
              textAlign: "center",
              color: "white",
              pb: 2,
              fontSize: { xs: "4.3vmax", sm: "48px" },
            }}
          >
            Make Appointment
          </Typography>
          <Card
            sx={{
              height: "500px",
              width: { xs: "100%", md: "90%", lg: "60vw" },
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: { xs: "100%", md: "50%" },
                height: "100%",
                textAlign: "center",
              }}
            >
              <textarea
                className="textarea-appointment"
                placeholder="Enter Reason Of Date"
                onChange={(e) => setReason(e.target.value)}
              />

              <Box mt={1}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Select Date"
                    value={date}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} />}
                    sx={{ width: { xs: "94%" } }}
                  />
                </LocalizationProvider>
              </Box>

              <Box mt={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Select Time"
                    value={time}
                    onChange={handleTimeChange}
                    minutesStep={30} // Setting the step for minutes to 30
                    renderInput={(params) => <TextField {...params} />}
                    sx={{ width: { xs: "94%" } }}
                  />
                </LocalizationProvider>
              </Box>

              <Box
                sx={{ width: "93%", mx: "auto" }}
                // onClick={() => recordSubmitHandler(id, text, images)}
              >
                <Button
                  sx={{
                    textAlign: "center",
                    bgcolor: "green",
                    color: "white",
                    width: "100%",
                    fontSize: "18px",
                    mt: 2,
                    "&:hover": {
                      backgroundColor: "green",
                    },
                  }}
                  onClick={(e) => formSubmitHandler(e)}
                >
                  Make Record
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                width: "50%",
                height: "100%",
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar
                src={makeAppointment}
                sx={{ width: "100%", height: "100%", borderRadius: "0" }}
              />
            </Box>
          </Card>
        </Box>
      )}
    </div>
  );
};

export default MakeAppointments;
