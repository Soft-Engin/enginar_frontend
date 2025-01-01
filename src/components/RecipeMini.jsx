import React from "react";
import { Typography, Box, Avatar, IconButton } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ShareIcon from "@mui/icons-material/Share";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const StyledCardMedia = styled("img")({
  width: "100%",
  borderRadius: 10,
  border: "1px solid #C0C0C0",
  objectFit: "cover",
  height: "225px",
});
export default function RecipeMini({ recipe }) {
  const navigate = useNavigate();
  const [bannerUrl, setBannerUrl] = React.useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = React.useState(null);
  const [likeCount, setLikeCount] = React.useState(0);
  const [commentCount, setCommentCount] = React.useState(0);
  const [isLiked, setIsLiked] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [loadingProfile, setLoadingProfile] = React.useState(true);
  const [loadingLikesComments, setLoadingLikesComments] = React.useState(true);
  const [loadingIsLiked, setLoadingIsLiked] = React.useState(true);
  const [loadingIsBookmarked, setLoadingIsBookmarked] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [errorProfile, setErrorProfile] = React.useState(null);
  const [errorLikesComments, setErrorLikesComments] = React.useState(null);
  const [errorIsLiked, setErrorIsLiked] = React.useState(null);
  const [errorIsBookmarked, setErrorIsBookmarked] = React.useState(null);
  const [showBanner, setShowBanner] = React.useState(false);

  let authButtonId = "loginButton";
  let userLogged = localStorage.getItem("userLogged") === "true";

  const handleImageError = (error, setErrorState) => {
    if (error.response && error.response.status === 404) {
      setErrorState(null);
    } else {
      setErrorState(error.message || "An unexpected error occurred.");
    }
  };

  React.useEffect(() => {
    if (recipe && recipe.id) {
      const fetchBanner = async () => {
        setLoading(true);
        setError(null);
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
          setLoading(false);
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
      const fetchLikesAndComments = async () => {
        setLoadingLikesComments(true);
        setErrorLikesComments(null);
        try {
          const [likeResponse, commentResponse] = await Promise.all([
            axios.get(`/api/v1/recipes/${recipe.id}/like-count`),
            axios.get(`/api/v1/recipes/${recipe.id}/comments`),
          ]);

          setLikeCount(likeResponse.data.likeCount || 0);
          setCommentCount(commentResponse.data.totalCount || 0);
        } catch (err) {
          console.error("Error fetching likes and comments:", err);
          setErrorLikesComments(err.message || "An unexpected error occurred.");
        } finally {
          setLoadingLikesComments(false);
        }
      };
      fetchLikesAndComments();
    }
  }, [recipe]);
  React.useEffect(() => {
    if (recipe && recipe.id && userLogged) {
      const fetchIsLiked = async () => {
        setLoadingIsLiked(true);
        setErrorIsLiked(null);
        try {
          const response = await axios.get(
            `/api/v1/recipes/${recipe.id}/is-liked`
          );
          setIsLiked(response.data.isLiked || false);
        } catch (err) {
          console.error("Error fetching isLiked:", err);
          setErrorIsLiked(err.message || "An unexpected error occurred.");
        } finally {
          setLoadingIsLiked(false);
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
      await axios.post(`/api/v1/recipes/${recipe.id}/toggle-like`);
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
      await axios.post(`/api/v1/recipes/${recipe.id}/bookmark`);
    } catch (err) {
      console.error("Error toggling bookmark", err);
      setIsBookmarked((prevIsBookmarked) => !prevIsBookmarked);
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        maxWidth: 700,
        outline: "1.5px solid #C0C0C0",
        backgroundColor: "#FFFFFF",
        pl: 3,
        pt: 2,
        pr: 3,
        pb: 1.5,
        borderRadius: 5,
        boxShadow: 5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
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
              sx={{ width: 30, height: 30, marginRight: 1 }}
              onError={() => setProfilePictureUrl(null)}
            />
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ marginRight: 0.5 }}
              noWrap
            >
              {recipe.userName}
            </Typography>
          </Link>
          <Typography variant="body2" color="text.secondary" noWrap>
            {recipe.createdAt &&
              formatDistanceToNow(parseISO(recipe.createdAt), {
                addSuffix: true,
              })}
          </Typography>
        </Box>
        <IconButton
          aria-label="more"
          id="menuButton"
          aria-controls={open ? "menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreHorizIcon sx={{ fontSize: "30px" }} />
        </IconButton>
        <Menu
          id="menu"
          MenuListProps={{
            "aria-labelledby": "menuButton",
          }}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem key="Follow" onClick={handleClose}>
            Follow User
          </MenuItem>
          <MenuItem key="Edit" onClick={handleClose}>
            Edit Recipe
          </MenuItem>
          <MenuItem key="Delete" onClick={handleClose}>
            Delete Recipe
          </MenuItem>
        </Menu>
      </Box>

      <Box
        onClick={() => navigate(`/recipe?id=${recipe.id}`)}
        sx={{ cursor: "pointer" }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            mb: 1,
          }}
        >
          {recipe.header}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: "24px",
            mb: 2,
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {recipe.bodyText}
        </Typography>
        <Box sx={{ mb: 0.5 }}>
          {showBanner && bannerUrl && !loading && (
            <StyledCardMedia
              src={bannerUrl}
              alt="Recipe Banner"
              onError={() => setBannerUrl(null)}
            />
          )}
        </Box>
        {error && (
          <Box display="flex" justifyContent="center" my={2}>
            {error !== null && (
              <Typography color="error">Error: {error}</Typography>
            )}
          </Box>
        )}
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
                  style={{ fontSize: "30px", marginRight: 4, color: "red" }}
                />
              ) : (
                <FavoriteBorderIcon
                  style={{ fontSize: "30px", marginRight: 4 }}
                />
              )}
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {likeCount}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ChatBubbleOutlineIcon
              style={{ fontSize: "28px", marginRight: 4 }}
            />
            <Typography variant="body2" color="text.secondary">
              {commentCount}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ShareIcon style={{ fontSize: "28px", marginRight: 6 }} />
          <IconButton onClick={handleBookmarkToggle} style={{ padding: 0 }}>
            {isBookmarked ? (
              <BookmarkIcon style={{ fontSize: "32px" }} />
            ) : (
              <BookmarkBorderOutlinedIcon style={{ fontSize: "32px" }} />
            )}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
