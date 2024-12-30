import React, { useState, useEffect } from "react";
import axios from "axios";
import { Stack, Box, CircularProgress, Typography } from "@mui/material";
import BlogMini from "./BlogMini";
import { LoadingErrorDisplay } from "./LoadingErrorDisplay";
import { useSearchParams } from "react-router-dom";

function UserBlogsTab() {
  const [blogs, setBlogs] = useState([]);
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
      const blogsResponse = await axios.get(`/api/v1/users/${userId}/blogs`, {
        params: { pageSize: pageSize, pageNumber: pageNumber },
      });
      if (blogsResponse.data && blogsResponse.data.items) {
        setBlogs((prevBlogs) => [...prevBlogs, ...blogsResponse.data.items]);
      }
      pageNumber += 1;
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
    const fetchUserBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/v1/users/${userId}/blogs`, {
          params: { pageSize: pageSize, pageNumber: 1 },
        });
        setBlogs(response.data.items);
        pageNumber = 2;
        totalPages = Math.ceil(response.data.totalCount / pageSize);
      } catch (err) {
        console.error("Error fetching user blogs:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserBlogs();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [userId]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <LoadingErrorDisplay
        loading={loading}
        error={error}
        loadingMore={loadingMore}
        errorMore={errorMore}
      />
      <Stack spacing={2} direction={"column"} alignItems={"center"}>
        {blogs.map((post) => (
          <BlogMini key={post.id} blog={post} />
        ))}
      </Stack>
    </Box>
  );
}

export default UserBlogsTab;
