import BlogDetailed from "./BlogDetailed"
import Box from '@mui/material/Box';
import CommentSection from "./CommentSection";
import RecommendedUsers from "./RecommendedUsers";
import UpcomingEvents from "./UpcomingEvents";

import { useSearchParams } from 'react-router-dom'

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  return(
    <Box sx={{ m: 4, maxWidth: 800 }}>
      <BlogDetailed blogId={searchParams.get('id')}/>
      <CommentSection type="blog" contentId={searchParams.get('id')} />
      <RecommendedUsers />
      <UpcomingEvents />
    </Box>
  )
}