import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import AddReactionOutlinedIcon from "@mui/icons-material/AddReactionOutlined";
import LinkIcon from "@mui/icons-material/Link";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { Typography, CircularProgress } from "@mui/material";

export default function PostPopup(props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    props.handleClose();
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const formData = new FormData(event.target);
    const bodyText = formData.get("bodyText");

    try {
      const response = await axios.post(
        "/api/v1/blogs",
        { bodyText, header: "" },
        {}
      );
      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          props.handleClose();
        }, 2000);
      } else {
        setError("Failed to create a post. Please try again later.");
      }
    } catch (error) {
      console.error("Error creating a post:", error);
      if (error.response) {
        // Request made and server responded with a status code
        console.log(error.response.data);
        console.log(error.response.status);
        setError(
          error.response.data.message || "An unexpected error occurred."
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        setError("Could not connect to the server. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      maxWidth={"md"}
      PaperProps={{
        sx: {
          width: { xs: 250, sm: 400, md: 550, lg: 600, xl: 620 },
          borderRadius: 4,
          backgroundColor: "#C8EFA5",
          padding: 0.5,
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "bold",
            color: "#333",
            fontSize: "1.5rem",
          }}
        >
          Create New Blog
          <IconButton
            onClick={handleClose}
            sx={{
              color: "#555",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {success && (
            <Typography color={"success"} textAlign={"center"}>
              Post created successfully!
            </Typography>
          )}
          {error && (
            <Typography color="error" textAlign={"center"} mb={2}>
              {error}
            </Typography>
          )}
          {loading && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="200px"
            >
              <CircularProgress />
            </Box>
          )}
          {!loading && (
            <>
              <Box
                display="flex"
              >
                <Box
                  component="img"
                  src="/pp3.jpeg" // Placeholder for profile image
                  alt="Profile"
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    marginRight: 2,
                  }}
                />
                <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                pr: 3,
                mb: 1,
              }}
            >
              <Typography
                variant="body1"
                fontWeight="bold"
                noWrap
                sx={{ mb: 1 }}
              >
                Kusanagi Nene
              </Typography>
              <TextField
                name="content"
                autoFocus
                fullWidth
                multiline
                rows={4}
                placeholder="Write something..."
                variant="outlined"
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 2,
                }}
              />
              
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
              pt: 1,
              borderTop: "0.5px solid rgb(124, 124, 124)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton>
                <AddReactionOutlinedIcon
                  sx={{ fontSize: "35px", color: "#417D1E" }}
                />
              </IconButton>
              <IconButton>
                <LinkIcon sx={{ fontSize: "35px", color: "#417D1E" }} />
              </IconButton>
            </Box>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#4B9023",
                borderRadius: 30,
                width: "90px",
                height: "40px",
                textTransform: "none",
              }}
            >
              <Typography variant="h6">Post</Typography>
            </Button>
          </Box>
            </>
          )}
        </DialogContent>
      </form>
    </Dialog>
  );
}
