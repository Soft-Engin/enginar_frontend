import BlogDetailed from "./BlogDetailed";
import Box from "@mui/material/Box";
import CommentSection from "./CommentSection";
import { useSearchParams } from "react-router-dom";
import RecomEventsBox from "./RecomEventsBox";

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <Box sx={{ m: 4, width: 800, pb: 5 }}>
      <Box
        data-testid="blog-page-container"
        sx={{
          scale: { xs: "70%", sm: "70%", md: "90%", lg: "84%", xl: "100%" },
          transformOrigin: "top",
          width: { md: "90%", lg: "90%", xl: "100%" },
          margin: "0 auto",
        }}
      >
        <BlogDetailed data-testid="blog-detailed" blogId={searchParams.get("id")} />
        <CommentSection data-testid="comment-section" type="blog" contentId={searchParams.get("id")} />
      </Box>
      <RecomEventsBox/>
    </Box>
  );
}
