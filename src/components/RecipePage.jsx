import RecipeDetailed from "./RecipeDetailed"
import Box from '@mui/material/Box';
import CommentSection from "./CommentSection";
import RecommendedUsers from "./RecommendedUsers";
import UpcomingEvents from "./UpcomingEvents";

export default function RecipePage() {
  return(
    <Box sx={{ m: 4, maxWidth: 900 }}>
      <RecipeDetailed />
      <CommentSection />
      <RecommendedUsers />
      <UpcomingEvents />
    </Box>
  )
}