import * as React from "react";
import {
  Typography,
  Box,
  Avatar,
  AvatarGroup,
  Button,
  List,
  ListItem
} from "@mui/material";
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import ParticipantsListPopup from "./ParticipantsListPopup"

export default function EventDetailed() {
  const [participantsPopupOpen, setParticipantsPopupOpen] = React.useState(false);
  
  const handleParticipantsPopupOpen = () => {
    setParticipantsPopupOpen(true);
  };

  const handleParticipantsPopupClose = () => {
    setParticipantsPopupOpen(false);
  };
  
  return(
    <Box sx={{ width: "100%", outline: "1.5px solid #C0C0C0", backgroundColor: "#FFFFFF", px: 5, py: 4, borderRadius: "20px 20px 0 0", boxShadow: 3 }} >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h4" fontWeight="bold" style={{ marginRight: '15px', maxWidth: '400px' }} noWrap>
            Enginar Festival
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <CalendarMonthIcon style={{ fontSize: '30px', marginRight: '2px' }} />
        <Typography variant="h6" component="div" fontWeight="bold" style={{ marginRight: "7px" }}>
          Event Date and Time:
        </Typography>
        <Typography variant="body1" component="div" color="text.secondary">
          24.12.2024, 16:00
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <PlaceOutlinedIcon style={{ fontSize: '30px', marginRight: '2px' }} />
        <Typography variant="h6" component="div" fontWeight="bold" style={{ marginRight: "7px" }}>
          Location:
        </Typography>
        <Typography variant="body1" component="div" color="text.secondary">
          Yenikapı Sahil Yolu, Kennedy Cd. No:17, 34130 Fatih, İstanbul, Türkiye
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <EmojiPeopleIcon style={{ fontSize: '30px', marginRight: '2px' }} />
        <Typography variant="h6" component="div" fontWeight="bold" style={{ marginRight: '7px' }}>
          Host:
        </Typography>
        <Avatar sx={{ width: 35, height: 35, marginRight: 0.7 }}/>
        <Typography variant="body1" component="div" color="text.secondary">
          <b>Hoshino Ichika</b>
        </Typography>
      </Box>
      
      <Typography variant="h6" component="div" fontWeight="bold" sx={{ mb: 0.5, pb: 0.6, borderBottom: "1px solid #E0E0E0" }}>
        Description
      </Typography>
      <Typography variant="body1" component="div" sx={{ lineHeight: "25px", mb: 3, pt: 0.5 }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </Typography>

      <Box sx={{ mb: 2, backgroundColor: "#C8EFA5", borderRadius: 4, px: 3, pt: 1, pb: 0.5, boxShadow: 3 }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          Requirements:
        </Typography>
        <List sx={{ listStyleType: "numeric", px: 3, "& .MuiListItem-root": {display: "list-item", pl: 0, mb: 0 } }}>
          <ListItem><b>ID Card:</b> Bring a valid ID card.</ListItem>
          <ListItem><b>Dress Code:</b> Guests are required to follow the formal dress code.</ListItem>
        </List>
      </Box>

      <Typography variant="h6" component="div" fontWeight="bold" sx={{ mb: 0.5, pb: 0.6, borderBottom: "1px solid #E0E0E0" }}>
        Participants
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AvatarGroup total={23} sx={{'& .MuiAvatar-root': { width: 38, height: 38, fontSize: 19 }, marginRight: 1, cursor: "pointer" }} onClick={handleParticipantsPopupOpen}>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
            <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
          </AvatarGroup>
          <Typography variant="subtitle2" component="div" color="text.secondary">
            X, Y and Z whom you follow are going
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button variant="contained" style={{ backgroundColor: "#4B9023", borderRadius: 30, width: "110px", height: "45px", textTransform: "none" }}>
            <Typography variant="h5">
              Join
            </Typography>
          </Button>
        </Box>
      </Box>
      <ParticipantsListPopup open={participantsPopupOpen} handleClose={handleParticipantsPopupClose} />
    </Box>
  );
}
