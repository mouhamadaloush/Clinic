import React from "react";
import DrawerAppBar from "../../MUI-Components/DrawerAppBar";
import { Box, Typography, Toolbar, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import img from "../../images/detist2-r.jpg";

const MainPage = () => {
  const theme = useTheme();

  const gapBetweenTitleAndImg = "0px";
  const heightOfTitle = "40%";
  const widthOfDescription = "90%";
  const heightOfImg = "55%";

  return (
    <Box
      sx={{
        bgcolor: theme.palette.mainColor.main,
        height: "calc(100vh - 64px)",
      }}
    >
      <Toolbar
        sx={{
          height: "100%",
          gap: { lg: "30px", md: "20px", xs: `${gapBetweenTitleAndImg}` },
          flexDirection: { xs: "column", md: "row" },
          justifyContent: { xs: "start", md: "center" },
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: { lg: "40%", md: "50%", xs: "100%" },
            mt: { md: "-64px", xs: "20px" },
            textAlign: { md: "start", xs: "center" },
            height: { xs: `${heightOfTitle}`, md: "auto" },
            display: { xs: "flex", md: "block" },
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              fontSize: { lg: "4.5vmax", sm: "5vmax", xs: "4.5vmax" },
              color: "white",
              lineHeight: "1.2",
            }}
            variant="body1"
            color="initial"
          >
            Make Your Perfect{" "}
            <Typography
              variant="span"
              style={{
                color: theme.palette.mainColor.mainFont,
                fontSize: "inherit",
                fontStyle: "italic",
                fontFamily: "Roboto",
              }}
            >
              Smile
            </Typography>{" "}
            Even Better
          </Typography>
          <Typography
            variant="span"
            color={theme.palette.mainColor.font}
            sx={{
              fontSize: {
                lg: "1.03vmax",
                md: "1.5vmax",
                sm: "1.8vmax",
                xs: "1.75vmax",
              },
              width: `${widthOfDescription}`,
              display: "inline-block",
              mt: { xs: "5px", sm: "10px" },
              textAlign: { md: "start", xs: "center" },
            }}
          >
            Explore our diverse range of services including fillings, deep
            cleaning, oral and maxillofacial surgery, cosmetic treatments, and
            dental alignment. Book your appointment now for a bright smile and
            optimal oral health.
          </Typography>
        </Box>
        <Box
          sx={{
            width: { lg: "40%", md: "50%", sx: "100%" },
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            height: { xs: `${heightOfImg}`, md: "auto" },
          }}
        >
          <Avatar
            sx={{
              backgroundColor: theme.palette.mainColor.navbar,
              borderRadius: "100%",
              padding: "20px 0 0 0",
              width: { lg: "65%", md: "80%", xs: "100%" },
              height: "100%",
            }}
            alt="doctor"
            src={img}
          />
        </Box>
      </Toolbar>
    </Box>
  );
};

export default MainPage;
