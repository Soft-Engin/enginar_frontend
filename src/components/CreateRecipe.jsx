import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";

// Sample Ingredients List
const ingredientsList = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Avocado" },
  { id: 3, name: "Banana" },
  { id: 4, name: "Blueberry" },
  { id: 5, name: "Carrot" },
  { id: 6, name: "Cabbage" },
  { id: 7, name: "Date" },
  { id: 8, name: "Eggplant" },
  { id: 9, name: "Fig" },
  { id: 10, name: "Grapes" },
  { id: 11, name: "Garlic" },
  { id: 12, name: "Honey" },
  { id: 13, name: "Lemon" },
  { id: 14, name: "Lettuce" },
];

// Group ingredients by their starting letter
const categorizeIngredients = (ingredients) => {
  const categories = {};
  ingredients.forEach((ingredient) => {
    const letter = ingredient.name[0].toUpperCase();
    if (!categories[letter]) {
      categories[letter] = [];
    }
    categories[letter].push(ingredient);
  });
  return categories;
};

const RecipeCreator = () => {
  const [recipeName, setRecipeName] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([""]);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter and categorize ingredients
  const filteredIngredients = ingredientsList.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const categorizedIngredients = categorizeIngredients(filteredIngredients);

  // Add ingredient
  const addIngredient = (ingredient) => {
    if (!ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
    }
  };

  // Remove ingredient
  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter((item) => item !== ingredient));
  };

  // Add step
  const addStep = () => {
    setSteps([...steps, ""]);
  };

  // Update step
  const updateStep = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  // Remove step
  const removeStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  return (
    <Box sx={{ p: 3, width: "90vmax", overflow: "hidden" }}>
      <Typography variant="h4" gutterBottom>
        Create a Recipe
      </Typography>
      <Grid container spacing={3} sx={{ height: "fit-content" }}>
        {/* Left Block - Recipe Info */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{ display: "flex", flexDirection: "column", height: "fit-content" }}
        >
          <Box>
            {/* Recipe Name */}
            <TextField
              label="Recipe Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
            />

            {/* Serving Size and Prep Time */}
            <Box sx={{display: "flex", gap: 5}}>
              <TextField
                label="Serving Size"
                variant="outlined"
                
                margin="normal"
                value={servingSize}
                onChange={(e) => setServingSize(e.target.value)}
              />
              <TextField
                label="Prep Time"
                variant="outlined"
                
                margin="normal"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
              />
            </Box>

            {/* Description */}
            <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                margin="normal"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

            {/* Selected Ingredients */}
            <Typography variant="h6" mb={1}>
              Selected Ingredients
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", p: 1, gap: 1, mb: 2,  border: "rgba(0, 0, 0, 0.87)", borderWidth: "1px", borderStyle: "groove", minHeight: "140px", borderRadius: "4px"}}>
              {ingredients.map((ingredient) => (
                <Card
                  key={ingredient.id}
                  variant="outlined"
                  sx={{ position: "relative" }}
                >
                  <CardMedia
                    component="img"
                    height="100"
                    image="https://via.placeholder.com/150"
                    alt={ingredient.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ height: "20px", padding: 0 }}>
                    <Typography variant="body2" textAlign="center">
                      {ingredient.name}
                    </Typography>
                  </CardContent>
                  <IconButton
                    color="error"
                    onClick={() => removeIngredient(ingredient)}
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -9,
                      zIndex: 1,
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Card>
              ))}
            </Box>

            {/* Steps */}
            <Typography variant="h6" mt={3}>
              Steps
            </Typography>
            <Box>
              {steps.map((step, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "center", mt: 1 }}
                >
                  <TextField
                    label={`Step ${index + 1}`}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={2}
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                  />
                  <IconButton
                    color="error"
                    onClick={() => removeStep(index)}
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              sx={{ mt: 2 }}
              onClick={addStep}
            >
              Add Step
            </Button>
          </Box>
        </Grid>

        {/* Right Block - Ingredient Selection */}
        <Grid item xs={12} md={4} sx={{height: "inherit"}}>
          <Box sx={{ height: "80%", display: "flex", flexDirection: "column" }}>
            {/* Search Bar */}
            <TextField
              variant="outlined"
              placeholder="Search Ingredients"
              fullWidth
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1 }} />,
              }}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              sx={{ mb: 2, mt: 2}}
            />

            {/* Ingredient List */}
            <Box
              sx={{
                overflowY: "auto",
                maxHeight: "90vh",
                minHeight: 0,
                flex: 1,
                border: "1px solid #ccc",
                p: 1,
              }}
            >
              {Object.keys(categorizedIngredients).map((letter) => (
                <Box key={letter} sx={{ mb: 2 }}>
                  <Divider sx={{ mb: 1 }}>
                    <Typography variant="h6" color="textSecondary">
                      {letter}
                    </Typography>
                  </Divider>
                  <div style={{ display: "flex" }}>
                    {categorizedIngredients[letter].map((ingredient) => (
                      <div style={{ marginRight: 5, marginLeft: 5 }}>
                        <Card variant="outlined">
                          <CardMedia
                            component="img"
                            height="100"
                            image="https://via.placeholder.com/150"
                            alt={ingredient.name}
                          />
                          <CardContent
                            sx={{
                              height: "20px",
                              padding: 0,
                              alignContent: "center",
                            }}
                          >
                            <Typography variant="body2" textAlign="center">
                              {ingredient.name}
                            </Typography>
                          </CardContent>
                          <CardActions sx={{ padding: 0 }}>
                            <Button
                              size="small"
                              fullWidth
                              variant="contained"
                              color="success"
                              onClick={() => addIngredient(ingredient)}
                            >
                              Add
                            </Button>
                          </CardActions>
                        </Card>
                      </div>
                    ))}
                  </div>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecipeCreator;
