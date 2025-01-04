import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
  Pagination,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import RecipeMini from "./RecipeMini";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ display: "flex", justifyContent: "center", height: "100%" }}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            height: "100%",
            overflowY: "auto",
            px: 2
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const RecipeSelectionDialog = ({ open, onClose, userId, onRecipeSelect }) => {
  const [ownRecipes, setOwnRecipes] = useState([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [errorRecipes, setErrorRecipes] = useState(null);
  const [value, setValue] = useState(0);
  const [ownTotalPages, setOwnTotalPages] = useState(0);
  const [bookmarkedTotalPages, setBookmarkedTotalPages] = useState(0);
  const ownPage = useRef(1);
  const bookmarkedPage = useRef(1);
  const pageSize = 5;

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleRecipeClick = (recipe) => {
    // If it's a bookmarked recipe, adjust the structure
    if (recipe && recipe.recipeId) {
      onRecipeSelect({ ...recipe, id: recipe.recipeId });
    } else {
      onRecipeSelect(recipe);
    }
  };

  const fetchRecipes = async () => {
    if (!userId) return;

    setLoadingRecipes(true);
    setErrorRecipes(null);

    try {
      const fetchOwnRecipes = async () => {
        try {
          const ownResponse = await axios.get(
            `/api/v1/users/${userId}/recipes`,
            {
              params: { pageSize: pageSize, page: ownPage.current },
            }
          );
          if (ownResponse.status === 200) {
            setOwnRecipes(ownResponse.data.items);
            setOwnTotalPages(Math.ceil(ownResponse.data.totalCount / pageSize));
          } else {
            setOwnRecipes([]);
            setOwnTotalPages(0);
          }
        } catch (err) {
          if (err.response?.status !== 404) {
            console.error("Error fetching own recipes:", err);
            setErrorRecipes("Failed to fetch own recipes.");
          }
          setOwnRecipes([]);
          setOwnTotalPages(0);
        }
      };

      const fetchBookmarkedRecipes = async () => {
        try {
          const bookmarkedResponse = await axios.get(
            `/api/v1/users/${userId}/bookmarks/recipes`,
            {
              params: {
                pageSize: pageSize,
                page: bookmarkedPage.current,
              },
            }
          );
          if (bookmarkedResponse.status === 200) {
            setBookmarkedRecipes(bookmarkedResponse.data.items);
            setBookmarkedTotalPages(
              Math.ceil(bookmarkedResponse.data.totalCount / pageSize)
            );
          } else {
            setBookmarkedRecipes([]);
            setBookmarkedTotalPages(0);
          }
        } catch (err) {
          if (err.response?.status !== 404) {
            console.error("Error fetching bookmarked recipes:", err);
            setErrorRecipes("Failed to fetch bookmarked recipes.");
          }
          setBookmarkedRecipes([]);
          setBookmarkedTotalPages(0);
        }
      };

      await Promise.all([fetchOwnRecipes(), fetchBookmarkedRecipes()]);
    } catch (err) {
      setErrorRecipes(
        err.message || "An unexpected error occurred while fetching recipes."
      );
      console.error("Error fetching recipes:", err);
    } finally {
      setLoadingRecipes(false);
    }
  };

  const handleOwnPageChange = async (event, value) => {
    ownPage.current = value;
    await fetchRecipes();
  };
  const handleBookmarkedPageChange = async (event, value) => {
    bookmarkedPage.current = value;
    await fetchRecipes();
  };

  useEffect(() => {
    fetchRecipes();
    ownPage.current = 1;
    bookmarkedPage.current = 1;
  }, [open, userId, value]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={"md"}
      PaperProps={{
        sx: {
          width: { xs: 250, sm: 400, md: 550, lg: 600, xl: 620 },
          borderRadius: 4,
          backgroundColor: "#C8EFA5",
          padding: 0.5,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "bold",
          color: "#333",
          fontSize: "1.25rem",
        }}
      >
        Select a Recipe
        <IconButton
          onClick={onClose}
          sx={{
            color: "#555",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: 0,
        }}
      >
        {errorRecipes && (
          <Typography color="error" textAlign={"center"} mb={2}>
            {errorRecipes}
          </Typography>
        )}
        {loadingRecipes ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box
              sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 2 }}
            >
              <Tabs
                centered
                value={value}
                onChange={handleTabChange}
                aria-label="Feed Tabs"
                variant="fullWidth"
                sx={{
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#4B9023",
                  },
                  "& .MuiTab-root": {
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    textTransform: "none",
                    padding: "12px 20px",
                  },
                  "& .MuiTab-root.Mui-selected": {
                    color: "#4B9023",
                  },
                  "& .MuiTab-root:hover": {
                    color: "#66c72e",
                  },
                }}
              >
                <Tab
                  label="Your Recipes"
                  sx={{ "&.Mui-selected": { color: "#4B9023" } }}
                  {...a11yProps(0)}
                />
                <Tab
                  label="Bookmarked Recipes"
                  sx={{ "&.Mui-selected": { color: "#4B9023" } }}
                  {...a11yProps(1)}
                />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              {ownRecipes.length === 0 && !loadingRecipes && !errorRecipes ? (
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ textAlign: "center", mt: 3 }}
                >
                  No recipes found.
                </Typography>
              ) : (
                <>
                  {ownRecipes.map((recipe) => (
                    <Box
                      key={recipe.id}
                      sx={{
                        mb: 2,
                      }}
                    >
                      <div onClick={() => handleRecipeClick(recipe)}>
                        <RecipeMini recipe={recipe} disableActions={open} />
                      </div>
                    </Box>
                  ))}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 1,
                      mb: 1,
                    }}
                  >
                    {ownTotalPages > 1 && (
                      <Pagination
                        count={ownTotalPages}
                        page={ownPage.current}
                        onChange={handleOwnPageChange}
                        variant="outlined"
                      />
                    )}
                  </Box>
                </>
              )}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              {bookmarkedRecipes.length === 0 &&
              !loadingRecipes &&
              !errorRecipes ? (
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ textAlign: "center", mt: 3 }}
                >
                  No recipes found.
                </Typography>
              ) : (
                <>
                  {bookmarkedRecipes.map((recipe) => (
                    <Box
                      key={recipe.id}
                      sx={{
                        mb: 2,
                      }}
                    >
                      <div onClick={() => handleRecipeClick(recipe)}>
                        <RecipeMini recipe={recipe} disableActions={open} />
                      </div>
                    </Box>
                  ))}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 1,
                      mb: 1,
                    }}
                  >
                    {bookmarkedTotalPages > 1 && (
                      <Pagination
                        count={bookmarkedTotalPages}
                        page={bookmarkedPage.current}
                        onChange={handleBookmarkedPageChange}
                        variant="outlined"
                      />
                    )}
                  </Box>
                </>
              )}
            </CustomTabPanel>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RecipeSelectionDialog;
