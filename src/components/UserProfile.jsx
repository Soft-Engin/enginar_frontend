import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import ProfileEditDialog from "./ProfileEditDialog";
import UserBlogsTab from "./UserBlogsTab";
import UserEventsTab from "./UserEventsTab";
import UserRecipesTab from "./UserRecipesTab";
import FollowersListPopup from "./FollowersListPopup";
import FollowingListPopup from "./FollowingListPopup";
import RecommendedUsers from "./RecommendedUsers";
import UpcomingEvents from "./UpcomingEvents";
import { useNavigate, useSearchParams } from "react-router-dom";
import RecomEventsBox from "./RecomEventsBox";

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
      {value === index && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {children}
        </Box>
      )}
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
  const navigate = useNavigate();
  const userId = searchParams.get("id");

  const [profileData, setProfileData] = useState(null);
  const [value, setValue] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const open = Boolean(anchorEl);

  const [loggedInUserData, setLoggedInUserData] = useState(
    localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : null
  );
  const [profilePic, setProfilePic] = useState(null);
  const [bannerPic, setBannerPic] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loggedInUserFollowing, setLoggedInUserFollowing] = useState([]);
  const [followingPopupOpen, setFollowingPopupOpen] = React.useState(false);
  const [followersPopupOpen, setFollowersPopupOpen] = React.useState(false);
  const [userLogged] = useState(localStorage.getItem("userLogged") === "true");
  let isAdmin = loggedInUserData?.roleName === "Admin";

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userResponse = await axios.get(`/api/v1/users/${userId}`);
        setProfileData(userResponse.data);
        try {
          const picResponse = await axios.get(
            `/api/v1/users/${userId}/profile-picture`,
            { responseType: "blob" }
          );
          if (picResponse.status === 200) {
            const imageUrl = URL.createObjectURL(picResponse.data);
            setProfilePic(imageUrl);
          } else {
            setProfilePic(null);
          }
        } catch (error) {
          console.error("Error fetching profile pic: ", error);
          setProfilePic(null);
        }
        try {
          const bannerResponse = await axios.get(
            `/api/v1/users/${userId}/banner`,
            {
              responseType: "blob",
            }
          );
          if (bannerResponse.status === 200) {
            const imageUrl = URL.createObjectURL(bannerResponse.data);
            setBannerPic(imageUrl);
          } else {
            setBannerPic(null);
          }
        } catch (error) {
          console.error("Error fetching profile pic: ", error);
          setBannerPic(null);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    const fetchFollowCounts = async () => {
      try {
        const followersResponse = await axios.get(
          `/api/v1/users/${userId}/followers?pageSize=1`
        );
        if (followersResponse.status === 200) {
          setFollowersCount(followersResponse.data.totalCount);
        }
        const followingResponse = await axios.get(
          `/api/v1/users/${userId}/following?pageSize=1`
        );
        if (followingResponse.status === 200) {
          setFollowingCount(followingResponse.data.totalCount);
        }
      } catch (error) {
        console.error("Error fetching follow counts: ", error);
      }
    };
  
    fetchUserData();
    fetchFollowCounts();
  }, [userId]);

  useEffect(() => {
    const fetchLoggedInUserFollowing = async () => {
      if (loggedInUserData?.userId) {
        try {
          const response = await axios.get(
            `/api/v1/users/${loggedInUserData?.userId}/following?pageSize=100`
          );
          if (response.status === 200) {
            setLoggedInUserFollowing(response.data.items);
          }
        } catch (error) {
          console.error(
            "Error fetching logged in user's following list: ",
            error
          );
        }
      }
    };
    fetchLoggedInUserFollowing();
  }, [loggedInUserData]);

  useEffect(() => {
    if (
      loggedInUserData?.userId &&
      userId !== loggedInUserData?.userId &&
      loggedInUserFollowing
    ) {
      const isFollowing = loggedInUserFollowing.some(
        (following) => following.userId === userId
      );
      setIsFollowing(isFollowing);
    } else {
      setIsFollowing(false);
    }
  }, [loggedInUserFollowing, userId, loggedInUserData]);

  const handleFollowUser = async () => {
    try {
      const response = await axios.post(
        `/api/v1/users/follow?targetUserId=${userId}`
      );
      if (response.status === 200) {
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
        setLoggedInUserFollowing((prev) => [...prev, { userId }]);
      }
    } catch (error) {
      console.error("Error following user:", error);
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
        `/api/v1/users/unfollow?targetUserId=${userId}`
      );
      if (response.status === 200) {
        setIsFollowing(false);
        setFollowersCount((prev) => prev - 1);
        setLoggedInUserFollowing((prev) =>
          prev.filter((following) => following.userId !== userId)
        );
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
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
  
  const handleBanOpen = () => {
    setBanDialogOpen(true);
  };

  const handleBanClose = () => {
    setBanDialogOpen(false);
    handleClose();
  };

  const handleBanConfirm = async () => {
    try {
      const response = await axios.delete(`/api/v1/users/${userId}`);

      if (response.status === 200) {
        console.log(`User ${userId} banned successfully.`);
        navigate("/");
        // Remove user from UI or provide user feedback on successful ban
      } else {
        console.error(
          `Failed to ban user ${userId}. Status: ${response.status}`
        );
        setError(`Failed to ban user. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error banning user:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to ban the user."
      );
    } finally {
      setBanDialogOpen(false); // Close the dialog after either success or error.
      handleClose();
    }
  };

  const handleEditProfile = () => {
    setEditDialogOpen(true);
    handleClose();
  };

  const handleUpdateProfile = (updatedProfile) => {
    setProfileData((prevData) => ({
      ...updatedProfile,
      following: prevData?.following,
      followers: prevData?.followers,
    }));
  };

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

  useEffect(() => {
    // This runs when the component unmounts or userId changes
    return () => {
      setFollowersPopupOpen(false);
      setFollowingPopupOpen(false);
    };
  }, [userId]);

  if (loading) {
    return (
      <Box
        data-testid="user-profile-loading"
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
        data-testid="user-profile-error"
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }
  const isOwnProfile =
    JSON.parse(localStorage.getItem("userData"))?.userId === userId;

  const profilePlaceholder = profileData?.firstName
    ? profileData.firstName.charAt(0).toUpperCase()
    : "?";
  const bannerPlaceholder = "#ffffff";

  return (
    <Box>
      <Box
        data-testid="user-profile-container"
        sx={{
          display: "flex",
          flexDirection: "column",
          scale: { xs: "70%", sm: "80%", md: "95%", lg: "95%", xl: "100%" },
          transformOrigin: "top",
          width: { md: 650, lg: 620, xl: 730 },
          margin: "0 auto",
        }}
      >
        {/* Profile Edit Dialog */}
        <ProfileEditDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          profileData={profileData}
          profilePic={profilePic}
          bannerPic={bannerPic}
          onProfileUpdate={handleUpdateProfile}
        />

        {/* Profile Column */}
        <Box>
          <Card
            sx={{
              position: "relative",
              overflow: "visible",
              backgroundColor: "#E9F6BC",
              outline: "1px solid rgb(196, 196, 196)",
            }}
          >
            {/* Cover Image */}
            <Box
              sx={{
                height: 225,
                background: `url(${
                  bannerPic || bannerPlaceholder
                }) no-repeat center`,
                bgcolor: "#A5E072",
                backgroundSize: "cover",
                boxShadow: 2,
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
                  sx={{
                    width: 150,
                    height: 150,
                    border: "4px solid white",
                    position: "absolute",
                    top: -90,
                    left: 0,
                    bgcolor: profilePic ? "transparent" : "#A5E072",
                    boxShadow: 2,
                    fontSize: "4rem",
                    fontWeight: "bold",
                  }}
                >
                  {!profilePic && profilePlaceholder}
                  {profilePic && (
                    <Avatar
                      src={profilePic}
                      sx={{ width: "100%", height: "100%" }}
                    />
                  )}
                </Avatar>
                <Box sx={{ mt: -2, ml: 20 }}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mt: 1,
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h4" fontWeight="bold">
                      {profileData.firstName} {profileData.lastName}
                    </Typography>
                    {!isOwnProfile &&
                      (userLogged ? (
                        isFollowing ? (
                          <FollowButton
                            data-testid="unfollow-button"
                            variant="contained"
                            onClick={handleUnfollowUser}
                          >
                            Unfollow
                          </FollowButton>
                        ) : (
                          <FollowButton
                            data-testid="follow-button"
                            variant="contained"
                            onClick={handleFollowUser}
                          >
                            Follow
                          </FollowButton>
                        )
                      ) : null)}
                  </Box>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ ml: 0.2 }}
                  >
                    {profileData.userName}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                    <Typography
                      variant="body2"
                      data-testid="following-count"
                      onClick={handleFollowingPopupOpen}
                      sx={{ cursor: "pointer" }}
                    >
                      <strong>{followingCount}</strong> Following
                    </Typography>
                    <Typography
                      data-testid="followers-count"
                      variant="body2"
                      onClick={handleFollowersPopupOpen}
                      sx={{ cursor: "pointer" }}
                    >
                      <strong>{followersCount}</strong> Followers
                    </Typography>
                  </Box>
                </Box>
                {(isOwnProfile || isAdmin) && (
                  <Box sx={{ position: "absolute", right: -10, mt: -1 }}>
                    <IconButton
                      data-testid="profile-menu-button"
                      aria-label="more"
                      id="menuButton"
                      aria-controls={open ? "menu" : undefined}
                      aria-expanded={open ? "true" : undefined}
                      aria-haspopup="true"
                      onClick={handleClick}
                    >
                      <MoreVertIcon sx={{ fontSize: "30px" }} />
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
                      {isOwnProfile ? (
                        <MenuItem key="Edit" onClick={handleEditProfile} data-testid="edit-bio-button">
                          Edit Profile
                        </MenuItem>
                      ) : isAdmin ? (
                        <MenuItem key="Ban" onClick={handleBanOpen}>
                          Ban
                        </MenuItem>
                      ) : null}
                    </Menu>
                    <Dialog
                      open={banDialogOpen}
                      onClose={handleBanClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                      PaperProps={{
                        sx: {
                          width: { xs: 250, sm: 400 },
                          borderRadius: 4,
                          backgroundColor: "#C8EFA5",
                          padding: 0.5,
                        },
                      }}
                    >
                      <DialogTitle sx={{ fontWeight: "bold" }}>
                        Confirm Ban
                      </DialogTitle>
                      <DialogContent>
                        <Typography>
                          Are you sure you want to ban this user?
                        </Typography>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={handleBanClose}
                          sx={{
                            backgroundColor: "#C8EFA5",
                            color: "black",
                            ":hover": {
                              backgroundColor: "#C8EFA5",
                            },
                            borderRadius: 20,
                            marginTop: 2,
                            display: "block",
                            marginLeft: "auto",
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleBanConfirm}
                          variant="contained"
                          sx={{
                            backgroundColor: "#cc0000",
                            color: "error",
                            ":hover": {
                              backgroundColor: "#cc0000",
                            },
                            borderRadius: 20,
                            marginTop: 2,
                            display: "block",
                            marginLeft: "auto",
                            fontWeight: "bold",
                          }}
                        >
                          Confirm Ban
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Box>
                )}
              </Box>

              {/* Profile Info */}
              <Box>
                <Typography sx={{ mt: 1, ml: 2 }}>{profileData.bio}</Typography>
              </Box>
            </CardContent>
            {/* User Content */}
            <Box sx={{ width: "100%", pb: 2, px: 2 }}>
              <Box sx={{ borderTop: 1, borderColor: "divider", mb: 1 }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  centered
                  sx={{
                    "& .MuiTabs-indicator": {
                      backgroundColor: "#4B9023",
                    },
                    "& .MuiTab-root": {
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      padding: "12px 20px",
                    },
                    "& .MuiTab-root.Mui-selected": {
                      color: "#4B9023",
                    },
                    "& .MuiTab-root:hover": {
                      color: "#66c72e",
                    },
                  }}
                >
                  <Tab label="Blogs" {...a11yProps(0)} />
                  <Tab label="Events" {...a11yProps(1)} />
                  <Tab label="Recipes" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <UserBlogsTab />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <UserEventsTab />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <UserRecipesTab />
              </CustomTabPanel>
            </Box>
          </Card>
        </Box>
      </Box>
      <FollowersListPopup
        open={followersPopupOpen}
        handleClose={handleFollowersPopupClose}
        userId={userId}
      />
      <FollowingListPopup
        open={followingPopupOpen}
        handleClose={handleFollowingPopupClose}
        userId={userId}
      />
      <RecomEventsBox/>
    </Box>
  );
};

export default UserProfile;
