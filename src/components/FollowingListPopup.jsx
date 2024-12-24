import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from '@mui/material/DialogContent';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton";

import CloseIcon from "@mui/icons-material/Close";
import UserListItem from "./UserListItem";

function generate(element) {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

export default function FollowingListPopup(props) {
  const handleClose = () => {
    props.handleClose();
  };

  return (
    <Dialog open={props.open} onClose={handleClose} maxWidth={"md"} PaperProps={{ sx: { width: 500, borderRadius: 4, backgroundColor: "#C8EFA5", px: 3, py: 2 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgb(165, 165, 165)", mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Following (42)
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: "#555" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ px: 1.5, py: 0 }}>
        {generate(<UserListItem />).map((user, index) => (
          <Box key={index} justifyContent="center" alignItems="center" sx={{ mt: 0.5, mb: 1.5 }}>
            {user}
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
}
