import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardMedia, Typography, IconButton, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ShareIcon from "@mui/icons-material/Share";

const RecipeCompressed = () => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const toggleLike = () => setLiked((prev) => !prev);
  const toggleBookmark = () => setBookmarked((prev) => !prev);

  return (
    <Card data-testid="recipe-compressed" sx={{ maxWidth: 700, margin: "auto", boxShadow: 3, borderRadius: 2 }}>
      <CardHeader
        avatar={
          <Box
            data-testid="recipe-avatar"
            component="img"
            src="/pp3.jpeg"
            alt="Shiraishi An"
            sx={{ width: 40, height: 40, borderRadius: "50%" }}
          />
        }
        title="Shiraishi An"
        subheader="2h"
        sx={{ pb: 0 }}
      />
      <CardContent>
        <Typography 
          data-testid="recipe-title"
          variant="h6" 
          component="div" 
          gutterBottom
        >
          Enginar Yemeği Tarifim
        </Typography>
        <Typography 
          data-testid="recipe-description"
          variant="body2" 
          color="text.secondary" 
          noWrap
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eu dictum ligula, et dignissim augue...
        </Typography>
      </CardContent>
      <CardMedia
        data-testid="recipe-media"
        component="img"
        height="194"
        image="https://via.placeholder.com/400x200" // Replace with the actual image URL
        alt="Enginar Yemeği"
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, py: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton
          data-testid="like-button"
                onClick={toggleLike}
                sx={{
                  transition: "transform 0.3s ease",
                  transform: liked ? "scale(1.2)" : "scale(1)",
                }}
              >
                {liked ? (
                  <FavoriteIcon color="error" data-testid="liked-icon" />
                ) : (
                  <FavoriteBorderIcon data-testid="not-liked-icon" />
                )}
              </IconButton>
              <Typography data-testid="likes-count" variant="body2" sx={{ ml: 0 }}>
                {liked ? "40k" : "39k"} {/* Update count dynamically */}
              </Typography>
              <IconButton data-testid="comment-button">
                <ChatBubbleOutlineIcon />
              </IconButton>
              <Typography variant="body2" sx={{ ml: 0 }}>
                827
              </Typography>
            </Box>
            <Box>
              <IconButton
                data-testid="bookmark-button"
                onClick={toggleBookmark}
                sx={{
                  transition: "transform 0.3s ease",
                  transform: bookmarked ? "scale(1.2)" : "scale(1)",
                }}
              >
                {bookmarked ? (
                  <BookmarkIcon data-testid="bookmarked-icon" color="secondary" />
                ) : (
                  <BookmarkBorderIcon data-testid="not-bookmarked-icon" />
                )}
              </IconButton>
              <IconButton data-testid="share-button">
                <ShareIcon />
              </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default RecipeCompressed;
