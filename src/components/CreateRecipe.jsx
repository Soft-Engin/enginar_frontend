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
  Select,
  MenuItem,
  FormControl,
  alpha,
  styled,
  InputBase,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

// Styled Components for Quantity and Unit fields - Identical to the SearchBar
const StyledSelect = styled(Select)(({ theme }) => ({
    color: "inherit",
    backgroundColor: "#A5E072", // Make background white
    "&:hover": {
      backgroundColor: alpha("#A5E072", 0.85),
    },
    "&:before": {
      borderColor: alpha(theme.palette.common.black, 0.7),
    },
    "&:after": {
      borderColor: theme.palette.common.black,
    },
      '& .MuiSelect-icon': {
          color: alpha(theme.palette.common.black, 0.7),
          right: theme.spacing(0.5),
          top: '50%',
          transform: 'translateY(-50%)',
        },
    "& .MuiSelect-select": {
      padding: theme.spacing(0.5, 1.5, 0.5, 0.5),
      height: "100%",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  height: "100%",
  borderRadius: theme.shape.borderRadius,
    backgroundColor: "#A5E072", // Make background white
  "&:hover": {
    backgroundColor: alpha("#A5E072", 0.85),
  },
  "& .MuiInputBase-input": {
    padding: theme.spacing(0.5, 0.5, 0.5, 0.5),
    transition: theme.transitions.create("width"),
    width: "100%",
    height: "100%",
  },
}));


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
  // Initialize steps to be an array of objects each containing text and imageUrl
  const [steps, setSteps] = useState([{ text: "", imageUrl: "" }]);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter and categorize ingredients
  const filteredIngredients = ingredientsList.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const categorizedIngredients = categorizeIngredients(filteredIngredients);

  // Add ingredient
 const addIngredient = (ingredient) => {
    if (ingredients.some((item) => item.id === ingredient.id)) {
      // Ingredient already exists, do not add
      return;
    }
    const newIngredient = {
      ...ingredient,
      quantity: "1/4", // Default quantity
      unit: "", // Default unit
    };
    setIngredients([...ingredients, newIngredient]);
  };

  // Remove ingredient
  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter((item) => item.id !== ingredient.id));
  };

  // Update ingredient quantity
  const updateIngredientQuantity = (id, quantity) => {
    setIngredients((prevIngredients) =>
      prevIngredients.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Update ingredient unit
  const updateIngredientUnit = (id, unit) => {
    setIngredients((prevIngredients) =>
      prevIngredients.map((item) =>
        item.id === id ? { ...item, unit } : item
      )
    );
  };

    // Add step
    const addStep = () => {
        setSteps([...steps, { text: "", imageUrl: "" }]);
      };

    // Update step
    const updateStep = (index, field, value) => {
        const newSteps = [...steps];
        newSteps[index][field] = value;
        setSteps(newSteps);
    };

    // Handle image upload
    const handleImageUpload = (index, event) => {
        const file = event.target.files[0];
        if (file) {
          // Simulate a file upload
          const reader = new FileReader();
          reader.onload = (e) => {
            updateStep(index, "imageUrl", e.target.result);
          };
          reader.readAsDataURL(file);
        }
      };

  // Remove step
  const removeStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  // Predefined quantity options
  const quantityOptions = ["1/4", "1/2", "1", "2", "3", "4", "5"];

    // Constant image width
    const imageWidth = "100px";

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
              sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                  }
              }}
            />

            {/* Serving Size and Prep Time */}
            <Box sx={{ display: "flex", gap: 5 }}>
              <TextField
                label="Serving Size"
                variant="outlined"
                margin="normal"
                value={servingSize}
                  onChange={(e) => setServingSize(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                    }
                  }}
              />
              <TextField
                label="Prep Time"
                variant="outlined"
                margin="normal"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                  sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                      }
                    }}
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
                sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "white",
                    }
                  }}
            />

            {/* Selected Ingredients */}
            <Typography variant="h6" mb={1}>
              Selected Ingredients
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                p: 1,
                gap: 1,
                mb: 2,
                border: "rgba(0, 0, 0, 0.13)",
                borderWidth: "1px",
                borderStyle: "groove",
                minHeight: "140px",
                borderRadius: "4px",
                backgroundColor: "white"
              }}
            >
              {ingredients.map((ingredient) => (
                <Card
                  key={ingredient.id}
                  variant="outlined"
                  sx={{ position: "relative", backgroundColor: "#A5E072" }}
                >
                  <CardMedia
                    component="img"
                    height="100"
                    image="https://via.placeholder.com/150"
                    alt={ingredient.name}
                    sx={{ objectFit: "cover" }}
                  />
                   <CardContent sx={{ padding: 0, display: "flex", flexDirection: "column" }}>
                    <Typography variant="body1" textAlign="center" sx={{marginBottom:0}}>
                      {ingredient.name}
                    </Typography>
                    <Divider variant="middle"/>
                     
                  </CardContent>
                 <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      padding: 0,
                      margin: 0,
                      width: "100%",
                      height: "30px",
                    }}
                  >
                    <FormControl
                      size="small"
                      sx={{
                        minWidth: 55,
                        margin: 0,
                        padding: 0,
                        borderRadius: 0,
                        borderRight: "none",
                        backgroundColor: "#A5E072"
                      }}
                    >
                      <StyledSelect
                        value={ingredient.quantity}
                        onChange={(e) =>
                          updateIngredientQuantity(ingredient.id, e.target.value)
                        }
                        variant="standard"
                      >
                        {quantityOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </StyledSelect>
                    </FormControl>
                    <StyledInputBase
                      size="small"
                      placeholder="Unit"
                      value={ingredient.unit}
                      onChange={(e) =>
                        updateIngredientUnit(ingredient.id, e.target.value)
                      }
                      sx={{
                        flex: 1,
                        margin: 0,
                        padding: 0,
                        borderRadius: 0,
                        borderLeft: "none",
                         width: "80px"
                      }}
                    />
                  </Box>
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
                    value={step.text}
                    onChange={(e) => updateStep(index, "text", e.target.value)}
                      sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "white",
                          }
                        }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, e)}
                    style={{display: "none"}} // hide the default file upload
                    id={`step-image-upload-${index}`}
                  />

                  <label htmlFor={`step-image-upload-${index}`}>
                    <IconButton color="primary" component="span" sx={{ ml: 1}}>
                        <AddAPhotoIcon/>
                    </IconButton>
                  </label>

                  {step.imageUrl && (
                    <CardMedia
                        component="img"
                        height="100"
                        image={step.imageUrl}
                        alt={`step ${index + 1}`}
                        sx={{width: imageWidth, ml: 1}}
                    />
                  )}

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
        <Grid item xs={12} md={4} sx={{ height: "inherit" }}>
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
              sx={{ mb: 2, mt: 2,
                 "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                  },
             }}
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
                backgroundColor: "white"
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
                        <Card variant="outlined" sx={{backgroundColor: "#A5E072", width: "120px"}}>
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
                          <CardActions sx={{ padding: 0.5 }}>
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