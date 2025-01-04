import React, { useState, useEffect } from "react";
import { Typography, Box, Avatar, IconButton } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { parseISO, formatDistanceToNow } from "date-fns";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const StyledCardMedia = styled("img")({
  width: "100%",
  borderRadius: 10,
  border: "1px solid #C0C0C0",
  objectFit: "cover",
  height: "225px",
});

export default function RecipeMini({ recipe, disableActions = false }) {
  // Added disableActions prop
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
  const [isFollowing, setIsFollowing] = useState(false);
  const [loggedInUserFollowing, setLoggedInUserFollowing] = useState([]);
  const [loggedInUserData, setLoggedInUserData] = useState(
    localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : null
  );

  let authButtonId = "loginButton";
  let userLogged = localStorage.getItem("userLogged") === "true";
  let isAdmin = loggedInUserData?.roleName === "Admin";

  const recipeId = recipe?.id || recipe?.recipeId; // Extract recipeId
  const isOwnRecipe =
    JSON.parse(localStorage.getItem("userData"))?.userId === recipe.userId;

  const handleImageError = (error, setErrorState) => {
    if (error.response && error.response.status === 404) {
      setErrorState(null);
    } else {
      setErrorState(error.message || "An unexpected error occurred.");
    }
  };

  React.useEffect(() => {
    if (recipeId) {
      const fetchBanner = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(
            `/api/v1/recipes/${recipeId}/banner`,
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
    if (recipeId) {
      const fetchLikesAndComments = async () => {
        setLoadingLikesComments(true);
        setErrorLikesComments(null);
        try {
          const [likeResponse, commentResponse] = await Promise.all([
            axios.get(`/api/v1/recipes/${recipeId}/like-count`),
            axios.get(`/api/v1/recipes/${recipeId}/comments`),
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
  }, [recipeId]);

  React.useEffect(() => {
    if (recipeId && userLogged) {
      const fetchIsLiked = async () => {
        setLoadingIsLiked(true);
        setErrorIsLiked(null);
        try {
          const response = await axios.get(
            `/api/v1/recipes/${recipeId}/is-liked`
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
  }, [recipeId, userLogged]);

  React.useEffect(() => {
    if (recipeId && userLogged) {
      const fetchIsBookmarked = async () => {
        setLoadingIsBookmarked(true);
        setErrorIsBookmarked(null);
        try {
          const response = await axios.get(
            `/api/v1/recipes/${recipeId}/is-bookmarked`
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
  }, [recipeId, userLogged]);

  const handleLikeToggle = async () => {
    if (disableActions) return; // Prevent action if disabled

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
    if (disableActions) return; // Prevent action if disabled

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
  }, [loggedInUserData]);

  useEffect(() => {
    if (
      loggedInUserData?.userId &&
      recipe.userId !== loggedInUserData?.userId &&
      loggedInUserFollowing
    ) {
      const isFollowing = loggedInUserFollowing.some(
        (following) => following.userId === recipe.userId
      );
      setIsFollowing(isFollowing);
    } else {
      setIsFollowing(false);
    }
  }, [loggedInUserFollowing, recipe.userId, loggedInUserData]);

  const handleFollowUser = async () => {
    if (disableActions) return; // Prevent action if disabled
    try {
      const response = await axios.post(
        `/api/v1/users/follow?targetUserId=${recipe.userId}`
      );
      if (response.status === 200) {
        setIsFollowing(true);
        setLoggedInUserFollowing((prev) => [
          ...prev,
          { userId: recipe.userId },
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
    if (disableActions) return; // Prevent action if disabled
    try {
      const response = await axios.delete(
        `/api/v1/users/unfollow?targetUserId=${recipe.userId}`
      );
      if (response.status === 200) {
        setIsFollowing(false);
        setLoggedInUserFollowing((prev) =>
          prev.filter((following) => following.userId !== recipe.userId)
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

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    if (disableActions) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      data-testid={`recipe-mini-${recipe.id}`}
      sx={{
        maxWidth: 700,
        width: "100%",
        outline: "1.5px solid #C0C0C0",
        backgroundColor: "#FFFFFF",
        pl: 3,
        pt: 2,
        pr: 3,
        pb: 1.5,
        borderRadius: 5,
        boxShadow: 5,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        data-testid="recipe-mini-header"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
          height: 35,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link
            to={disableActions ? undefined : `/profile?id=${recipe.userId}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              pointerEvents: disableActions ? "none" : "auto",
            }}
          >
            <Avatar
              data-testid="recipe-avatar"
              src={profilePictureUrl}
              sx={{ width: 30, height: 30, marginRight: 1 }}
              onError={() => setProfilePictureUrl(null)}
            />
            <Typography
              data-testid="recipe-username"
              variant="body2"
              fontWeight="bold"
              sx={{ marginRight: 0.5 }}
              noWrap
            >
              {recipe.userName}
            </Typography>
          </Link>
          <Typography data-testid="recipe-created-ago" variant="body2" color="text.secondary" noWrap>
            {recipe.createdAt &&
              formatDistanceToNow(parseISO(recipe.createdAt).getTime() + 3 * 60 * 60 * 1000, {
                addSuffix: true,
              })}
          </Typography>
        </Box>
        {userLogged && (
          <Box>
            <IconButton
              aria-label="more"
              id="menuButton"
              aria-controls={open ? "menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
              disabled={disableActions} // Disable the more button as well
            >
              <MoreHorizIcon data-testid="menu-button" sx={{ fontSize: "30px" }} />
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
              {isAdmin || !isOwnRecipe ? (
                <>
                  {isAdmin && (
                    <>
                      <MenuItem key="Edit" onClick={handleClose}>
                        Edit Recipe
                      </MenuItem>
                      <MenuItem
                        key="Delete"
                        onClick={handleClose}
                        sx={{ color: "red" }}
                      >
                        Delete Recipe
                      </MenuItem>
                    </>
                  )}

                  {!isOwnRecipe && (
                    <>
                      {isFollowing ? (
                        <MenuItem
                          key="Unfollow"
                          onClick={handleUnfollowUser}
                          disabled={disableActions}
                        >
                          Unfollow User
                        </MenuItem>
                      ) : (
                        <MenuItem
                          key="Follow"
                          onClick={handleFollowUser}
                          disabled={disableActions}
                        >
                          Follow User
                        </MenuItem>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  <MenuItem key="Edit" onClick={handleClose}>
                    Edit Recipe
                  </MenuItem>
                  <MenuItem
                    key="Delete"
                    onClick={handleClose}
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

      <Box
        data-testid="recipe-mini-clickable"
        onClick={
          disableActions ? undefined : () => navigate(`/recipe?id=${recipeId}`)
        }
        sx={{
          cursor: disableActions ? "default" : "pointer",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight="bold"
            data-testid={`recipe-header-${recipe.id}`}
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
            data-testid="recipe-bodyText"
            variant="body2"
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              mb: 2,
              lineHeight: "24px",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {recipe.bodyText}
          </Typography>
        </Box>

        {showBanner && bannerUrl && !loading && (
          <Box
            sx={{
              mb: 1,
              flexShrink: 0,
              display: "flex",
              justifyContent: "center", // Center the image horizontally
            }}
          >
            <StyledCardMedia
              data-testid="recipe-banner"
              src={bannerUrl}
              alt="Recipe Banner"
              onError={() => setBannerUrl(null)}
            />
          </Box>
        )}

        {error && (
          <Box data-testid="recipe-error" display="flex" justifyContent="center" my={2}>
            {error !== null && (
              <Typography color="error">Error: {error}</Typography>
            )}
          </Box>
        )}
      </Box>

      <Box
        data-testid="recipe-mini-actions"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              data-testid="like-button"
              onClick={handleLikeToggle}
              style={{ padding: 0 }}
              disabled={disableActions}
            >
              {isLiked ? (
                <FavoriteIcon data-testid="like-icon-filled"
                  style={{ fontSize: "30px", marginRight: 4, color: "red" }}
                />
              ) : (
                <FavoriteBorderIcon
                  data-testid="like-icon-border"
                  style={{ fontSize: "30px", marginRight: 4, color: "#757575" }}
                />
              )}
            </IconButton>
            <Typography data-testid="like-count" variant="body2" color="text.secondary">
              {likeCount}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ChatBubbleOutlineIcon
              style={{ fontSize: "28px", marginRight: 4, color: "#757575" }}
              onClick={
                disableActions
                  ? undefined
                  : () => navigate(`/recipe?id=${recipeId}`)
              }
            />
            <Typography data-testid="comment-count" variant="body2" color="text.secondary">
              {commentCount}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            data-testid="bookmark-button"
            onClick={handleBookmarkToggle}
            style={{ padding: 0 }}
            disabled={disableActions}
          >
            {isBookmarked ? (
              <BookmarkIcon data-testid="bookmark-icon-filled" style={{ fontSize: "32px" }} />
            ) : (
              <BookmarkBorderOutlinedIcon
                data-testid="bookmark-icon-border"
                style={{ fontSize: "32px", color: "#757575" }}
              />
            )}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
