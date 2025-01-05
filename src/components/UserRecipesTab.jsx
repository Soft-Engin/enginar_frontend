import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import RecipeMini from "./RecipeMini";
import { LoadingErrorDisplay } from "./LoadingErrorDisplay";
import { useSearchParams } from "react-router-dom";

function UserRecipesTab() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [errorMore, setErrorMore] = useState(null);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");

  let pageSize = 10;
  let pageNumber = 1;
  let totalPages = 0;
  let scrollTimeout = null;

  const fetchData = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    setErrorMore(null);
    try {
      const recipesResponse = await axios.get(
        `/api/v1/users/${userId}/recipes`,
        {
          params: { pageSize: pageSize, pageNumber: pageNumber },
        }
      );
      if (recipesResponse.data && recipesResponse.data.items) {
        setRecipes((prevRecipes) => [
          ...prevRecipes,
          ...recipesResponse.data.items,
        ]);
      }
      pageNumber += 1;
    } catch (err) {
      console.error("Error fetching more data: ", err);
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
    const fetchUserRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/v1/users/${userId}/recipes`, {
          params: { pageSize: pageSize, pageNumber: 1 },
        });
        setRecipes(response.data.items);
        pageNumber = 2;
        totalPages = Math.ceil(response.data.totalCount / pageSize);
      } catch (err) {
        console.error("Error fetching user recipes: ", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserRecipes();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [userId]);

  return (
    <div data-testid="user-recipes-tab">
      <LoadingErrorDisplay
        data-testid="loading-error-display"
        loading={loading}
        error={error}
        loadingMore={loadingMore}
        errorMore={errorMore}
      />
      <div data-testid="recipes-stack">
        {recipes.map((recipe, index) => (
          <Box key={index} sx={{ width: 600, mb: 2 }}>
            <RecipeMini key={recipe.id} recipe={recipe} />
          </Box>
        ))}
      </div>
    </div>
  );
}

export default UserRecipesTab;
