import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Avatar, 
  Box,
  IconButton
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';

const ProfileEditDialog = ({ 
  open, 
  onClose, 
  profileData, 
  onProfileUpdate 
}) => {
  const [editedProfile, setEditedProfile] = useState({
    name: profileData.name,
    bio: profileData.bio,
    profileImage: profileData.profileImage,
    coverImage: profileData.coverImage
  });

  const handleChange = (prop) => (event) => {
    setEditedProfile({ ...editedProfile, [prop]: event.target.value });
  };

  const handleImageChange = (prop) => (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditedProfile({ 
          ...editedProfile, 
          [prop]: e.target.result 
        });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleSave = () => {
    onProfileUpdate(editedProfile);
    onClose();
  };

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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Cover Image Edit */}
          <Box 
            sx={{ 
              height: 200, 
              background: `url(${editedProfile.coverImage}) no-repeat center`,
              backgroundSize: 'cover',
              position: 'relative',
              mb: 2,
              borderRadius: 2,
            }}
          >
            <input
              type="file"
              accept="image/*"
              id="cover-image-upload"
              style={{ display: "none" }}
              onChange={handleImageChange('coverImage')}
            />
            <label htmlFor="cover-image-upload">
              <Button
                component="span"
                sx={{ 
                  position: 'absolute', 
                  bottom: 10, 
                  right: 10,
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                  }
                }}
              >
                Change Cover
              </Button>
            </label>
          </Box>

          {/* Profile Picture Edit */}
          <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <Avatar
              src={editedProfile.profileImage}
              sx={{ width: 120, height: 120, border: '4px solid white' }}
            />
            <input
              type="file"
              accept="image/*"
              id="profile-image-upload"
              style={{ display: "none" }}
              onChange={handleImageChange('profileImage')}
            />
            <label htmlFor="profile-image-upload">
              <IconButton
                component="span"
                sx={{ 
                  position: 'absolute', 
                  bottom: -10, 
                  right: '40%',
                  backgroundColor: 'white',
                  '&:hover': { 
                    backgroundColor: 'rgba(0,0,0,0.1)' 
                  }
                }}
              >
                <PhotoCameraIcon />
              </IconButton>
            </label>
          </Box>

          {/* Name Edit */}
          <TextField
            fullWidth
            label="Name"
            value={editedProfile.name}
            onChange={handleChange('name')}
            variant="outlined"
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
            }}
          />

          {/* Bio Edit */}
          <TextField
            fullWidth
            label="Bio"
            value={editedProfile.bio}
            onChange={handleChange('bio')}
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