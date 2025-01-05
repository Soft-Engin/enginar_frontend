import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Typography,
  Box,
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link } from "react-router-dom";
import axios from "axios";
import FollowersListPopup from "./FollowersListPopup";
import FollowingListPopup from "./FollowingListPopup";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [userInitials, setUserInitials] = useState("");

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
      const response = await axios.delete(`/api/v1/users/${user.userId}`);

      if (response.status === 200) {
        console.log(`User ${user.userId} banned successfully.`);
        navigate("/");
        // Remove user from UI or provide user feedback on successful ban
      } else {
        console.error(
          `Failed to ban user ${user.userId}. Status: ${response.status}`
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
      setBanDialogOpen(false);
      handleClose();
    }
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
  const [userLogged] = useState(localStorage.getItem("userLogged") === "true");
  let isAdmin = loggedInUserData?.roleName === "Admin";

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

  const generateInitials = (userName) => {
    const nameParts = userName.split(" ");
    return (
      nameParts.map((part) => part.charAt(0).toUpperCase()).join("") ||
      userName.charAt(0).toUpperCase()
    );
  };

  useEffect(() => {
    if (user && user.userName) {
      setUserInitials(generateInitials(user.userName));
    }
  }, [user]);

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
        {profilePic ? (
          <Avatar
            src={profilePic}
            sx={{
              width: 130,
              height: 130,
              border: "4px solid white",
              position: "absolute",
              top: -65,
              left: 5,
              bgcolor: "transparent",
              boxShadow: 2,
            }}
            onError={() => setProfilePic(null)}
          />
        ) : (
          <Box
            sx={{
              width: 130,
              height: 130,
              borderRadius: "50%",
              backgroundColor: "#A5E072",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "3rem",
              fontWeight: "bold",
              border: "4px solid white",
              position: "absolute",
              top: -65,
              left: 5,
              boxShadow: 2,
            }}
          >
            {userInitials}
          </Box>
        )}
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
              <Typography data-testid="user-name" variant="h5" fontWeight="bold">
                {user.firstName} {user.lastName}
              </Typography>
            </Link>
            {!isOwnProfile &&
              (userLogged ? (
                isFollowing ? (
                  <FollowButton
                    data-testid="follow-button"
                    variant="contained"
                    onClick={handleUnfollowUser}
                  >
                    Unfollow
                  </FollowButton>
                ) : (
                  <FollowButton variant="contained" onClick={handleFollowUser}>
                    Follow
                  </FollowButton>
                )
              ) : null)}
          </Box>
          <Typography variant="body2" color="textSecondary" sx={{ ml: 0.2 }}>
            {user.userName}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
            <Typography
              data-testid="following-count"
              variant="body2"
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
        {userLogged && isAdmin && !isOwnProfile && (
          <Box sx={{ position: "absolute", right: -10 }}>
            <IconButton
              data-testid="more-button"
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
              <MenuItem data-testid="ban-menu-item" key="Ban" onClick={handleBanOpen}>
                Ban
              </MenuItem>
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
                <Typography>Are you sure you want to ban this user?</Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  data-testid="cancel-ban-button"
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
                  data-testid="confirm-ban-button"
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
