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

export default function EventCompressed() {
  return(
    <Box sx={{ maxWidth: 700, outline: "1.5px solid #C0C0C0", backgroundColor: "#FFFFFF", pl: 3, pt: 3, pr: 3, pb: 3, borderRadius: 5, boxShadow: 5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h5" fontWeight="bold" style={{ marginRight: '15px', maxWidth: '400px' }} noWrap>
            Enginar Festival
          </Typography>
          <PlaceOutlinedIcon style={{ fontSize: '30px', marginRight: '2px' }} />
          <Typography variant="body2" component="div" noWrap>
            Istanbul
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarMonthIcon style={{ fontSize: '30px', marginRight: '2px' }} />
          <Typography variant="body2" component="div" noWrap>
            24.12.2024
          </Typography>
        </Box>
      </Box>
        
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="body1" component="div" fontWeight="bold" style={{ marginRight: '6px' }} noWrap>
          Host:
        </Typography>
        <Avatar sx={{ width: 34, height: 34, marginRight: 0.7 }}/>
        <Typography variant="body2" component="div" color="text.secondary" noWrap>
          <b>Hoshino Ichika</b><br/>CEO
        </Typography>
      </Box>
        
      <Typography variant="body2" component="div" sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 5, textOverflow: 'ellipsis' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" component="div" fontWeight="bold" style={{ marginRight: '6px' }}>
            Participants:
          </Typography>
          <AvatarGroup total={23} sx={{'& .MuiAvatar-root': { width: 32, height: 32, fontSize: 15 }, marginRight: 0.5}}>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
            <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
          </AvatarGroup>
          <Typography variant="caption" component="div" color="text.secondary">
            X, Y and Z whom you follow are going
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button variant="contained" style={{ backgroundColor: "#4B9023", borderRadius: 30, width: "80px", height: "35px", textTransform: "none" }}>
            <Typography variant="h6" >
              Join
            </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
