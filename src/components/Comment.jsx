import React, { useState } from "react";
import {
  Typography,
  Box,
  Avatar,
  ImageList,
  ImageListItem,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Modal,
  Fade,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import axios from "axios";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

export default function Comment({ comment, type, onDelete }) {
  const [profilePictureUrl, setProfilePictureUrl] = React.useState(null);
  const [userInitials, setUserInitials] = React.useState("");
  const [loadingProfile, setLoadingProfile] = React.useState(true);
  const [errorProfile, setErrorProfile] = React.useState(null);
  const [commentImages, setCommentImages] = React.useState([]);
  const [loadingImages, setLoadingImages] = React.useState(true);
  const [errorImages, setErrorImages] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = React.useState(false);
  const userId = JSON.parse(localStorage.getItem("userData"))?.userId;
  const isCommentOwner = userId === comment.userId;
  const [imageEnlarged, setImageEnlarged] = useState(false);

  React.useEffect(() => {
    if (comment && comment.userId) {
      const fetchProfilePicture = async () => {
        setLoadingProfile(true);
        setErrorProfile(null);
        try {
          // Fetch User Name First
          const userDataResponse = await axios.get(
            `/api/v1/users/${comment.userId}`
          );
          if (userDataResponse.status === 200) {
            //Generate user initials from username
            const nameParts = userDataResponse.data.userName.split(" ");
            const initials = nameParts
              .map((part) => part.charAt(0).toUpperCase())
              .join("");
            setUserInitials(initials);
          }
          try {
            const response = await axios.get(
              `/api/v1/users/${comment.userId}/profile-picture`,
              { responseType: "blob" }
            );
            if (response.data) {
              const profileUrl = URL.createObjectURL(response.data);
              setProfilePictureUrl(profileUrl);
            }
          } catch (error) {
            if (error.response && error.response.status === 404) {
              setProfilePictureUrl(null);
            } else {
              console.error("Error fetching profile picture:", error);
              setErrorProfile(error.message || "An unexpected error occurred.");
            }
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setErrorProfile(err.message || "An unexpected error occurred.");
        } finally {
          setLoadingProfile(false);
        }
      };
      fetchProfilePicture();
    }
    return () => {
      if (profilePictureUrl) {
        URL.revokeObjectURL(profilePictureUrl);
      }
    };
  }, [comment]);
  React.useEffect(() => {
    if (comment && comment.id && type) {
      const fetchCommentImages = async () => {
        setLoadingImages(true);
        setErrorImages(null);
        const images = [];
        for (let i = 0; i < comment.imagesCount; i++) {
          try {
            const response = await axios.get(
              `/api/v1/${type}s/comments/${comment.id}/images/${i}`,
              { responseType: "blob" }
            );
            if (response.data) {
              const imageUrl = URL.createObjectURL(response.data);
              images.push(imageUrl);
            }
          } catch (error) {
            if (error.response && error.response.status !== 404) {
              console.error(
                `Error fetching image for comment ${comment.id} at index ${i}:`,
                error
              );
              setErrorImages(error.message || "An unexpected error occurred.");
            }
          }
        }
        setCommentImages(images);
        setLoadingImages(false);
      };
      fetchCommentImages();
    }
    return () => {
      for (const imageUrl of commentImages) {
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl);
        }
      }
    };
  }, [comment, type]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleDeleteClick = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = async () => {
    setOpenDialog(false);
    try {
      await axios.delete(
        `/api/v1/${type}${type !== "event" ? "s" : ""}/comments/${comment.id}`
      );
      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.log("Error deleting comment", error);
    }
  };
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#EAEAEA",
        pb: 1.3,
        pt: 2.2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", pb: 1.2 }}>
          {profilePictureUrl ? (
            <Avatar
              src={profilePictureUrl}
              sx={{ width: 50, height: 50, mr: 1.3 }}
              onError={() => setProfilePictureUrl(null)}
            />
          ) : (
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                marginRight: 2,
                backgroundColor: "#A5E072",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              {userInitials}
            </Box>
          )}

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Link
                to={`/profile?id=${comment.userId}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" fontWeight="bold" noWrap>
                  {comment.userName}
                </Typography>
              </Link>
              <Typography variant="body2" color="text.secondary">
                {comment.timestamp &&
                  formatDistanceToNow(parseISO(comment.timestamp), {
                    addSuffix: true,
                  })}
              </Typography>
            </Box>
            <Typography variant="body2">{comment.text}</Typography>
            {errorProfile && (
              <Box display="flex" justifyContent="center" my={2}>
                <Typography color="error">Error: {errorProfile}</Typography>
              </Box>
            )}

            {loadingImages ? (
              <Box display="flex" justifyContent="center" my={2}>
                <CircularProgress size={20} />
              </Box>
            ) : commentImages && commentImages.length > 0 ? (
              <ImageList cols={3} gap={8} sx={{ mt: 1, width: "400px" }}>
                {commentImages.map((image, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={image}
                      alt={`Comment image ${index}`}
                      style={{
                        width: "100%",
                        height: "100px",
                        display: "block",
                        objectFit: "cover",
                        borderRadius: 10,
                        border: "1px solid #C0C0C0",
                        cursor: "pointer",
                      }}
                      onClick={() => setImageEnlarged(true)}
                    />
                    <Fade in={imageEnlarged}>
                      <Box>
                        <Modal
                          open={imageEnlarged}
                          onClose={() => setImageEnlarged(false)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(0, 0, 0, 0.5)",
                          }}
                        >
                          <Fade in={imageEnlarged} timeout={300}>
                            <img
                              src={image}
                              alt={"Comment image"}
                              style={{
                                maxWidth: "70vw",
                                maxHeight: "70vh",
                                aspectRatio: "auto",
                                objectFit: "contain",
                                borderRadius: "10px",
                              }}
                            />
                          </Fade>
                        </Modal>
                      </Box>
                    </Fade>
                  </ImageListItem>
                ))}
              </ImageList>
            ) : null}
          </Box>
        </Box>
        {isCommentOwner && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <IconButton onClick={handleMenuOpen} sx={{ padding: 0 }}>
              <MoreHorizIcon sx={{ fontSize: "30px" }} />
            </IconButton>
            <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
              <MenuItem onClick={handleDeleteClick} sx={{ color: "red" }}>
                Delete Comment
              </MenuItem>
            </Menu>
          </Box>
        )}
        <Dialog
          open={openDialog}
          onClose={handleCancelDelete}
          PaperProps={{
            sx: {
              width: { xs: 250, sm: 400 },
              borderRadius: 4,
              backgroundColor: "#C8EFA5",
              padding: 0.5,
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this comment?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCancelDelete}
              sx={{
                backgroundColor: "#C8EFA5",
                color: "black",
                ":hover": {
                  backgroundColor: "#C8EFA5",
                },
                borderRadius: 20,
                marginTop: 2,
                display: "block",
                marginLeft: "auto",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              sx={{
                backgroundColor: "#cc0000",
                color: "error",
                ":hover": {
                  backgroundColor: "#cc0000",
                },
                borderRadius: 20,
                marginTop: 2,
                display: "block",
                marginLeft: "auto",
                fontWeight: "bold",
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
