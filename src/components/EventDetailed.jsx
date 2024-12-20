import * as React from "react";
import {
  Typography,
  Box,
  Avatar,
  AvatarGroup,
  Button
} from "@mui/material";
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function EventDetailed() {
  return(
    <Box sx={{ maxWidth: 1500, outline: "1.5px solid #C0C0C0", backgroundColor: "#FFFFFF", p: 5, borderRadius: "20px 20px 0 0", boxShadow: 3 }} >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h4" fontWeight="bold" style={{ marginRight: '15px', maxWidth: '400px' }} noWrap>
            Enginar Festival
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarMonthIcon style={{ fontSize: '30px', marginRight: '3px' }} />
          <Typography variant="body1" component="div" fontWeight="bold" style={{ marginRight: '5px' }} noWrap>
            Event Date and Time:
          </Typography>
          <Typography variant="body1" component="div" color="text.secondary" noWrap>
            24.12.2024, 16:00
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" component="div" fontWeight="bold" noWrap>
          Location:
        </Typography>
        <PlaceOutlinedIcon style={{ fontSize: '30px', marginRight: '2px' }} />
        <Typography variant="body1" component="div" color="text.secondary" noWrap>
          Yenikapı Sahil Yolu, Kennedy Cd. No:17, 34130 Fatih, İstanbul, Türkiye
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" component="div" fontWeight="bold" style={{ marginRight: '7px' }} noWrap>
          Host:
        </Typography>
        <Avatar sx={{ width: 42, height: 42, marginRight: 0.7 }}/>
        <Typography variant="body1" component="div" color="text.secondary" noWrap>
          <b>Hoshino Ichika</b><br/>CEO
        </Typography>
      </Box>
      
      <Typography variant="h6" component="div" fontWeight="bold" style={{ marginBottom: '4px' }}>
        Description:
      </Typography>
      <Typography variant="body1" component="div" sx={{ lineHeight: "25px", mb: 2}}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </Typography>

      <Typography variant="h6" component="div" fontWeight="bold">
        Participants:
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AvatarGroup total={23} sx={{'& .MuiAvatar-root': { width: 38, height: 38, fontSize: 19 }, marginRight: 1}}>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
            <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
          </AvatarGroup>
          <Typography variant="subtitle2" component="div" color="text.secondary">
            X, Y and Z whom you follow are going
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button variant="contained" style={{ backgroundColor: "#4B9023", borderRadius: 30, width: "140px", height: "55px", textTransform: "none" }}>
            <Typography variant="h4">
              Join
            </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
