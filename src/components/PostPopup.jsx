import React, { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import LinkIcon from "@mui/icons-material/Link";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { Typography, CircularProgress, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RecipeSelectionDialog from "./RecipeSelectionDialog";


export default function PostPopup(props) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const [userName, setUserName] = useState("");
  const [userInitials, setUserInitials] = useState("");
  const [newPost, setNewPost] = useState(props.blogData?.bodyText || "");
  const fileInputRef = useRef(null);
  const userId = JSON.parse(localStorage.getItem("userData"))?.userId;
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerImageUrl, setBannerImageUrl] = useState(null);
  const bannerImageInputRef = useRef(null);
    const [linkDialogOpen, setLinkDialogOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);


  useEffect(() => {
    if (props.bannerUrl) {
      setBannerImageUrl(props.bannerUrl);
    }
    if (props.bannerImage) {
      setBannerImage(props.bannerImage);
      setBase64Image(props.bannerImage);
    }
  }, [props.bannerImage, props.bannerUrl]);

  useEffect(() => {
    return () => {
      if (bannerImageUrl) {
        URL.revokeObjectURL(bannerImageUrl);
      }
    };
  }, [bannerImageUrl]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const userDataResponse = await axios.get(`/api/v1/users/${userId}`);
          if (userDataResponse.status === 200) {
            setUserName(userDataResponse.data.userName);
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
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Error fetching user data.");
        }
      }
    };

    fetchUserData();
  }, [userId]);

  const handleClose = () => {
    props.handleClose();
    setLoading(false);
    setError(null);
    setSuccess(false);
    setPreviewImage(null);
    setBase64Image(null);
    setBannerImage(null);
    setNewPost(props.blogData?.bodyText || "");
    setBannerImageUrl(null);
    setLinkDialogOpen(false);
    setSelectedRecipe(null)
  };

  const handleBannerImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      if (bannerImage) {
        setBannerImage(null);
        setBase64Image(null);
        setBannerImageUrl(null);
      }

      if (file.type.startsWith("image/")) {
        const base64Image = await convertToBase64(file);
        setBannerImage(base64Image);
        setBase64Image(base64Image);
      } else {
        setError("Please select an image file");
      }

      setLoading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRemoveBannerImage = () => {
    setBannerImage(null);
    setBase64Image(null);
    if (bannerImageInputRef.current) {
      bannerImageInputRef.current.value = "";
    }
    setBannerImageUrl(null);
  };

 const handleOpenLinkDialog = () => {
    setLinkDialogOpen(true);
  };

const handleCloseLinkDialog = () => {
    setLinkDialogOpen(false);
  };


  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
    handleCloseLinkDialog();
  };

  const handleDeleteSelectedRecipe = () =>{
     setSelectedRecipe(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.target);
    const bodyText = formData.get("bodyText");
    let finalBannerImage = bannerImage;
    if (props.isEditMode && !bannerImage && base64Image) {
      finalBannerImage = base64Image;
    }
    const method = props.isEditMode ? "put" : "post";
    const apiUrl = props.isEditMode
      ? `/api/v1/blogs/${props.blogId}`
      : "/api/v1/blogs";
    const recipeId = selectedRecipe ? selectedRecipe.id : null;
    try {
      const response = await axios({
        method: method,
        url: apiUrl,
        data: {
          header: "kys",
          bodyText: bodyText,
          bannerImage: finalBannerImage,
             recipeId: recipeId,
        },
      });
      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
        if (props.isEditMode) {
          props.refreshBlogData();
          handleClose();
        } else {
          navigate(`/blog?id=${response.data.id}`);
          handleClose();
        }
      } else {
        setError("Failed to create a post. Please try again later.");
      }
    } catch (error) {
      console.error("Error creating a post:", error);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        setError(
          error.response.data.message || "An unexpected error occurred."
        );
      } else if (error.request) {
        console.log(error.request);
        setError("Could not connect to the server. Please try again later.");
      } else {
        console.log("Error", error.message);
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <RecipeSelectionDialog
            open={linkDialogOpen}
            onClose={handleCloseLinkDialog}
            userId={userId}
            onRecipeSelect={handleRecipeSelect}
        />
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
            fontSize: "1.25rem",
          }}
        >
          {props.isEditMode ? "Edit Post" : "Create New Post"}
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
              {props.isEditMode
                ? "Post edited successfully!"
                : "Post created successfully!"}
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
                alignItems="center"
                sx={{
                  marginBottom: 2,
                }}
              >
                {userAvatar ? (
                  <Box
                    component="img"
                    src={userAvatar}
                    alt="Profile"
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      marginRight: 1,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      marginRight: 2,
                      backgroundColor: "#ccc",
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

                <Box
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                  }}
                >
                  {userName || "User Name"}
                </Box>
              </Box>
              <TextField
                name="bodyText"
                autoFocus
                fullWidth
                multiline
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={4}
                placeholder="Write something..."
                variant="outlined"
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 2,
                }}
              />
                 {selectedRecipe && (
                  <Box
                    sx={{
                       marginTop: 2,
                      marginBottom: 2,
                      display: "flex",
                      alignItems: "center",

                    }}
                  >
                     <Typography sx={{ marginRight: 1 }}>Linked recipe:</Typography>
                     <Chip
                      label={selectedRecipe.header}
                      onDelete={handleDeleteSelectedRecipe}
                      color="success"
                    />
                 </Box>
                )}
              {(bannerImage || bannerImageUrl) && (
                <Box
                  sx={{
                    mt: 2,
                    mb: 2,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: "fit-content",
                      maxHeight: "300px",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={
                        bannerImageUrl || `data:image/png;base64,${bannerImage}`
                      }
                      alt="Uploaded Preview"
                      style={{
                        width: "100%",
                        height: "300px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <IconButton
                      onClick={handleRemoveBannerImage}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "white",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        "&:hover": {
                          backgroundColor: "rgba(0,0,0,0.7)",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              )}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: 2,
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleBannerImageUpload}
                  ref={bannerImageInputRef}
                  id="banner-image-upload"
                />
                <IconButton onClick={() => bannerImageInputRef.current.click()}>
                  <AddPhotoAlternateOutlinedIcon
                    sx={{ fontSize: "35px", color: "#417D1E" }}
                  />
                </IconButton>
                  <IconButton onClick={handleOpenLinkDialog}>
                     <LinkIcon sx={{ fontSize: "35px", color: "#417D1E" }} />
                  </IconButton>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#4B9023",
                    color: "#fff",
                    ":hover": {
                      backgroundColor: "#4B9023",
                    },
                    borderRadius: 20,
                    marginLeft: "auto",
                  }}
                  disabled={!newPost.trim()}
                >
                  {props.isEditMode ? "Update" : "Post"}
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </form>
    </Dialog>
        </>
  );
}