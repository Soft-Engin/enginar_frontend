import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Avatar,
  AvatarGroup,
  Button,
  List,
  ListItem,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ParticipantsListPopup from "./ParticipantsListPopup";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EventPopup from "./EventPopup";

export default function EventDetailed({ eventId }) {
  const [participantsPopupOpen, setParticipantsPopupOpen] =
    React.useState(false);
  const [eventData, setEventData] = React.useState(null);
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
  const [isFollowing, setIsFollowing] = useState(false);
  const [loggedInUserFollowing, setLoggedInUserFollowing] = useState([]);
  const [loggedInUserData, setLoggedInUserData] = useState(
    localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : null
  );
  const isOwnEvent = eventData?.creatorId === loggedInUserData?.userId;
  let isAdmin = loggedInUserData?.roleName === "Admin";

  //EDIT POPUP STATE
  const [editPopupOpen, setEditPopupOpen] = useState(false);

  // DELETE DIALOG STATE
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleParticipantsPopupOpen = () => {
    setParticipantsPopupOpen(true);
  };

  const handleParticipantsPopupClose = () => {
    setParticipantsPopupOpen(false);
  };

  useEffect(() => {
    const fetchLoggedInUserFollowing = async () => {
      if (loggedInUserData?.userId) {
        try {
          const response = await axios.get(
            `/api/v1/users/${loggedInUserData?.userId}/following?pageSize=200`
          );
          if (response.status === 200) {
            setLoggedInUserFollowing(response.data.items);
          }
        } catch (error) {
          console.error(
            "Error fetching logged in user's following list: ",
            error
          );
        }
      }
    };
    fetchLoggedInUserFollowing();
  }, [loggedInUserData?.userId]);

  useEffect(() => {
    if (eventData && loggedInUserFollowing) {
      const isFollowing = loggedInUserFollowing.some(
        (following) => following.userId === eventData.creatorId
      );
      setIsFollowing(isFollowing);
    } else {
      setIsFollowing(false);
    }
  }, [loggedInUserFollowing, eventData?.creatorId]);

  const handleFollowUser = async () => {
    try {
      const response = await axios.post(
        `/api/v1/users/follow?targetUserId=${eventData.creatorId}`
      );
      if (response.status === 200) {
        setIsFollowing(true);
        setLoggedInUserFollowing((prev) => [
          ...prev,
          { userId: eventData.creatorId },
        ]);
      }
    } catch (error) {
      console.error("Error following user:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to follow the user."
      );
    }
  };

  const handleUnfollowUser = async () => {
    try {
      const response = await axios.delete(
        `/api/v1/users/unfollow?targetUserId=${eventData.creatorId}`
      );
      if (response.status === 200) {
        setIsFollowing(false);
        setLoggedInUserFollowing((prev) =>
          prev.filter((following) => following.userId !== eventData.creatorId)
        );
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to unfollow the user."
      );
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/v1/events/${eventId}`);
        if (response.data) {
          setEventData(response.data);
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
      if (eventData && eventData.creatorId) {
        try {
          const response = await axios.get(
            `/api/v1/users/${eventData.creatorId}/profile-picture`,
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
  }, [eventData]);

  React.useEffect(() => {
    const fetchParticipants = async () => {
      if (eventData && eventData.eventId) {
        setLoadingParticipants(true);
        setErrorParticipants(null);
        try {
          const response = await axios.get(
            `/api/v1/events/${eventData.eventId}/participants?pageSize=200`
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
  }, [eventData]);

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
    if (eventData && eventData.eventId && userLogged) {
      const fetchIsParticipant = async () => {
        setLoadingIsParticipant(true);
        setErrorIsParticipant(null);
        try {
          const response = await axios.get(
            `/api/v1/events/${eventData.eventId}/is-participant`
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
  }, [eventData, userLogged]);

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
        `/api/v1/events/${eventData.eventId}/toggle-event-attendance`
      );
    } catch (err) {
      console.error("Error toggling event attendance", err);
      setIsParticipant((prevIsParticipant) => !prevIsParticipant);
    }
  };

  const formattedDate = eventData?.date
    ? format(parseISO(eventData.date), "dd.MM.yyyy, HH:mm")
    : "N/A";

  //EDIT FUNCTIONALITY
  const handleEditEvent = () => {
    setEditPopupOpen(true);
  };

  const handleCloseEditPopup = () => {
    setEditPopupOpen(false);
  };

  //DELETE FUNCTIONALITY
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteEvent = () => {
    handleOpenDeleteDialog();
  };

  // Delete confirmation dialog component
  const DeleteConfirmationDialog = () => {
    const confirmDelete = async () => {
      try {
        await axios.delete(`/api/v1/events/${eventData.eventId}`);
        // Handle successful deletion - redirect, refresh list or notify user
        window.location.href = "/"; // Redirect to home after delete
      } catch (error) {
        console.error("Error deleting event:", error);
      }
      handleCloseDeleteDialog();
    };
    return (
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            width: { xs: 250, sm: 400 },
            borderRadius: 4,
            backgroundColor: "#C8EFA5",
            padding: 0.5,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this event?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{
              backgroundColor: "#C8EFA5",
              color: "black",
              ":hover": {
                backgroundColor: "#C8EFA5",
              },
              borderRadius: 20,
              marginTop: 2,
              display: "block",
              marginLeft: "auto",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            sx={{
              backgroundColor: "#cc0000",
              color: "error",
              ":hover": {
                backgroundColor: "#cc0000",
              },
              borderRadius: 20,
              marginTop: 2,
              display: "block",
              marginLeft: "auto",
              fontWeight: "bold",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

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
              alignItems: "flex-start",
              mb: 1,
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                maxWidth: "100%",
              }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  overflowWrap: "break-word",
                  wordWrap: "break-word",
                  hyphens: "auto",
                  maxWidth: "100%",
                  whiteSpace: "normal",
                  lineHeight: 1.2,
                }}
              >
                {eventData?.title || "Event Title"}
              </Typography>
            </Box>
            {userLogged && (
              <Box sx={{ position: "relative", right: -3, top: -5}}>
                <IconButton
                  aria-label="more"
                  id="menuButton"
                  aria-controls={open ? "menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <MoreHorizIcon sx={{ fontSize: "30px" }} />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  open={open}
                  onClose={handleClose}
                >
                  {isAdmin || !isOwnEvent ? (
                    <>
                      {isAdmin && (
                        <>
                          <MenuItem
                            key="Edit"
                            onClick={() => {
                              handleClose();
                              handleEditEvent();
                            }}
                          >
                            Edit Event
                          </MenuItem>
                          <MenuItem
                            key="Delete"
                            onClick={() => {
                              handleClose();
                              handleDeleteEvent();
                            }}
                            sx={{ color: "red" }}
                          >
                            Delete Event
                          </MenuItem>
                        </>
                      )}

                      {!isOwnEvent && (
                        <>
                          {isFollowing ? (
                            <MenuItem
                              key="Unfollow"
                              onClick={handleUnfollowUser}
                            >
                              Unfollow Host
                            </MenuItem>
                          ) : (
                            <MenuItem key="Follow" onClick={handleFollowUser}>
                              Follow Host
                            </MenuItem>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <MenuItem
                        key="Edit"
                        onClick={() => {
                          handleClose();
                          handleEditEvent();
                        }}
                      >
                        Edit Event
                      </MenuItem>
                      <MenuItem
                        key="Delete"
                        onClick={() => {
                          handleClose();
                          handleDeleteEvent();
                        }}
                        sx={{ color: "red" }}
                      >
                        Delete Event
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              component="div"
              fontWeight="bold"
              noWrap
              sx={{ mr: 1 }}
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
            <Typography
              variant="h6"
              component="div"
              fontWeight="bold"
              noWrap
              sx={{ mr: 1 }}
            >
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
              {eventData?.address?.street || ""},{" "}
              {eventData?.address?.district?.name || ""},{" "}
              {eventData?.address?.district?.city?.name || ""},{" "}
              {eventData?.address?.district?.city?.country?.name || ""}
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
              to={`/profile?id=${eventData?.creatorId}`}
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
                <b>{eventData?.creatorUserName}</b>
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
            sx={{
              lineHeight: "25px",
              mb: 3,
              pt: 0.5,
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {eventData?.bodyText}
          </Typography>

          {eventData?.requirements && eventData.requirements.length > 0 && (
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
                {eventData.requirements.map((req) => (
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
                  {eventData.totalParticipantsCount} people are
                  going
                  {followedParticipants && followedParticipants.length > 0 && (
                    <span>
                      {" "}
                      ({followedParticipants.length} whom you follow)
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
          <ParticipantsListPopup
            open={participantsPopupOpen}
            handleClose={handleParticipantsPopupClose}
            eventId={eventId}
            totalCount={eventData.totalParticipantsCount}
          />
          <EventPopup
            open={editPopupOpen}
            handleClose={handleCloseEditPopup}
            editMode={true}
            eventData={eventData}
          />
          <DeleteConfirmationDialog />
        </>
      )}
    </Box>
  );
}
