import * as React from "react";
import { styled } from "@mui/material/styles";
import { Typography, Box, Avatar, Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const SharedButton = styled(Button)(({ theme }) => ({
  border: "#888888",
  borderStyle: "solid",
  borderWidth: "2px",
  height: "30px",
  minWidth: "90px",
  borderRadius: "20px",
}));

const FollowButton = styled(SharedButton)(({ theme }) => ({
  color: "#453E3E",
  backgroundColor: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#FFFFFF",
  },
  textTransform: "none",
  fontWeight: "bold",
  variant: "subtitle1",
}));

export default function UserMini() {
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
        pl: 2,
        pt: 2,
        pr: 2,
        pb: 3,
        borderRadius: 5,
        boxShadow: 5,
      }}
    >
      <Box
        sx={{
          height: 180,
          background: `url(https://via.placeholder.com/400x225) no-repeat center`,
          backgroundSize: "cover",
          borderRadius: "12px 12px 0 0",
        }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          position: "relative",
        }}
      >
        <Avatar
          sx={{
            width: 130,
            height: 130,
            border: "4px solid white",
            position: "absolute",
            top: -65,
            left: 5,
          }}
        />
        <Box sx={{ ml: 18 }}>
          <Box sx={{ display: "flex", gap: 2, mt: 0.6, alignItems: "center" }}>
            <Typography variant="h5" fontWeight="bold">
              Hoshino Ichika
            </Typography>
            <FollowButton variant="contained">Follow</FollowButton>
          </Box>
          <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
            <Typography variant="body2">
              <strong>3</strong> Following
            </Typography>
            <Typography variant="body2">
              <strong>5</strong> Followers
            </Typography>
          </Box>
        </Box>
        <Box sx={{ position: "absolute", right: -10 }}>
          <IconButton
            aria-label="more"
            id="menuButton"
            aria-controls={open ? "menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
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
            <MenuItem key="Ban" onClick={handleClose}>
              Ban
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Typography sx={{ lineHeight: "24px", mt: 2, ml: 3 }}>
        biography biography biography biography
      </Typography>
    </Box>
  );
}
