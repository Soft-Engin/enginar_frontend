import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import BannerImg from "../assets/bg2.jpeg";
import RecipeMini from "./RecipeMini";
import BlogMini from "./BlogMini";
import ProfileEditDialog from "./ProfileEditDialog"; 
import EventCompressed from "./EventCompressed";
import FollowersListPopup from "./FollowersListPopup"
import FollowingListPopup from "./FollowingListPopup";

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
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
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

const UserProfile = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");

  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [value, setValue] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [following, setFollowing] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [userResponse, blogsResponse, recipesResponse] =
          await Promise.all([
            axios.get(`/api/v1/user/GetUser/${userId}`),
            axios.get(`/api/v1/blog/search`, {
              params: { userId: userId, pageSize: 5 },
            }),
            axios.get("/api/v1/recipes/search", {
              params: { userId: userId, pageSize: 5 },
            }),
          ]);

        setProfileData(userResponse.data);
        setUserPosts(blogsResponse.data.items);
        setUserRecipes(recipesResponse.data.items);

        // Check if the user is already followed
        const followedUser = blogsResponse.data.items?.find(
          (item) => item.id === userId
        );
        if (followedUser) {
          setFollowing(true);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleFollowUser = async () => {
    try {
      const response = await axios.post(
        `/api/v1/user/follow?targetUserld=${userId}`
      );
      if (response.status === 200) {
        setFollowing(true);
      }
    } catch (error) {
      console.error("Error follow user:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to follow the user."
      );
    }
  };

  const handleUnfollowUser = async () => {
    try {
      const response = await axios.delete(
        `/api/v1/user/unfollow?targetUserld=${userId}`
      );
      if (response.status === 200) {
        setFollowing(false);
      }
    } catch (error) {
      console.error("Error unfollow user:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to unfollow the user."
      );
    }
  };

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
    setProfileData((prevData) => ({
      ...updatedProfile,
      following: prevData?.following,
      followers: prevData?.followers,
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minWidth: "730px",
        maxWidth: "730px",
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
              background: `url(${
                profileData?.coverImage || BannerImg
              }) no-repeat center`,
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
                src={profileData?.profileImage || "/pp3.jpeg"}
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
                    {profileData.firstName} {profileData.lastName}
                  </Typography>
                  {userId !== localStorage.getItem("userId") ? (
                    following ? (
                      <FollowButton
                        variant="contained"
                        onClick={handleUnfollowUser}
                      >
                        Unfollow
                      </FollowButton>
                    ) : (
                      <FollowButton
                        variant="contained"
                        onClick={handleFollowUser}
                      >
                        Follow
                      </FollowButton>
                    )
                  ) : null}
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
                  {userId === localStorage.getItem("userId") || true ? (
                    <MenuItem key="Edit" onClick={handleEditProfile}>
                      Edit Profile
                    </MenuItem>
                  ) : null}
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
      <FollowersListPopup open={followersPopupOpen} handleClose={handleFollowersPopupClose} />
      <FollowingListPopup open={followingPopupOpen} handleClose={handleFollowingPopupClose} />
    </Box>
  );
};

export default UserProfile;
