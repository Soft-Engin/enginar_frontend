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
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [showAllergens, setShowAllergens] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isInverted, setIsInverted] = useState(false);

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

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post("/api/v1/auth/forgot-password", {
        email: email,
      });

      setNotification({
        open: true,
        message: response.data.message,
        severity: "success",
      });
      setEmail("");
    } catch (error) {
      setNotification({
        open: true,
        message: "Error processing request. Please try again.",
        severity: "error",
      });
      console.error("Forgot password error:", error);
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
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            marginBottom: 3,
          }}
        >
          <TextField
            label="Email for Password Reset"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleForgotPassword}
            sx={{ backgroundColor: "#4B9023", height: 56 }}
          >
            Reset Password
          </Button>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="h6">Allergen / Preferences Selection</Typography>
        <Divider sx={{ my: 2 }} />
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
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage;
