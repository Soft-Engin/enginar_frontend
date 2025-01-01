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
  Divider,
  IconButton,
  alpha,
  styled,
  InputBase,
  CircularProgress,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import RecipeMini from "./RecipeMini";
import { LoadingErrorDisplay } from "./LoadingErrorDisplay";

// Styled Components for SearchBar
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

const RecipeSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [error, setError] = useState(null);
  const [errorRecipes, setErrorRecipes] = useState(null);
  const [ingredientImages, setIngredientImages] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [pageGroup, setPageGroup] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

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

  const addIngredient = (ingredient) => {
    if (selectedIngredients.some((item) => item.id === ingredient.id)) {
      return;
    }
    setSelectedIngredients([...selectedIngredients, ingredient]);
  };

  const removeIngredient = (ingredient) => {
    setSelectedIngredients(
      selectedIngredients.filter((item) => item.id !== ingredient.id)
    );
  };

  // Search Recipes Button Handler
  const handleSearchRecipes = async () => {
    setPage(1); // Reset page to 1 for new search
    setRecipes([]); // Clear existing recipes
    setTotalRecipes(0);
    setPageGroup(1); // Reset page group
    // Prevent search if no ingredients are selected
    if (selectedIngredients.length === 0) {
      return;
    }
    await searchRecipes(1); // Fetch the first page of results
  };

  // Function to actually search for the recipes
  const searchRecipes = async (pageToSearch) => {
    setLoadingRecipes(true);
    setErrorRecipes(null);
    try {
      const params = new URLSearchParams();
      selectedIngredients.forEach((ingredient) => {
        params.append("ingredientIds", ingredient.id);
      });
      params.append("pageSize", pageSize);
      params.append("pageNumber", pageToSearch);

      const response = await axios.get("/api/v1/recipes/search", {
        params: params,
      });
      if (response.data && response.data.items) {
        setRecipes(response.data.items);
        setTotalRecipes(response.data.totalCount);
        setTotalPages(Math.ceil(response.data.totalCount / pageSize));
      }
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setErrorRecipes(err.message || "An unexpected error occurred.");
    } finally {
      setLoadingRecipes(false);
    }
  };

  // Handle page change
  const handlePageChange = async (event, value) => {
    setPage(value);
    await searchRecipes(value);
  };

  // Update the page group when the page changes
  useEffect(() => {
    setPageGroup(page);
  }, [page]);

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
    <Box sx={{ p: 4, width: "90vw", overflow: "hidden", height: "90vh" }}>
      <Typography variant="h4" gutterBottom>
        Find Recipes by Ingredients
      </Typography>

      <Grid container spacing={3} sx={{ height: "100%" }}>
        {/* Left side: Ingredient Selection */}
        <Grid
          item
          xs={12}
          md={7}
          sx={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          {/* Search Bar */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <StyledInputBase
              placeholder="Search Ingredients"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startAdornment={<SearchIcon />}
            />
          </Box>

          {/* Ingredient List */}
          <Box
            sx={{
              overflowY: "auto",
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
            }}
          >
            {filteredIngredients.length === 0 && searchTerm ? (
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
                  <div style={{ display: "flex" }}>
                    {categorizedIngredients[letter].map((ingredient) => (
                      <div
                        style={{ marginRight: 5, marginLeft: 5 }}
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

          {/* Selected Ingredients Display */}
          <Box
            sx={{
              mt: 2,
              p: 1,
              display: "flex",
              alignItems: "center",
              flexWrap: "nowrap",
              overflowX: "auto", // Add horizontal scroll
              border: "1px solid #ccc",
              backgroundColor: "white",
              minHeight: "140px",
            }}
          >
            {selectedIngredients.length === 0 ? (
              <Typography variant="body1" color="textSecondary">
                No ingredients selected.
              </Typography>
            ) : (
              selectedIngredients.map((ingredient) => (
                <Card
                  key={ingredient.id}
                  variant="outlined"
                  sx={{
                    position: "relative",
                    backgroundColor: "#A5E072",
                    margin: 1,
                    width: "120px", //Same width as selection
                    flexShrink: 0, // Prevent cards from shrinking
                  }}
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
                      minHeight: 0,
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
              ))
            )}
          </Box>
        </Grid>

        {/* Right side: Recipe Results */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid #ccc",
              backgroundColor: "white",
              p: 1,
              height: "100%", // Important: Set the height
            }}
          >
            <Box
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                sx={{ backgroundColor: "#4B9023" }}
                onClick={handleSearchRecipes}
                startIcon={<SearchIcon />}
                disabled={selectedIngredients.length === 0 || loadingRecipes}
              >
                {loadingRecipes ? "Searching..." : "Search Recipes"}
              </Button>
            </Box>
            <Divider>
              <Typography variant="subtitle1" color="textSecondary">
                {totalRecipes} {totalRecipes === 1 ? "Recipe" : "Recipes"} Found
                (Page {page} of {totalPages > 0 ? totalPages : 1})
              </Typography>
            </Divider>
            <LoadingErrorDisplay
              loading={loadingRecipes}
              error={errorRecipes}
            />

            {/* Recipe List */}
            <Box
              sx={{
                overflowY: "auto",
                flex: 1,
                p: 1,
                maxHeight: "100%",
              }}
            >
              {/* Pagination controls */}
              <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                {totalPages > 1 && (
                  <Pagination
                    count={totalPages}
                    page={pageGroup}
                    onChange={(event, value) => {
                      const newPage = value;
                      setPage(newPage);
                      handlePageChange(null, newPage);
                    }}
                    variant="outlined"
                  />
                )}
              </Box>
              {recipes.length === 0 && !loadingRecipes && !errorRecipes ? (
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ textAlign: "center", mt: 3 }}
                >
                  No recipes found for the selected ingredients.
                </Typography>
              ) : (
                recipes.map((recipe, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <RecipeMini recipe={recipe} />
                  </Box>
                ))
              )}
              {loadingRecipes && (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  minHeight="200px"
                >
                  <CircularProgress />
                </Box>
              )}
              {/* Pagination controls at the bottom*/}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                {totalPages > 1 && (
                  <Pagination
                    count={totalPages}
                    page={pageGroup}
                    onChange={(event, value) => {
                      const newPage = value;
                      setPage(newPage);
                      handlePageChange(null, newPage);
                    }}
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecipeSearch;
