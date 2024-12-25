import * as React from "react";
import BlogMini from "./BlogMini";
import RecipeMini from "./RecipeMini";
import RecommendedUsers from "./RecommendedUsers";
import UpcomingEvents from "./UpcomingEvents";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import axios from "axios";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

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

export default function ContentFeed() {
  const [value, setValue] = React.useState(0);
  const [recipes, setRecipes] = React.useState([]);
  const [blogs, setBlogs] = React.useState([]);
  const [followingContent, setFollowingContent] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [errorMore, setErrorMore] = React.useState(null);
  let randSeed = (Math.random() + 1).toString(36).substring(7);
  let pageNumber = 1;
  let scrollTimeout = null;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchData = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    setErrorMore(null);
    try {
      const [recipesResponse, blogsResponse] = await Promise.all([
        axios.get("/api/v1/feed/recipe", {
          params: { pageSize: 10, seed: randSeed, pageNumber: pageNumber },
        }),
        axios.get("/api/v1/feed/blog", {
          params: { pageSize: 10, seed: randSeed, pageNumber: pageNumber },
        }),
      ]);
      if (recipesResponse.data && recipesResponse.data.items) {
        setRecipes((prevRecipes) => [
          ...prevRecipes,
          ...recipesResponse.data.items,
        ]);
      }
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
      if (scrollPosition >= totalContentHeight - 300) {
        fetchData();
      }
    }, 100);
  };

  React.useEffect(() => {
    const initialFetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const [recipesResponse, blogsResponse] = await Promise.all([
          axios.get("/api/v1/feed/recipe", {
            params: { pageSize: 10, seed: randSeed, pageNumber: 1 },
          }),
          axios.get("/api/v1/feed/blog", {
            params: { pageSize: 10, seed: randSeed, pageNumber: 1 },
          }),
        ]);
        setRecipes(recipesResponse.data.items);
        setBlogs(blogsResponse.data.items);
        pageNumber = 2;
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
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 2 }}>
        <Tabs
          centered
          value={value}
          onChange={handleChange}
          aria-label="Feed Tabs"
          sx={{ "& .MuiTabs-indicator": { backgroundColor: "#4B9023" } }}
        >
          <Tab
            label="Popular Recipes"
            sx={{ "&.Mui-selected": { color: "#4B9023" } }}
            {...a11yProps(0)}
          />
          <Tab
            label="Popular Blogs"
            sx={{ "&.Mui-selected": { color: "#4B9023" } }}
            {...a11yProps(1)}
          />
          <Tab
            label="Following"
            sx={{ "&.Mui-selected": { color: "#4B9023" } }}
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        {recipes.map((recipe, index) => (
          <Box key={index} sx={{ width: 600, mb: 2 }}>
            <RecipeMini recipe={recipe} />
          </Box>
        ))}
        {loadingMore && (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress size={20} />
          </Box>
        )}
        {errorMore && (
          <Box display="flex" justifyContent="center" my={2}>
            <Typography color="error">Error: {errorMore}</Typography>
          </Box>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {blogs.map((blog, index) => (
          <Box key={index} sx={{ width: 600, mb: 2 }}>
            <BlogMini blog={blog} />
          </Box>
        ))}
        {loadingMore && (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress size={20} />
          </Box>
        )}
        {errorMore && (
          <Box display="flex" justifyContent="center" my={2}>
            <Typography color="error">Error: {errorMore}</Typography>
          </Box>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {followingContent.map((user, index) => (
          <Box key={index} sx={{ width: 600, mb: 2 }}>
            <BlogMini blog={user} />
            <RecipeMini recipe={user} />
          </Box>
        ))}
      </CustomTabPanel>

      <RecommendedUsers />
      <UpcomingEvents />
    </Box>
  );
}
