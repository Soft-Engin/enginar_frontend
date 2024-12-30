import * as React from "react";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ShareIcon from "@mui/icons-material/Share";
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
  const [recipe, setRecipe] = React.useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = React.useState(null);
  const [bannerUrl, setBannerUrl] = React.useState(null);
  const [loadingIsBookmarked, setLoadingIsBookmarked] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [loadingProfile, setLoadingProfile] = React.useState(true);
  const [loadingBanner, setLoadingBanner] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [errorProfile, setErrorProfile] = React.useState(null);
  const [errorBanner, setErrorBanner] = React.useState(null);
  const [errorIsBookmarked, setErrorIsBookmarked] = React.useState(null);
  const [stepImages, setStepImages] = React.useState({});
  const [isLiked, setIsLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(0);
  const [commentCount, setCommentCount] = React.useState(0);
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  let authButtonId = "loginButton";
  let userLogged = localStorage.getItem("userLogged") === "true";
  const [showBanner, setShowBanner] = React.useState(false);

  const handleImageError = (error, setErrorState) => {
    if (error.response && error.response.status === 404) {
      // Do nothing, don't set an error for 404. The image won't render, which is fine.
      setErrorState(null);
    } else {
      setErrorState(error.message || "An unexpected error occurred.");
    }
  };

  React.useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/v1/recipes/${recipeId}`);
        setRecipe(response.data);
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
    if (recipe && recipe.userId) {
      const fetchProfilePicture = async () => {
        setLoadingProfile(true);
        setErrorProfile(null);
        try {
          const response = await axios.get(
            `/api/v1/users/${recipe.userId}/profile-picture`,
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
  }, [recipe]);
  React.useEffect(() => {
    if (recipe && recipe.id) {
      const fetchBanner = async () => {
        setLoadingBanner(true);
        setErrorBanner(null);
        try {
          const response = await axios.get(
            `/api/v1/recipes/${recipe.id}/banner`,
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
  }, [recipe]);
  React.useEffect(() => {
    if (recipe && recipe.id && recipe.steps) {
      const fetchStepImages = async () => {
        const images = {};
        for (let i = 0; i < recipe.steps.length; i++) {
          try {
            const response = await axios.get(
              `/api/v1/recipes/${recipe.id}/steps/${i}/image`,
              { responseType: "blob" }
            );
            if (response.data) {
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
  }, [recipe]);
  React.useEffect(() => {
    if (recipe && recipe.id && userLogged) {
      const fetchIsLiked = async () => {
        try {
          const response = await axios.get(
            `/api/v1/recipes/${recipe.id}/is-liked`
          );
          setIsLiked(response.data.isLiked || false);
          setLikeCount(response.data.likeCount || 0);
        } catch (err) {
          console.error("Error fetching isLiked:", err);
        }
      };
      fetchIsLiked();
    }
  }, [recipe, userLogged]);
  React.useEffect(() => {
    if (recipe && recipe.id && userLogged) {
      const fetchIsBookmarked = async () => {
        setLoadingIsBookmarked(true);
        setErrorIsBookmarked(null);
        try {
          const response = await axios.get(
            `/api/v1/recipes/${recipe.id}/is-bookmarked`
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
  }, [recipe, userLogged]);

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
  if (loading) {
    return (
      <Box
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
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!recipe) {
    return (
      <Typography color="error" textAlign={"center"}>
        No recipe information available for this ID
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1500,
        outline: "1.5px solid #C0C0C0",
        backgroundColor: "#FFFFFF",
        px: 4,
        pt: 2,
        pb: 1,
        borderRadius: "20px 20px 0 0",
        boxShadow: 3,
      }}
    >
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
            to={`/profile?id=${recipe.userId}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar
              src={profilePictureUrl}
              sx={{ width: 50, height: 50, marginRight: 1.5 }}
              onError={() => setProfilePictureUrl(null)}
            />
            <Box>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ marginRight: 0.5 }}
                noWrap
              >
                {recipe.userName}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {recipe.createdAt &&
                  formatDistanceToNow(parseISO(recipe.createdAt), {
                    addSuffix: true,
                  })}
              </Typography>
            </Box>
          </Link>
        </Box>
        <MoreHorizIcon sx={{ fontSize: "40px" }} />
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
              {recipe.header}
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
                <b>Servings:</b> {recipe.servingSize}
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
                <b>Total Time:</b> {recipe.preparationTime} mins
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
      <Typography variant="body1" sx={{ lineHeight: "30px", mb: 2, px: 2 }}>
        {recipe.bodyText}
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
          {recipe.ingredients.map((ingredient, index) => (
            <Grid item size={6} key={index} sx={{ pr: 10 }}>
              <ListItem>{`${ingredient.quantity} ${ingredient.unit} ${ingredient.ingredientName}`}</ListItem>
            </Grid>
          ))}
        </Grid>
      </List>
      {showBanner && bannerUrl && (
        <img
          src={bannerUrl}
          alt={recipe.header}
          style={{
            width: "100%",
            height: "450px",
            display: "block",
            objectFit: "cover",
            borderRadius: 10,
            border: "1px solid #C0C0C0",
          }}
        />
      )}

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
        {recipe.steps.map((step, index) => (
          <ListItem key={index}>
            {step}
            {stepImages[index] && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  mb: 1,
                  mt: 1,
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
                  }}
                />
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
          {recipe.createdAt && format(parseISO(recipe.createdAt), "h:mm a")}
        </Typography>
        <Typography variant="body1" color="text.secondary" noWrap>
          {recipe.createdAt &&
            format(parseISO(recipe.createdAt), "MMM d, yyyy")}
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
            <IconButton onClick={handleLikeToggle} style={{ padding: 0 }}>
              {isLiked ? (
                <FavoriteIcon
                  style={{ fontSize: "45px", marginRight: 4, color: "red" }}
                />
              ) : (
                <FavoriteBorderIcon
                  style={{ fontSize: "45px", marginRight: 4 }}
                />
              )}
            </IconButton>
            <Typography variant="body1" color="text.secondary">
              {likeCount}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ChatBubbleOutlineIcon
              style={{ fontSize: "42px", marginRight: 4 }}
            />
            <Typography variant="body1" color="text.secondary">
              {commentCount}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ShareIcon style={{ fontSize: "42px", marginRight: 6 }} />
          <IconButton onClick={handleBookmarkToggle} style={{ padding: 0 }}>
            {isBookmarked ? (
              <BookmarkIcon style={{ fontSize: "48px" }} />
            ) : (
              <BookmarkBorderOutlinedIcon style={{ fontSize: "48px" }} />
            )}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
