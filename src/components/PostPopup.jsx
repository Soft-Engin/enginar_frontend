import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import LinkIcon from "@mui/icons-material/Link";
import CloseIcon from "@mui/icons-material/Close";

export default function PostPopup(props) {
  const [images, setImages] = useState([]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      file, // The actual file object
      preview: URL.createObjectURL(file), // For preview
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

    // Add the uploaded image files to the FormData
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
          <Box sx={{ display: 'flex' }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, pr: 3, mb: 1 }}>
              <Typography variant="body1" fontWeight="bold" noWrap sx={{ mb: 1 }}>
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
              {images.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    marginTop: 2,
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
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, pt: 1, borderTop: "0.5px solid rgb(124, 124, 124)" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <input
                type="file"
                accept="image/*"
                multiple
                id="image-upload"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
              <label htmlFor="image-upload">
                <IconButton component="span">
                  <AddPhotoAlternateOutlinedIcon sx={{ fontSize: '35px', color: "#417D1E" }}/>
                </IconButton>
              </label>
              <IconButton>
                <AddReactionOutlinedIcon sx={{ fontSize: '35px', color: "#417D1E" }}/>
              </IconButton>
              <IconButton>
                <LinkIcon sx={{ fontSize: '35px', color: "#417D1E" }} />
              </IconButton>
            </Box>
            <Button variant="contained" style={{ backgroundColor: "#4B9023", borderRadius: 30, width: "90px", height: "40px", textTransform: "none" }}>
              <Typography variant="h6">
                Post
              </Typography>
            </Button>
          </Box>
        </DialogContent>
      </form>
    </Dialog>
  );
}
