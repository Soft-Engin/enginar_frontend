import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import CloseIcon from "@mui/icons-material/Close";

export default function EventPopup(props) {
  const [location, setLocation] = React.useState('');

  const handleClose = () => {
    props.handleClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);

    props.handleClose();
  };

  const handleLocation = (event) => {
    setLocation(event.target.value);
  };

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      maxWidth={"md"}
      PaperProps={{
        sx: {
          width: { xs: 250, sm: 400, md: 550, lg: 600, xl: 620 },
          borderRadius: 4,
          backgroundColor: "#C8EFA5",
          padding: 0.5,
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "bold",
            color: "#333",
            fontSize: "1.5rem",
          }}
        >
          Create New Event
          <IconButton
            onClick={handleClose}
            sx={{
              color: "#555",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            name="eventName"
            autoFocus
            fullWidth
            required
            label="Event Name"
            variant="outlined"
            sx={{
              marginBottom: 2,
              backgroundColor: "#fff",
              borderRadius: 2,
              mt: 1
            }}
          />
          <Box
            display="flex"
            gap={2}
            sx={{
              marginBottom: 2,
            }}
          >
            <TextField
              name="eventDate"
              type="date"
              fullWidth
              required
              label="Event Date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              sx={{
                backgroundColor: "#fff",
                borderRadius: 2,
              }}
            />
          </Box>
          <FormControl fullWidth sx={{marginBottom: 2}}>
            <InputLabel id="demo-simple-select-autowidth-label">Location </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={location}
              onChange={handleLocation}
              label="Location"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={21}>Twenty one</MenuItem>
              <MenuItem value={22}>Twenty two</MenuItem>
            </Select>
          </FormControl>

          <TextField
            name="description"
            fullWidth
            multiline
            rows={4}
            label="Event Description"
            variant="outlined"
            sx={{
              marginBottom: 2,
              backgroundColor: "#fff",
              borderRadius: 2,
            }}
          />
          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "#4B9023",
              color: "#fff",
              ":hover": {
                backgroundColor: "#4B9023",
              },
              borderRadius: 20,
              marginTop: 2,
              display: "block",
              marginLeft: "auto",
            }}
          >
            Create Event
          </Button>
        </DialogContent>
      </form>
    </Dialog>
  );
}
