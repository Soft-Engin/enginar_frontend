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

const StyledCardMedia = styled("img")({
  width: "100%",
  borderRadius: 10,
  border: "1px solid #C0C0C0",
  objectFit: "cover",
  height: "225px",
});

export default function BlogMini({ blog }) {
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
    if (blog && blog.id) {
      const fetchBanner = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`/api/v1/blogs/${blog.id}/banner`, {
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
  }, [blog]);
  React.useEffect(() => {
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
  React.useEffect(() => {
    if (blog && blog.id) {
      const fetchLikesAndComments = async () => {
        setLoadingLikesComments(true);
        setErrorLikesComments(null);
        try {
          const [likeResponse, commentResponse] = await Promise.all([
            axios.get(`/api/v1/blogs/${blog.id}/like-count`),
            axios.get(`/api/v1/blogs/${blog.id}/comments`),
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
  }, [blog]);
  React.useEffect(() => {
    if (blog && blog.id && userLogged) {
      const fetchIsLiked = async () => {
        setLoadingIsLiked(true);
        setErrorIsLiked(null);
        try {
          const response = await axios.get(`/api/v1/blogs/${blog.id}/is-liked`);
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
  }, [blog, userLogged]);
  React.useEffect(() => {
    if (blog && blog.id && userLogged) {
      const fetchIsBookmarked = async () => {
        setLoadingIsBookmarked(true);
        setErrorIsBookmarked(null);
        try {
          const response = await axios.get(
            `/api/v1/blogs/${blog.id}/is-bookmarked`
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
  }, [blog, userLogged]);

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
      await axios.post(`/api/v1/blogs/${blog.id}/toggle-like`);
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
      await axios.post(`/api/v1/blogs/${blog.id}/bookmark`);
    } catch (err) {
      console.error("Error toggling bookmark", err);
      setIsBookmarked((prevIsBookmarked) => !prevIsBookmarked);
    }
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
              formatDistanceToNow(parseISO(blog.createdAt), {
                addSuffix: true,
              })}
          </Typography>
        </Box>
        <MoreHorizIcon style={{ fontSize: "30px" }} />
      </Box>

      <Box
        onClick={() => navigate(`/blog?id=${blog.id}`)}
        sx={{ cursor: "pointer" }}
      >
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
          }}
        >
          {blog.bodyText}
        </Typography>

        <Box sx={{ mb: 0.5 }}>
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
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton 
              onClick={handleLikeToggle} 
              style={{ padding: 0 }}
              data-testid="like-button"
            >
              {isLiked ? (
                <FavoriteIcon
                  style={{ fontSize: "30px", marginRight: 4, color: "red" }}
                  data-testid="liked-icon"
                />
              ) : (
                <FavoriteBorderIcon
                  style={{ fontSize: "30px", marginRight: 4 }}
                  data-testid="not-liked-icon"
                />
              )}
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {likeCount}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ChatBubbleOutlineIcon
              style={{ fontSize: "28px", marginRight: 4, cursor: "pointer" }}
              onClick={() => navigate(`/blog?id=${blog.id}`)}
            />
            <Typography variant="body2" color="text.secondary">
              {commentCount}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ShareIcon style={{ fontSize: "28px", marginRight: 6 }} />
          <IconButton 
            onClick={handleBookmarkToggle} 
            style={{ padding: 0 }}
            data-testid="bookmark-button"
          >
            {isBookmarked ? (
              <BookmarkIcon 
                style={{ fontSize: "32px" }}
                data-testid="bookmarked-icon"
              />
            ) : (
              <BookmarkBorderOutlinedIcon 
                style={{ fontSize: "32px" }}
                data-testid="not-bookmarked-icon"
              />
            )}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
