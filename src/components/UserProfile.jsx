import React from "react";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Card,
  CardContent,
  Paper,
  Divider,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Repeat as RepeatIcon,
  Favorite as FavoriteIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
} from "@mui/icons-material";

import BannerImg from "../assets/bg2.jpeg";

const SharedButton = styled(Button)(({ theme }) => ({
  border: "black",
  borderStyle: "solid",
  borderWidth: "1px",
  height: "25px",
  minWidth: "100px",
  borderRadius: "15px",
}));

const FollowButton = styled(SharedButton)(({ theme }) => ({
  color: "#453E3E",
  backgroundColor: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#FFFFFF",
  },
}));

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 0 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const randomPosts = [
  {
    id: 1,
    content:
      "Just exploring the fascinating world of AI and its potential to help humanity!",
    likes: 1234,
    comments: 56,
    retweets: 89,
  },
  {
    id: 2,
    content:
      "Excited about the latest advancements in machine learning and natural language processing.",
    likes: 2345,
    comments: 78,
    retweets: 123,
  },
  {
    id: 3,
    content:
      "Ethics in AI is crucial. We must always prioritize human values and safety.",
    likes: 3456,
    comments: 99,
    retweets: 210,
  },
  {
    id: 4,
    content:
      "Collaborating with researchers to push the boundaries of AI capabilities.",
    likes: 1567,
    comments: 45,
    retweets: 67,
  },
];

const profileData = {
  name: "Hoshino Ichika",
  username: "adl",
  bio: "GOING 8TH CHECKLIST: I already won the game ✔ This lobby’s playing for second ✔ This is my last loss ✔ I win out from here ✔ My board is too lit ✔ HP is fake ✔ I’m about to spike hard ✔ That’s a fake loss ✔ 20hp? That’s 3 lives ✔ This game is over ✔ We win out ✔",
  following: 42,
  followers: 1500000,
  coverImage: BannerImg,
  profileImage: "/pp3.jpeg",
};

const UserProfile = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
        display: "flex",
        height: "100vh",
        flexDirection: "column",
        minWidth: "730px",
        maxWidth: "730px",
      }}
    >
      {/* Profile Column */}
      <Box>
        <Card
          sx={{
            position: "relative",
            overflow: "visible",
            backgroundColor: "#E9F6BC",
          }}
        >
          {/* Cover Image */}
          <Box
            sx={{
              height: 200,
              background: `url(${profileData.coverImage}) no-repeat center`,
              backgroundSize: "cover",
            }}
          />

          {/* Profile Header */}
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                position: "relative",
              }}
            >
              <Avatar
                src={profileData.profileImage}
                sx={{
                  width: 120,
                  height: 120,
                  border: "4px solid white",
                  position: "absolute",
                  top: -80,
                  left: 0,
                }}
              />
              <Box sx={{ mt: -2, ml: 17 }}>
                <Box
                  sx={{ display: "flex", gap: 2, mt: 1, alignItems: "center" }}
                >
                  <Typography variant="h5" fontWeight="bold">
                    {profileData.name}
                  </Typography>
                  <FollowButton variant="contained">Follow</FollowButton>
                </Box>
                <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                  <Typography variant="body2">
                    <strong>{profileData.following}</strong> Following
                  </Typography>
                  <Typography variant="body2">
                    <strong>{profileData.followers}</strong> Followers
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ position: "absolute", right: -10, mt: -1 }}>
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

            {/* Profile Info */}
            <Box>
              <Typography sx={{ mt: 1, ml: 2 }}>{profileData.bio}</Typography>
            </Box>
          </CardContent>
          {/* User Content */}
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderTop: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                centered
                textColor="secondary"
                indicatorColor="secondary"
              >
                <Tab label="Post" {...a11yProps(0)} />
                <Tab label="Events" {...a11yProps(1)} />
                <Tab label="Recipes" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <Box
                sx={{
                  backgroundColor: "#E9F6BC",
                }}
              >
                {randomPosts.map((post) => (
                  <Paper
                    key={post.id}
                    sx={{
                      m: 2,
                      p: 2,
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Avatar
                        src={profileData.profileImage}
                        sx={{ width: 40, height: 40, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {profileData.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          @{profileData.username}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {post.content}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        color: "text.secondary",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          ml: 1,
                        }}
                      >
                        <FavoriteIcon fontSize="small" />
                        <Typography variant="caption">{post.likes}</Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          ml: 1,
                        }}
                      >
                        <CommentIcon fontSize="small" />
                        <Typography variant="caption">
                          {post.comments}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          ml: 65,
                        }}
                      >
                        <ShareIcon fontSize="small" />
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              Item Two
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              Item Three
            </CustomTabPanel>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default UserProfile;
