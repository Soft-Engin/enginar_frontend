import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Avatar,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
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

export default function BlogMini({ blog }) {
  const navigate = useNavigate();
  const [bannerUrl, setBannerUrl] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingLikesComments, setLoadingLikesComments] = useState(true);
  const [loadingIsLiked, setLoadingIsLiked] = useState(true);
  const [loadingIsBookmarked, setLoadingIsBookmarked] = useState(true);
  const [error, setError] = useState(null);
  const [errorProfile, setErrorProfile] = useState(null);
  const [errorLikesComments, setErrorLikesComments] = useState(null);
  const [errorIsLiked, setErrorIsLiked] = useState(null);
  const [errorIsBookmarked, setErrorIsBookmarked] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loggedInUserFollowing, setLoggedInUserFollowing] = useState([]);
  const [loggedInUserData, setLoggedInUserData] = useState(
    localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [recipeName, setRecipeName] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(true);
  const [errorRecipe, setErrorRecipe] = useState(null);

  let authButtonId = "loginButton";
  let userLogged = localStorage.getItem("userLogged") === "true";

  const blogId = blog?.id || blog?.blogId; // Extract blogId
  const isOwnBlog =
    JSON.parse(localStorage.getItem("userData"))?.userId === blog.userId;
  let isAdmin = loggedInUserData?.roleName === "Admin";

  const handleImageError = (error, setErrorState) => {
    if (error.response && error.response.status === 404) {
      // Do nothing, don't set an error for 404. The image won't render, which is fine.
      setErrorState(null);
    } else {
      setErrorState(error.message || "An unexpected error occurred.");
    }
  };

  useEffect(() => {
    if (blogId) {
      const fetchBanner = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`/api/v1/blogs/${blogId}/banner`, {
            responseType: "blob",
          });
          if (response.data) {
            const imageUrl = URL.createObjectURL(response.data);
            setBannerUrl(imageUrl);
          } else {
            setBannerUrl(null);
          }
        } catch (err) {
          console.error("Error fetching banner image:", err);
          handleImageError(err, setError);
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
  }, [blogId]);

  useEffect(() => {
    if (blog && blog.recipeId) {
      const fetchRecipe = async () => {
        setLoadingRecipe(true);
        setErrorRecipe(null);
        try {
          const response = await axios.get(`/api/v1/recipes/${blog.recipeId}`);
          setRecipeName(response.data.header);
        } catch (err) {
          console.error("Error fetching recipe:", err);
          setErrorRecipe(err.message || "An unexpected error occurred.");
        } finally {
          setLoadingRecipe(false);
        }
      };
      fetchRecipe();
    } else {
      setLoadingRecipe(false);
    }
  }, [blog?.recipeId]);

  useEffect(() => {
    if (blog && blog.userId) {
      const fetchProfilePicture = async () => {
        setLoadingProfile(true);
        setErrorProfile(null);
        try {
          const response = await axios.get(
            `/api/v1/users/${blog.userId}/profile-picture`,
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
  }, [blog]);
  useEffect(() => {
    if (blogId) {
      const fetchLikesAndComments = async () => {
        setLoadingLikesComments(true);
        setErrorLikesComments(null);
        try {
          const [likeResponse, commentResponse] = await Promise.all([
            axios.get(`/api/v1/blogs/${blogId}/like-count`),
            axios.get(`/api/v1/blogs/${blogId}/comments`),
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
  }, [blogId]);
  useEffect(() => {
    if (blogId && userLogged) {
      const fetchIsLiked = async () => {
        setLoadingIsLiked(true);
        setErrorIsLiked(null);
        try {
          const response = await axios.get(`/api/v1/blogs/${blogId}/is-liked`);
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
  }, [blogId, userLogged]);
  useEffect(() => {
    if (blogId && userLogged) {
      const fetchIsBookmarked = async () => {
        setLoadingIsBookmarked(true);
        setErrorIsBookmarked(null);
        try {
          const response = await axios.get(
            `/api/v1/blogs/${blogId}/is-bookmarked`
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
  }, [blogId, userLogged]);

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
      await axios.post(`/api/v1/blogs/${blogId}/toggle-like`);
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
      await axios.post(`/api/v1/blogs/${blogId}/bookmark`);
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
      blog.userId !== loggedInUserData?.userId &&
      loggedInUserFollowing
    ) {
      const isFollowing = loggedInUserFollowing.some(
        (following) => following.userId === blog.userId
      );
      setIsFollowing(isFollowing);
    } else {
      setIsFollowing(false);
    }
  }, [loggedInUserFollowing, blog.userId, loggedInUserData]);

  const handleFollowUser = async () => {
    try {
      const response = await axios.post(
        `/api/v1/users/follow?targetUserId=${blog.userId}`
      );
      if (response.status === 200) {
        setIsFollowing(true);
        setLoggedInUserFollowing((prev) => [...prev, { userId: blog.userId }]);
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
        `/api/v1/users/unfollow?targetUserId=${blog.userId}`
      );
      if (response.status === 200) {
        setIsFollowing(false);
        setLoggedInUserFollowing((prev) =>
          prev.filter((following) => following.userId !== blog.userId)
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
  const handleDeleteBlog = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/v1/blogs/${blogId}`);
      setDeleteDialogOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Error deleting blog:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete the blog."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleClose();
  };

  return (
    <Box
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
            to={`/profile?id=${blog.userId}`}
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
              {blog.userName}
            </Typography>
          </Link>
          <Typography variant="body2" color="text.secondary" noWrap>
            {blog.createdAt &&
              formatDistanceToNow(parseISO(blog.createdAt).getTime() + 3 * 60 * 60 * 1000, {
                addSuffix: true,
                }
              )}
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
              {isAdmin || !isOwnBlog ? (
                <>
                  {isAdmin && (
                    <MenuItem
                      key="Delete"
                      onClick={handleDeleteClick}
                      sx={{ color: "red" }}
                    >
                      Delete Blog
                    </MenuItem>
                  )}

                  {!isOwnBlog && (
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
                <MenuItem
                  key="Delete"
                  onClick={handleDeleteClick}
                  sx={{ color: "red" }}
                >
                  Delete Blog
                </MenuItem>
              )}
            </Menu>
          </Box>
        )}
      </Box>

      <Box>
        <Typography
          variant="body2"
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: "24px",
            mb: 2,
            wordWrap: "break-word",
            overflowWrap: "break-word",
            flexGrow: 1,
            cursor: "pointer",
          }}
          onClick={() => navigate(`/blog?id=${blogId}`)}
        >
          {blog.bodyText}
        </Typography>

        {recipeName && (
          <Box sx={{ mb: 0.5, display: "flex", flexDirection: "row", gap: 1 }}>
            <Typography variant="subtitle2">{"Linked Recipe: "}</Typography>
            <Chip
              label={recipeName}
              onClick={() => navigate(`/recipe?id=${blog.recipeId}`)}
              clickable
              size="small"
              sx={{ backgroundColor: "#4B9023", color: "white", maxWidth: "70%" }}
            />
          </Box>
        )}

        <Box
          sx={{ mb: 0.5, cursor: "pointer" }}
          onClick={() => navigate(`/blog?id=${blogId}`)}
        >
          {bannerUrl && !loading && (
            <StyledCardMedia
              src={bannerUrl}
              alt="Blog Banner"
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
          marginTop: "auto",
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
                  style={{ fontSize: "30px", marginRight: 4, color: "#757575" }}
                />
              )}
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {likeCount}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ChatBubbleOutlineIcon
              style={{
                fontSize: "28px",
                marginRight: 4,
                cursor: "pointer",
                color: "#757575",
              }}
              onClick={() => navigate(`/blog?id=${blogId}`)}
            />
            <Typography variant="body2" color="text.secondary">
              {commentCount}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleBookmarkToggle} style={{ padding: 0 }}>
            {isBookmarked ? (
              <BookmarkIcon style={{ fontSize: "32px" }} />
            ) : (
              <BookmarkBorderOutlinedIcon
                style={{ fontSize: "32px", color: "#757575" }}
              />
            )}
          </IconButton>
        </Box>
      </Box>
      <Dialog
        open={deleteDialogOpen}
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
            Are you sure you want to delete this blog post?
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
            onClick={handleDeleteBlog}
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
  );
}
