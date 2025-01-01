import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import BlogMini from "./BlogMini";
import RecipeMini from "./RecipeMini";
import axios from "axios";
import { LoadingErrorDisplay } from "./LoadingErrorDisplay";
import { LinearProgress } from "@mui/material";

function FollowingTab() {
  const [followingContent, setFollowingContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [errorMore, setErrorMore] = useState(null);

  let pageSize = 10;
  let recipePageNumber = 1;
  let blogPageNumber = 1;
  let recipeTotalPages = 0;
  let blogTotalPages = 0;
  let scrollTimeout = null;
  const [loadingItem, setLoadingItem] = useState({});

  const fetchMoreData = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    setErrorMore(null);
    try {
      const [recipesResponse, blogsResponse] = await Promise.all([
        axios.get("/api/v1/feed/recipe/followed", {
          params: {
            pageSize: pageSize,
            pageNumber: recipePageNumber,
          },
        }),
        axios.get("/api/v1/feed/blog/followed", {
          params: {
            pageSize: pageSize,
            pageNumber: blogPageNumber,
          },
        }),
      ]);
      let newContent = [];
      if (recipesResponse.data && recipesResponse.data.items) {
        newContent = [
          ...newContent,
          ...recipesResponse.data.items.map((item) => ({
            ...item,
            type: "recipe",
          })),
        ];
        recipePageNumber += 1;
      }
      if (blogsResponse.data && blogsResponse.data.items) {
        newContent = [
          ...newContent,
          ...blogsResponse.data.items.map((item) => ({
            ...item,
            type: "blog",
          })),
        ];
        blogPageNumber += 1;
      }

      setFollowingContent((prevContent) => {
        const combined = [...prevContent, ...newContent];
        combined.sort((a, b) => {
          const dateA = new Date(a.createdDate || a.creationDate);
          const dateB = new Date(b.createdDate || b.creationDate);
          return dateB - dateA;
        });
        return combined;
      });
    } catch (err) {
      console.error("Error fetching more following content:", err);
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

      if (
        scrollPosition >= totalContentHeight - 300 &&
        (recipePageNumber <= recipeTotalPages ||
          blogPageNumber <= blogTotalPages)
      ) {
        fetchMoreData();
      }
    }, 100);
  };

  useEffect(() => {
    const initialFetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const [recipesResponse, blogsResponse] = await Promise.all([
          axios.get("/api/v1/feed/recipe/followed", {
            params: { pageSize: pageSize, pageNumber: 1 },
          }),
          axios.get("/api/v1/feed/blog/followed", {
            params: { pageSize: pageSize, pageNumber: 1 },
          }),
        ]);

        let initialContent = [];
        if (recipesResponse.data && recipesResponse.data.items) {
          initialContent = [
            ...initialContent,
            ...recipesResponse.data.items.map((item) => ({
              ...item,
              type: "recipe",
            })),
          ];
        }
        if (blogsResponse.data && blogsResponse.data.items) {
          initialContent = [
            ...initialContent,
            ...blogsResponse.data.items.map((item) => ({
              ...item,
              type: "blog",
            })),
          ];
        }

        initialContent.sort((a, b) => {
          const dateA = new Date(a.createdDate || a.creationDate);
          const dateB = new Date(b.createdDate || b.creationDate);
          return dateB - dateA;
        });

        setFollowingContent(initialContent);
        recipePageNumber = 2;
        blogPageNumber = 2;
        recipeTotalPages = Math.ceil(
          recipesResponse.data?.totalCount / pageSize
        );
        blogTotalPages = Math.ceil(blogsResponse.data?.totalCount / pageSize);
      } catch (err) {
        console.error("Error fetching initial following content:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    initialFetch();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleItemLoading = (index, isLoading) => {
    setLoadingItem((prevState) => ({ ...prevState, [index]: isLoading }));
  };

  const hasContent = followingContent.length > 0;

  return (
    <div>
      <LoadingErrorDisplay
        loading={loading}
        error={error}
        loadingMore={loadingMore}
        errorMore={errorMore}
      />
      {!hasContent && !loading && !error && (
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{ textAlign: "center", padding: 2 }}
        >
          You have no available content from your following.
        </Typography>
      )}
      {hasContent &&
        followingContent.map((item, index) => (
          <Box key={index} sx={{ width: 600, mb: 2 }}>
            {loadingItem[index] && <LinearProgress />}
            {item.type === "recipe" && (
              <RecipeMini
                recipe={item}
                onLoadingChange={(isLoading) =>
                  handleItemLoading(index, isLoading)
                }
              />
            )}
            {item.type === "blog" && (
              <BlogMini
                blog={item}
                onLoadingChange={(isLoading) =>
                  handleItemLoading(index, isLoading)
                }
              />
            )}
          </Box>
        ))}
    </div>
  );
}

export default FollowingTab;
