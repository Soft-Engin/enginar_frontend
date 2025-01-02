import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { Link } from "react-router-dom";

const SharedButton = styled("button")(({ following }) => ({
  border: "2px solid #888888",
  height: "30px",
  minWidth: "90px",
  borderRadius: "20px",
  color: following ? "#FFFFFF" : "#453E3E",
  backgroundColor: following ? "#888888" : "#FFFFFF",
  fontWeight: "bold",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: following ? "#888888" : "#FFFFFF",
  },
}));

export default function RecommendedUsers() {
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState({});
  const loggedInUserData = JSON.parse(localStorage.getItem("userData"));

  const initializeData = async () => {
    setLoading(true);
    try {
      let followingUsers = [];
      if (loggedInUserData?.userId) {
        const followingResponse = await axios.get(
          `/api/v1/users/${loggedInUserData.userId}/following?pageSize=100`
        );
        followingUsers = followingResponse.data.items || [];
        const followingMap = {};
        followingUsers.forEach((user) => {
          followingMap[user.userId] = true;
        });
        setIsFollowing(followingMap);
      }

      const response = await axios.get("/api/v1/feed/recipe", {
        params: { pageSize: 150 },
      });
      if (response.data?.items) {
        const uniqueUserIds = [];
        const uniqueUsers = [];
        response.data.items.forEach((item) => {
          if (
            !uniqueUserIds.includes(item.userId) &&
            uniqueUserIds.length < 4 &&
            item.userId !== loggedInUserData?.userId && // Check if the user is not the logged in user
            !followingUsers.some(
              (following) => following.userId === item.userId
            )
          ) {
            uniqueUserIds.push(item.userId);
            uniqueUsers.push(item);
          }
        });

        const usersWithProfile = await Promise.all(
          uniqueUsers.map(async (user) => {
            const profilePicResponse = await axios
              .get(`/api/v1/users/${user.userId}/profile-picture`, {
                responseType: "blob",
              })
              .catch(() => null);

            return {
              ...user,
              profilePictureUrl: profilePicResponse?.data
                ? URL.createObjectURL(profilePicResponse.data)
                : null,
            };
          })
        );

        setRecommendedUsers(usersWithProfile);
      }
    } catch (err) {
      console.error("Error initializing data:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await axios.post(`/api/v1/users/follow?targetUserId=${userId}`);
      setIsFollowing((prev) => ({ ...prev, [userId]: true }));
    } catch (err) {
      console.error("Error following user:", err);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await axios.delete(`/api/v1/users/unfollow?targetUserId=${userId}`);
      setIsFollowing((prev) => ({ ...prev, [userId]: false }));
    } catch (err) {
      console.error("Error unfollowing user:", err);
    }
  };

  useEffect(() => {
    initializeData();
    return () => {
      recommendedUsers.forEach((user) => {
        if (user.profilePictureUrl) URL.revokeObjectURL(user.profilePictureUrl);
      });
    };
  }, []);

  return (
    <Card
      sx={{
        position: "fixed",
        top: 115,
        right: { lg: "0.7%", xl: "2.5%" },
        width: 300,
        scale: { xs: "0%", sm: "0%", md: "0%", lg: "85%", xl: "95%" },
        borderRadius: 3,
        outline: "1.5px solid #959595",
        backgroundColor: "#C8EFA5",
        boxShadow: 5,
      }}
    >
      <CardHeader
        title={
          <Typography
            fontWeight="bold"
            sx={{ fontSize: 24, opacity: 0.7, color: "#000000" }}
          >
            Recommended Users
          </Typography>
        }
        sx={{ pb: 0 }}
      />
      {loading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100px"
        >
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100px"
        >
          <Typography color="error">Error: {error}</Typography>
        </Box>
      )}
      {!loading && !error && (
        <List>
          {recommendedUsers.map((user) => (
            <ListItem
              key={user.userId}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pr: 1,
              }}
            >
              <Link
                to={`/profile?id=${user.userId}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ListItemAvatar>
                  <Avatar src={user.profilePictureUrl}>
                    {!user.profilePictureUrl &&
                      user.userName?.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText>
                  <Typography variant="h6" color="black" noWrap>
                    {user.userName}
                  </Typography>
                </ListItemText>
              </Link>
              <SharedButton
                following={isFollowing[user.userId]}
                onClick={() =>
                  isFollowing[user.userId]
                    ? handleUnfollow(user.userId)
                    : handleFollow(user.userId)
                }
              >
                {isFollowing[user.userId] ? "Unfollow" : "Follow"}
              </SharedButton>
            </ListItem>
          ))}
        </List>
      )}
    </Card>
  );
}
