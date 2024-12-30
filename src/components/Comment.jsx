import * as React from "react";
import { Typography, Box, Avatar } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

export default function Comment() {
  return (
    <Box sx={{ maxWidth: 1500, backgroundColor: "#EAEAEA", pb: 1.3, pt: 2.2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", pb: 1.2 }}>
          <Avatar sx={{ width: 50, height: 50, mr: 1.3 }} />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="body1" fontWeight="bold" noWrap>
              Kusanagi Nene
            </Typography>
            <Typography variant="body2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", ml: 4 }}>
          <MoreHorizIcon sx={{ fontSize: "30px" }} />
        </Box>
      </Box>
    </Box>
  );
}
