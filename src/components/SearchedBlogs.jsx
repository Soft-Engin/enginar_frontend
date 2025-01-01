import BlogMini from "./BlogMini";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { LoadingErrorDisplay } from "./LoadingErrorDisplay";

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

export default function SearchedBlogs({ query }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [errorMore, setErrorMore] = useState(null);
  let pageSize = 10;
  let pageNumber = 1;
  let totalPages = 0;
  let scrollTimeout = null;

  const fetchData = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    setErrorMore(null);
    try {
      const blogsResponse = await axios.get("/api/v1/blogs/search", {
        params: {
          pageSize: pageSize,
          pageNumber: pageNumber,
          BodyContains: query,
          SortBy: "date",
        },
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
    const initialFetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("/api/v1/blogs/search", {
          params: {
            pageSize: pageSize,
            pageNumber: 1,
            BodyContains: query,
            SortBy: "date",
          },
        });
        setBlogs(response.data.items);
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
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 2 }}>
        <Tabs
          centered
          value={value}
          onChange={handleChange}
          aria-label="Search Tabs"
          sx={{ "& .MuiTabs-indicator": { backgroundColor: "#4B9023" } }}
        >
          <Tab
            label="Most Recent"
            sx={{ "&.Mui-selected": { color: "#4B9023" } }}
            {...a11yProps(0)}
          />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <LoadingErrorDisplay
          loading={loading}
          error={error}
          loadingMore={loadingMore}
          errorMore={errorMore}
        />
        {blogs.map((blog, index) => (
          <Box key={index} sx={{ width: 600, mb: 2 }}>
            <BlogMini blog={blog} />
          </Box>
        ))}
      </CustomTabPanel>
    </Box>
  );
}
