import React, { useState, useEffect, useRef } from "react";
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
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

// Styled Components for Quantity and Unit fields - Identical to the SearchBar
const StyledSelect = styled(Select)(({ theme }) => ({
  color: "inherit",
  backgroundColor: "#A5E072",
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
  backgroundColor: "#A5E072",
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
  const [bannerImage, setBannerImage] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([{ text: "", imageUrl: null }]);
  const [stepImageUrls, setStepImageUrls] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [recipeError, setRecipeError] = useState(null);
  const [bannerUrl, setBannerUrl] = useState(null);
  const [creating, setCreating] = useState(false);
  const [creationError, setCreationError] = useState(null);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [ingredientImages, setIngredientImages] = useState({});
  const [showBanner, setShowBanner] = useState(false);
  const [loadingBanner, setLoadingBanner] = React.useState(true);
  const [errorBanner, setErrorBanner] = React.useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recipeId = searchParams.get("id");
  const [isEditing, setIsEditing] = useState(!!recipeId);

  const handleImageError = (error, setErrorState) => {
    if (error.response && error.response.status === 404) {
      setErrorState(null);
    } else {
      setErrorState(error.message || "An unexpected error occurred.");
    }
  };

  const stepsRef = useRef(steps);

  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  const [editRecipeFetched, setEditRecipeFetched] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (recipeId) {
        setRecipeLoading(true);
        setRecipeError(null);
        try {
          const response = await axios.get(`/api/v1/recipes/${recipeId}`);
          const recipeData = response.data;
          setRecipeName(recipeData.header || "");
          setServingSize(String(recipeData.servingSize || "1"));
          setPrepTime(
            prepTimeOptions[Math.floor(recipeData.preparationTime / 10)] ||
              "0-10 minutes"
          );
          setDescription(recipeData.bodyText || "");
          setIngredients(
            recipeData.ingredients?.map((ingredient) => ({
              id: ingredient.ingredientId,
              name: ingredient.ingredientName,
              quantity: String(ingredient.quantity),
              unit: ingredient.unit,
            })) || []
          );

          // First set initial steps with base64 images if available
          const initialSteps =
            recipeData.steps?.map((step, index) => ({
              text: step || "",
              imageUrl: recipeData.stepImages?.[index] || null,
            })) || [];
          setSteps(initialSteps);

          // Initialize stepImageUrls with base64 images
          const initialImageUrls = initialSteps.reduce((acc, step, index) => {
            acc[index] = step.imageUrl
              ? `data:image/png;base64,${step.imageUrl}`
              : null;
            return acc;
          }, {});
          setStepImageUrls(initialImageUrls);

          for (let i = 0; i < initialSteps.length; i++) {
            if (!initialSteps[i].imageUrl) {
              try {
                const response = await axios.get(
                  `/api/v1/recipes/${recipeId}/steps/${i}/image`,
                  { responseType: "blob" }
                );
                if (response.data && response.data.size > 0) {
                  // Convert blob to base64
                  const reader = new FileReader();
                  reader.readAsDataURL(response.data);
                  reader.onloadend = () => {
                    // Remove the data:image/png;base64, prefix
                    const base64String = reader.result.split(",")[1];

                    setStepImageUrls((prev) => ({
                      ...prev,
                      [i]: `data:image/png;base64,${base64String}`,
                    }));
                    setSteps((prevSteps) => {
                      const updatedSteps = [...prevSteps];
                      updatedSteps[i] = {
                        ...updatedSteps[i],
                        imageUrl: base64String, // Store just the base64 string without prefix
                      };
                      return updatedSteps;
                    });
                  };
                }
              } catch (error) {
                console.error(`Error fetching image for step ${i}:`, error);
                handleImageError(error, (errorMessage) => {
                  setStepImageUrls((prev) => ({
                    ...prev,
                    [i]: null,
                  }));
                  setSteps((prevSteps) => {
                    const updatedSteps = [...prevSteps];
                    updatedSteps[i] = { ...updatedSteps[i], imageUrl: null };
                    return updatedSteps;
                  });
                });
              }
            }
          }

          // Fetch banner image URL
          if (recipeData.id) {
            const fetchBanner = async () => {
              setLoadingBanner(true);
              setErrorBanner(null);
              try {
                const response = await axios.get(
                  `/api/v1/recipes/${recipeData.id}/banner`,
                  { responseType: "blob" }
                );
                if (response.data) {
                  // Convert blob to base64
                  const reader = new FileReader();
                  reader.readAsDataURL(response.data);
                  reader.onloadend = () => {
                    const base64data = reader.result.split(",")[1];
                    setBannerUrl(`data:image/png;base64,${base64data}`);
                    // Update banner image state with the base64 so it can persist on edit
                    setBannerImage(base64data); // Set to bannerImage to persist banner image on edit
                    setShowBanner(true);
                  };
                } else {
                  setBannerUrl(null);
                  setBannerImage(""); // Clear when no image present
                  setShowBanner(false);
                }
              } catch (err) {
                console.error("Error fetching banner image:", err);
                handleImageError(err, (errorMessage) => {
                  setBannerUrl(null);
                  setBannerImage(""); // Clear when error fetching banner
                  setShowBanner(false);
                });
              } finally {
                setLoadingBanner(false);
              }
            };
            fetchBanner();
          }
        } catch (err) {
          console.error("Error fetching recipe:", err);
          setRecipeError(err.message || "Failed to load recipe data.");
        } finally {
          setRecipeLoading(false);
        }
      }
    };
    fetchRecipe();
    setEditRecipeFetched(true);
    return () => {
      if (bannerUrl) {
        URL.revokeObjectURL(bannerUrl);
      }
      // Clean up step image URLs
      for (const step in stepImageUrls) {
        if (stepImageUrls[step]) {
          URL.revokeObjectURL(stepImageUrls[step]);
        }
      }
    };
  }, [recipeId]);

  const [stepImagesFetched, setStepImagesFetched] = useState(false);

  useEffect(() => {
    const fetchStepImages = async () => {
      if (
        recipeId &&
        steps &&
        steps.length > 0 &&
        editRecipeFetched &&
        !stepImagesFetched
      ) {
        const images = {};
        for (let i = 0; i < steps.length; i++) {
          if (steps[i].imageUrl) {
            // Check if there is a base64 image
            images[i] = `data:image/png;base64,${steps[i].imageUrl}`;
            setStepImageUrls((prevImageUrls) => ({
              ...prevImageUrls,
              [i]: `data:image/png;base64,${steps[i].imageUrl}`,
            }));
          } else {
            try {
              const response = await axios.get(
                `/api/v1/recipes/${recipeId}/steps/${i}/image`,
                { responseType: "blob" }
              );
              if (response.data && response.data.size > 0) {
                const imageUrl = URL.createObjectURL(response.data);
                images[i] = imageUrl;
                setStepImageUrls((prevImageUrls) => ({
                  ...prevImageUrls,
                  [i]: imageUrl,
                }));
              } else {
                images[i] = null;
                setStepImageUrls((prevImageUrls) => ({
                  ...prevImageUrls,
                  [i]: null,
                }));
              }
            } catch (error) {
              console.error(`Error fetching image for step ${i}:`, error);
              handleImageError(error, (errorMessage) => {
                images[i] = null;
                setStepImageUrls((prevImageUrls) => ({
                  ...prevImageUrls,
                  [i]: null,
                }));
              });
            }
          }
        }
      }
    };

    fetchStepImages();
    return () => {
      for (const step in stepImageUrls) {
        if (stepImageUrls[step]) {
          URL.revokeObjectURL(stepImageUrls[step]);
        }
      }
    };
  }, [recipeId, steps]);

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

  const addIngredient = (ingredient) => {
    if (ingredients.some((item) => item.id === ingredient.id)) {
      return;
    }
    const newIngredient = {
      ...ingredient,
      quantity: "0.25",
      unit: "",
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter((item) => item.id !== ingredient.id));
  };

  const updateIngredientQuantity = (id, quantity) => {
    setIngredients((prevIngredients) =>
      prevIngredients.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const updateIngredientUnit = (id, unit) => {
    setIngredients((prevIngredients) =>
      prevIngredients.map((item) => (item.id === id ? { ...item, unit } : item))
    );
  };

  const addStep = () => {
    setSteps([...steps, { text: "", imageUrl: null }]);
  };

  const updateStep = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  const handleBannerImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      const base64Image = await convertToBase64(file);
      setBannerImage(base64Image);
      setLoading(false);
      setBannerUrl(`data:image/png;base64,${base64Image}`);
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

  const handleRemoveBannerImage = () => {
    setBannerUrl(null);
    setBannerImage("");
  };

  const handleImageUpload = async (index, event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      const base64Image = await convertToBase64(file);
      setSteps((prevSteps) => {
        const newSteps = [...prevSteps];
        newSteps[index] = { ...newSteps[index], imageUrl: base64Image };
        return newSteps;
      });
      setStepImageUrls((prevImageUrls) => ({
        ...prevImageUrls,
        [index]: `data:image/png;base64,${base64Image}`,
      }));
      setLoading(false);
    }
  };
  // Remove step image
  const removeStepImage = (index) => {
    console.log(steps);
    setSteps((prevSteps) => {
      const newSteps = [...prevSteps];
      newSteps[index] = { ...newSteps[index], imageUrl: null };
      return newSteps;
    });
    console.log(steps);

    setStepImageUrls((prevImageUrls) => {
      const imageUrl = prevImageUrls[index];
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
      const { [index]: removed, ...rest } = prevImageUrls;
      return rest;
    });
  };

  const removeStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
    setStepImageUrls((prevImageUrls) => {
      const { [index]: removed, ...rest } = prevImageUrls;
      return rest;
    });
  };

  const quantityOptions = [0.25, 0.5, 0.75, 1, 2, 3, 4, 5];

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
      const stepImagesData = steps.map((step) => step.imageUrl || null);

      //   If new banner image is uploaded then use it else use the existing bannerUrl
      const bannerData = bannerImage
        ? bannerImage
        : bannerUrl
        ? bannerUrl.split(",")[1]
        : null;

      const recipeData = {
        header: recipeName,
        bodyText: description,
        bannerImage: bannerData,
        stepImages: stepImagesData.length > 0 ? stepImagesData : null,
        servingSize: parseInt(servingSize),
        preparationTime:
          prepTimeOptions.findIndex((option) => option === prepTime) * 10,
        steps: stepsWithTextOnly,
        ingredients: transformedIngredients,
      };

      let response;
      if (isEditing) {
        response = await axios.put(`/api/v1/recipes/${recipeId}`, recipeData);
      } else {
        response = await axios.post("/api/v1/recipes", recipeData);
      }

      if (response.status === 201 || response.status === 200) {
        setCreationSuccess(true);
        navigate(`/recipe?id=${response.data.id}`);
        if (!isEditing) {
          setRecipeName("");
          setServingSize("1");
          setPrepTime("0-10 minutes");
          setDescription("");
          setBannerImage("");
          setIngredients([]);
          setSteps([{ text: "", imageUrl: null }]);
          setStepImageUrls({});
        }
        console.log(
          `${isEditing ? "Recipe updated" : "Recipe created"} successfully:`,
          response.data
        );
      } else {
        setCreationError(
          response.data?.message ||
            `Failed to ${
              isEditing ? "update" : "create"
            } recipe. Please try again.`
        );
        console.error(
          `Failed to ${isEditing ? "update" : "create"} recipe:`,
          response
        );
      }
    } catch (error) {
      setCreationError(
        error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred."
      );
      console.error(
        `Error ${isEditing ? "updating" : "creating"} recipe:`,
        error.response?.data?.message
      );
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

  const imageWidth = "100px";

  if (recipeLoading) {
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

  if (recipeError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography color="error">Error: {recipeError}</Typography>
      </Box>
    );
  }
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
          {isEditing
            ? "Recipe Updated Successfully!"
            : "Recipe created successfully!"}
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
        {isEditing ? "Edit Recipe" : "Create a Recipe"}
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
                {bannerUrl && (
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
              {bannerUrl && (
                <Box sx={{ mt: 2, width: "200px", height: "200px" }}>
                  <img
                    src={bannerUrl}
                    alt="Banner Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
              {errorBanner && (
                <Box display="flex" justifyContent="center" my={2}>
                  {errorBanner !== null && (
                    <Typography color="error">Error: {errorBanner}</Typography>
                  )}
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
                      startAdornment: stepImageUrls[index] ? (
                        <InputAdornment position="start">
                          <Box sx={{ width: "70px", height: "70px" }}>
                            <img
                              src={stepImageUrls[index]}
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
                          {stepImageUrls[index] && (
                            <IconButton
                              color="error"
                              onClick={() => {
                                setStepImagesFetched(true);
                                removeStepImage(index);
                              }}
                              sx={{ mr: 1 }}
                            >
                              <CloseIcon />
                            </IconButton>
                          )}
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
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
                {creating
                  ? "Saving..."
                  : isEditing
                  ? "Save Recipe"
                  : "Create Recipe"}
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
                              {" "}
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
