import * as React from "react";
import RecommendedUsers from "./RecommendedUsers";
import UpcomingEvents from "./UpcomingEvents";
import Box from "@mui/material/Box";
import SearchedUsers from "./SearchedUsers";

export default function SearchPage() {
  return (
    <Box>
      <SearchedUsers />

      <RecommendedUsers />
      <UpcomingEvents />
    </Box>
  );
}
