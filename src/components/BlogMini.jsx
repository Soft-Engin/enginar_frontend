import * as React from "react";
import { Typography, Box, Avatar } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import ShareIcon from "@mui/icons-material/Share";

import { useNavigate, Link } from "react-router-dom";

export default function BlogMini({ blog }) {
  const navigate = useNavigate();

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
            style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center" }}
          >
            <Avatar sx={{ width: 30, height: 30, marginRight: 1 }} />
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ marginRight: 0.5 }}
              noWrap
            >
              UserID: {blog.userId}
            </Typography>
          </Link>
          <Typography variant="body2" color="text.secondary" noWrap>
            · 5d
          </Typography>
        </Box>
        <MoreHorizIcon style={{ fontSize: "30px" }} />
      </Box>

      <Box onClick={() => navigate(`/blog?id=${blog.id}`)} sx={{cursor: "pointer"}}>
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
          <img
            src="https://via.placeholder.com/400x225"
            alt="Enginar Yemeği"
            style={{
              width: "100%",
              borderRadius: 10,
              border: "1px solid #C0C0C0",
            }}
          />
        </Box>
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
            <FavoriteBorderIcon style={{ fontSize: "30px", marginRight: 4 }} />
            <Typography variant="body2" color="text.secondary">
              39k
            </Typography>
          </Box>
          
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ChatBubbleOutlineIcon
              style={{ fontSize: "28px", marginRight: 4, cursor: "pointer" }}
              onClick={() => navigate(`/blog?id=${blog.id}`)}
            />
            <Typography variant="body2" color="text.secondary">
              14
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ShareIcon style={{ fontSize: "28px", marginRight: 6 }} />
          <BookmarkBorderOutlinedIcon style={{ fontSize: "32px" }} />
        </Box>
      </Box>
    </Box>
  );
}
