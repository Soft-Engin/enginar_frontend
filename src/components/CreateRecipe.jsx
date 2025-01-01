import React, { useState, useEffect } from "react";
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
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import axios from "axios";

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
  "& .MuiSelect-icon": {
    color: alpha(theme.palette.common.black, 0.7),
    right: theme.spacing(0.5),
    top: "50%",
    transform: "translateY(-50%)",
  },
  "& .MuiSelect-select": {
    padding: theme.spacing(0.5, 1.5, 0.5, 0.5),
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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

const CreateRecipe = () => {
  const [recipeName, setRecipeName] = useState("");
  const [servingSize, setServingSize] = useState("1");
  const [prepTime, setPrepTime] = useState("0-10 minutes");
  const [description, setDescription] = useState("");
  // State for banner image URL
  const [bannerImage, setBannerImage] = useState("");
  const [ingredients, setIngredients] = useState([]);
  // Initialize steps to be an array of objects each containing text and imageUrl
  const [steps, setSteps] = useState([{ text: "", imageUrl: "" }]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [creationError, setCreationError] = useState(null);
  const [creationSuccess, setCreationSuccess] = useState(false);
  //New State for Images
  const [ingredientImages, setIngredientImages] = useState({});
  // Filter and categorize ingredients

  useEffect(() => {
    const fetchIngredients = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("/api/v1/ingredients", {
          params: { pageSize: 999 },
        });
        if (response.data && response.data.items) {
          const sortedIngredients = [...response.data.items].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setIngredientsList(sortedIngredients);
          // Fetch images for all ingredients
          await fetchIngredientImages(
            sortedIngredients.map((ingredient) => ingredient.id)
          );
        }
      } catch (err) {
        console.error("Error fetching ingredients:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchIngredients();
  }, []);

  const fetchIngredientImages = async (ingredientIds) => {
    try {
      const params = new URLSearchParams();
      ingredientIds.forEach((id) => {
        params.append("ingredientIds", id);
      });

      const response = await axios.get("/api/v1/ingredients/Images", {
        params: params,
      });

      if (response.data) {
        const images = response.data.reduce((acc, item) => {
          acc[item.id] = item.image;
          return acc;
        }, {});
        setIngredientImages(images);
      }
    } catch (error) {
      console.error("Error fetching ingredient images:", error);
    }
  };

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
      quantity: "0.25", // Default quantity
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
      prevIngredients.map((item) => (item.id === id ? { ...item, unit } : item))
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

  // Handle banner image upload
  const handleBannerImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      const base64Image = await convertToBase64(file);
      setBannerImage(base64Image);
      setLoading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle banner image removal
  const handleRemoveBannerImage = () => {
    setBannerImage("");
  };

  // Handle image upload
  const handleImageUpload = async (index, event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      const base64Image = await convertToBase64(file);
      updateStep(index, "imageUrl", base64Image);
      setLoading(false);
    }
  };

  // Remove step
  const removeStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  // Predefined quantity options
  const quantityOptions = [0.25, 0.5, 0.75, 1, 2, 3, 4, 5];

  // Generate options for serving size and prep time from 1 to 10+, with "10+" as last option
  const numberOptions = Array.from({ length: 10 }, (_, i) => i + 1);
  const servingSizeOptions = [...numberOptions.map(String), "10+"];
  const prepTimeOptions = numberOptions.map((num) => `${num * 10} minutes`);
  prepTimeOptions.push("More than 100 minutes");

  const handleCreateRecipe = async () => {
    setCreating(true);
    setCreationError(null);
    setCreationSuccess(false);

    try {
      const stepsWithTextOnly = steps.map((step) => step.text);
      const transformedIngredients = ingredients.map((ingredient) => ({
        ingredientId: ingredient.id,
        quantity: parseFloat(ingredient.quantity),
        unit: ingredient.unit,
      }));

      console.log("Transformed Ingredients", transformedIngredients);

      const stepImages = steps
        .map((step) => step.imageUrl)
        .filter((imageUrl) => imageUrl !== "");
      const recipeData = {
        header: recipeName,
        bodyText: description,
        bannerImage: bannerImage || null,
        stepImages: stepImages.length > 0 ? stepImages : null,
        servingSize: parseInt(servingSize),
        preparationTime:
          prepTimeOptions.findIndex((option) => option === prepTime) * 10,
        steps: stepsWithTextOnly,
        ingredients: transformedIngredients,
      };
      console.log("Payload: ", recipeData);
      const response = await axios.post("/api/v1/recipes", recipeData);

      console.log("Response: ", response);
      if (response.status === 201) {
        setCreationSuccess(true);
        setRecipeName("");
        setServingSize("1");
        setPrepTime("0-10 minutes");
        setDescription("");
        setBannerImage("");
        setIngredients([]);
        setSteps([{ text: "", imageUrl: "" }]);
        console.log("Recipe created successfully:", response.data);
      } else {
        setCreationError(
          response.data?.message || "Failed to create recipe. Please try again."
        );
        console.error("Failed to create recipe:", response);
      }
    } catch (error) {
      setCreationError(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred."
      );
      console.error("Error creating recipe:", error.response?.data?.message);
    } finally {
      setCreating(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setCreationSuccess(false);
    setCreationError(null);
  };

  // Constant image width
  const imageWidth = "100px";

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, width: "90vmax", overflow: "hidden" }}>
      <Snackbar
        open={creationSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Recipe created successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        open={creationError != null}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {creationError}
        </Alert>
      </Snackbar>
      <Typography variant="h4" gutterBottom>
        Create a Recipe
      </Typography>
      <Grid container spacing={3} sx={{ height: "fit-content" }}>
        {/* Left Block - Recipe Info */}
        <Grid
          item
          xs={12}
          md={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "fit-content",
          }}
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
                },
              }}
            />
            <Divider variant="middle" sx={{ mt: 2, mb: 2 }} />

            {/* Serving Size and Prep Time */}
            <Box
              sx={{
                display: "flex",
                gap: 5,
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <FormControl
                size="small"
                sx={{
                  minWidth: 120,
                  margin: 0,
                  padding: 0,
                  borderRadius: 0,
                }}
              >
                <Typography variant="body1" sx={{ paddingRight: 1 }}>
                  Serving Size
                </Typography>
                <Select
                  value={servingSize}
                  onChange={(e) => setServingSize(e.target.value)}
                  sx={{ backgroundColor: "white" }}
                >
                  {servingSizeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                size="small"
                sx={{
                  minWidth: 120,
                  margin: 0,
                  padding: 0,
                  borderRadius: 0,
                }}
              >
                <Typography variant="body1" sx={{ paddingRight: 1 }}>
                  Prep Time
                </Typography>
                <Select
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  sx={{ backgroundColor: "white" }}
                >
                  {prepTimeOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Divider variant="middle" sx={{ mt: 2, mb: 2 }} />

            {/* Banner Image Upload */}
            <Box
              sx={{ mt: 2, mb: 2, display: "flex", flexDirection: "column" }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerImageUpload}
                  style={{ display: "none" }}
                  id="banner-image-upload"
                />
                <Typography variant="body1" sx={{ paddingRight: 1 }}>
                  Banner Image:
                </Typography>
                <label htmlFor="banner-image-upload">
                  <Button
                    variant="outlined"
                    color="primary"
                    component="span"
                    startIcon={<AddAPhotoIcon />}
                  >
                    Upload Image
                  </Button>
                </label>
                {bannerImage && (
                  <Button
                    variant="outlined"
                    color="error"
                    component="span"
                    onClick={handleRemoveBannerImage}
                    sx={{ ml: 2 }}
                  >
                    Remove
                  </Button>
                )}
              </Box>
              {bannerImage && (
                <Box sx={{ mt: 2, width: "200px", height: "200px" }}>
                  <img
                    src={`data:image/png;base64,${bannerImage}`}
                    alt="Banner Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
            </Box>
            <Divider variant="middle" sx={{ mt: 2, mb: 2 }} />

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
                },
              }}
            />
            <Divider variant="middle" sx={{ mt: 2, mb: 2 }} />

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
                backgroundColor: "white",
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
                    image={`data:image/png;base64,${
                      ingredientImages[ingredient.id]
                    }`}
                    alt={ingredient.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent
                    sx={{
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="body1"
                      textAlign="center"
                      sx={{ marginBottom: 0 }}
                    >
                      {ingredient.name}
                    </Typography>
                    <Divider variant="middle" />
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
                        backgroundColor: "#A5E072",
                      }}
                    >
                      <StyledSelect
                        value={ingredient.quantity}
                        onChange={(e) =>
                          updateIngredientQuantity(
                            ingredient.id,
                            e.target.value
                          )
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
                        width: "80px",
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
            <Divider variant="middle" sx={{ mt: 2, mb: 2 }} />

            {/* Steps */}
            <Typography variant="h6" mt={3}>
              Steps
            </Typography>
            <Box>
              {steps.map((step, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "center", mb: 2 }}
                >
                  <TextField
                    label={`Step ${index + 1}`}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={step.text}
                    onChange={(e) => updateStep(index, "text", e.target.value)}
                    InputProps={{
                      startAdornment: step.imageUrl ? (
                        <InputAdornment position="start">
                          <Box sx={{ width: "70px", height: "70px" }}>
                            <img
                              src={`data:image/png;base64,${step.imageUrl}`}
                              alt={`step ${index + 1}`}
                              style={{
                                height: "100%",
                                width: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </Box>
                        </InputAdornment>
                      ) : null,
                      endAdornment: (
                        <InputAdornment position="end">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(index, e)}
                            style={{ display: "none" }}
                            id={`step-image-upload-${index}`}
                          />
                          <label htmlFor={`step-image-upload-${index}`}>
                            <IconButton color="primary" component="span">
                              <AddAPhotoIcon />
                            </IconButton>
                          </label>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                      },
                    }}
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
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
              <Button
                variant="contained"
                startIcon={<AddCircleIcon />}
                sx={{ mt: 2 }}
                onClick={addStep}
              >
                Add Step
              </Button>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                color="success"
                onClick={handleCreateRecipe}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Recipe"}
              </Button>
            </Box>
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
              sx={{
                mb: 2,
                mt: 2,
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
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent:
                  filteredIngredients.length === 0 && searchTerm
                    ? "center"
                    : "flex-start",
                alignItems:
                  filteredIngredients.length === 0 && searchTerm
                    ? "center"
                    : "stretch",
                maxWidth: "100%", // Ensure no X-overflow
                overflowX: "hidden", // Prevent X-overflow
              }}
            >
              {filteredIngredients.length === 0 && searchTerm ? ( // Condition to render the message
                <Typography variant="body1" color="textSecondary">
                  No ingredients found.
                </Typography>
              ) : (
                Object.keys(categorizedIngredients).map((letter) => (
                  <Box key={letter} sx={{ mb: 2 }}>
                    <Divider sx={{ mb: 1 }}>
                      <Typography variant="h6" color="textSecondary">
                        {letter}
                      </Typography>
                    </Divider>
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {categorizedIngredients[letter].map((ingredient) => (
                        <div
                          style={{
                            marginRight: 5,
                            marginLeft: 5,
                            marginTop: 5,
                            marginBottom: 5,
                          }}
                          key={ingredient.id}
                        >
                          <Card
                            variant="outlined"
                            sx={{ backgroundColor: "#A5E072", width: "120px" }}
                          >
                            <CardMedia
                              component="img"
                              height="100"
                              image={`data:image/png;base64,${
                                ingredientImages[ingredient.id]
                              }`}
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
                ))
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateRecipe;
