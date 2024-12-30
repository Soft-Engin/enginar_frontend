import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import UserListItem from "./UserListItem";
import axios from "axios";

export default function FollowingListPopup(props) {
  const { open, handleClose, userId } = props;
  const [following, setFollowing] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowing = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `/api/v1/users/${userId}/following?pageSize=100`
        );
        if (response.status === 200) {
          setFollowing(response.data.items);
          setTotalCount(response.data.totalCount);
        }
      } catch (error) {
        console.error("Error fetching following:", error);
        setError(error.message || "Failed to load following.");
      } finally {
        setLoading(false);
      }
    };
    if (open) {
      fetchFollowing();
    }
  }, [open, userId]);

  if (!open || totalCount === 0) {
    return null; // Do not render the dialog if not open or there are no following
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={"md"}
      PaperProps={{
        sx: {
          width: 500,
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
          Following ({totalCount})
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: "#555" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ px: 1.5, py: 0 }}>
        {loading && <Typography>Loading following...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {!loading &&
          !error &&
          following.map((user) => (
            <Box
              key={user.userId}
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 0.5, mb: 1.5 }}
            >
              <UserListItem user={user} />
            </Box>
          ))}
      </DialogContent>
    </Dialog>
  );
}
