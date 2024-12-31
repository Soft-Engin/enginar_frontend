import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import AvatarGroup from "@mui/material/AvatarGroup";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

function generate(element) {
  return [0, 1].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

export default function UpcomingEvents() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 425,
        right: { lg: "0.7%", xl: "2.5%" },
        width: 300,
        scale: { xs: "0%", sm: "0%", md: "0%", lg: "85%", xl: "95%" },
        borderRadius: 3,
        outline: "1.5px solid #959595",
        backgroundColor: "#C8EFA5",
        boxShadow: 5,
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
                width: 270,
                pl: 0.5,
                pr: 1,
                pb: 0.5,
                backgroundColor: "#FFFFFF",
                borderRadius: 3,
              }}
            >
              <ListItemText>
                <Box
                  sx={{
                    display: "grid",
                    gridAutoFlow: "row",
                    gridTemplateColumns: "0.7fr 1fr",
                    gridTemplateRows: "auto",
                  }}
                >
                  <Box display="flex">
                    <LocalOfferOutlinedIcon style={{ fontSize: "50px" }} />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      component="div"
                      fontWeight="bold"
                      mt={0.5}
                      sx={{ maxWidth: "210px" }}
                      noWrap
                    >
                      Enginar Festival @test wrapping
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "2px",
                      }}
                    >
                      <PlaceOutlinedIcon
                        style={{ fontSize: "30px", marginRight: "2px" }}
                      />
                      <Typography
                        variant="body2"
                        component="div"
                        sx={{ marginRight: "15px", maxWidth: "75px" }}
                        noWrap
                      >
                        Istanbul
                      </Typography>
                      <CalendarMonthIcon
                        style={{ fontSize: "30px", marginRight: "2px" }}
                      />
                      <Typography
                        variant="body2"
                        component="div"
                        sx={{ maxWidth: "75px" }}
                        noWrap
                      >
                        24.12.2024
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "10px",
                      }}
                    >
                      <AvatarGroup
                        total={23}
                        spacing={4}
                        sx={{
                          "& .MuiAvatar-root": {
                            width: 36,
                            height: 36,
                            fontSize: 17,
                          },
                        }}
                      >
                        <Avatar
                          alt="Remy Sharp"
                          src="/static/images/avatar/1.jpg"
                        />
                        <Avatar
                          alt="Travis Howard"
                          src="/static/images/avatar/2.jpg"
                        />
                        <Avatar
                          alt="Agnes Walker"
                          src="/static/images/avatar/4.jpg"
                        />
                      </AvatarGroup>
                      <Typography
                        variant="body2"
                        component="div"
                        color="text.secondary"
                        sx={{ marginLeft: "2px" }}
                        noWrap
                      >
                        are
                        <br />
                        going
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </ListItemText>
            </Box>
          </ListItem>
        )}
      </List>
    </Box>
  );
}
