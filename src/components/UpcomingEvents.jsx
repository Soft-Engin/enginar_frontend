import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import AvatarGroup from "@mui/material/AvatarGroup";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { LoadingErrorDisplay } from "./LoadingErrorDisplay";
export default function UpcomingEvents() {
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [eventParticipants, setEventParticipants] = React.useState({});
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        pageNumber: 1,
        pageSize: 2,
        SortBy: "date",
        FromDate: dayjs().format("YYYY-MM-DD"),
      };

      const eventsResponse = await axios.get(
        `/api/v1/events/search?${new URLSearchParams(params).toString()}`
      );

      if (eventsResponse.data && eventsResponse.data.items) {
        setEvents(eventsResponse.data.items);
      } else {
        setError("No events found");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async (eventId) => {
    try {
      const participantsResponse = await axios.get(
        `/api/v1/events/${eventId}/participants?pageNumber=1&pageSize=3`
      );
      return participantsResponse.data.participations.items || [];
    } catch (err) {
      console.error("Error fetching participants", err);
      return [];
    }
  };

  const fetchProfilePicture = async (userId) => {
    try {
      const profilePicResponse = await axios.get(
        `/api/v1/users/${userId}/profile-picture`,
        {
          responseType: "blob",
        }
      );

      if (profilePicResponse && profilePicResponse.data) {
        return URL.createObjectURL(profilePicResponse.data);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return null;
      }
      console.error("Error fetching profile picture", err);
      return null;
    }
  };

  React.useEffect(() => {
    fetchEvents();
  }, []);

  React.useEffect(() => {
    const loadAllParticipants = async () => {
      if (!events || events.length === 0) return;
      const allParticipants = {};

      for (const event of events) {
        const fetchedParticipants = await fetchParticipants(event.eventId);
        const avatarPromises = fetchedParticipants.map(async (participant) => {
          const profilePictureUrl = await fetchProfilePicture(
            participant.userId
          );
          return {
            userId: participant.userId,
            profilePictureUrl,
          };
        });

        const avatarResults = await Promise.all(avatarPromises);
        allParticipants[event.eventId] = {
          participants: fetchedParticipants,
          avatars: avatarResults,
          loading: false,
        };
      }
      setEventParticipants(allParticipants);
    };

    loadAllParticipants();
  }, [events]);

  const handleEventClick = (eventId) => {
    navigate(`/event?id=${eventId}`);
  };

  const renderEventItem = (event) => {
    const participantsInfo = eventParticipants[event.eventId] || {
      participants: [],
      avatars: [],
      loading: true,
    };
    const {
      participants,
      avatars,
      loading: participantsLoading,
    } = participantsInfo;

    return (
      <ListItem
        key={event.eventId}
        onClick={() => handleEventClick(event.eventId)}
        style={{ cursor: "pointer" }}
      >
        <Box
          sx={{
            outline: "1.5px solid #AAAAAA",
            width: 270,
            pl: 0.5,
            pr: 1,
            pb: 0.5,
            backgroundColor: "#FFFFFF",
            borderRadius: 3,
          }}
        >
          <ListItemText>
            <Box
              sx={{
                display: "grid",
                gridAutoFlow: "row",
                gridTemplateColumns: "0.7fr 1fr",
                gridTemplateRows: "auto",
              }}
            >
              <Box display="flex">
                <LocalOfferOutlinedIcon style={{ fontSize: "50px" }} />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  variant="subtitle1"
                  component="div"
                  fontWeight="bold"
                  mt={0.5}
                  sx={{ maxWidth: "210px", color: "black" }}
                  noWrap
                >
                  {event.title}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "2px",
                  }}
                >
                  <PlaceOutlinedIcon
                    style={{ fontSize: "30px", marginRight: "2px" }}
                  />
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{ marginRight: "15px", maxWidth: "75px" }}
                    noWrap
                  >
                    {event.address?.district?.name}
                  </Typography>
                  <CalendarMonthIcon
                    style={{ fontSize: "30px", marginRight: "2px" }}
                  />
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{ maxWidth: "75px" }}
                    noWrap
                  >
                    {dayjs(event.date).format("DD.MM.YYYY")}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  {participantsLoading ? (
                    <Typography variant="body2">
                      Loading participants...
                    </Typography>
                  ) : (
                    <AvatarGroup
                      total={event.totalParticipantsCount}
                      spacing={4}
                      sx={{
                        "& .MuiAvatar-root": {
                          width: 36,
                          height: 36,
                          fontSize: 17,
                        },
                      }}
                    >
                      {avatars.map((avatar, index) => {
                        return (
                          <Avatar
                            key={index}
                            alt={participants[index]?.userName}
                            src={avatar.profilePictureUrl || undefined}
                            sx={{
                              backgroundColor: "#A5E072",
                              fontWeight: "bold",
                            }}
                          >
                            {!avatar.profilePictureUrl &&
                              participants[index]?.userName
                                ?.charAt(0)
                                .toUpperCase()}
                          </Avatar>
                        );
                      })}
                    </AvatarGroup>
                  )}

                  <Typography
                    variant="body2"
                    component="div"
                    color="text.secondary"
                    sx={{ marginLeft: "2px" }}
                    noWrap
                  >
                    are
                    <br />
                    going
                  </Typography>
                </Box>
              </Box>
            </Box>
          </ListItemText>
        </Box>
      </ListItem>
    );
  };

  return (
    <Box
      sx={{
        width: 300,
        borderRadius: 3,
        outline: "1.5px solid #959595",
        backgroundColor: "#C8EFA5",
        boxShadow: 5,
      }}
    >
      <Typography
        fontWeight="bold"
        style={{ color: "#000000" }}
        sx={{ pt: 2, pl: 2, fontSize: 24, opacity: 0.7 }}
        variant="h5"
        component="div"
      >
        Upcoming Events
      </Typography>
      <LoadingErrorDisplay loading={loading} error={error} />
      <List>{events.map((event) => renderEventItem(event))}</List>
    </Box>
  );
}
