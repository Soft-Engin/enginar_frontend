import * as React from "react";
import {
  Typography,
  Box,
  Avatar,
  AvatarGroup,
  Button,
  CircularProgress,
} from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function EventMini({ event }) {
  const eventDate = event?.date ? parseISO(event.date) : null;
  const formattedDate = eventDate ? format(eventDate, "dd.MM.yyyy") : "N/A";
  const [participants, setParticipants] = React.useState([]);
  const [followedParticipants, setFollowedParticipants] = React.useState([]);
  const [participantProfiles, setParticipantProfiles] = React.useState({});
  const [followedParticipantProfiles, setFollowedParticipantProfiles] =
    React.useState({});
  const [loadingParticipants, setLoadingParticipants] = React.useState(true);
  const [errorParticipants, setErrorParticipants] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = React.useState(null);
  const [userInitials, setUserInitials] = React.useState("");
  const [isParticipant, setIsParticipant] = React.useState(false);
  const [loadingIsParticipant, setLoadingIsParticipant] = React.useState(true);
  const [errorIsParticipant, setErrorIsParticipant] = React.useState(null);

  let authButtonId = "loginButton";
  let userLogged = localStorage.getItem("userLogged") === "true";
  const navigate = useNavigate();

  React.useEffect(() => {
    if (event && event.creatorId) {
      const fetchProfilePicture = async () => {
        setLoading(true);
        setError(null);
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
          setError(err.message || "An unexpected error occurred.");
        } finally {
          setLoading(false);
        }
      };
      fetchProfilePicture();
    }
    return () => {
      if (profilePictureUrl) {
        URL.revokeObjectURL(profilePictureUrl);
      }
    };
  }, [event]);

  const generateInitials = (userName) => {
    const nameParts = userName.split(" ");
    return (
      nameParts.map((part) => part.charAt(0).toUpperCase()).join("") ||
      userName.charAt(0).toUpperCase()
    );
  };

  React.useEffect(() => {
    if (event && event.creatorUserName) {
      setUserInitials(generateInitials(event.creatorUserName));
    }
  }, [event]);

  React.useEffect(() => {
    const fetchParticipants = async () => {
      if (event && event.eventId) {
        setLoadingParticipants(true);
        setErrorParticipants(null);
        try {
          const response = await axios.get(
            `/api/v1/events/${event.eventId}/participants?pageSize=200`
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

  return (
    <Box
      data-testid={`event-mini-${event.eventId}`}
      sx={{
        maxWidth: 630,
        width: "100%",
        outline: "1.5px solid #C0C0C0",
        backgroundColor: "#FFFFFF",
        pl: 3,
        pt: 2,
        pr: 3,
        pb: 1.5,
        borderRadius: 5,
        boxShadow: 5,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            maxWidth: { sm: 250, md: 350, lg: 250, xl: 350 },
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            data-testid="event-title"
            style={{ marginRight: "15px" }}
            noWrap
            onClick={() => navigate(`/event?id=${event.eventId}`)}
            sx={{ cursor: "pointer" }}
          >
            {event?.title || "Event Title"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PlaceOutlinedIcon style={{ fontSize: "30px", marginRight: "2px" }} />
          <Typography 
            variant="body2" 
            component="div" 
            data-testid="event-location"
            noWrap
          >
            {event?.address?.district?.city?.name || "City"}
          </Typography>
          <CalendarMonthIcon
            style={{ fontSize: "30px", marginRight: "2px", marginLeft: "5px" }}
          />
          <Typography 
            variant="body2" 
            component="div"
            data-testid="event-date" 
            noWrap
          >
            {formattedDate}
          </Typography>
        </Box>
      </Box>
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
            variant="body1"
            component="div"
            fontWeight="bold"
            style={{ marginRight: "6px" }}
            noWrap
          >
            Host:
          </Typography>
          <Link
            to={`/profile?id=${event.creatorId}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
            }}
          >
            {profilePictureUrl ? (
              <Avatar
                src={profilePictureUrl}
                sx={{ width: 34, height: 34, mr: 0.7 }}
                onError={() => setProfilePictureUrl(null)}
              />
            ) : (
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  marginRight: 0.7,
                  backgroundColor: "#A5E072",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                }}
              >
                {userInitials}
              </Box>
            )}
            <Typography
              variant="body2"
              component="div"
              color="text.secondary"
              noWrap
            >
              <b>{event?.creatorUserName || "Unknown"}</b>
            </Typography>
          </Link>
        </Box>
      </Box>

      <Typography
        variant="body2"
        component="div"
        data-testid="event-description"
        sx={{
          overflow: "hidden",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 5,
          textOverflow: "ellipsis",
          mb: 1,
          wordWrap: "break-word",
          overflowWrap: "break-word",
          flexGrow: 1,
        }}
      >
        {event?.bodyText || "Event Description"}
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
          marginTop: "auto",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="body1"
            component="div"
            fontWeight="bold"
            style={{ marginRight: "6px" }}
            noWrap
          >
            Participants:
          </Typography>
          {loadingParticipants ? (
            <CircularProgress size={20} />
          ) : (
            <AvatarGroup
              max={3}
              sx={{
                "& .MuiAvatar-root": { width: 32, height: 32, fontSize: 15 },
                marginRight: 0.5,
              }}
            >
              {followedParticipants &&
                followedParticipants.map((participant) => (
                  <Avatar
                    key={participant.userId}
                    alt={participant.userName}
                    src={followedParticipantProfiles[participant.userId]}
                    sx={{ backgroundColor: "#A5E072", fontWeight: "bold" }}
                    onError={() =>
                      setFollowedParticipantProfiles((prevProfiles) => {
                        const newProfiles = { ...prevProfiles };
                        delete newProfiles[participant.userId];
                        return newProfiles;
                      })
                    }
                  >
                    {!followedParticipantProfiles[participant.userId] &&
                      participant.userName?.charAt(0).toUpperCase()}
                  </Avatar>
                ))}
              {participants &&
                participants.map((participant) => (
                  <Avatar
                    key={participant.userId}
                    alt={participant.userName}
                    src={participantProfiles[participant.userId]}
                    sx={{ backgroundColor: "#A5E072", fontWeight: "bold" }}
                    onError={() =>
                      setParticipantProfiles((prevProfiles) => {
                        const newProfiles = { ...prevProfiles };
                        delete newProfiles[participant.userId];
                        return newProfiles;
                      })
                    }
                  >
                    {!participantProfiles[participant.userId] &&
                      participant.userName?.charAt(0).toUpperCase()}
                  </Avatar>
                ))}
            </AvatarGroup>
          )}
          {errorParticipants && (
            <Typography variant="caption" component="div" color="error">
              {errorParticipants}
            </Typography>
          )}
          {!loadingParticipants && participants && (
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
            >
              {event.totalParticipantsCount} people are going
              {followedParticipants && followedParticipants.length > 0 && (
                <span> ({followedParticipants.length} whom you follow)</span>
              )}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="contained"
            data-testid="join-button"
            sx={{
              backgroundColor: "#4B9023",
              borderRadius: 30,
              width: "80px",
              height: "35px",
              textTransform: "none",
            }}
            onClick={handleJoinLeaveToggle}
            disabled={eventDate < dayjs()}
          >
            <Typography variant="h6">
              {userLogged ? (
                loadingIsParticipant ? (
                  <CircularProgress size={15} color="inherit" />
                ) : isParticipant ? (
                  "Leave"
                ) : (
                  "Join"
                )
              ) : (
                "Join"
              )}
            </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
