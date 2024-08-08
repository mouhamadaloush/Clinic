import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleUser } from "../../redux/actions/UsersActions";
import { cyan } from "@mui/material/colors";
import profile from "../../images/Perfil de avatar de hombre en icono redondo _ Vector Premium.jpeg";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    dispatch(getSingleUser(localStorage.getItem("userId-dentist-clinic")));
  }, []);

  const { user, loading } = useSelector((state) => state.singleUser);

  console.log(user);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        backgroundImage: "linear-gradient(180deg, #003c44 0%,  #00929d 100%)",
        padding: { xs: "20px 0", sm: "20px" },
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container
        sx={{
          padding: { xs: "0 10px", sm: "0 16px" },
          mt: { xs: "0", sm: "-80px" },
        }}
      >
        <Box>
          <Box>
            <Grid container spacing={0}>
              <Grid
                item
                xs={12}
                md={4}
                sx={{ textAlign: "center", mt: { xs: 1, sm: 3 } }}
              >
                <Avatar
                  src={profile}
                  sx={{
                    width: { xs: "175px", sm: "200px" },
                    height: { xs: "175px", sm: "200px" },
                    mx: "auto",
                  }}
                />
                <Typography
                  sx={{
                    fontStyle: "italic",
                    color: "white",
                    fontSize: "24px",
                    mt: 1,
                  }}
                >
                  {user?.data?.first_name} {user?.data?.last_name}
                </Typography>
                <Typography sx={{ color: "yellow" }}>
                  {user?.data?.is_staff === true
                    ? "Admin"
                    : user?.data?.is_staff === false
                    ? "User"
                    : null}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                md={8}
                sx={{
                  mt: 3,
                  boxShadow: "0 4px 6px 0px #00929d",
                  borderRadius: "10px",
                  padding: "16px",
                }}
              >
                <Typography
                  component="h3"
                  variant="h3"
                  sx={{
                    color: "white",
                    borderBottom: "1px solid white",
                    fontSize: { xs: "35px", sm: "48px" },
                  }}
                >
                  About
                </Typography>

                <Box sx={{ mt: 3.5 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    flexWrap="wrap"
                    sx={{ borderBottom: "1px solid #00929d", pb: 0.5 }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "15px", sm: "20px" },
                        color: "yellow",
                      }}
                    >
                      UserName :
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "15px", sm: "20px" },
                        ml: 0.4,
                        color: "white",
                        fontStyle: "italic",
                      }}
                    >
                      {user?.data?.first_name} {user?.data?.last_name}
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    alignItems="center"
                    flexWrap="wrap"
                    sx={{ borderBottom: "1px solid #00929d", pb: 0.5, mt: 2 }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "15px", sm: "20px" },
                        color: "yellow",
                      }}
                    >
                      Email :
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "15px", sm: "20px" },
                        ml: 0.4,
                        color: "white",
                        fontStyle: "italic",
                      }}
                    >
                      {user?.data?.email}
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    alignItems="center"
                    flexWrap="wrap"
                    sx={{ borderBottom: "1px solid #00929d", pb: 0.5, mt: 2 }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "15px", sm: "20px" },
                        color: "yellow",
                      }}
                    >
                      Phone :
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "15px", sm: "20px" },
                        ml: 0.4,
                        color: "white",
                        fontStyle: "italic",
                      }}
                    >
                      {user?.data?.phone}
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    alignItems="center"
                    flexWrap="wrap"
                    sx={{ borderBottom: "1px solid #00929d", pb: 0.5, mt: 2 }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "15px", sm: "20px" },
                        color: "yellow",
                      }}
                    >
                      Date Of Join :
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "15px", sm: "20px" },
                        ml: 0.4,
                        color: "white",
                        fontStyle: "italic",
                      }}
                    >
                      {user?.data?.dob}
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    alignItems="center"
                    flexWrap="wrap"
                    sx={{ mt: 2 }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "15px", sm: "20px" },
                        color: "yellow",
                      }}
                    >
                      Gender :
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "15px", sm: "20px" },
                        ml: 0.4,
                        color: "white",
                        fontStyle: "italic",
                      }}
                    >
                      {user?.data?.gender === "M"
                        ? "Male"
                        : user?.data?.gender === "F"
                        ? "Female"
                        : null}
                    </Typography>
                  </Stack>
                </Box>

                <Box>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/changePassword")}
                    sx={{
                      marginX: "auto",
                      display: "block",
                      mt: 3,
                      color: "white",
                      bgcolor: cyan[600],
                      ":hover": {
                        bgcolor: cyan[500],
                      },
                    }}
                  >
                    Change Password
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Profile;
