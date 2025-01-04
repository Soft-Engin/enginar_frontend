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
  cursor: "pointer", // Change cursor to pointer on hover
  transition: "background-color 0.1s ease", // Smooth transition for hover
  "&:hover": {
    // Add hover effect
    backgroundColor: "#f0f0f0", // Slight background color change on hover
  },
}));

const UserListItem = ({ user }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [userInitials, setUserInitials] = React.useState("");
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

  const generateInitials = (userName) => {
    const nameParts = userName.split(" ");
    return (
      nameParts.map((part) => part.charAt(0).toUpperCase()).join("") ||
      userName.charAt(0).toUpperCase()
    );
  };

  React.useEffect(() => {
    if (user && user.userName) {
      setUserInitials(generateInitials(user.userName));
    }
  }, [user]);

  const handleUserClick = () => {
    navigate(`/profile?id=${user.userId}`);
  };

  return (
    <UserListItemContainer data-testid="user-list-item" onClick={handleUserClick}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {profilePic ? (
          <Avatar
            data-testid="user-avatar-image"
            src={profilePic}
            sx={{ width: 40, height: 40 }}
            onError={() => setProfilePic(null)}
          />
        ) : (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "#A5E072",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            {userInitials}
          </Box>
        )}
        <Typography data-testid="user-username" sx={{ fontWeight: "medium", fontSize: "18px" }}>
          {user.userName}
        </Typography>
      </Box>
    </UserListItemContainer>
  );
};

export default UserListItem;
