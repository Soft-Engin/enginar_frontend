import * as React from "react";
import {
  Typography,
  Box,
  Avatar
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ShareIcon from "@mui/icons-material/Share";

export default function RecipeMini() {
  return(
    <Box sx= {{ width: 450, height: 450, outline: "1.5px solid #C0C0C0", backgroundColor: "#FFFFFF", pl: 3, pt: 2, pr: 3, pb: 2, borderRadius: 5, boxShadow: 5 }}>
      <Grid container spacing={1}>
        <Grid item size={11}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 30, height: 30, marginRight: 0.8 }}/>
            <Typography variant="body2" component="div" fontWeight="bold" style={{ marginRight: '3px'}} noWrap>
              Hoshino Ichika
            </Typography>
            <Typography variant="body2" component="span" color="text.secondary">
              · 2h
            </Typography>
          </Box>
        </Grid>
        <Grid item size={1}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MoreHorizIcon style={{ fontSize: '30px' }} />
          </Box>
        </Grid>
        <Grid item size={12}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight="bold" style={{ marginRight: '15px', maxWidth: '380px' }} noWrap>
              My Enginar Recipe
            </Typography>
          </Box>
        </Grid>
        <Grid item size={12}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" component="div" sx={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, textOverflow: 'ellipsis', lineHeight: "24px" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </Typography>
          </Box>
        </Grid>
        <Grid item size={12}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="https://via.placeholder.com/400x225"
              alt="Enginar Yemeği"
              style={{ border: "1px solid #C0C0C0", borderRadius: 10 }}
            />
          </Box>
        </Grid>
        <Grid item size={2} sx={{ mt: "1px" }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FavoriteBorderIcon style={{ fontSize: '32px' }} />
            <Typography variant="body2" component="span" color="text.secondary">
              39k
            </Typography>
          </Box>
        </Grid>
        <Grid item size={8} sx={{ mt: "3px" }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ChatBubbleOutlineIcon style={{ fontSize: '28px', marginRight: '1px' }} />
            <Typography variant="body2" component="span" color="text.secondary">
              14
            </Typography>
          </Box>
        </Grid>
        <Grid item size={2} sx={{ mt: "1px" }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ShareIcon style={{ fontSize: '28px', marginRight: '6px' }} />
            <BookmarkIcon style={{ fontSize: '32px' }} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}