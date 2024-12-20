import * as React from "react";
import RecommendedUsers from "./RecommendedUsers";
import UpcomingEvents from "./UpcomingEvents";
import Box from "@mui/material/Box";
import SearchedUsers from "./SearchedUsers";
import SearchedBlogs from "./SearchedBlogs";
import SearchedRecipes from "./SearchedRecipes";

export default function SearchPage() {
  return (
    <Box>
      <SearchedUsers />

      <RecommendedUsers />
      <UpcomingEvents />
    </Box>
  );
}
