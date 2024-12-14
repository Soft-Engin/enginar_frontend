import BlogDetailed from "./BlogDetailed"
import Box from '@mui/material/Box';
import CommentSection from "./CommentSection";

export default function BlogPage() {
  return(
    <Box sx={{ m: 5, maxWidth: 1000 }}>
      <BlogDetailed />
      <CommentSection />
    </Box>
  )
}