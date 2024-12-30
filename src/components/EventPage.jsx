import EventDetailed from "./EventDetailed"
import Box from '@mui/material/Box';
import CommentSection from "./CommentSection";
import RecommendedUsers from "./RecommendedUsers";
import UpcomingEvents from "./UpcomingEvents";

import { useSearchParams } from 'react-router-dom'

export default function EventPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams.get('id'));
  return(
    <Box sx={{ m: 4, maxWidth: 900 }}>
      <EventDetailed eventId={searchParams.get('id')}/>
      <CommentSection type="event" contentId={searchParams.get('id')}/>
      <RecommendedUsers />
      <UpcomingEvents />
    </Box>
  )
}