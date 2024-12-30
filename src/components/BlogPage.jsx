import BlogDetailed from "./BlogDetailed"
import Box from '@mui/material/Box';
import CommentSection from "./CommentSection";
import RecommendedUsers from "./RecommendedUsers";
import UpcomingEvents from "./UpcomingEvents";
import { useSearchParams } from 'react-router-dom'

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();


  return(
    <Box sx={{ scale: { xs: "70%", sm: "70%", md: "80%", lg: "84%", xl: "100%" }, transformOrigin: "top", width: { lg: "90%", xl: "100%" }, margin: "0 auto" }} data-testid="blog-page-container">
      <BlogDetailed blogId={searchParams.get('id')} data-testid="blog-detailed"/>
      <CommentSection type="blog" contentId={searchParams.get('id')} data-testid="comment-section" />
      <RecommendedUsers data-testid="recommended-users"/>
      <UpcomingEvents data-testid="upcoming-events"/>
    </Box>
  )
}