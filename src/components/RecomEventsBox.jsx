// RecomEventsBox.jsx
import React from "react";
import { Box } from "@mui/material";
import RecommendedUsers from "./RecommendedUsers";
import UpcomingEvents from "./UpcomingEvents";

export default function RecomEventsBox() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: { xs: "120px", sm: "120px", md: "120px", lg: "90px", xl: "90px" },
        right: { lg: "0.7%", xl: "2.5%" },
        display: "flex",
        flexDirection: { xs: "column", lg: "column", xl: "column" },
        gap: 2,
        scale: { xs: "0%", sm: "0%", md: "0%", lg: "85%", xl: "95%" },
        width: { xs: "95vw", md: "95vw", lg: "300px" },
        height: "85vh",
        justifyContent: "space-between"
      }}
    >
      <RecommendedUsers data-testid="recommended-users"/>
      <UpcomingEvents data-testid="upcoming-events"/>
    </Box>
  );
}