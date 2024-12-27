import React, { useState } from "react";
import {
  TextField,
  Box,
  Typography,
  Grid,
  Card,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const allergensList = [
  { id: 1, name: "Dairy" },
  { id: 2, name: "Eggs" },
  { id: 3, name: "Fish" },
  { id: 4, name: "Gluten" },
  { id: 5, name: "Milk" },
  { id: 6, name: "Peanuts" },
  { id: 7, name: "Shellfish" },
  { id: 8, name: "Soy" },
  { id: 9, name: "Tree Nuts" },
  { id: 10, name: "Wheat" },
  { id: 11, name: "Mustard" },
  { id: 12, name: "Sesame" },
  { id: 13, name: "Lupin" },
  { id: 14, name: "Celery" },
  { id: 15, name: "Salam" },
];

const AllergenSelector = ({ onAllergenSelect, selectedAllergens = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAllergens = allergensList
    .filter((allergen) =>
      allergen.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const isAllergenSelected = (allergenId) =>
    selectedAllergens.some((allergen) => allergen.id === allergenId);

  const toggleAllergen = (allergen) => {
    if (!isAllergenSelected(allergen.id)) {
      onAllergenSelect([...selectedAllergens, allergen]);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
      <TextField
        variant="outlined"
        placeholder="Search Allergens"
        fullWidth
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1 }} />,
        }}
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "white",
          },
        }}
      />

      <Box
        sx={{
          overflowY: "auto",
          maxHeight: "70vh",
          border: "1px solid #ccc",
          p: 1,
          backgroundColor: "white",
        }}
      >
        {filteredAllergens.length === 0 && searchTerm ? (
          <Typography variant="body1" color="textSecondary" textAlign="center">
            No allergens found.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {filteredAllergens.map((allergen) => (
              <Grid item xs={12} sm={6} md={4} key={allergen.id}>
                <Card
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 16px",
                    backgroundColor: isAllergenSelected(allergen.id) ? "#f5f5f5" : "#fff",
                    opacity: isAllergenSelected(allergen.id) ? 0.6 : 1,
                    borderColor: isAllergenSelected(allergen.id) ? "#555555" : "#000000",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      textDecoration: isAllergenSelected(allergen.id) ? "line-through" : "none",
                    }}
                  >
                    {allergen.name}
                  </Typography>
                  {!isAllergenSelected(allergen.id) && (
                    <Button
                      size="small"
                      sx={{
                        backgroundColor: "#6AA84F",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#A5E072",
                        },
                      }}
                      onClick={() => toggleAllergen(allergen)}
                    >
                      Add
                    </Button>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default AllergenSelector;
