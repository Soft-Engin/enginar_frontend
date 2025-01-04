import RecipeDetailed from "./RecipeDetailed";
import Box from "@mui/material/Box";
import CommentSection from "./CommentSection";
import RecommendedUsers from "./RecommendedUsers";
import UpcomingEvents from "./UpcomingEvents";

import { useSearchParams } from "react-router-dom";

export default function RecipePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams.get("id"));
  return (
    <Box data-testid="recipe-page" sx={{ m: 4, width: 800 }}>
      <Box
        data-testid="recipe-page-inner"
        sx={{
          scale: { xs: "70%", sm: "70%", md: "90%", lg: "84%", xl: "100%" },
          transformOrigin: "top",
          width: { md: "90%", lg: "90%", xl: "100%" },
          margin: "0 auto",
        }}
      >
        <RecipeDetailed data-testid="recipe-detailed" recipeId={searchParams.get("id")} />
        <CommentSection data-testid="comment-section" type="recipe" contentId={searchParams.get("id")} />
      </Box>
      <RecommendedUsers data-testid="recommended-users" />
      <UpcomingEvents data-testid="upcoming-events" />
    </Box>
  );
}
