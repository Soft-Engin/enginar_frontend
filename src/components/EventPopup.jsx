import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";

export default function EventPopup(props) {
  const [images, setImages] = useState([]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setImages([]);
    props.handleClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    images.forEach((image, index) => {
      formData.append(`image${index}`, image.file);
    });

    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);

    props.handleClose();
  };

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      maxWidth={"md"}
      PaperProps={{
        sx: {
          width: 620,
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
            fontSize: "1.25rem",
          }}
        >
          Create Event
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
          <TextField
            name="eventName"
            autoFocus
            fullWidth
            required
            label="Event Name"
            variant="outlined"
            sx={{
              marginBottom: 2,
              backgroundColor: "#fff",
              borderRadius: 2,
            }}
          />
          <Box
            display="flex"
            gap={2}
            sx={{
              marginBottom: 2,
            }}
          >
            <TextField
              name="eventDate"
              type="date"
              fullWidth
              required
              label="Event Date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              sx={{
                backgroundColor: "#fff",
                borderRadius: 2,
              }}
            />
          </Box>
          <TextField
            name="location"
            fullWidth
            required
            label="Location"
            variant="outlined"
            sx={{
              marginBottom: 2,
              backgroundColor: "#fff",
              borderRadius: 2,
            }}
          />
          <TextField
            name="description"
            fullWidth
            multiline
            rows={4}
            label="Event Description"
            variant="outlined"
            sx={{
              marginBottom: 2,
              backgroundColor: "#fff",
              borderRadius: 2,
            }}
          />
          {images.length > 0 && (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                marginBottom: 2,
                flexWrap: "wrap",
              }}
            >
              {images.map((image, index) => (
                <Box key={index} sx={{ position: "relative" }}>
                  <Box
                    component="img"
                    src={image.preview}
                    alt={`Preview ${index}`}
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: 2,
                      objectFit: "cover",
                      border: "1px solid #ccc",
                    }}
                  />
                  <IconButton
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 1)",
                      },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            id="event-image-upload"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          <label htmlFor="event-image-upload">
            <IconButton component="span">
              <AddPhotoAlternateIcon sx={{ color: "#4caf50" }} />
            </IconButton>
          </label>
          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "#4B9023",
              color: "#fff",
              ":hover": {
                backgroundColor: "#4B9023",
              },
              borderRadius: 20,
              marginTop: 2,
              display: "block",
              marginLeft: "auto",
            }}
          >
            Create Event
          </Button>
        </DialogContent>
      </form>
    </Dialog>
  );
}
