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
  const query = searchParams.get("query");

  return (
    <Box
      sx={{
        width: 600,
        margin: "0 auto",
      }}
    >
      {type == "user" && <SearchedUsers query={query} />}
      {type == "blog" && <SearchedBlogs query={query} />}
      {type == "recipe" && <SearchedRecipes query={query} />}
      {!type && <SearchedUsers query={query} />}

      <RecommendedUsers />
      <UpcomingEvents />
    </Box>
  );
}
