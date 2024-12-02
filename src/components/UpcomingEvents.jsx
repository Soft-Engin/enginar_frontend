import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import AvatarGroup from "@mui/material/AvatarGroup";

function generate(element) {
  return [0, 1].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}
{
  /* Bu komple kaldırılacak */
}

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

export default function UpcomingEvents() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 550,
        right: 160,
        width: 350,
        borderRadius: 3,
        outline: "1.5px solid #AAAAAA",
        backgroundColor: "#C8EFA5",
      }}
    >
      <Typography
        fontWeight="bold"
        style={{ color: "#000000" }}
        sx={{ pt: 2, pl: 2, fontSize: 24, opacity: 0.7 }}
        variant="h5"
        component="div"
      >
        Upcoming Events
      </Typography>
      <List>
        {generate(
          <ListItem>
            <Box
              sx={{
                outline: "1.5px solid #AAAAAA",
                width: 330,
                pt: 1,
                pl: 2,
                backgroundColor: "#FFFFFF",
                borderRadius: 3,
              }}
            >
              <ListItemText>
                <Typography variant="h6" component="div" noWrap>
                  Pair Programming @ Octa's {/* Buraya username gelecek*/}
                </Typography>
              </ListItemText>
              <AvatarGroup total={24}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
                <Avatar
                  alt="Trevor Henderson"
                  src="/static/images/avatar/5.jpg"
                />
              </AvatarGroup>
            </Box>
          </ListItem>
        )}
      </List>
    </Box>
  );
}
