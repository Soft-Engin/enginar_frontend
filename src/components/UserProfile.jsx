import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Stack from "@mui/material/Stack";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Card,
  CardContent,
} from "@mui/material";

import BannerImg from "../assets/bg2.jpeg";
import RecipeMini from "./RecipeMini";
import BlogMini from "./BlogMini";
import ProfileEditDialog from "./ProfileEditDialog"; 
import EventCompressed from "./EventCompressed";
import FollowersListPopup from "./FollowersListPopup"
import FollowingListPopup from "./FollowingListPopup";
import RecommendedUsers from "./RecommendedUsers";
import UpcomingEvents from "./UpcomingEvents";

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
  variant: "subtitle1"
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
  },
  {
    id: 2,
    content:
      "Excited about the latest advancements in machine learning and natural language processing.",
    likes: 2345,
    comments: 78,
  },
  {
    id: 3,
    content:
      "Ethics in AI is crucial. We must always prioritize human values and safety.",
    likes: 3456,
    comments: 99,
  },
  {
    id: 4,
    content:
      "Collaborating with researchers to push the boundaries of AI capabilities.",
    likes: 1567,
    comments: 45,
  },
];

const UserProfile = () => {
  const [profileData, setProfileData] = useState({
    name: "Hoshino Ichika",
    username: "adl",
    bio: "GOING 8TH CHECKLIST: I already won the game ✔ This lobby's playing for second ✔ This is my last loss ✔ I win out from here ✔ My board is too lit ✔ HP is fake ✔ I'm about to spike hard ✔ That's a fake loss ✔ 20hp? That's 3 lives ✔ This game is over ✔ We win out ✔",
    following: 42,
    followers: 1500000,
    coverImage: BannerImg,
    profileImage: "/pp3.jpeg",
  });

  const [value, setValue] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const open = Boolean(anchorEl);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditProfile = () => {
    setEditDialogOpen(true);
    handleClose(); // Close the options menu
  };

  const handleUpdateProfile = (updatedProfile) => {
    setProfileData(prevData => ({
      ...updatedProfile,
      following: prevData.following,
      followers: prevData.followers
    }));
  };

  const [followingPopupOpen, setFollowingPopupOpen] = React.useState(false);
  const [followersPopupOpen, setFollowersPopupOpen] = React.useState(false);
    
  const handleFollowingPopupOpen = () => {
    setFollowingPopupOpen(true);
  };

  const handleFollowingPopupClose = () => {
    setFollowingPopupOpen(false);
  };

  const handleFollowersPopupOpen = () => {
    setFollowersPopupOpen(true);
  };

  const handleFollowersPopupClose = () => {
    setFollowersPopupOpen(false);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          scale: { xs: "70%", sm: "70%", md: "80%", lg: "84%", xl: "100%" },
          transformOrigin: "top",
          width: { lg: "90%", xl: "100%" }, 
          margin: "0 auto",
          maxWidth: "730px"
        }}
      >
        {/* Profile Edit Dialog */}
        <ProfileEditDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          profileData={profileData}
          onProfileUpdate={handleUpdateProfile}
        />

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
                    <Typography variant="body2" onClick={handleFollowingPopupOpen} sx={{ cursor: "pointer" }}>
                      <strong>{profileData.following}</strong> Following
                    </Typography>
                    <Typography variant="body2" onClick={handleFollowersPopupOpen} sx={{ cursor: "pointer" }}>
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
                    <MenuItem key="Edit" onClick={handleEditProfile}>
                      Edit Profile
                    </MenuItem>
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
            <Box sx={{ width: "100%", pb: 2 }}>
              <Box sx={{ borderTop: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  centered
                  textColor="secondary"
                  indicatorColor="secondary"
                >
                  <Tab label="Blogs" {...a11yProps(0)} />
                  <Tab label="Events" {...a11yProps(1)} />
                  <Tab label="Recipes" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <Stack spacing={2} direction={"column"} alignItems={"center"}>
                  {randomPosts.map((post) => (
                    <BlogMini
                      key={post.id}
                      content={post.content}
                      likes={post.likes}
                      comments={post.comments}
                    />
                  ))}
                </Stack>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Stack spacing={2} direction={"column"} alignItems={"center"}>
                    <EventCompressed />
                    <EventCompressed />
                  </Stack>
                </Box>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Stack spacing={2} direction={"column"} alignItems={"center"}>
                    <RecipeMini />
                    <RecipeMini />
                  </Stack>
                </Box>
              </CustomTabPanel>
            </Box>
          </Card>
        </Box>
      </Box>
      <FollowersListPopup open={followersPopupOpen} handleClose={handleFollowersPopupClose} />
      <FollowingListPopup open={followingPopupOpen} handleClose={handleFollowingPopupClose} />
      <RecommendedUsers />
      <UpcomingEvents />
    </Box>
  );
};

export default UserProfile;