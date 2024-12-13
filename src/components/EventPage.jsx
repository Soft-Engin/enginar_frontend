import EventDetailed from "./EventDetailed"
import Box from '@mui/material/Box';
import CommentSection from "./CommentSection";

export default function EventPage() {
  return(
    <Box sx={{ m: 5, maxWidth: 1000 }}>
      <EventDetailed />
      <CommentSection />
    </Box>
  )
}