import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Modal,
  Fade,
  Chip,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PostPopup from "./PostPopup";
import { Link, useNavigate } from "react-router-dom";

const StyledCardMedia = styled("img")({
  width: "100%",
  objectFit: "cover",
  height: "300px",
  display: "block",
  borderRadius: 10,
  border: "1px solid #C0C0C0",
});

export default function BlogDetailed({ blogId }) {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingBanner, setLoadingBanner] = useState(true);
  const [loadingIsBookmarked, setLoadingIsBookmarked] = useState(true);
  const [error, setError] = useState(null);
  const [errorProfile, setErrorProfile] = useState(null);
  const [errorBanner, setErrorBanner] = useState(null);
  const [errorIsBookmarked, setErrorIsBookmarked] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [bannerUrl, setBannerUrl] = useState(null);
  const [bannerImage, setBannerImage] = useState(null); // New state for base64 banner
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0); // Initialize commentCount state
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageEnlarged, setImageEnlarged] = useState(false);
  let authButtonId = "loginButton";

  const [recipeName, setRecipeName] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(true);
  const [errorRecipe, setErrorRecipe] = useState(null);

  let userLogged = localStorage.getItem("userLogged") === "true";
  const [isFollowing, setIsFollowing] = useState(false);
  const [loggedInUserFollowing, setLoggedInUserFollowing] = useState([]);
  const [loggedInUserData, setLoggedInUserData] = useState(
    localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : null
  );
  const isOwnBlog = blogData?.userId === loggedInUserData?.userId;
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
    if (blogData && loggedInUserFollowing) {
      const isFollowing = loggedInUserFollowing.some(
        (following) => following.userId === blogData.userId
      );
      setIsFollowing(isFollowing);
    } else {
      setIsFollowing(false);
    }
  }, [loggedInUserFollowing, blogData?.userId]);

  const handleFollowUser = async () => {
    try {
      const response = await axios.post(
        `/api/v1/users/follow?targetUserId=${blogData.userId}`
      );
      if (response.status === 200) {
        setIsFollowing(true);
        setLoggedInUserFollowing((prev) => [
          ...prev,
          { userId: blogData.userId },
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
        `/api/v1/users/unfollow?targetUserId=${blogData.userId}`
      );
      if (response.status === 200) {
        setIsFollowing(false);
        setLoggedInUserFollowing((prev) =>
          prev.filter((following) => following.userId !== blogData.userId)
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

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleImageError = (error, setErrorState) => {
    if (error.response && error.response.status === 404) {
      // Do nothing, don't set an error for 404. The image won't render, which is fine.
      setErrorState(null);
    } else {
      setErrorState(error.message || "An unexpected error occurred.");
    }
  };

  const refreshBlogData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/v1/blogs/${blogId}`);
      setBlogData(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch blog data");
    } finally {
      setLoading(false);
      setIsEditing(false);
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
  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/v1/blogs/${blogId}`);
        setBlogData(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch blog data");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [blogId]);

  useEffect(() => {
    if (blogData && blogData.userId) {
      const fetchProfilePicture = async () => {
        setLoadingProfile(true);
        setErrorProfile(null);
        try {
          const response = await axios.get(
            `/api/v1/users/${blogData.userId}/profile-picture`,
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
  }, [blogData]);

  useEffect(() => {
    if (blogData && blogData.id) {
      const fetchBanner = async () => {
        setLoadingBanner(true);
        setErrorBanner(null);
        try {
          const response = await axios.get(
            `/api/v1/blogs/${blogData.id}/banner`,
            { responseType: "blob" }
          );
          if (response.data) {
            const base64 = await convertBlobToBase64(response.data);
            setBannerImage(base64);
            const imageUrl = URL.createObjectURL(response.data);
            setBannerUrl(imageUrl);
          } else {
            setBannerUrl(null);
            setBannerImage(null);
          }
        } catch (err) {
          console.error("Error fetching banner image:", err);
          handleImageError(err, setErrorBanner);
          setBannerUrl(null);
          setBannerImage(null);
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
  }, [blogData]);
  useEffect(() => {
    if (blogData && blogData.recipeId) {
      const fetchRecipe = async () => {
        setLoadingRecipe(true);
        setErrorRecipe(null);
        try {
          const response = await axios.get(
            `/api/v1/recipes/${blogData.recipeId}`
          );
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
  }, [blogData?.recipeId]);
  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
    });
  };

  useEffect(() => {
    if (blogData && blogData.id && userLogged) {
      const fetchIsLiked = async () => {
        try {
          const response = await axios.get(
            `/api/v1/blogs/${blogData.id}/is-liked`
          );
          setIsLiked(response.data.isLiked || false);
          setLikeCount(response.data.likeCount || 0);
        } catch (err) {
          console.error("Error fetching isLiked:", err);
        }
      };
      fetchIsLiked();
    }
  }, [blogData, userLogged]);

  useEffect(() => {
    if (blogData && blogData.id && userLogged) {
      const fetchCommentCount = async () => {
        try {
          const response = await axios.get(
            `/api/v1/blogs/${blogData.id}/comments`
          );
          setCommentCount(response.data.totalCount || 0);
        } catch (err) {
          console.error("Error fetching comment count:", err);
        }
      };
      fetchCommentCount();
    }
  }, [blogData, userLogged]);

  useEffect(() => {
    if (blogData && blogData.id && userLogged) {
      const fetchIsBookmarked = async () => {
        setLoadingIsBookmarked(true);
        setErrorIsBookmarked(null);
        try {
          const response = await axios.get(
            `/api/v1/blogs/${blogData.id}/is-bookmarked`
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
  }, [blogData, userLogged]);

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
      await axios.post(`/api/v1/blogs/${blogData.id}/toggle-like`);
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
      await axios.post(`/api/v1/blogs/${blogData.id}/bookmark`);
    } catch (err) {
      console.error("Error toggling bookmark", err);
      setIsBookmarked((prevIsBookmarked) => !prevIsBookmarked);
    }
  };
  const handleEditClick = () => {
    setIsEditing(true);
    handleClose();
  };
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleClose();
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
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

  if (!blogData) {
    return <Typography>No blog data available.</Typography>;
  }
  const formattedTime =
    blogData.createdAt && format(parseISO(blogData.createdAt).getTime() + 3 * 60 * 60 * 1000, "h:mm a");
  const formattedDate =
    blogData.createdAt && format(parseISO(blogData.createdAt).getTime() + 3 * 60 * 60 * 1000, "MMM d, yyyy");

  return (
    <Box
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1.2,
          mb: 1.2,
          borderBottom: "1px solid #E0E0E0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Placeholder avatar */}
          <Link
            to={`/profile?id=${blogData.userId}`}
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
                {blogData.userName}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {blogData.createdAt &&
                  formatDistanceToNow(parseISO(blogData.createdAt).getTime() + 3 * 60 * 60 * 1000, {
                    addSuffix: true,
                  })}
              </Typography>
            </Box>
          </Link>
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
                    <>
                      <MenuItem key="Edit" onClick={handleEditClick}>
                        Edit Blog
                      </MenuItem>
                      <MenuItem
                        key="Delete"
                        onClick={handleDeleteClick}
                        sx={{ color: "red" }}
                      >
                        Delete Blog
                      </MenuItem>
                    </>
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
                <>
                  <MenuItem key="Edit" onClick={handleEditClick}>
                    Edit Blog
                  </MenuItem>
                  <MenuItem
                    key="Delete"
                    onClick={handleDeleteClick}
                    sx={{ color: "red" }}
                  >
                    Delete Blog
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>
        )}
      </Box>
      <Typography
        variant="body1"
        component="div"
        sx={{
          lineHeight: "28px",
          mb: 2,
          wordWrap: "break-word",
          overflowWrap: "break-word",
        }}
      >
        {blogData.bodyText}
      </Typography>
      {recipeName && (
        <Box sx={{ mb: 0.5, display: "flex", flexDirection: "row", gap: 1 }}>
          <Typography variant="subtitle2">{"Linked Recipe: "}</Typography>
          <Chip
            label={recipeName}
            onClick={() => {
              try {
                  navigate(`/recipe?id=${blogData.recipeId}`)
              } catch(e){
                  console.error("error on navigation", e)
              }
          }}
            clickable
            size="small"
            sx={{ backgroundColor: "#4B9023", color: "white" }}
          />
        </Box>
      )}
      {bannerUrl && !loadingBanner && (
        <Box sx={{ mb: 2 }}>
          <StyledCardMedia
            src={bannerUrl}
            alt={blogData.header}
            onError={() => setBannerUrl(null)}
            onClick={() => setImageEnlarged(true)}
            sx={{ cursor: "pointer" }}
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
                    src={bannerUrl}
                    alt={blogData.header}
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
        </Box>
      )}
      {errorBanner && (
        <Box display="flex" justifyContent="center" my={2}>
          {errorBanner !== null && (
            <Typography color="error">Error: {errorBanner}</Typography>
          )}
        </Box>
      )}

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
          {formattedTime}
        </Typography>
        <Typography variant="body1" color="text.secondary" noWrap>
          · {formattedDate}
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
                  style={{ fontSize: "45px", marginRight: 4, color: "#757575" }}
                />
              )}
            </IconButton>
            <Typography variant="body1" color="text.secondary">
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
          <IconButton onClick={handleBookmarkToggle} style={{ padding: 0 }}>
            {isBookmarked ? (
              <BookmarkIcon style={{ fontSize: "48px" }} />
            ) : (
              <BookmarkBorderOutlinedIcon
                style={{ fontSize: "48px", color: "#757575" }}
              />
            )}
          </IconButton>
        </Box>
      </Box>
      {isEditing && (
        <PostPopup
          open={isEditing}
          handleClose={() => setIsEditing(false)}
          blogData={blogData}
          blogId={blogId}
          isEditMode={true}
          refreshBlogData={refreshBlogData}
          bannerImage={bannerImage} // Pass bannerImage as a prop
        />
      )}
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
