import RecipeDetailed from "./RecipeDetailed"
import Box from '@mui/material/Box';
import CommentSection from "./CommentSection";
import RecommendedUsers from "./RecommendedUsers";
import UpcomingEvents from "./UpcomingEvents";

import { useSearchParams } from 'react-router-dom'

export default function RecipePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams.get('id'));
  return(
    <Box sx={{ m: 4, maxWidth: 800 }}>
      <RecipeDetailed recipeId={searchParams.get('id')}/>
      <CommentSection />
      <RecommendedUsers />
      <UpcomingEvents />
    </Box>
  )
}