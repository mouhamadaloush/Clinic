import { Avatar, Box, Button, Card, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import "./MakeRecordAppointment.css";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ImageMenu from "./../../Components/Menu/ImageMenu";
import { notifyWarning } from "../../Components/Toastify/Toastify";
import record from "../../images/record.JPG";
import { useDispatch } from "react-redux";
import { RecordAppointmentAction } from "../../redux/actions/appointmentsAction";
import { useParams } from "react-router-dom";

const MakeRecordAppointment = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { id } = useParams();

  const [text, setText] = useState("");
  const [images, setImages] = useState("");
  const [imagesArray, setImagesArray] = useState("");

  useEffect(() => {}, []);

  const setImagesHandler = (event) => {
    // Access the selected files from the event object
    const selectedImages = event.target.files;

    // Update the images state with the selected files
    setImages(selectedImages);

    let arrayOfImages = [];
    Array.from(selectedImages).map((img) => {
      arrayOfImages.push(img.name);
    });
    setImagesArray(arrayOfImages);
  };

  const recordSubmitHandler = () => {
    if (text === "") {
      return notifyWarning("Please enter text for record");
    }

    const formData = new FormData();

    formData.append("appointment", id);
    formData.append("text_note", text);
    formData.append("images", images);

    console.log(images);

    // dispatch(RecordAppointmentAction(formData));
  };

  return (
    <Box
      sx={{
        backgroundImage: "linear-gradient(180deg, #003c44 0%,  #00929d 100%)",
        overflowX: "hidden",
        minHeight: "calc(100vh - 64px)",
        padding: { xs: "20px 15px", sm: "20px" },
        display: "flex",
        justifyContent: "center",
        alignItems: { xs: "center", md: "center" },
        gap: "10px",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
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
            width: "50%",
            height: "100%",
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar
            src={record}
            sx={{ width: "100%", height: "100%", borderRadius: "0" }}
          />
        </Box>
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            height: "100%",
            textAlign: "center",
          }}
        >
          <textarea
            className="textarea-record"
            placeholder="Enter Record Of Date"
            onChange={(e) => setText(e.target.value)}
          />

          <Box
            sx={{
              border: "1px dashed #007683",
              borderRadius: "5px",
              width: { xs: "93%" },
              height: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              mt: 1,
              mx: "auto",
            }}
          >
            <label for="image-record" className="upload-image-record">
              <CloudDownloadIcon
                sx={{
                  fontSize: { xs: "45px", sm: "50px" },
                  color: "green",
                  mt: 1,
                }}
              />
              <Typography
                variant="h5"
                component="h5"
                sx={{
                  mt: { xs: -1, sm: -1.5 },
                  fontSize: { xs: "20px", sm: "25px" },
                }}
              >
                Upload Images
              </Typography>
            </label>
            <input
              type="file"
              multiple
              id="image-record"
              style={{ display: "none" }}
              onChange={(e) => setImagesHandler(e.target.files)}
              accept="image/jpeg, image/jpg, image/png"
            />
          </Box>

          <Box sx={{ width: "93%", mx: "auto", mt: 2 }}>
            <ImageMenu sx={{ width: "100%" }} images={imagesArray} />
          </Box>

          <Box
            sx={{ width: "93%", mx: "auto", mt: 3.5 }}
            onClick={() => recordSubmitHandler(id, text, images)}
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
            >
              Make Record
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default MakeRecordAppointment;
