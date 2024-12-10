import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";

function generate(element) {
  return [0, 1, 2, 3].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
} {/* Bu komple kaldırılacak */}

const SharedButton = styled(Button)(({ theme }) => ({
  border: "black",
  borderStyle: "solid",
  borderWidth: "1px",
  height: "25px",
  minWidth: "100px",
  borderRadius: "15px",
}));

const FollowButton = styled(SharedButton)(({ theme }) => ({
  color: "#453E3E",
  backgroundColor: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#FFFFFF",
  },
}));

export default function RecommendedUsers() {
  return (
    <Box sx={{ position: "fixed", top: 150, right: 160, width: 320, borderRadius: 3, outline: "1.5px solid #959595", backgroundColor: "#C8EFA5", boxShadow: 5}}>
        <Typography
          fontWeight="bold"
          style={{ color: "#000000" }}
          sx={{pt: 2, pl: 2, fontSize: 24, opacity: 0.7}}
          variant="h5"
          component="div"
        >
          Recommended Users
        </Typography>
        <List>
          {generate(
            <ListItem>
              <ListItemAvatar>
                <Avatar>{/* Buraya user profile picture gelecek*/}</Avatar>
              </ListItemAvatar>
              <ListItemText>
                <Typography variant="h6" component="div">
                  Kendrick{/* Buraya username gelecek*/}
                </Typography>
              </ListItemText>
              <FollowButton sx={{}} variant="contained">
                Follow
              </FollowButton>
            </ListItem>
          )}
        </List>
    </Box>
  );
}
