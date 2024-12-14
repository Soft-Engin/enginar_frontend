import EventDetailed from "./EventDetailed"
import Box from '@mui/material/Box';
import CommentSection from "./CommentSection";
import RecommendedUsers from "./RecommendedUsers";
import UpcomingEvents from "./UpcomingEvents";

export default function EventPage() {
  return(
    <Box sx={{ m: 4, maxWidth: 900 }}>
      <EventDetailed />
      <CommentSection />
      <RecommendedUsers />
      <UpcomingEvents />
    </Box>
  )
}