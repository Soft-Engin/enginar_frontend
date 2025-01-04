import React, { useState, useEffect } from "react";
import RecipeMini from "./RecipeMini";
import BlogMini from "./BlogMini";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid2";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function SavedLikedPosts() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "likes"; // Default to 'likes' if no mode is specified

  const [value, setValue] = useState(0); // 0 for Recipes, 1 for Blogs
  const [recipes, setRecipes] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingMoreRecipes, setLoadingMoreRecipes] = useState(false);
  const [loadingMoreBlogs, setLoadingMoreBlogs] = useState(false);
  const [errorRecipes, setErrorRecipes] = useState(null);
  const [errorBlogs, setErrorBlogs] = useState(null);
  const userId = JSON.parse(localStorage.getItem("userData"))?.userId;

  let recipesPageNumber = 1;
  let blogsPageNumber = 1;
  let recipesTotalPages = 0;
  let blogsTotalPages = 0;
  let scrollTimeout = null;
  let pageSize = 8;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchRecipes = async () => {
    if (loadingMoreRecipes) return;
    setLoadingMoreRecipes(true);
    setErrorRecipes(null);
    try {
      const params = { page: recipesPageNumber, pageSize: pageSize };
      const endpoint =
        mode === "likes"
          ? `/api/v1/users/${userId}/likes/recipes`
          : `/api/v1/users/${userId}/bookmarks/recipes`;
      const response = await axios.get(endpoint, { params });

      if (response.data && response.data.items) {
        setRecipes((prevRecipes) => [...prevRecipes, ...response.data.items]);
      }
      recipesTotalPages = Math.ceil(response.data.totalCount / pageSize);
      recipesPageNumber += 1;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setRecipes([]);
        recipesTotalPages = 0;
        recipesPageNumber = 2;
      } else {
        console.error("Error fetching recipes:", error);
        setErrorRecipes(error.message || "An unexpected error occurred.");
      }
    } finally {
      setLoadingMoreRecipes(false);
    }
  };

  const fetchBlogs = async () => {
    if (loadingMoreBlogs) return;
    setLoadingMoreBlogs(true);
    setErrorBlogs(null);
    try {
      const params = { page: blogsPageNumber, pageSize: pageSize };
      const endpoint =
        mode === "likes"
          ? `/api/v1/users/${userId}/likes/blogs`
          : `/api/v1/users/${userId}/bookmarks/blogs`;
      const response = await axios.get(endpoint, { params });

      if (response.data && response.data.items) {
        setBlogs((prevBlogs) => [...prevBlogs, ...response.data.items]);
      }
      blogsTotalPages = Math.ceil(response.data.totalCount / pageSize);
      blogsPageNumber += 1;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setBlogs([]);
        blogsTotalPages = 0;
        blogsPageNumber = 2;
      } else {
        console.error("Error fetching blogs:", error);
        setErrorBlogs(error.message || "An unexpected error occurred.");
      }
    } finally {
      setLoadingMoreBlogs(false);
    }
  };

  const handleScroll = () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
      const scrollPosition =
        window.innerHeight + document.documentElement.scrollTop;
      const totalContentHeight = document.documentElement.scrollHeight;
      if (scrollPosition >= totalContentHeight - 300) {
        if (value === 0 && recipesPageNumber <= recipesTotalPages) {
          fetchRecipes();
        } else if (value === 1 && blogsPageNumber <= blogsTotalPages) {
          fetchBlogs();
        }
      }
    }, 100);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingRecipes(true);
      setLoadingBlogs(true);

      try {
        const recipesEndpoint =
          mode === "likes"
            ? `/api/v1/users/${userId}/likes/recipes`
            : `/api/v1/users/${userId}/bookmarks/recipes`;
        const recipesResponse = await axios.get(recipesEndpoint, {
          params: { page: 1, pageSize: pageSize },
        });

        if (recipesResponse.data && recipesResponse.data.items) {
          setRecipes(recipesResponse.data.items);
          recipesTotalPages = Math.ceil(
            recipesResponse.data.totalCount / pageSize
          );
          recipesPageNumber = 2;
        } else {
          setRecipes([]);
          recipesTotalPages = 0;
          recipesPageNumber = 2;
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setRecipes([]);
          recipesTotalPages = 0;
          recipesPageNumber = 2;
        } else {
          console.error("Error fetching initial recipes data:", error);
          setErrorRecipes(error.message || "An unexpected error occurred.");
        }
      } finally {
        setLoadingRecipes(false);
      }
      try {
        const blogsEndpoint =
          mode === "likes"
            ? `/api/v1/users/${userId}/likes/blogs`
            : `/api/v1/users/${userId}/bookmarks/blogs`;
        const blogsResponse = await axios.get(blogsEndpoint, {
          params: { page: 1, pageSize: pageSize },
        });
        if (blogsResponse.data && blogsResponse.data.items) {
          setBlogs(blogsResponse.data.items);
          blogsTotalPages = Math.ceil(blogsResponse.data.totalCount / pageSize);
          blogsPageNumber = 2;
        } else {
          setBlogs([]);
          blogsTotalPages = 0;
          blogsPageNumber = 2;
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setBlogs([]);
          blogsTotalPages = 0;
          blogsPageNumber = 2;
        } else {
          console.error("Error fetching initial blogs data:", error);
          setErrorBlogs(error.message || "An unexpected error occurred.");
        }
      } finally {
        setLoadingBlogs(false);
      }
    };
    fetchInitialData();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, userId]);

  const getNoContentMessage = () => {
    return `No ${mode === "likes" ? "liked" : "saved"} `;
  };

  return (
    <Box sx={{ px: 10 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          centered
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
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
            label="Recipes"
            sx={{ "&.Mui-selected": { color: "#4B9023" } }}
            {...a11yProps(0)}
          />
          <Tab
            label="Blogs"
            sx={{ "&.Mui-selected": { color: "#4B9023" } }}
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Grid
          container
          rowSpacing={4}
          columnSpacing={4}
          justifyContent="center"
          sx={{
            pt: 2,
            pb: 5,
            scale: { md: "85%", lg: "85%", xl: "95%" },
            transformOrigin: "top",
          }}
        >
          {loadingRecipes && <div>Loading recipes...</div>}
          {errorRecipes && <div>Error loading recipes: {errorRecipes}</div>}
          {recipes.length === 0 && !loadingRecipes && !errorRecipes && (
            <div>{getNoContentMessage()} recipes found.</div>
          )}
          {recipes.map((recipe, index) => (
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              key={index}
              display="flex"
              justifyContent="center"
              alignItems="stretch"
              sx={{
                width: "100%",
                maxWidth: { sm: 300, md: 410, lg: 410, xl: 425 },
              }}
            >
              <RecipeMini recipe={recipe} sx={{ width: "100%" }} />
            </Grid>
          ))}
        </Grid>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Grid
          container
          rowSpacing={4}
          columnSpacing={4}
          justifyContent="center"
          sx={{ pt: 2, pb: 5 }}
        >
          {loadingBlogs && <div>Loading blogs...</div>}
          {errorBlogs && <div>Error loading blogs: {errorBlogs}</div>}
          {blogs.length === 0 && !loadingBlogs && !errorBlogs && (
            <div>{getNoContentMessage()} blogs found.</div>
          )}
          {blogs.map((blog, index) => (
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              key={index}
              display="flex"
              justifyContent="center"
              alignItems="stretch"
              sx={{
                width: "100%",
                maxWidth: { sm: 300, md: 410, lg: 410, xl: 425 },
              }}
            >
              <BlogMini blog={blog} sx={{ width: "100%" }} />
            </Grid>
          ))}
        </Grid>
      </CustomTabPanel>
    </Box>
  );
}
