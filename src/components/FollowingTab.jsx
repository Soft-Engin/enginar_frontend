import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import BlogMini from "./BlogMini";
import RecipeMini from "./RecipeMini";
import axios from "axios";
import { LoadingErrorDisplay } from "./LoadingErrorDisplay";


function FollowingTab() {
  const [followingContent, setFollowingContent] = useState([]);
    const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
  
    useEffect(() => {
    const fetchFollowingContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const [recipesResponse, blogsResponse] = await Promise.all([
          axios.get("/api/v1/feed/recipe", {
            params: { pageSize: 10, seed: (Math.random() + 1).toString(36).substring(7), pageNumber: 1 },
          }),
          axios.get("/api/v1/feed/blog", {
            params: { pageSize: 10, seed: (Math.random() + 1).toString(36).substring(7), pageNumber: 1 },
          }),
        ]);
        const combinedContent = [
          ...(recipesResponse.data?.items || []),
          ...(blogsResponse.data?.items || []),
        ];
        setFollowingContent(combinedContent);
      } catch (err) {
        console.error("Error fetching following content:", err);
          setError(err.message || "An unexpected error occurred.");
      } finally {
         setLoading(false);
      }
    };

    fetchFollowingContent();
  }, []);


  return (
      <div>
           <LoadingErrorDisplay loading={loading} error={error}  />
            {followingContent.map((item, index) => (
                <Box key={index} sx={{ width: 600, mb: 2 }}>
                    {item.recipeId && <RecipeMini recipe={item} />}
                    {item.blogId && <BlogMini blog={item} />}
                </Box>
            ))}
       </div>
  );
}

export default FollowingTab;