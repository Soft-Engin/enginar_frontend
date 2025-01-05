import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import UserListItem from "./UserListItem";
import axios from "axios";
import Pagination from "@mui/material/Pagination";

export default function ParticipantsListPopup(props) {
  const { open, handleClose, eventId, totalCount } = props;
  const [participants, setParticipants] = useState([]);
  const [followingParticipants, setFollowingParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const fetchParticipants = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/api/v1/events/${eventId}/participants`,
        {
          params: { pageSize: pageSize, pageNumber: pageNum },
        }
      );
      if (response.data && response.data.participations) {
        setParticipants(response.data.participations.items || []);
        setFollowingParticipants(
          response.data.followedParticipations.items || []
        );
        setTotalPages(Math.ceil(totalCount / pageSize));
      }
    } catch (error) {
      console.error("Error fetching participants: ", error);
      setError(error.message || "Failed to load participants.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPageNum(value);
  };

  useEffect(() => {
    fetchParticipants();
  }, [open, eventId, pageNum]);

  if (!open || totalCount === 0) {
    return null; // Do not render the dialog if not open or there are no participants
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={"md"}
      PaperProps={{
        sx: {
          width: { xs: 400, sm: 400, md: 450, lg: 500, xl: 500 },
          borderRadius: 4,
          backgroundColor: "#C8EFA5",
          px: 3,
          py: 2,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgb(165, 165, 165)",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Event Participants ({totalCount})
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: "#555" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ px: 1.5, py: 0 }}>
        {loading && <Typography>Loading participants...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && !error && (
          <>
            {followingParticipants &&
              followingParticipants.map((user) => (
                <Box
                  key={user.userId}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ mt: 0.5, mb: 1.5 }}
                >
                  <UserListItem user={user} />
                </Box>
              ))}
            {participants &&
              participants.map((user) => (
                <Box
                  key={user.userId}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ mt: 0.5, mb: 1.5 }}
                >
                  <UserListItem user={user} />
                </Box>
              ))}
          </>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 1,
            mb: 1,
          }}
        >
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={pageNum}
              onChange={handlePageChange}
              variant="outlined"
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
