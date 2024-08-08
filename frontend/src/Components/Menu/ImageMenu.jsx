import React, { useState } from "react";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSpring, animated } from "@react-spring/web";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

const Fade = React.forwardRef(function Fade(props, ref) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element.isRequired,
  in: PropTypes.bool,
  onClick: PropTypes.any,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  ownerState: PropTypes.any,
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500, md: 600 },
  minHeight: "200px",
  maxHeight: "400px",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "15px",
  overflowY: "auto",
  padding: { xs: "16px 20px", sm: "32px" },
  p: 4,
};

const ImageMenu = ({ images }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const deleteImgHandler = (img) => {
    console.log(img);

    images.map((i) => {
      if (i === img) {
        // images.remove(img);
      }
    });
  };

  return (
    <div>
      <Button
        onClick={handleOpen}
        sx={{
          textTransform: "capitalize",
          border: "1px solid #ccc",
          width: "100%",
          fontSize: "16px",
          fontWeight: "500",
          color: "green",
        }}
      >
        {images.length === 0 ? (
          <Stack direction="row" gap="10px" alignItems="center">
            <Typography component="p" variant="p">
              No Images Selected
            </Typography>
            <MoreHorizIcon />
          </Stack>
        ) : (
          <Stack direction="row" gap="10px" alignItems="center">
            <Typography component="p" variant="p">
              {images.length} Images Selected
            </Typography>
            <MoreHorizIcon />
          </Stack>
        )}
      </Button>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <CloseIcon
              sx={{
                position: "absolute",
                right: { xs: "24px", sm: "37px" },
                top: { xs: "18px", sm: "38px" },
                backgroundColor: "gray",
                borderRadius: "50%",
                color: "white",
                cursor: "pointer",
                fontSize: { xs: "20px", sm: "24px" },
                border: "2px solid gray",
                "&:hover": {
                  color: "gray",
                  backgroundColor: "white",
                },
              }}
              onClick={handleClose}
            />
            <Typography
              id="spring-modal-title"
              variant="h6"
              component="h6"
              sx={{
                fontSize: { xs: "15px", sm: "20px" },
                fontWeight: "500",
              }}
            >
              The Images That Selected For Record
            </Typography>
            <Typography
              id="spring-modal-description"
              sx={{ mt: 2, width: "100%" }}
            >
              {images.length === 0 ? (
                <Typography
                  sx={{
                    fontSize: { xs: "14px", sm: "18px" },
                    fontWeight: "600",
                    color: "green",
                  }}
                >
                  No Images Selected
                </Typography>
              ) : (
                images.map((img, index) => (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      padding: "5px",
                      mt: 2,
                      borderBottom:
                        index === images.length - 1 ? "none" : "1px solid #ddd",
                    }}
                  >
                    <Typography
                      component="p"
                      variant="p"
                      sx={{ fontSize: { xs: "13px", sm: "20px" } }}
                    >
                      {img}
                    </Typography>
                    <DeleteIcon
                      sx={{
                        color: "red",
                        fontSize: { xs: "20px", sm: "24px" },
                        cursor: "pointer",
                        transition: "0.3s",
                        "&:hover": {
                          transform: "scale(1.2)",
                        },
                      }}
                      onClick={() => deleteImgHandler(img)}
                    />
                  </Box>
                ))
              )}
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default ImageMenu;
