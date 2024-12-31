import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserListItemContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#FFFFFF",
  borderRadius: 5,
  boxShadow: 2,
  padding: theme.spacing(1), // Increased padding for better spacing
  outline: "1.5px solid #C0C0C0",
    cursor: 'pointer', // Change cursor to pointer on hover
    transition: 'background-color 0.1s ease', // Smooth transition for hover
    "&:hover": { // Add hover effect
        backgroundColor: '#f0f0f0', // Slight background color change on hover
    },
}));

const UserListItem = ({ user }) => {
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfilePic = async () => {
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
        console.error("Error fetching profile pic:", error);
        setProfilePic(null);
      }
    };
    fetchProfilePic();
  }, [user.userId]);

  const handleUserClick = () => {
    navigate(`/profile?id=${user.userId}`);
  };

  const profilePlaceholder = user?.userName
    ? user.userName.charAt(0).toUpperCase()
    : "?";

  return (
    <UserListItemContainer data-testid="user-list-item" onClick={handleUserClick}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          data-testid="user-avatar"
          sx={{
            width: 40,
            height: 40,
            bgcolor: profilePic ? "transparent" : "grey",
          }}
        >
          {!profilePic && profilePlaceholder}
          {profilePic && (
            <Avatar data-testid="user-avatar-image" src={profilePic} sx={{ width: "100%", height: "100%" }} />
          )}
        </Avatar>
        <Typography data-testid="user-username" sx={{ fontWeight: "medium", fontSize: "18px" }}>
          {user.userName}
        </Typography>
      </Box>
    </UserListItemContainer>
  );
};

export default UserListItem;