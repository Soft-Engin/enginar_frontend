import EventDetailed from "./EventDetailed";
import Box from "@mui/material/Box";
import CommentSection from "./CommentSection";
import RecommendedUsers from "./RecommendedUsers";
import UpcomingEvents from "./UpcomingEvents";

import { useSearchParams } from "react-router-dom";

export default function EventPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams.get("id"));
  return (
    <Box sx={{ m: 4, width: 800 }}>
      <Box
        sx={{
          scale: { xs: "70%", sm: "70%", md: "90%", lg: "84%", xl: "100%" },
          transformOrigin: "top",
          width: { lg: "90%", xl: "100%" },
          margin: "0 auto",
        }}
      >
        <EventDetailed eventId={searchParams.get("id")} />
        <CommentSection type="event" contentId={searchParams.get("id")} />
      </Box>
      <RecommendedUsers />
      <UpcomingEvents />
    </Box>
  );
}
