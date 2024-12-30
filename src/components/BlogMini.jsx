import * as React from "react";
import { Typography, Box, Avatar } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import ShareIcon from "@mui/icons-material/Share";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function BlogMini() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
          <Avatar sx={{ width: 35, height: 35, marginRight: 1 }} />
          <Typography
            variant="body1"
            fontWeight="bold"
            sx={{ marginRight: 0.5 }}
            noWrap
          >
            Hoshino Ichika
          </Typography>
          <Typography variant="body1" color="text.secondary" noWrap>
            · 5d
          </Typography>
        </Box>
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
          <MenuItem key="Follow" onClick={handleClose}>
            Follow User
          </MenuItem>
          <MenuItem key="Edit" onClick={handleClose}>
            Edit Blog
          </MenuItem>
          <MenuItem key="Delete" onClick={handleClose}>
            Delete Blog
          </MenuItem>
        </Menu>
      </Box>

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
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur.
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
              style={{ fontSize: "28px", marginRight: 4 }}
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
