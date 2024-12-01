import React from "react";
import { Card, CardHeader, CardContent, CardMedia, Typography, IconButton, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ShareIcon from "@mui/icons-material/Share";

const RecipeCompressed = () => {
  return (
    <Card sx={{ maxWidth: 700, margin: "auto", boxShadow: 3, borderRadius: 2 }}>
      <CardHeader
        avatar={
          <Box
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
        <Typography variant="h6" component="div" gutterBottom>
          Enginar Yemeği Tarifim
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eu dictum ligula, et dignissim augue...
        </Typography>
      </CardContent>
      <CardMedia
        component="img"
        height="194"
        image="https://via.placeholder.com/400x200" // Replace with the actual image URL
        alt="Enginar Yemeği"
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, py: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton>
            <FavoriteIcon color="error" />
          </IconButton>
          <Typography variant="body2" sx={{ ml: 0 }}>
            39k
          </Typography>
          <IconButton>
            <ChatBubbleOutlineIcon />
          </IconButton>
          <Typography variant="body2" sx={{ ml: 0 }}>
            827
          </Typography>
        </Box>
        <Box>
          <IconButton>
            <BookmarkBorderIcon />
          </IconButton>
          <IconButton>
            <ShareIcon />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default RecipeCompressed;
