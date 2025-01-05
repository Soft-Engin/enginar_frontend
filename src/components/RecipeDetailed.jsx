import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  Fade,
  Modal,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import axios from "axios";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { styled } from "@mui/material/styles";
import { useNavigate, Link } from "react-router-dom";

const StyledCardMedia = styled("img")({
  width: "100%",
  objectFit: "cover",
  height: "300px",
  display: "block",
  filter: "blur(2px)",
});

export default function RecipeDetailed({ recipeId }) {
  const navigate = useNavigate();
  const [recipeData, setRecipeData] = React.useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = React.useState(null);
  const [userInitials, setUserInitials] = useState("");
  const [bannerUrl, setBannerUrl] = React.useState(null);
  const [loadingIsBookmarked, setLoadingIsBookmarked] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [loadingProfile, setLoadingProfile] = React.useState(true);
  const [loadingBanner, setLoadingBanner] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [errorProfile, setErrorProfile] = React.useState(null);
  const [errorBanner, setErrorBanner] = React.useState(null);
  const [errorIsBookmarked, setErrorIsBookmarked] = React.useState(null);
  const [errorDelete, setErrorDelete] = React.useState(null);
  const [stepImages, setStepImages] = React.useState({});
  const [isLiked, setIsLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(0);
  const [commentCount, setCommentCount] = React.useState(0);
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
  const [imageEnlarged, setImageEnlarged] = useState(false);
  const [enlargedImageIndex, setEnlargedImageIndex] = useState(null);
  const open = Boolean(anchorEl);
  let authButtonId = "loginButton";
  let userLogged = localStorage.getItem("userLogged") === "true";
  const [showBanner, setShowBanner] = React.useState(false);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleEditClick = () => {
    navigate(`/createRecipe?id=${recipeId}`);
    handleMenuClose();
  };
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  const handleDialogOpen = () => {
    setOpenDialog(true);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleImageError = (error, setErrorState) => {
    if (error.response && error.response.status === 404) {
      // Do nothing, don't set an error for 404. The image won't render, which is fine.
      setErrorState(null);
    } else {
      setErrorState(error.message || "An unexpected error occurred.");
    }
  };

  const [isFollowing, setIsFollowing] = useState(false);
  const [loggedInUserFollowing, setLoggedInUserFollowing] = useState([]);
  const [loggedInUserData, setLoggedInUserData] = useState(
    localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : null
  );
  const isOwnRecipe = recipeData?.userId === loggedInUserData?.userId;
  let isAdmin = loggedInUserData?.roleName === "Admin";

  useEffect(() => {
    const fetchLoggedInUserFollowing = async () => {
      if (loggedInUserData?.userId) {
        try {
          const response = await axios.get(
            `/api/v1/users/${loggedInUserData?.userId}/following?pageSize=100`
          );
          if (response.status === 200) {
            setLoggedInUserFollowing(response.data.items);
          }
        } catch (error) {
          console.error(
            "Error fetching logged in user's following list: ",
            error
          );
        }
      }
    };
    fetchLoggedInUserFollowing();
  }, [loggedInUserData?.userId]);

  useEffect(() => {
    if (recipeData && loggedInUserFollowing) {
      const isFollowing = loggedInUserFollowing.some(
        (following) => following.userId === recipeData.userId
      );
      setIsFollowing(isFollowing);
    } else {
      setIsFollowing(false);
    }
  }, [loggedInUserFollowing, recipeData?.userId]);

  const handleFollowUser = async () => {
    try {
      const response = await axios.post(
        `/api/v1/users/follow?targetUserId=${recipeData.userId}`
      );
      if (response.status === 200) {
        setIsFollowing(true);
        setLoggedInUserFollowing((prev) => [
          ...prev,
          { userId: recipeData.userId },
        ]);
      }
    } catch (error) {
      console.error("Error following user:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to follow the user."
      );
    }
  };

  const handleUnfollowUser = async () => {
    try {
      const response = await axios.delete(
        `/api/v1/users/unfollow?targetUserId=${recipeData.userId}`
      );
      if (response.status === 200) {
        setIsFollowing(false);
        setLoggedInUserFollowing((prev) =>
          prev.filter((following) => following.userId !== recipeData.userId)
        );
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to unfollow the user."
      );
    }
  };

  React.useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/v1/recipes/${recipeId}`);
        setRecipeData(response.data);
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [recipeId]);

  React.useEffect(() => {
    if (recipeData && recipeData.userId) {
      const fetchProfilePicture = async () => {
        setLoadingProfile(true);
        setErrorProfile(null);
        try {
          const response = await axios.get(
            `/api/v1/users/${recipeData.userId}/profile-picture`,
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
          handleImageError(err, setErrorProfile);
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
  }, [recipeData]);

  const generateInitials = (userName) => {
    const nameParts = userName.split(" ");
    return (
      nameParts.map((part) => part.charAt(0).toUpperCase()).join("") ||
      userName.charAt(0).toUpperCase()
    );
  };

  useEffect(() => {
    if (recipeData && recipeData.userName) {
      setUserInitials(generateInitials(recipeData.userName));
    }
  }, [recipeData]);

  React.useEffect(() => {
    if (recipeData && recipeData.id) {
      const fetchBanner = async () => {
        setLoadingBanner(true);
        setErrorBanner(null);
        try {
          const response = await axios.get(
            `/api/v1/recipes/${recipeData.id}/banner`,
            { responseType: "blob" }
          );
          if (response.data) {
            const imageUrl = URL.createObjectURL(response.data);
            setBannerUrl(imageUrl);
            setShowBanner(true);
          } else {
            setBannerUrl(null);
            setShowBanner(false);
          }
        } catch (err) {
          console.error("Error fetching banner image:", err);
          handleImageError(err, (errorMessage) => {
            setBannerUrl(null);
            setShowBanner(false);
          });
        } finally {
          setLoadingBanner(false);
        }
      };
      fetchBanner();
    }
    return () => {
      if (bannerUrl) {
        URL.revokeObjectURL(bannerUrl);
      }
    };
  }, [recipeData]);

  React.useEffect(() => {
    if (recipeData && recipeData.id && recipeData.steps) {
      const fetchStepImages = async () => {
        const images = {};
        for (let i = 0; i < recipeData.steps.length; i++) {
          try {
            const response = await axios.get(
              `/api/v1/recipes/${recipeData.id}/steps/${i}/image`,
              { responseType: "blob" }
            );
            if (response.data && response.data.size > 0) {
              const imageUrl = URL.createObjectURL(response.data);
              images[i] = imageUrl;
            } else {
              images[i] = null;
            }
          } catch (error) {
            console.error(`Error fetching image for step ${i}:`, error);
            handleImageError(error, (errorMessage) => {
              //If there was an error, we set the error state for this particular image
              images[i] = null;
            });
          }
        }
        setStepImages(images);
      };

      fetchStepImages();
    }
    return () => {
      for (const step in stepImages) {
        if (stepImages[step]) {
          URL.revokeObjectURL(stepImages[step]);
        }
      }
    };
  }, [recipeData]);

  React.useEffect(() => {
    if (recipeData && recipeData.id && userLogged) {
      const fetchIsLiked = async () => {
        try {
          const response = await axios.get(
            `/api/v1/recipes/${recipeData.id}/is-liked`
          );
          setIsLiked(response.data.isLiked || false);
          setLikeCount(response.data.likeCount || 0);
        } catch (err) {
          console.error("Error fetching isLiked:", err);
        }
      };
      fetchIsLiked();
    }
  }, [recipeData, userLogged]);

  React.useEffect(() => {
    if (recipeData && recipeData.id && userLogged) {
      const fetchCommentCount = async () => {
        try {
          const response = await axios.get(
            `/api/v1/recipes/${recipeData.id}/comments`
          );
          setCommentCount(response.data.totalCount || 0);
        } catch (err) {
          console.error("Error fetching comment count:", err);
        }
      };
      fetchCommentCount();
    }
  }, [recipeData, userLogged]);

  React.useEffect(() => {
    if (recipeData && recipeData.id && userLogged) {
      const fetchIsBookmarked = async () => {
        setLoadingIsBookmarked(true);
        setErrorIsBookmarked(null);
        try {
          const response = await axios.get(
            `/api/v1/recipes/${recipeData.id}/is-bookmarked`
          );
          setIsBookmarked(response.data.isBookmarked || false);
        } catch (err) {
          console.error("Error fetching isBookmarked:", err);
          setErrorIsBookmarked(err.message || "An unexpected error occurred.");
        } finally {
          setLoadingIsBookmarked(false);
        }
      };
      fetchIsBookmarked();
    }
  }, [recipeData, userLogged]);

  const handleLikeToggle = async () => {
    if (!userLogged) {
      const authButton = document.getElementById(authButtonId);
      if (authButton) {
        authButton.click();
      }
      return;
    }
    setIsLiked((prevIsLiked) => !prevIsLiked);
    if (isLiked) {
      setLikeCount((prevLikeCount) => prevLikeCount - 1);
    } else {
      setLikeCount((prevLikeCount) => prevLikeCount + 1);
    }
    try {
      await axios.post(`/api/v1/recipes/${recipeId}/toggle-like`);
    } catch (err) {
      console.error("Error toggling like", err);
      setIsLiked((prevIsLiked) => !prevIsLiked);
      if (isLiked) {
        setLikeCount((prevLikeCount) => prevLikeCount + 1);
      } else {
        setLikeCount((prevLikeCount) => prevLikeCount - 1);
      }
    }
  };

  const handleBookmarkToggle = async () => {
    if (!userLogged) {
      const authButton = document.getElementById(authButtonId);
      if (authButton) {
        authButton.click();
      }
      return;
    }
    setIsBookmarked((prevIsBookmarked) => !prevIsBookmarked);
    try {
      await axios.post(`/api/v1/recipes/${recipeId}/bookmark`);
    } catch (err) {
      console.error("Error toggling bookmark", err);
      setIsBookmarked((prevIsBookmarked) => !prevIsBookmarked);
    }
  };

  const handleDelete = async () => {
    setErrorDelete(null);
    try {
      await axios.delete(`/api/v1/recipes/${recipeId}`);
      setSnackbarMessage("Recipe deleted successfully");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error("Error deleting recipe:", err);
      setErrorDelete(err.message || "An unexpected error occurred.");
      setSnackbarMessage("Failed to delete the recipe");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  if (loading) {
    return (
      <Box
        data-testid="recipe-detailed-loading"
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        data-testid="recipe-detailed-error"
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!recipeData) {
    return (
      <Typography data-testid="recipe-detailed-nodata" color="error" textAlign={"center"}>
        No recipe information available for this ID
      </Typography>
    );
  }

  return (
    <Box
      data-testid="recipe-detailed-container"
      sx={{
        width: "100%",
        outline: "1.5px solid #C0C0C0",
        backgroundColor: "#FFFFFF",
        px: 4,
        pt: 2,
        pb: 1,
        borderRadius: "20px 20px 0 0",
        boxShadow: 3,
      }}
    >
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
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
          <Typography>Are you sure you want to delete this recipe?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
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
            onClick={() => {
              handleDelete();
              handleDialogClose();
            }}
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1.5,
          borderBottom: "1px solid #E0E0E0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link
            to={`/profile?id=${recipeData.userId}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
            }}
          >
            {profilePictureUrl ? (
              <Avatar
                src={profilePictureUrl}
                sx={{ width: 50, height: 50, mr: 1.5 }}
                onError={() => setProfilePictureUrl(null)}
              />
            ) : (
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  marginRight: 1.5,
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
            <Box>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ marginRight: 0.5 }}
                noWrap
              >
                {recipeData.userName}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {recipeData.createdAt &&
                  formatDistanceToNow(
                    parseISO(recipeData.createdAt).getTime() +
                      3 * 60 * 60 * 1000,
                    {
                      addSuffix: true,
                    }
                  )}
              </Typography>
            </Box>
          </Link>
        </Box>
        <Box>
          {userLogged && (
            <Box>
              <IconButton
                aria-label="more"
                id="menuButton"
                aria-controls={open ? "menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleMenuClick}
              >
                <MoreHorizIcon sx={{ fontSize: "30px" }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {isAdmin || !isOwnRecipe ? (
                  <>
                    {isAdmin && (
                      <>
                        <MenuItem key="Edit" onClick={handleEditClick}>
                          Edit Recipe
                        </MenuItem>
                        <MenuItem
                          key="Delete"
                          onClick={handleDialogOpen}
                          sx={{ color: "red" }}
                        >
                          Delete Recipe
                        </MenuItem>
                      </>
                    )}

                    {!isOwnRecipe && (
                      <>
                        {isFollowing ? (
                          <MenuItem key="Unfollow" onClick={handleUnfollowUser}>
                            Unfollow User
                          </MenuItem>
                        ) : (
                          <MenuItem key="Follow" onClick={handleFollowUser}>
                            Follow User
                          </MenuItem>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <MenuItem key="Edit" onClick={handleEditClick}>
                      Edit Recipe
                    </MenuItem>
                    <MenuItem
                      key="Delete"
                      onClick={handleDialogOpen}
                      sx={{ color: "red" }}
                    >
                      Delete Recipe
                    </MenuItem>
                  </>
                )}
              </Menu>
            </Box>
          )}
        </Box>
      </Box>
      {
        <Box
          sx={{
            mb: 2,
            position: "relative",
            overflow: "hidden",
            boxShadow: 2,
            mx: -4,
          }}
        >
          <StyledCardMedia src={bannerUrl} />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
            }}
          >
            <Typography
              variant="h3"
              fontFamily="Georgia"
              color="white"
              sx={{
                textAlign: "center",
                mb: 1,
                textShadow: "1px 1px 2px black",
              }}
            >
              {recipeData.header}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 1,
                padding: "5px 10px",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "10px",
                boxShadow: 3,
              }}
            >
              <Typography
                variant="body2"
                color="text.primary"
                sx={{
                  fontSize: "0.9rem",
                  mr: 5,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.4,
                }}
              >
                <LocalDiningIcon />
                <b>Servings:</b> {recipeData.servingSize}
              </Typography>
              <Typography
                variant="body2"
                color="text.primary"
                sx={{
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.4,
                }}
              >
                <AccessTimeFilledIcon />
                <p><b>Total Time:</b> {recipeData?.preparationTime > 120 ? "More than 120 mins" : recipeData?.preparationTime ? `${recipeData?.preparationTime} mins` : null}</p>
              </Typography>
            </Box>
          </Box>
        </Box>
      }
      {errorBanner && (
        <Box display="flex" justifyContent="center" my={2}>
          {errorBanner !== null && (
            <Typography color="error">Error: {errorBanner}</Typography>
          )}
        </Box>
      )}
      <Typography
        variant="body1"
        sx={{
          lineHeight: "30px",
          mb: 2,
          px: 2,
          wordWrap: "break-word",
          overflowWrap: "break-word",
        }}
      >
        {recipeData.bodyText}
      </Typography>
      <Typography
        variant="h4"
        fontWeight="bold"
        fontFamily="Garamond"
        sx={{ pb: 0.8, borderBottom: "1px solid #E0E0E0" }}
      >
        Ingredients
      </Typography>
      <List
        sx={{
          listStyleType: "disc",
          px: 3,
          "& .MuiListItem-root": { display: "list-item", pl: 0, mb: 0 },
        }}
      >
        <Grid container>
          {recipeData.ingredients.map((ingredient, index) => (
            <Grid item size={6} key={index} sx={{ pr: 10 }}>
              <ListItem>{`${ingredient.quantity} ${ingredient.unit} ${ingredient.ingredientName}`}</ListItem>
            </Grid>
          ))}
        </Grid>
      </List>
      {showBanner && bannerUrl && (
        <img
          src={bannerUrl}
          alt={recipeData.header}
          style={{
            width: "100%",
            height: "450px",
            display: "block",
            objectFit: "cover",
            borderRadius: 10,
            border: "1px solid #C0C0C0",
            cursor: "pointer",
          }}
          onClick={() => setImageEnlarged(true)}
        />
      )}
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
                src={bannerUrl}
                alt={recipeData.header}
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

      <Typography
        variant="h4"
        fontWeight="bold"
        fontFamily="Garamond"
        sx={{ pb: 0.8, borderBottom: "1px solid #E0E0E0" }}
      >
        Steps
      </Typography>
      <List
        sx={{
          listStyleType: "numeric",
          px: 3,
          "& .MuiListItem-root": { display: "list-item", pl: 0, mb: 0 },
        }}
      >
        {recipeData.steps.map((step, index) => (
          <ListItem
            key={index}
            sx={{
              flexDirection: "column",
              alignItems: "flex-start",
              paddingBottom: 2,
            }}
          >
            <Typography
              sx={{
                wordWrap: "break-word",
                overflowWrap: "break-word",
                marginBottom: 1,
              }}
            >
              {step}
            </Typography>
            {stepImages[index] && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  paddingBottom: 1,
                }}
              >
                <img
                  src={stepImages[index]}
                  alt={`Step ${index + 1}`}
                  style={{
                    width: "150px",
                    height: "100px",
                    display: "block",
                    objectFit: "cover",
                    borderRadius: 10,
                    border: "1px solid #C0C0C0",
                    cursor: "pointer",
                  }}
                  onClick={() => setEnlargedImageIndex(index)}
                />
                <Fade in={imageEnlarged}>
                  <Box>
                    <Modal
                      open={enlargedImageIndex === index}
                      onClose={() => setEnlargedImageIndex(null)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      <Fade in={enlargedImageIndex === index} timeout={300}>
                        {enlargedImageIndex !== null ? (
                          <img
                            src={stepImages[enlargedImageIndex]}
                            alt={`Step ${enlargedImageIndex + 1}`}
                            style={{
                              maxWidth: "70vw",
                              maxHeight: "70vh",
                              aspectRatio: "auto",
                              objectFit: "contain",
                              borderRadius: "10px",
                            }}
                          />
                        ) : (
                          <Box />
                        )}
                      </Fade>
                    </Modal>
                  </Box>
                </Fade>
              </Box>
            )}
          </ListItem>
        ))}
      </List>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          pb: 1,
          mb: 1,
          mt: 1.5,
          borderBottom: "1px solid #C0C0C0",
        }}
      >
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ marginRight: 0.5 }}
          noWrap
        >
          {recipeData.createdAt &&
            format(
              parseISO(recipeData.createdAt).getTime() + 3 * 60 * 60 * 1000,
              "h:mm a"
            )}
        </Typography>
        <Typography variant="body1" color="text.secondary" noWrap>
          ·{" "}
          {recipeData.createdAt &&
            format(
              parseISO(recipeData.createdAt).getTime() + 3 * 60 * 60 * 1000,
              "MMM d, yyyy"
            )}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton data-testid="like-button" onClick={handleLikeToggle} style={{ padding: 0 }}>
              {isLiked ? (
                <FavoriteIcon
                  data-testid="like-icon-filled"
                  style={{ fontSize: "45px", marginRight: 4, color: "red" }}
                />
              ) : (
                <FavoriteBorderIcon
                  data-testid="like-icon-border"
                  style={{ fontSize: "45px", marginRight: 4, color: "#757575" }}
                />
              )}
            </IconButton>
            <Typography data-testid="like-count" variant="body1" color="text.secondary">
              {likeCount}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ChatBubbleOutlineIcon
              style={{ fontSize: "42px", marginRight: 4, color: "#757575" }}
            />
            <Typography variant="body1" color="text.secondary">
              {commentCount}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton data-testid="bookmark-button" onClick={handleBookmarkToggle} style={{ padding: 0 }}>
            {isBookmarked ? (
              <BookmarkIcon data-testid="bookmark-icon-filled" style={{ fontSize: "48px" }} />
            ) : (
              <BookmarkBorderOutlinedIcon
                data-testid="bookmark-icon-border"
                style={{ fontSize: "48px", color: "#757575" }}
              />
            )}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
