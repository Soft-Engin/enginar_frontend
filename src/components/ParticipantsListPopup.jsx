import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import CloseIcon from "@mui/icons-material/Close";
import UserListItem from "./UserListItem";

function generate(element) {
  return [0, 1, 2, 3, 4, 5].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

export default function ParticipantsListPopup(props) {
  const handleClose = () => {
    props.handleClose();
  };

  return (
    <Dialog open={props.open} onClose={handleClose} maxWidth={"md"} PaperProps={{ sx: { width: 400, borderRadius: 4, backgroundColor: "#C8EFA5", padding: 0.5 } }}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "bold", color: "#333", fontSize: "1.25rem" }}>
        Event Participants (80)
        <IconButton onClick={handleClose} sx={{ color: "#555" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {generate(<UserListItem />).map((user, index) => (
          <Box key={index} justifyContent="center" alignItems="center">
            {user}
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
}
