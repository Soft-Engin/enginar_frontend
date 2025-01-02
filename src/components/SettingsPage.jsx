import React, { useState, useEffect } from "react";
import {
  Typography,
  Divider,
  TextField,
  Button,
  Box,
  IconButton,
  Collapse,
  Paper,
  Chip,
  Alert,
  Snackbar,
} from "@mui/material";
import { Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";
import AllergenSelector from "./AllergenPick";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const SettingsPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [showAllergens, setShowAllergens] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isInverted, setIsInverted] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const getStoredInvertMode = () => {
    return localStorage.getItem("isInverted") === "true";
  };

  const setStoredInvertMode = (value) => {
    localStorage.setItem("isInverted", value.toString());
  };

  useEffect(() => {
    const storedMode = getStoredInvertMode();
    setIsInverted(storedMode);

    if (storedMode) {
      document.body.classList.add("invert-mode");
    }

    return () => {
      document.body.classList.remove("invert-mode");
    };
  }, []);

  const toggleInvertMode = () => {
    const newInverted = !isInverted;
    setIsInverted(newInverted);
    if (newInverted) {
      document.body.classList.add("invert-mode");
    } else {
      document.body.classList.remove("invert-mode");
    }
    setStoredInvertMode(newInverted);
  };

  const handleToggleChangePassword = () => {
    setShowChangePassword(!showChangePassword);
  };

  const auth = localStorage.getItem("accessToken");
  const apiVersion = "v1";
  const createAuthHeader = () => {
    return auth ? { Authorization: `Bearer ${auth}` } : {};
  };

  useEffect(() => {
    const fetchSelectedAllergens = async () => {
      try {
        const response = await axios.get(
          `/api/${apiVersion}/users/allergens?page=1&pageSize=10`,
          { headers: createAuthHeader() }
        );
        if (response.data && response.data.items) {
          setSelectedAllergens(response.data.items);
        } else if (
          response.data &&
          response.data.message === "No allergens found for the given user."
        ) {
          setSelectedAllergens([]);
        }
      } catch (error) {
        console.error("Error fetching selected allergens:", error);
      }
    };
    fetchSelectedAllergens();
  }, []);

  const fetchUserEmail = async () => {
    try {
      const response = await axios.get(`/api/${apiVersion}/users/me`, {
        headers: createAuthHeader(),
      });
      if (response.data && response.data.email) {
        setEmail(response.data.email);
        return response.data.email;
      } else {
        setNotification({
          open: true,
          message: "Error fetching user email.",
          severity: "error",
        });
        return null;
      }
    } catch (error) {
      setNotification({
        open: true,
        message: "Error fetching user email.",
        severity: "error",
      });
      console.error("Error fetching user email:", error);
      return null;
    }
  };

  const handleForgotPassword = async () => {
    try {
      const userEmail = await fetchUserEmail();
      if (userEmail) {
        const response = await axios.post(
          `/api/${apiVersion}/auth/forgot-password`,
          {
            email: userEmail,
          }
        );

        if (response.data && response.data.token) {
          setNotification({
            open: true,
            message: response.data.message,
            severity: "success",
          });
          return response.data.token;
        } else {
          setNotification({
            open: true,
            message: "Error getting password reset token.",
            severity: "error",
          });
          return null;
        }
      }
      return null;
    } catch (error) {
      setNotification({
        open: true,
        message: "Error processing request. Please try again.",
        severity: "error",
      });
      console.error("Forgot password error:", error);
      return null;
    }
  };

  const handleChangePassword = async () => {
    try {
      const userEmail = await fetchUserEmail();
      if (userEmail) {
        if (newPassword !== confirmPassword) {
          setNotification({
            open: true,
            message: "New password and confirm password do not match.",
            severity: "error",
          });
          return;
        }
        const token = await handleForgotPassword();
        if (!token) {
          setNotification({
            open: true,
            message: "Please request a password reset token first.",
            severity: "error",
          });
          return;
        }

        const response = await axios.post(
          `/api/${apiVersion}/auth/reset-password`,
          {
            email: userEmail,
            token: token,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
          }
        );
        setNotification({
          open: true,
          message: "Password changed successfully!",
          severity: "success",
        });
        setNewPassword("");
        setConfirmPassword("");
        setShowChangePassword(false);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        let errorMessages = [];
        if (errorData.errors) {
          if (Array.isArray(errorData.errors)) {
            errorMessages = errorData.errors.map(
              (err) => err.description || err
            );
          } else if (typeof errorData.errors === "object") {
            errorMessages = Object.values(errorData.errors).flat();
          }
        } else if (errorData.message) {
          errorMessages.push(errorData.message);
        }

        setNotification({
          open: true,
          message: errorMessages.join("\n"),
          severity: "error",
        });
      } else {
        setNotification({
          open: true,
          message: "Error changing password. Please try again.",
          severity: "error",
        });
      }

      console.error("Change password error:", error);
    }
  };

  const handleAllergenSave = async () => {
    try {
      const allergenIds = selectedAllergens.map((allergen) => allergen.id);
      await axios.post(
        `/api/${apiVersion}/users/allergens`,
        { allergenIds },
        { headers: createAuthHeader() }
      );
      setNotification({
        open: true,
        message: "Settings updated!",
        severity: "success",
      });
      console.log("Settings updated successfully:", { allergenIds });
    } catch (error) {
      setNotification({
        open: true,
        message: "Error updating allergens. Please try again.",
        severity: "error",
      });
      console.error("Error updating allergens:", error);
    }
  };

  const handleCancel = () => {
    setEmail("");
    setUsername("");
    setPassword("");
    setSelectedAllergens([]);
    setNewPassword("");
    setConfirmPassword("");
  };

  const toggleAllergenSection = () => {
    setShowAllergens(!showAllergens);
  };

  const removeAllergen = (id) => {
    setSelectedAllergens(
      selectedAllergens.filter((allergen) => allergen.id !== id)
    );
  };

  return (
    <Box
      maxWidth="xl"
      sx={{
        width: { xs: "70vw", sm: "67vw", md: "64vw", lg: "61vw", xl: "58vw" },
        margin: "0 auto",
        marginTop: 4,
        borderRadius: 3,
        outline: "1.5px solid #959595",
        backgroundColor: "#BEDDA3",
        boxShadow: 5,
        padding: { xs: 2, sm: 3, md: 4 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          pt: 2,
          pl: 2,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SettingsIcon sx={{ fontSize: 40, mr: 1 }} />
        <IconButton onClick={toggleInvertMode} sx={{ color: "#4B9023" }}>
          {isInverted ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Box>

      <Box sx={{ pt: 2, flexGrow: 1 }}>
        <Typography variant="h6">Profile Settings</Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <Paper
          elevation={3}
          sx={{ p: 3, mb: 3, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              pr: 2,
              pl: 2,
            }}
          >
            <Typography>Change Password</Typography>
            <IconButton
              onClick={handleToggleChangePassword}
              sx={{
                transition: "transform 0.3s",
                transform: showChangePassword ? "rotate(180deg)" : "none",
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>
          <Collapse in={showChangePassword}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="New Password"
                variant="outlined"
                fullWidth
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                  },
                }}
              />
              <TextField
                label="Confirm New Password"
                variant="outlined"
                fullWidth
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                  },
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  variant="outlined"
                  sx={{ color: "black" }}
                  onClick={handleToggleChangePassword}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleChangePassword}
                  sx={{ backgroundColor: "#4B9023" }}
                >
                  Change Password
                </Button>
              </Box>
            </Box>
          </Collapse>
        </Paper>
      </Box>

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6">Allergen / Preferences Selection</Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 2, pr: 2, pl: 2, flexGrow: 1 }}>
          <Box
            sx={{
              mb: 2,
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              maxWidth: "100%",
              overflowX: "hidden",
            }}
          >
            {selectedAllergens.length > 0 ? (
              selectedAllergens.map((allergen) => (
                <Chip
                  key={allergen.id}
                  label={allergen.name}
                  onDelete={() => removeAllergen(allergen.id)}
                  sx={{
                    fontSize: "1rem",
                    p: 0.5,
                    backgroundColor: "#4CAF50",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#45a049",
                    },
                  }}
                />
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No allergens selected.
              </Typography>
            )}
          </Box>
        </Box>

        <Paper
          elevation={3}
          sx={{ p: 3, mb: 3, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              pr: 2,
              pl: 2,
            }}
          >
            <Typography>Manage your allergen preferences</Typography>
            <IconButton
              onClick={toggleAllergenSection}
              sx={{
                transition: "transform 0.3s",
                transform: showAllergens ? "rotate(180deg)" : "none",
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>

          <Collapse in={showAllergens}>
            <Box
              sx={{
                maxHeight: "500px",
                overflowY: "auto",
                width: "100%",
              }}
            >
              <AllergenSelector
                selectedAllergens={selectedAllergens}
                onAllergenSelect={setSelectedAllergens}
              />
            </Box>
          </Collapse>
        </Paper>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px",
          mt: 4,
          pr: 2,
          pl: 2,
        }}
      >
        <Button
          variant="outlined"
          sx={{ color: "black" }}
          color="black"
          size="large"
          onClick={handleCancel}
          startIcon={<CancelIcon />}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#4B9023" }}
          size="large"
          onClick={handleAllergenSave}
          startIcon={<SaveIcon />}
        >
          Save Changes
        </Button>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={notification.severity} sx={{ width: "100%" }}>
          <Typography variant="body1" style={{ whiteSpace: "pre-line" }}>
            {notification.message}
          </Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage;
