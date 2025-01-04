import BlogDetailed from "./BlogDetailed";
import Box from "@mui/material/Box";
import CommentSection from "./CommentSection";
import RecommendedUsers from "./RecommendedUsers";
import UpcomingEvents from "./UpcomingEvents";

import { useSearchParams } from "react-router-dom";

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <Box sx={{ m: 4, width: 800, pb: 5 }}>
      <Box
        sx={{
          scale: { xs: "70%", sm: "70%", md: "90%", lg: "84%", xl: "100%" },
          transformOrigin: "top",
          width: { md: "90%", lg: "90%", xl: "100%" },
          margin: "0 auto",
        }}
      >
        <BlogDetailed blogId={searchParams.get("id")} />
        <CommentSection type="blog" contentId={searchParams.get("id")} />
      </Box>
      <RecommendedUsers />
      <UpcomingEvents />
    </Box>
  );
}
