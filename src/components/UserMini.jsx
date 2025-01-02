import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Typography,
  Box,
  Avatar,
  Button,
  CircularProgress,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link } from "react-router-dom";
import axios from "axios";
import FollowersListPopup from "./FollowersListPopup";
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
  variant: "subtitle1",
}));

export default function UserMini({ user }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
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
  const isOwnProfile =
    JSON.parse(localStorage.getItem("userData"))?.userId === user.userId;

  const profilePlaceholder = user?.firstName
    ? user.firstName.charAt(0).toUpperCase()
    : "?";
  const bannerPlaceholder = "#ffffff";

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const picResponse = await axios.get(
          `/api/v1/users/${user.userId}/profile-picture`,
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
          `/api/v1/users/${user.userId}/banner`,
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
      } finally {
        setLoading(false);
      }
    };

    const fetchFollowCounts = async () => {
      try {
        const followersResponse = await axios.get(
          `/api/v1/users/${user.userId}/followers?pageSize=1`
        );
        if (followersResponse.status === 200) {
          setFollowersCount(followersResponse.data.totalCount);
        }
        const followingResponse = await axios.get(
          `/api/v1/users/${user.userId}/following?pageSize=1`
        );
        if (followingResponse.status === 200) {
          setFollowingCount(followingResponse.data.totalCount);
        }
      } catch (error) {
        console.error("Error fetching follow counts: ", error);
      }
    };

    fetchImages();
    fetchFollowCounts();
  }, [user.userId]);

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
      user.userId !== loggedInUserData?.userId &&
      loggedInUserFollowing
    ) {
      const isFollowing = loggedInUserFollowing.some(
        (following) => following.userId === user.userId
      );
      setIsFollowing(isFollowing);
    } else {
      setIsFollowing(false);
    }
  }, [loggedInUserFollowing, user.userId, loggedInUserData]);

  const handleFollowUser = async () => {
    try {
      const response = await axios.post(
        `/api/v1/users/follow?targetUserId=${user.userId}`
      );
      if (response.status === 200) {
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
        setLoggedInUserFollowing((prev) => [...prev, { userId: user.userId }]);
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
        `/api/v1/users/unfollow?targetUserId=${user.userId}`
      );
      if (response.status === 200) {
        setIsFollowing(false);
        setFollowersCount((prev) => prev - 1);
        setLoggedInUserFollowing((prev) =>
          prev.filter((following) => following.userId !== user.userId)
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

  useEffect(() => {
    // This runs when the component unmounts or userId changes
    return () => {
      setFollowersPopupOpen(false);
      setFollowingPopupOpen(false);
    };
  }, [user.userId]);

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
          height: 170,
          background: `url(${bannerPic || bannerPlaceholder}) no-repeat center`,
          bgcolor: "#A5E072",
          backgroundSize: "cover",
          boxShadow: 2,
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
            bgcolor: profilePic ? "transparent" : "#A5E072",
            boxShadow: 2,
            fontSize: "3rem",
          }}
        >
          {!profilePic && profilePlaceholder}
          {profilePic && (
            <Avatar src={profilePic} sx={{ width: "100%", height: "100%" }} />
          )}
        </Avatar>
        <Box sx={{ ml: 18 }}>
          <Box sx={{ display: "flex", gap: 2, mt: 0.6, alignItems: "center" }}>
            <Link
              to={`/profile?id=${user.userId}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                {user.firstName} {user.lastName}
              </Typography>
            </Link>
            {!isOwnProfile &&
              (isFollowing ? (
                <FollowButton variant="contained" onClick={handleUnfollowUser}>
                  Unfollow
                </FollowButton>
              ) : (
                <FollowButton variant="contained" onClick={handleFollowUser}>
                  Follow
                </FollowButton>
              ))}
          </Box>
          <Typography variant="body2" color="textSecondary" sx={{ ml: 0.2 }}>
            {user.userName}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
            <Typography
              variant="body2"
              onClick={handleFollowingPopupOpen}
              sx={{ cursor: "pointer" }}
            >
              <strong>{followingCount}</strong> Following
            </Typography>
            <Typography
              variant="body2"
              onClick={handleFollowersPopupOpen}
              sx={{ cursor: "pointer" }}
            >
              <strong>{followersCount}</strong> Followers
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
      <FollowersListPopup
        open={followersPopupOpen}
        handleClose={handleFollowersPopupClose}
        userId={user.userId}
      />
      <FollowingListPopup
        open={followingPopupOpen}
        handleClose={handleFollowingPopupClose}
        userId={user.userId}
      />
    </Box>
  );
}
