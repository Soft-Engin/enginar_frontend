import React, { useState } from "react";
import { Typography, Divider, TextField, Button, Box } from "@mui/material";
import { Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";

import SettingsIcon from "@mui/icons-material/Settings";

import RecommendedUsers from "./RecommendedUsers";
import UpcomingEvents from "./UpcomingEvents";

const SettingsPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const handleSave = () => {
    alert("Settings saved!");
  };

  const handleCancel = () => {
    setEmail("");
    setUsername("");
    setNotificationsEnabled(true);
    setPrivacySetting(false);
  };

  return (
    <Box
      maxWidth="md"
      sx={{ width: { xs: "40%", sm: "60%", md: "80%", lg: "80%", xl: "100%" }, margin: "0 auto", marginTop: 4, borderRadius: 3, outline: "1.5px solid #959595", backgroundColor: "#BEDDA3", boxShadow: 5 }}
    >
      <Box sx={{ display: "flex", pt: 2, pl: 2 }}>
        <SettingsIcon sx={{ fontSize: 40, mr: 1}} />
      </Box>

      <Box sx={{ pt: 2, pl: 2 }}>
        <Typography variant="h6">Profile Settings</Typography>
        <Divider sx={{ marginBottom: 2}} />

        <TextField
          label="Change Username"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2, pr: 2 }}
        />

        <TextField
          label="Change Email"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2, pr: 2 }}
        />

        <TextField
          label="Change Password"
          variant="outlined"
          fullWidth
          sx={{ marginBottom: 2, pr: 2 }}
        />
      </Box>

      <Box sx={{ pt: 2, pl: 2 }}>
        <Typography variant="h6">Allergen / Preferences Selection</Typography>
        <Divider sx={{ marginBottom: 2 }} />
      </Box>

      <Box sx={{ pt: 2, pl: 2 }}>
        <Typography variant="h6">Ne koyulacaksa</Typography>
        <Divider sx={{ marginBottom: 2 }} />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
          pb: 2,
          pr: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleCancel}
          startIcon={<CancelIcon />}
        >
          Cancel
        </Button>
      </Box>
      <RecommendedUsers />
      <UpcomingEvents />
    </Box>
  );
};

export default SettingsPage;