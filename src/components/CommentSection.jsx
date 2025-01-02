import React from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  CircularProgress,
  Button,
  TextField,
  IconButton,
  Divider,
} from "@mui/material";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Comment from "./Comment";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CloseIcon from "@mui/icons-material/Close";

const StyledCommentItem = styled(ListItem)(({ theme }) => ({
  borderBottom: "1px solid #E0E0E0",
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}));

const ImagePreview = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "inline-block",
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));
const StyledCloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(-1),
  right: theme.spacing(-1),
  backgroundColor: "rgba(220,220,220,0.7)",
  "&:hover": {
    backgroundColor: "rgba(220,220,220,0.9)",
  },
  padding: 0,
  width: "18px",
  height: "18px",
}));

export default function CommentSection({ type, contentId }) {
  const [comments, setComments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingComment, setLoadingComment] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [commentImages, setCommentImages] = React.useState({});
  const [newComment, setNewComment] = React.useState("");
  const [newImages, setNewImages] = React.useState([]);
  const [userAvatar, setUserAvatar] = React.useState(null);
  const [userName, setUserName] = React.useState("");
  const [userInitials, setUserInitials] = React.useState("");
  const [profilePictureUrl, setProfilePictureUrl] = React.useState(null);
  let userLogged = localStorage.getItem("userLogged") === "true";
  const userId = JSON.parse(localStorage.getItem("userData"))?.userId;
  const authButtonId = "loginButton";

  React.useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `/api/v1/${type}s/${contentId}/comments`
        );
        setComments(response.data.items);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [type, contentId]);
  React.useEffect(() => {
    if (userLogged && userId) {
      const fetchUserData = async () => {
        try {
          const userDataResponse = await axios.get(`/api/v1/users/${userId}`);
          if (userDataResponse.status === 200) {
            setUserName(userDataResponse.data.userName);
            //Generate user initials from username
            const nameParts = userDataResponse.data.userName.split(" ");
            const initials = nameParts
              .map((part) => part.charAt(0).toUpperCase())
              .join("");
            setUserInitials(initials);
          }
          try {
            const avatarResponse = await axios.get(
              `/api/v1/users/${userId}/profile-picture`,
              { responseType: "blob" }
            );
            if (avatarResponse.status === 200) {
              const imageUrl = URL.createObjectURL(avatarResponse.data);
              setUserAvatar(imageUrl);
            }
          } catch (error) {
            if (error.response && error.response.status === 404) {
              setUserAvatar(null);
            } else {
              console.error("Error fetching user profile picture", error);
              setError("Error fetching user profile picture");
            }
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Error fetching user data.");
        }
      };
      fetchUserData();
    }
  }, [userLogged, userId]);

  React.useEffect(() => {
    // this handles images for each comment
    const fetchCommentImages = async () => {
      if (!comments || comments.length === 0) {
        setCommentImages({});
        return;
      }

      const images = {};
      for (const comment of comments) {
        try {
          const response = await axios.get(
            `/api/v1/${type}s/comments/${comment.id}/images/0`,
            { responseType: "blob" }
          );
          if (response.data) {
            const imageUrl = URL.createObjectURL(response.data);
            images[comment.id] = imageUrl;
          } else {
            images[comment.id] = null;
          }
        } catch (error) {
          console.error(
            `Error fetching image for comment ${comment.id}:`,
            error
          );
          images[comment.id] = null;
        }
      }
      setCommentImages(images);
    };

    fetchCommentImages();
    return () => {
      for (const commentId in commentImages) {
        if (commentImages[commentId]) {
          URL.revokeObjectURL(commentImages[commentId]);
        }
      }
    };
  }, [comments, type]);

  React.useEffect(() => {
    if (userLogged && userId) {
      const fetchProfilePicture = async () => {
        try {
          const response = await axios.get(
            `/api/v1/users/${userId}/profile-picture`,
            { responseType: "blob" }
          );
          if (response.data) {
            const profileUrl = URL.createObjectURL(response.data);
            setProfilePictureUrl(profileUrl);
          } else {
            setProfilePictureUrl(null);
          }
        } catch (err) {
          console.error("Error fetching profile picture:", err);
        }
      };
      fetchProfilePicture();
    }
    return () => {
      if (profilePictureUrl) {
        URL.revokeObjectURL(profilePictureUrl);
      }
    };
  }, [userLogged, userId]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100px"
      >
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }
  const handleAddComment = async () => {
    if (!userLogged) {
      const authButton = document.getElementById(authButtonId);
      if (authButton) {
        authButton.click();
      }
      return;
    }
    setLoadingComment(true);
    setError(null);
    try {
      const formData = {
        text: newComment,
        images: newImages,
      };
      const response = await axios.post(
        `/api/v1/${type}s/${contentId}/comment`,
        formData
      );
      setComments((prevComments) => [response.data, ...prevComments]);
    } catch (err) {
      console.log("Could not add comment", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoadingComment(false);
    }
    setNewComment("");
    setNewImages([]);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target.result.split(",")[1]); // Extract base64 data
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then((base64Images) => {
        setNewImages(base64Images);
      })
      .catch((error) => {
        console.log("Error parsing images:", error);
      });
  };
  const removeImage = (index) => {
    setNewImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <Box
      sx={{
        maxWidth: 1500,
        outline: "1px solid #C0C0C0",
        backgroundColor: "#EAEAEA",
        px: 3,
        py: 2,
        borderRadius: "0 0 20px 20px",
        boxShadow: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 0.5,
          mr: 2.5,
          pb: 1.6,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            flexGrow: 1,
            flexDirection: "row",
          }}
        >
          {userAvatar ? (
            <Avatar
              src={userAvatar}
              sx={{ width: 50, height: 50, marginRight: 0.5, mt: 2 }}
              onError={() => setUserAvatar(null)}
            />
          ) : (
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                backgroundColor: "#A5E072",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginRight: 0.5,
              }}
            >
              {userInitials}
            </Box>
          )}
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Typography
              variant="body1"
              fontWeight="bold"
              noWrap
              sx={{ mb: 0, ml: 1.6, position: "relative", top: 10 }}
            >
              {userName || "User Name"}
            </Typography>
            <TextField
              fullWidth
              multiline
              placeholder="Write a comment..."
              variant="outlined"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "18px",
                  },
                },
              }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                marginTop: 0.5,
              }}
            >
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="contained-button-file"
                multiple
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="contained-button-file">
                <IconButton
                  variant="outlined"
                  component="span"
                  style={{
                    borderRadius: 30,
                    textTransform: "none",
                    marginLeft: 11,
                    padding: 0,
                  }}
                >
                  <AddPhotoAlternateOutlinedIcon
                    sx={{
                      fontSize: "25px",
                      color: "#417D1E",
                      position: "relative",
                      top: -5,
                    }}
                  />
                </IconButton>
              </label>
              {newImages &&
                newImages.map((image, index) => (
                  <ImagePreview key={index}>
                    <img
                      src={`data:image/png;base64,${image}`}
                      alt={`Preview ${index}`}
                      style={{
                        width: 75,
                        height: 75,
                        objectFit: "cover",
                        borderRadius: 10,
                        border: "1px solid #C0C0C0",
                      }}
                    />
                    <StyledCloseButton
                      aria-label="remove"
                      onClick={() => removeImage(index)}
                    >
                      <CloseIcon style={{ fontSize: "15px" }} />
                    </StyledCloseButton>
                  </ImagePreview>
                ))}
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", ml: 5 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#4B9023",
              color: "#fff",
              ":hover": {
                backgroundColor: "#4B9023",
              },
              borderRadius: 20,
              marginLeft: "auto",
              textTransform: "none",
              height: "36px",
              width: "80px"
            }}
            onClick={handleAddComment}
            disabled={loadingComment || !newComment.trim()}
          >
            {userLogged ? (
              loadingComment ? (
                <CircularProgress size={20} color="white" />
              ) : (
                <Typography variant="h6">Post</Typography>
              )
            ) : (
              <Typography variant="h6">Post</Typography>
            )}
          </Button>
        </Box>
      </Box>
      <Divider></Divider>
      <List>
        {comments.map((comment, index) => (
          <StyledCommentItem key={index} disableGutters>
            <Comment comment={comment} type={type} />
          </StyledCommentItem>
        ))}
      </List>
      {error && (
        <Box display="flex" justifyContent="center" my={2}>
          <Typography color="error">Error: {error}</Typography>
        </Box>
      )}
    </Box>
  );
}
