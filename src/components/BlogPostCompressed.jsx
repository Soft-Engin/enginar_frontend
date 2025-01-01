import React, { useState } from "react";
import { Card, Typography, IconButton, Box, Avatar } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

const BlogPostCompressed = (props) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const toggleLike = () => setLiked((prev) => !prev);
  const toggleBookmark = () => setBookmarked((prev) => !prev);

  return (
    <Card
      sx={{
        maxWidth: 700,
        width: 700,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", padding: 2 }}>
        {/* User Avatar */}
        <Avatar
          src="/pp3.jpeg" // Replace with user avatar URL
          alt="User Avatar"
          sx={{ width: 48, height: 48 }}
        />

        {/* Post Content */}
        <Box sx={{ flex: 1, ml: 2 }}>
          {/* User Info */}
          <Typography
            variant="body1"
            component="span"
            sx={{ fontWeight: 600, mr: 1 }}
          >
            Shiraishi An
          </Typography>
          <Typography variant="body2" component="span" color="text.secondary">
            birseyler
          </Typography>

          {/* Post Text */}
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ mt: 1, mb: 1 }}
          >
            {props.content}
          </Typography>

          {/* Post Image */}
          <Box
            component="img"
            src="https://via.placeholder.com/500x250" // Replace with actual image URL
            alt="Post Content"
            sx={{ width: "100%", borderRadius: 8, mt: 1 }}
          />

          {/* Interaction Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 0,
              py: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                onClick={toggleLike}
                sx={{
                  transition: "transform 0.3s ease",
                  transform: liked ? "scale(1.2)" : "scale(1)",
                }}
              >
                {liked ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
              <Typography variant="body2" sx={{ ml: 0 }}>
                {liked ? "40k" : "39k"} {/* Update count dynamically */}
              </Typography>
              <IconButton>
                <ChatBubbleOutlineIcon />
              </IconButton>
              <Typography variant="body2" sx={{ ml: 0 }}>
                827
              </Typography>
            </Box>
            <Box>
              <IconButton
                onClick={toggleBookmark}
                sx={{
                  transition: "transform 0.3s ease",
                  transform: bookmarked ? "scale(1.2)" : "scale(1)",
                }}
              >
                {bookmarked ? (
                  <BookmarkIcon color="secondary" />
                ) : (
                  <BookmarkBorderIcon />
                )}
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default BlogPostCompressed;
