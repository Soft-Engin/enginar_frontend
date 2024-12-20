import * as React from "react";
import { useSearchParams } from "react-router-dom";
import RecommendedUsers from "./RecommendedUsers";
import UpcomingEvents from "./UpcomingEvents";
import Box from "@mui/material/Box";
import SearchedUsers from "./SearchedUsers";
import SearchedBlogs from "./SearchedBlogs";
import SearchedRecipes from "./SearchedRecipes";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  return (
    <Box>
      {type == "user" && <SearchedUsers />}
      {type == "blog" && <SearchedBlogs />}
      {type == "recipe" && <SearchedRecipes />}
      {!type && <SearchedUsers />}

      <RecommendedUsers />
      <UpcomingEvents />
    </Box>
  );
}
