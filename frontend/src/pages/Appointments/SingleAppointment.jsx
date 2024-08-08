import { Avatar, Box, Container, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecordAction } from "../../redux/actions/appointmentsAction";
import { useParams } from "react-router-dom";
import t1 from "../../images/t1.jpg";
import t2 from "../../images/t2.jpg";
import t3 from "../../images/t3.jpeg";
import t4 from "../../images/t4.jpeg";

const SingleAppointment = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { loading, record } = useSelector(
    (state) => state.getRecordAppointment
  );

  console.log(record);

  useEffect(() => {
    dispatch(getRecordAction(id));
  }, []);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        backgroundImage: "linear-gradient(180deg, #003c44 0%,  #00929d 100%)",
        padding: { xs: "20px 0px", sm: "20px" },
        flexDirection: "column",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {loading === true ? (
        <h1>Loading... </h1>
      ) : record?.record === "None" ? (
        <Typography
          component="h3"
          variant="h3"
          sx={{
            position: "absolute",
            top: "50%",
            transform: "translateY(calc(-50% - 64px))",
            fontStyle: "italic",
            color: theme.palette.mainColor.mainFont,
            fontSize: { xs: "32px", sm: "64px" },
          }}
        >
          There is no records
        </Typography>
      ) : (
        <Container>
          <Typography
            component="h4"
            variant="h4"
            sx={{
              color: "white",
              textAlign: "center",
              fontSize: { xs: "23px", sm: "34px" },
            }}
          >
            The Record of Appointments
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "start",
              justifyContent: "space-between",
              flexDirection: { xs: "column", md: "row" },
              gap: "30px",
              mt: { xs: 6, md: 22 },
            }}
          >
            <Typography
              component="h6"
              variant="h6"
              sx={{
                color: theme.palette.mainColor.background,
                textAlign: "center",
                fontSize: {
                  xs: "16px",
                  sm: "20px",
                  width: "100%",
                  textAlign: "left",
                },
              }}
            >
              {record?.record?.text_note}
            </Typography>

            <Grid
              container
              spacing={2}
              columnSpacing={{ xs: 1, sm: 2 }}
              sx={{ width: "100%" }}
            >
              {record?.images?.map((image, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Avatar
                    src={image.image}
                    sx={{
                      borderRadius: "0",
                      width: "100%",
                      height: "275px",
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      )}
    </Box>
  );
};

export default SingleAppointment;
