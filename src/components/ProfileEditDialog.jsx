import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Avatar,
  Box,
  IconButton,
  Stack,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const ProfileEditDialog = ({
  open,
  onClose,
  profileData,
  profilePic,
  bannerPic,
  onProfileUpdate,
}) => {
  const [editedProfile, setEditedProfile] = useState({
    userName: profileData?.userName || "",
    email: profileData?.email || "",
    firstName: profileData?.firstName || "",
    lastName: profileData?.lastName || "",
    bio: profileData?.bio || "",
    profileImage: profilePic || null,
    coverImage: bannerPic || null,
  });

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);

  const handleChange = (prop) => (event) => {
    setEditedProfile({ ...editedProfile, [prop]: event.target.value });
  };

  const handleImageChange = (prop) => async (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      if (prop === "profileImage") {
        setProfileImageFile(file);
        reader.onload = (e) => {
          setEditedProfile({
            ...editedProfile,
            [prop]: e.target.result,
          });
        };
      } else if (prop === "coverImage") {
        setCoverImageFile(file);
        reader.onload = (e) => {
          setEditedProfile({
            ...editedProfile,
            [prop]: e.target.result,
          });
        };
      }
      reader.readAsDataURL(file);
    }
  };

  const getBase64String = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSave = async () => {
    const userId = JSON.parse(localStorage.getItem("userData"))?.userId;

    const profileImageBase64 = await getBase64String(profileImageFile);
    const coverImageBase64 = await getBase64String(coverImageFile);

    const mappedData = {
      userName: editedProfile.userName,
      email: editedProfile.email,
      firstName: editedProfile.firstName,
      lastName: editedProfile.lastName,
      bio: editedProfile.bio,
      profileImage: profileImageBase64,
      bannerImage: coverImageBase64,
    };
    try {
      const response = await axios.put(`/api/v1/users/${userId}`, mappedData);
      if (response.status === 200) {
        onProfileUpdate({
          ...profileData,
          userName: mappedData.userName,
          email: mappedData.email,
          firstName: mappedData.firstName,
          lastName: mappedData.lastName,
          bio: mappedData.bio,
          profileImage: editedProfile.profileImage,
          coverImage: editedProfile.coverImage,
        });
        onClose();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  useEffect(() => {
    setEditedProfile({
      userName: profileData?.userName || "",
      email: profileData?.email || "",
      firstName: profileData?.firstName || "",
      lastName: profileData?.lastName || "",
      bio: profileData?.bio || "",
      profileImage: profilePic || null,
      coverImage: bannerPic || null,
    });
  }, [profileData, profilePic, bannerPic]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      PaperProps={{
        sx: {
          width: 620,
          borderRadius: 4,
          backgroundColor: "#C8EFA5",
          padding: 0.5,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "bold",
          color: "#333",
          fontSize: "1.25rem",
        }}
      >
        Edit Profile
        <IconButton
          onClick={onClose}
          sx={{
            color: "#555",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Cover Image Edit */}
          <Box
            sx={{
              height: 200,
              background: `url(${editedProfile.coverImage}) no-repeat center`,
              backgroundSize: "cover",
              position: "relative",
              mb: 2,
              borderRadius: 2,
            }}
          >
            <input
              type="file"
              accept="image/*"
              id="cover-image-upload"
              style={{ display: "none" }}
              onChange={handleImageChange("coverImage")}
            />
            <label htmlFor="cover-image-upload">
              <Button
                component="span"
                sx={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  backgroundColor: "rgba(255,255,255,0.7)",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.9)",
                  },
                }}
              >
                Change Cover
              </Button>
            </label>
          </Box>

          {/* Profile Picture Edit */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Avatar
              src={editedProfile.profileImage}
              sx={{ width: 120, height: 120, border: "4px solid white" }}
            />
            <input
              type="file"
              accept="image/*"
              id="profile-image-upload"
              style={{ display: "none" }}
              onChange={handleImageChange("profileImage")}
            />
            <label htmlFor="profile-image-upload">
              <IconButton
                component="span"
                sx={{
                  position: "absolute",
                  bottom: -10,
                  right: "40%",
                  backgroundColor: "white",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.1)",
                  },
                }}
              >
                <PhotoCameraIcon />
              </IconButton>
            </label>
          </Box>
          {/* User Name and Email Edit */}
          <Stack direction="column" spacing={2}>
            <TextField
              fullWidth
              label="User Name"
              value={editedProfile.userName}
              onChange={handleChange("userName")}
              variant="outlined"
              sx={{
                backgroundColor: "#fff",
                borderRadius: 2,
              }}
            />
            <TextField
              fullWidth
              label="Email"
              value={editedProfile.email}
              onChange={handleChange("email")}
              variant="outlined"
              sx={{
                backgroundColor: "#fff",
                borderRadius: 2,
              }}
            />
            {/* Name Edit */}
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="First Name"
                value={editedProfile.firstName}
                onChange={handleChange("firstName")}
                variant="outlined"
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 2,
                }}
              />
              <TextField
                fullWidth
                label="Last Name"
                value={editedProfile.lastName}
                onChange={handleChange("lastName")}
                variant="outlined"
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 2,
                }}
              />
            </Stack>
          </Stack>

          {/* Bio Edit */}
          <TextField
            fullWidth
            label="Bio"
            value={editedProfile.bio}
            onChange={handleChange("bio")}
            multiline
            rows={4}
            variant="outlined"
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: "#4B9023",
            borderRadius: 20,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            backgroundColor: "#4B9023",
            color: "#fff",
            ":hover": {
              backgroundColor: "#4B9023",
            },
            borderRadius: 20,
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileEditDialog;
