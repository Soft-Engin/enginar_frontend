import React, { useState } from "react";
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
} from "@mui/material";
import { Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";
import AllergenSelector from "./AllergenPick";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const SettingsPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [showAllergens, setShowAllergens] = useState(false);

  const handleSave = () => {
    console.log({
      email,
      username,
      password,
      allergens: selectedAllergens,
    });
    alert("Settings saved!");
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
        display: "flex", // Add display: flex
        flexDirection: "column", // Add flexDirection: column
      }}
    >
      <Box sx={{ display: "flex", pt: 2, pl: 2 }}>
        <SettingsIcon sx={{ fontSize: 40, mr: 1 }} />
      </Box>

      <Box sx={{ pt: 2, flexGrow: 1 }}>
        {" "}
        {/* Added flexGrow: 1 */}
        <Typography variant="h6">Profile Settings</Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <TextField
          label="Change Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{
            marginBottom: 3,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
              pr: 2,
            },
          }}
        />
        <TextField
          label="Change Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            marginBottom: 3,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
            },
          }}
        />
        <TextField
          label="Change Password"
          variant="outlined"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            marginBottom: 2,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
            },
          }}
        />
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
            {" "}
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
            <Box sx={{ maxHeight: "500px", overflowY: "auto" }}>
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
          onClick={handleSave}
          startIcon={<SaveIcon />}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPage;
