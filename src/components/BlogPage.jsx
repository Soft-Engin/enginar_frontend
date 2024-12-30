import BlogDetailed from "./BlogDetailed";
import Box from "@mui/material/Box";
import CommentSection from "./CommentSection";
import RecommendedUsers from "./RecommendedUsers";
import UpcomingEvents from "./UpcomingEvents";

export default function BlogPage() {
  return (
    <Box sx={{ m: 4, maxWidth: 800 }}>
      <Box
        sx={{
          scale: { xs: "70%", sm: "70%", md: "80%", lg: "84%", xl: "100%" },
          transformOrigin: "top",
          width: { lg: "90%", xl: "100%" },
          margin: "0 auto",
        }}
      >
        <BlogDetailed />
        <CommentSection />
      </Box>

      <RecommendedUsers />
      <UpcomingEvents />
    </Box>
  );
}
