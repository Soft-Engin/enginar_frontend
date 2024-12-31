import * as React from "react";
import {
  Typography,
  Box,
  Avatar,
  AvatarGroup,
  Button,
  List,
  ListItem,
  CircularProgress,
} from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ParticipantsListPopup from "./ParticipantsListPopup";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { useNavigate, Link } from "react-router-dom";

export default function EventDetailed({ eventId }) {
  const [participantsPopupOpen, setParticipantsPopupOpen] =
    React.useState(false);
  const [event, setEvent] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = React.useState(null);
  const [participants, setParticipants] = React.useState([]);
  const [followedParticipants, setFollowedParticipants] = React.useState([]);
  const [isParticipant, setIsParticipant] = React.useState(false);
  const [loadingIsParticipant, setLoadingIsParticipant] = React.useState(true);
  const [errorIsParticipant, setErrorIsParticipant] = React.useState(null);
  const [participantProfiles, setParticipantProfiles] = React.useState({});
  const [followedParticipantProfiles, setFollowedParticipantProfiles] =
    React.useState({});
  const [loadingParticipants, setLoadingParticipants] = React.useState(true);
  const [errorParticipants, setErrorParticipants] = React.useState(null);

  let authButtonId = "loginButton";
  let userLogged = localStorage.getItem("userLogged") === "true";

  const navigate = useNavigate();

  const handleParticipantsPopupOpen = () => {
    setParticipantsPopupOpen(true);
  };

  const handleParticipantsPopupClose = () => {
    setParticipantsPopupOpen(false);
  };

  React.useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/v1/events/${eventId}`);
        if (response.data) {
          setEvent(response.data);
        }
      } catch (err) {
        console.error("Error fetching event data:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();

    return () => {};
  }, [eventId]);

  React.useEffect(() => {
    const fetchProfilePicture = async () => {
      if (event && event.creatorId) {
        try {
          const response = await axios.get(
            `/api/v1/users/${event.creatorId}/profile-picture`,
            { responseType: "blob" }
          );
          if (response.data) {
            const profileUrl = URL.createObjectURL(response.data);
            setProfilePictureUrl(profileUrl);
          } else {
            setProfilePictureUrl(null);
          }
        } catch (err) {
          console.error("Error fetching profile picture:", err);
        }
      }
    };

    fetchProfilePicture();

    return () => {
      if (profilePictureUrl) {
        URL.revokeObjectURL(profilePictureUrl);
      }
    };
  }, [event]);

  React.useEffect(() => {
    const fetchParticipants = async () => {
      if (event && event.eventId) {
        setLoadingParticipants(true);
        setErrorParticipants(null);
        try {
          const response = await axios.get(
            `/api/v1/events/${event.eventId}/participants`
          );
          if (response.data && response.data.participations) {
            setParticipants(response.data.participations.items || []);
          }
          if (response.data && response.data.followedParticipations) {
            setFollowedParticipants(
              response.data.followedParticipations.items || []
            );
          }
          setLoadingParticipants(false);
        } catch (err) {
          console.error("Error fetching participants:", err);
          setErrorParticipants(
            err.message || "Failed to fetch event participants"
          );
          setLoadingParticipants(false);
        }
      }
    };
    fetchParticipants();
  }, [event]);

  React.useEffect(() => {
    const fetchProfilePictures = async () => {
      const profiles = {};
      if (participants && participants.length > 0) {
        await Promise.all(
          participants.map(async (participant) => {
            try {
              const response = await axios.get(
                `/api/v1/users/${participant.userId}/profile-picture`,
                { responseType: "blob" }
              );
              if (response.data) {
                const profileUrl = URL.createObjectURL(response.data);
                profiles[participant.userId] = profileUrl;
              }
            } catch (error) {
              console.error(
                `Error fetching profile picture for user ${participant.userId}:`,
                error
              );
            }
          })
        );
        setParticipantProfiles(profiles);
      }
    };

    fetchProfilePictures();
    return () => {
      if (participantProfiles) {
        for (const profileUrl in participantProfiles) {
          URL.revokeObjectURL(participantProfiles[profileUrl]);
        }
      }
    };
  }, [participants]);

  React.useEffect(() => {
    const fetchFollowedProfilePictures = async () => {
      const profiles = {};
      if (followedParticipants && followedParticipants.length > 0) {
        await Promise.all(
          followedParticipants.map(async (participant) => {
            try {
              const response = await axios.get(
                `/api/v1/users/${participant.userId}/profile-picture`,
                { responseType: "blob" }
              );
              if (response.data) {
                const profileUrl = URL.createObjectURL(response.data);
                profiles[participant.userId] = profileUrl;
              }
            } catch (error) {
              console.error(
                `Error fetching profile picture for user ${participant.userId}:`,
                error
              );
            }
          })
        );
        setFollowedParticipantProfiles(profiles);
      }
    };

    fetchFollowedProfilePictures();
    return () => {
      if (followedParticipantProfiles) {
        for (const profileUrl in followedParticipantProfiles) {
          URL.revokeObjectURL(followedParticipantProfiles[profileUrl]);
        }
      }
    };
  }, [followedParticipants]);

  React.useEffect(() => {
    if (event && event.eventId && userLogged) {
      const fetchIsParticipant = async () => {
        setLoadingIsParticipant(true);
        setErrorIsParticipant(null);
        try {
          const response = await axios.get(
            `/api/v1/events/${event.eventId}/is-participant`
          );
          setIsParticipant(response.data.isParticipant || false);
        } catch (err) {
          console.error("Error fetching isParticipant:", err);
          setErrorIsParticipant(
            err.message || "Failed to fetch participant status"
          );
        } finally {
          setLoadingIsParticipant(false);
        }
      };
      fetchIsParticipant();
    }
  }, [event, userLogged]);

  const handleJoinLeaveToggle = async () => {
    if (!userLogged) {
      const authButton = document.getElementById(authButtonId);
      if (authButton) {
        authButton.click();
      }
      return;
    }
    setIsParticipant((prevIsParticipant) => !prevIsParticipant);
    try {
      await axios.post(
        `/api/v1/events/${event.eventId}/toggle-event-attendance`
      );
    } catch (err) {
      console.error("Error toggling event attendance", err);
      setIsParticipant((prevIsParticipant) => !prevIsParticipant);
    }
  };

  const formattedDate = event?.date
    ? format(parseISO(event.date), "dd.MM.yyyy, HH:mm")
    : "N/A";

  return (
    <Box
      sx={{
        maxWidth: 1500,
        outline: "1.5px solid #C0C0C0",
        backgroundColor: "#FFFFFF",
        px: 5,
        py: 4,
        borderRadius: "20px 20px 0 0",
        boxShadow: 3,
      }}
    >
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="300px"
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="300px"
        >
          <Typography color="error">Error: {error}</Typography>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                noWrap
              >
                {event?.title || "Event Title"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              component="div"
              fontWeight="bold"
              noWrap
              sx= {{ mr: 1 }}
            >
              Date and Time:
            </Typography>
            <CalendarMonthIcon
              style={{ fontSize: "28px", marginRight: "3px" }}
            />
            <Typography
              variant="body1"
              component="div"
              color="text.secondary"
              noWrap
            >
              {formattedDate}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="h6" component="div" fontWeight="bold" noWrap sx={{ mr: 1 }}>
              Location:
            </Typography>
            <PlaceOutlinedIcon
              style={{ fontSize: "28px", marginRight: "2px" }}
            />
            <Typography
              variant="body1"
              component="div"
              color="text.secondary"
              noWrap
            >
              {event?.address?.street || ""},{" "}
              {event?.address?.district?.name || ""},{" "}
              {event?.address?.district?.city?.name || ""},{" "}
              {event?.address?.district?.city?.country?.name || ""}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography
              variant="h6"
              component="div"
              fontWeight="bold"
              style={{ marginRight: "7px" }}
              noWrap
            >
              Host:
            </Typography>
            <Link
              to={`/profile?id=${event?.creatorId}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Avatar
                src={profilePictureUrl}
                sx={{ width: 38, height: 38, marginRight: 0.7 }}
                onError={() => setProfilePictureUrl(null)}
              />
              <Typography variant="body1" component="div" noWrap>
                <b>{event?.creatorUserName}</b>
              </Typography>
            </Link>
          </Box>

          <Typography
            variant="h6"
            component="div"
            fontWeight="bold"
            sx={{ mb: 0.5, pb: 0.6, borderBottom: "1px solid #E0E0E0" }}
          >
            Description
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{ lineHeight: "25px", mb: 3, pt: 0.5 }}
          >
            {event?.bodyText}
          </Typography>

          {event?.requirements && event.requirements.length > 0 && (
            <Box
              sx={{
                mb: 2,
                backgroundColor: "#C8EFA5",
                borderRadius: 4,
                px: 3,
                pt: 1,
                pb: 0.5,
                boxShadow: 3,
              }}
            >
              <Typography variant="h6" component="div" fontWeight="bold">
                Requirements:
              </Typography>
              <List
                sx={{
                  listStyleType: "numeric",
                  px: 3,
                  "& .MuiListItem-root": { display: "list-item", pl: 0, mb: 0 },
                }}
              >
                {event.requirements.map((req) => (
                  <ListItem key={req.id}>
                    <b>{req.name}:</b> {req.description}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          <Typography
            variant="h6"
            component="div"
            fontWeight="bold"
            sx={{ mb: 0.5, pb: 0.6, borderBottom: "1px solid #E0E0E0" }}
          >
            Participants
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pt: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AvatarGroup
                max={3}
                sx={{
                  "& .MuiAvatar-root": { width: 38, height: 38, fontSize: 19 },
                  marginRight: 1,
                  cursor: "pointer",
                }}
                onClick={handleParticipantsPopupOpen}
              >
                {participants &&
                  participants.map((participant) => (
                    <Avatar
                      key={participant.userId}
                      alt={participant.userName}
                      src={participantProfiles[participant.userId]}
                      onError={() =>
                        setParticipantProfiles((prevProfiles) => {
                          const newProfiles = { ...prevProfiles };
                          delete newProfiles[participant.userId];
                          return newProfiles;
                        })
                      }
                    />
                  ))}
                {followedParticipants &&
                  followedParticipants.map((participant) => (
                    <Avatar
                      key={participant.userId}
                      alt={participant.userName}
                      src={followedParticipantProfiles[participant.userId]}
                      onError={() =>
                        setFollowedParticipantProfiles((prevProfiles) => {
                          const newProfiles = { ...prevProfiles };
                          delete newProfiles[participant.userId];
                          return newProfiles;
                        })
                      }
                    />
                  ))}
              </AvatarGroup>
              {!loadingParticipants && participants && (
                <Typography
                  variant="subtitle2"
                  component="div"
                  color="text.secondary"
                >
                  {participants.length + followedParticipants.length} people are going
                  {followedParticipants && followedParticipants.length > 0 && (
                    <span>
                      , and {followedParticipants.length} whom you follow
                    </span>
                  )}
                </Typography>
              )}
              {loadingParticipants && <CircularProgress size={20} />}
              {errorParticipants && (
                <Typography variant="caption" component="div" color="error">
                  {errorParticipants}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#4B9023",
                  borderRadius: 30,
                  width: "110px",
                  height: "45px",
                  textTransform: "none",
                }}
                onClick={handleJoinLeaveToggle}
              >
                <Typography variant="h5">
                  {loadingIsParticipant ? (
                    <CircularProgress size={15} color="inherit" />
                  ) : isParticipant ? (
                    "Leave"
                  ) : (
                    "Join"
                  )}
                </Typography>
              </Button>
            </Box>
          </Box>
          <ParticipantsListPopup
            open={participantsPopupOpen}
            handleClose={handleParticipantsPopupClose}
          />
        </>
      )}
    </Box>
  );
}
