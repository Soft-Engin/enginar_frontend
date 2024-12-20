import BlogDetailed from "./BlogDetailed"
import Box from '@mui/material/Box';
import CommentSection from "./CommentSection";
import RecommendedUsers from "./RecommendedUsers";
import UpcomingEvents from "./UpcomingEvents";

export default function BlogPage() {
  return(
    <Box sx={{ m: 4, maxWidth: 800 }}>
      <BlogDetailed />
      <CommentSection />
      <RecommendedUsers />
      <UpcomingEvents />
    </Box>
  )
}