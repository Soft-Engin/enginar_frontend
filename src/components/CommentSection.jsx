import * as React from "react";
import {
  Typography,
  Box,
  Avatar,
  Button,
  TextField
} from "@mui/material";
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import Comment from "./Comment"

function generate(element) {
  return [0, 1, 2, 3].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

export default function CommentSection() {
  return(
    <Box sx={{ maxWidth: 1500, outline: "1px solid #C0C0C0", backgroundColor: "#EAEAEA", px: 3, py: 2, borderRadius: "0 0 15px 15px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5, mr: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Avatar sx={{ width: 50, height: 50, marginRight: 0.5 }}/>
          <TextField fullWidth multiline placeholder="Write a comment..." variant="outlined" sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
              },
              "&:hover fieldset": {
                border: "none",
              },
              "&.Mui-focused fieldset": {
                border: "none",
              },
              "& .MuiInputBase-input": {
                fontSize: "18px",
              },
            },
          }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 5 }}>
          <Button variant="contained" style={{ backgroundColor: "#4B9023", borderRadius: 30, width: "90px", height: "40px", textTransform: "none" }}>
            <Typography variant="h6">
              Post
            </Typography>
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 8.5, mb: 2 }}>
        <AddPhotoAlternateOutlinedIcon sx={{ fontSize: '30px', marginRight: 1, color: "#417D1E" }}/>
        <AddReactionOutlinedIcon sx={{ fontSize: '30px', color: "#417D1E" }}/>
      </Box>

      {generate(<Comment />).map((comment, index) => (
        <Box key={index} sx={{ borderTop: "1px solid #C0C0C0", alignItems: 'center' }}>
          {comment}
        </Box>
      ))}
    </Box>
  )
}