import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import RecipeMini from "./RecipeMini";
import { LoadingErrorDisplay } from "./LoadingErrorDisplay";

function PopularRecipesTab() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [errorMore, setErrorMore] = useState(null);
  let randSeed = (Math.random() + 1).toString(36).substring(7);
  let pageSize = 10;
  let pageNumber = 1;
  let totalPages = 0;
  let scrollTimeout = null;

  const fetchData = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    setErrorMore(null);
    try {
      const recipesResponse = await axios.get("/api/v1/feed/recipe", {
        params: { pageSize: pageSize, seed: randSeed, pageNumber: pageNumber },
      });
      if (recipesResponse.data && recipesResponse.data.items) {
        setRecipes((prevRecipes) => [
          ...prevRecipes,
          ...recipesResponse.data.items,
        ]);
      }
      pageNumber += 1;
      console.log(pageNumber);
    } catch (err) {
      console.error("Error fetching more data:", err);
      setErrorMore(err.message || "An unexpected error occurred.");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleScroll = () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
      if (loadingMore || errorMore) return;
      const scrollPosition =
        window.innerHeight + document.documentElement.scrollTop;
      const totalContentHeight = document.documentElement.scrollHeight;
      // Check if scrolled to the bottom
      if (
        scrollPosition >= totalContentHeight - 300 &&
        pageNumber <= totalPages
      ) {
        fetchData();
      }
    }, 100);
  };

  useEffect(() => {
    const initialFetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("/api/v1/feed/recipe", {
          params: { pageSize: pageSize, seed: randSeed, pageNumber: 1 },
        });
        setRecipes(response.data.items);
        pageNumber = 2;
        totalPages = Math.ceil(response.data.totalCount / pageSize);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    initialFetch();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div data-testid="popular-recipes-tab">
      <LoadingErrorDisplay
        data-testid="loading-error-display"
        loading={loading}
        error={error}
        loadingMore={loadingMore}
        errorMore={errorMore}
      />
      <div data-testid="recipes-container">
        {recipes.map((recipe, index) => (
          <Box data-testid="recipe-box" key={index} sx={{ width: 600, mb: 2 }}>
            <RecipeMini recipe={recipe} />
          </Box>
        ))}
      </div>
    </div>
  );
}

export default PopularRecipesTab;
