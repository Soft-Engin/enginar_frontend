import * as React from "react";
import {
  Typography,
  Box,
  Avatar
} from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

export default function Comment() {
  return(
    <Box sx={{ maxWidth: 1500, backgroundColor: "#EAEAEA", pb: 1.3, pt: 2.2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: 'flex' }}>
          <Avatar sx={{ width: 50, height: 50, mr: 1.3 }}/>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body1" fontWeight="bold" noWrap>
              Kusanagi Nene
            </Typography>
            <Typography variant="body2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FavoriteBorderIcon style={{ fontSize: "30px", marginRight: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  39
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ChatBubbleOutlineIcon style={{ fontSize: "28px", marginRight: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  10
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', ml: 4 }}>
          <MoreHorizIcon sx={{ fontSize: '30px' }} />
        </Box>
      </Box>
    </Box>
  );
}
