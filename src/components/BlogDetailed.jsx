import * as React from "react";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ShareIcon from "@mui/icons-material/Share";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { format, parseISO, formatDistanceToNow } from "date-fns";

import { useNavigate, Link } from "react-router-dom";

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
  const [blogData, setBlogData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [loadingProfile, setLoadingProfile] = React.useState(true);
  const [loadingBanner, setLoadingBanner] = React.useState(true);
  const [loadingIsBookmarked, setLoadingIsBookmarked] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [errorProfile, setErrorProfile] = React.useState(null);
  const [errorBanner, setErrorBanner] = React.useState(null);
  const [errorIsBookmarked, setErrorIsBookmarked] = React.useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = React.useState(null);
  const [bannerUrl, setBannerUrl] = React.useState(null);
  const [isLiked, setIsLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(0);
  const [commentCount, setCommentCount] = React.useState(0);
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  let authButtonId = "loginButton";
  let userLogged = localStorage.getItem("userLogged") === "true";

  const handleImageError = (error, setErrorState) => {
    if (error.response && error.response.status === 404) {
      // Do nothing, don't set an error for 404. The image won't render, which is fine.
      setErrorState(null);
    } else {
      setErrorState(error.message || "An unexpected error occurred.");
    }
  };

  React.useEffect(() => {
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
  React.useEffect(() => {
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
  React.useEffect(() => {
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
            const imageUrl = URL.createObjectURL(response.data);
            setBannerUrl(imageUrl);
          } else {
            setBannerUrl(null);
          }
        } catch (err) {
          console.error("Error fetching banner image:", err);
          handleImageError(err, setErrorBanner);
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
  React.useEffect(() => {
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
  React.useEffect(() => {
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
    blogData.createdAt && format(parseISO(blogData.createdAt), "h:mm a");
  const formattedDate =
    blogData.createdAt && format(parseISO(blogData.createdAt), "MMM d, yyyy");

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
                  formatDistanceToNow(parseISO(blogData.createdAt), {
                    addSuffix: true,
                  })}
              </Typography>
            </Box>
          </Link>
        </Box>
        <MoreHorizIcon sx={{ fontSize: "40px" }} />
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
      {bannerUrl && !loadingBanner && (
        <Box sx={{ mb: 2 }}>
          <StyledCardMedia
            src={bannerUrl}
            alt={blogData.header}
            onError={() => setBannerUrl(null)}
          />
        </Box>
      )}
      {errorBanner && (
        <Box display="flex" justifyContent="center" my={2}>
          {errorBanner !== null && (
            <Typography color="error">Error: {errorBanner}</Typography>
          )}
        </Box>
      )}

      {blogData.recipeId && (
        <Link
          to={`/recipe?id=${blogData.recipeId}`}
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "block",
            textAlign: "center",
            marginBottom: 2,
          }}
        >
          <Typography variant="body1" fontWeight={"bold"}>
            Click here to see related recipe
          </Typography>
        </Link>
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
