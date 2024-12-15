import * as React from "react";
import { 
  Box, 
  Typography,
  Avatar
} from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import ShareIcon from "@mui/icons-material/Share";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

export default function RecipeDetailed() {
  return(
    <Box sx={{ maxWidth: 1500, outline: "1.5px solid #C0C0C0", backgroundColor: "#FFFFFF", pl: 4, pr: 4, pt: 2, pb: 1, borderRadius: "20px 20px 0 0" }} >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ width: 50, height: 50, marginRight: 1.5 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ marginRight: 0.5 }} noWrap>
              Shiraishi An
            </Typography>
            <Typography variant="h6" color="text.secondary" noWrap>
              · 2h
            </Typography>
          </Box>
        <MoreHorizIcon sx={{ fontSize: '40px' }} />
      </Box>

      <Typography variant="body1" sx={{ lineHeight: "25px", mb: 1 }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </Typography>

      <Box sx={{ textAlign: "center", borderTop: "1px solid #E0E0E0", py: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          My Artichoke Recipe
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
          <Typography variant="body2" color="text.secondary">
            <b>Servings:</b> 10
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <b>Total Time:</b> 90 mins
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ flex: "0 0 40%" }}>
          <Typography variant="h5" fontWeight="bold">
            Ingredients
          </Typography>
          <List sx={{ listStyleType: "disc", pl: 2, "& .MuiListItem-root": {display: "list-item", pl: 0, mb: 0} }}>
            <ListItem>1/2 cup olive oil</ListItem>
            <ListItem>1 medium-sized onion</ListItem>
            <ListItem>1 potato</ListItem>
            <ListItem>1 large carrot</ListItem>
            <ListItem>1 cup frozen peas</ListItem>
            <ListItem>8 cleaned artichokes</ListItem>
            <ListItem>2 freshly squeezed lemons (juice)</ListItem>
            <ListItem>1 cup water</ListItem>
            <ListItem>1 teaspoon granulated sugar</ListItem>
            <ListItem>1/4 teaspoon salt</ListItem>
            <ListItem>1/4 bunch dill</ListItem>
          </List>
        </Box>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Steps
          </Typography>
          <List sx={{ listStyleType: "numeric", pl: 2, "& .MuiListItem-root": {display: "list-item", pl: 0, mb: 0} }}>
            <ListItem>Sauté 1 finely chopped onion in half a cup of olive oil in a pan until it turns slightly golden.</ListItem>
            <ListItem>Add 1 diced and boiled potato and carrot to the pan. Cook for another 2-3 minutes.</ListItem>
            <ListItem>Add 1 cup of peas to the mixture, cook for 3-4 minutes, then remove your garnish from the heat.</ListItem>
            <ListItem>To prepare the sauce for cooking the artichokes, mix 2 freshly squeezed lemons, 1 cup of water, 1 teaspoon of sugar, 1/2 teaspoon of salt, and 2 tablespoons of olive oil in a bowl.</ListItem>
            <ListItem>Place 8 artichokes in a wide pot and fill each with the prepared garnish.</ListItem>
            <ListItem>Pour the lemon sauce mixture into the pot.</ListItem>
            <ListItem>Cover the lid and cook until the artichokes are tender.</ListItem>
            <ListItem>Serve the artichokes cold. Enjoy!</ListItem>
          </List>
        </Box>
      </Box>

      <Box sx={{ mb: 0.5 }}>
        <img 
          src="https://via.placeholder.com/400x225"
          alt="Enginar Yemeği"
          style={{
            width: "100%",
            borderRadius: 10,
            border: "1px solid #C0C0C0",
          }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", pb: 1, mb: 1, borderBottom: "1px solid #C0C0C0" }}>
        <Typography variant="body1" color="text.secondary" sx={{ marginRight: 0.5 }} noWrap>
          11:35 PM
        </Typography>
        <Typography variant="body1" color="text.secondary" noWrap>
          · Dec 15, 2024
        </Typography>
      </Box>
      
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FavoriteBorderIcon style={{ fontSize: "45px", marginRight: 4 }} />
            <Typography variant="body1" color="text.secondary">
              39,500
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ChatBubbleOutlineIcon style={{ fontSize: "42px", marginRight: 4 }} />
            <Typography variant="body1" color="text.secondary">
              14
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ShareIcon style={{ fontSize: "42px", marginRight: 6 }} />
          <BookmarkBorderOutlinedIcon style={{ fontSize: "48px" }} />
        </Box>
      </Box>
    </Box>
  )
}