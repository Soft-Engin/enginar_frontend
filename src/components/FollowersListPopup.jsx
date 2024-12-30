import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import UserListItem from "./UserListItem";
import axios from "axios";

export default function FollowersListPopup(props) {
  const { open, handleClose, userId } = props;
  const [followers, setFollowers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `/api/v1/users/${userId}/followers?pageSize=100`
        );
        if (response.status === 200) {
          setFollowers(response.data.items);
          setTotalCount(response.data.totalCount);
        }
      } catch (error) {
        console.error("Error fetching followers:", error);
        setError(error.message || "Failed to load followers.");
      } finally {
        setLoading(false);
      }
    };
    if (open) {
      fetchFollowers();
    }
  }, [open, userId]);

  if (!open || totalCount === 0) {
    return null; // Do not render the dialog if not open or there are no followers
  }

  return (
    <Dialog open={props.open} onClose={handleClose} maxWidth={"md"} PaperProps={{ sx: { width: { xs: 400, sm: 400, md: 450, lg: 500, xl: 500 }, borderRadius: 4, backgroundColor: "#C8EFA5", px: 3, py: 2 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgb(165, 165, 165)", mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Followers ({totalCount})
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: "#555" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ px: 1.5, py: 0 }}>
        {loading && <Typography>Loading followers...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {!loading &&
          !error &&
          followers.map((user) => (
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
