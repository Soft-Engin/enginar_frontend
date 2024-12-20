import * as React from "react";
import {
  Typography,
  Box
} from "@mui/material";

export default function UserMini() {
  return(
    <Box sx={{ maxWidth: 700, outline: "1.5px solid #C0C0C0", backgroundColor: "#FFFFFF", pl: 3, pt: 2, pr: 3, pb: 1.5, borderRadius: 5, boxShadow: 5 }}>
      <Typography>
        test
      </Typography>
    </Box>
  )
}