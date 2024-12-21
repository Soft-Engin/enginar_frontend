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
import ProfileEditDialog from "./ProfileEditDialog";
import { useSearchParams } from "react-router-dom";
import RecipeMini from "./RecipeMini";
import BlogMini from "./BlogMini";

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

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!profileData) {
    return (
      <Typography textAlign={"center"}>User profile not found!</Typography>
    );
  }
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
                  <Typography variant="body2">
                    <strong>{profileData.following?.length}</strong> Following
                  </Typography>
                  <Typography variant="body2">
                    <strong>{profileData.followers?.length}</strong> Followers
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
                <Tab label="Post" {...a11yProps(0)} />
                <Tab label="Events" {...a11yProps(1)} />
                <Tab label="Recipes" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              {userPosts.map((blog, index) => (
                <Box key={index} sx={{ width: 660, mb: 2 }}>
                  <BlogMini blog={blog} />
                </Box>
              ))}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              {/* TODO: Add event display*/}
              <Typography textAlign={"center"}>No events scheduled</Typography>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              {userRecipes.map((recipe, index) => (
                <Box key={index} sx={{ width: 660, mb: 2 }}>
                  <RecipeMini recipe={recipe} />
                </Box>
              ))}
            </CustomTabPanel>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default UserProfile;
