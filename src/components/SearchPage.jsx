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
  const query = searchParams.get("query"); // Not used for fetching yet

  return (
    <Box
      sx={{
        width: { xs: 200, sm: 400, md: 520, lg: 520, xl: 600 },
        margin: "0 auto",
      }}
    >
      {type == "user" && <SearchedUsers />}
      {type == "blog" && <SearchedBlogs />}
      {type == "recipe" && <SearchedRecipes />}
      {!type && <SearchedUsers />}

      <RecommendedUsers />
      <UpcomingEvents />
    </Box>
  );
}
