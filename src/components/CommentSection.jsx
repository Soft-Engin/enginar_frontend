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
} from "@mui/material";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Comment from "./Comment";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
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
  const [profilePictureUrl, setProfilePictureUrl] = React.useState(null);
  let userLogged = localStorage.getItem("userLogged") === "true";
  let userId = localStorage.getItem("userId");

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
    if (comments && comments.length > 0) {
      const fetchCommentImages = async () => {
        const images = {};
        for (let i = 0; i < comments.length; i++) {
          try {
            const response = await axios.get(
              `/api/v1/comments/${comments[i].id}/images/0`,
              { responseType: "blob" }
            );
            if (response.data) {
              const imageUrl = URL.createObjectURL(response.data);
              images[comments[i].id] = imageUrl;
            } else {
              images[comments[i].id] = null;
            }
          } catch (error) {
            console.error(
              `Error fetching image for comment ${comments[i].id}:`,
              error
            );
            images[comments[i].id] = null;
          }
        }
        setCommentImages(images);
      };
      fetchCommentImages();
    }
    return () => {
      for (const commentId in commentImages) {
        if (commentImages[commentId]) {
          URL.revokeObjectURL(commentImages[commentId]);
        }
      }
    };
  }, [comments]);
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
        borderRadius: "0 0 15px 15px",
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
          <Avatar
            src={profilePictureUrl}
            sx={{ width: 50, height: 50, marginRight: 0.5 }}
            onError={() => setProfilePictureUrl(null)}
          />
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
              width: "100%",
            }}
          >
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
                    backgroundColor: "white",
                    borderRadius: 30,
                    textTransform: "none",
                    marginLeft: 1,
                    padding: 0,
                  }}
                >
                  <AddPhotoAlternateIcon />
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
            style={{
              backgroundColor: "#4B9023",
              borderRadius: 30,
              width: "90px",
              height: "40px",
              textTransform: "none",
            }}
            onClick={handleAddComment}
            disabled={loadingComment}
          >
            {loadingComment ? (
              <CircularProgress size={20} color="white" />
            ) : (
              <Typography variant="h6">Post</Typography>
            )}
          </Button>
        </Box>
      </Box>
      <List>
        {comments.map((comment, index) => (
          <StyledCommentItem key={index} disableGutters>
            <Comment
              comment={comment}
              commentImage={commentImages[comment.id]}
            />
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
