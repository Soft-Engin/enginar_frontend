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

export default function BlogDetailed() {
  return(
    <Box sx={{ width: "100%", outline: "1.5px solid #C0C0C0", backgroundColor: "#FFFFFF", pl: 4, pr: 4, pt: 2, pb: 1, borderRadius: "20px 20px 0 0", boxShadow: 3 }} >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1.2, mb: 1.2, borderBottom: "1px solid #E0E0E0" }}>
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
        sx={{ lineHeight: "28px", mb: 2 }}
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
