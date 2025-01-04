import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import KitchenOutlinedIcon from "@mui/icons-material/KitchenOutlined";
import CasinoOutlinedIcon from "@mui/icons-material/CasinoOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import LogoutIcon from "@mui/icons-material/Logout";
import PostAddIcon from "@mui/icons-material/PostAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AuthPopup from "./AuthPopup";
import SearchBar from "./SearchBar";
import PostPopup from "./PostPopup";
import EventPopup from "./EventPopup";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const drawerWidth = 300;
const drawerIconStyle = {
  fontSize: { xs: 28, sm: 36, md: 36, lg: 36 },
  color: "black",
};

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(6)} + 7px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 7px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#4B9023",
}));

const ActionSpeedDial = styled(SpeedDial)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  position: "fixed",
  bottom: 8,
  right: 8,
  [theme.breakpoints.up("sm")]: {
    right: "auto",
    left: 8,
  },
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  [theme.breakpoints.up("lg")]: {
    justifyContent: "space-between",
    "& > *:nth-of-type(2)": {
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      maxWidth: "600px",
      width: "100%",
    },
  },
}));

const LeftSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}));

const RightSection = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const navbarTitlesIconsBase = [
  {
    text: (
      <Typography sx={{ fontWeight: "500", fontSize: "20px" }}>Home</Typography>
    ),
    icon: <HomeOutlinedIcon sx={drawerIconStyle} />,
    link: "/",
  },
  {
    text: (
      <Typography sx={{ fontWeight: "500", fontSize: "20px" }}>
        From My Kitchen
      </Typography>
    ),
    icon: <KitchenOutlinedIcon sx={drawerIconStyle} />,
    link: "/fromMyKitchen",
  },
  {
    text: (
      <Typography sx={{ fontWeight: "500", fontSize: "20px" }}>
        Feelin' Hungry
      </Typography>
    ),
    icon: <CasinoOutlinedIcon sx={drawerIconStyle} />,
    action: () => {},
  },
  {
    text: (
      <Typography sx={{ fontWeight: "500", fontSize: "20px" }}>
        Event Hub
      </Typography>
    ),
    icon: <PeopleAltOutlinedIcon sx={drawerIconStyle} />,
    link: "/eventhub",
  },
];
const navbarTitlesIconsAuth = [
  {
    text: (
      <Typography sx={{ fontWeight: "500", fontSize: "20px" }}>
        Liked Posts
      </Typography>
    ),
    icon: <FavoriteBorderOutlinedIcon sx={drawerIconStyle} />,
    link: "/savedliked?mode=likes",
  },
  {
    text: (
      <Typography sx={{ fontWeight: "500", fontSize: "20px" }}>
        Saved Posts
      </Typography>
    ),
    icon: <BookmarkBorderOutlinedIcon sx={drawerIconStyle} />,
    link: "/savedliked?mode=bookmarkes",
  },
];

axios.defaults.baseURL = "http://localhost:8090";
axios.defaults.headers.common["Authorization"] = localStorage.getItem("token")
  ? `Bearer ${localStorage.getItem("token")}`
  : "";

export default function Navbar(props) {
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [userLogged, setUserLogged] = useState(
    localStorage.getItem("userLogged") === "true"
  );
  const [isInverted, setIsInverted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [user, setUser] = useState(
    localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : null
  );
  const [navbarTitlesIcons, setNavbarTitlesIcons] = useState(
    navbarTitlesIconsBase
  );
  const [showSpeedDial, setShowSpeedDial] = useState(false);
  const getStoredInvertMode = () => {
    return localStorage.getItem("isInverted") === "true";
  };
  const setStoredInvertMode = (value) => {
    localStorage.setItem("isInverted", value.toString());
  };
  const [userInitials, setUserInitials] = React.useState("");

  const generateInitials = (userName) => {
    const nameParts = userName.split(" ");
    return (
      nameParts.map((part) => part.charAt(0).toUpperCase()).join("") ||
      userName.charAt(0).toUpperCase()
    );
  };

  useEffect(() => {
    if (user && user.userName) {
      setUserInitials(generateInitials(user.userName));
    }
  }, [user]);

  useEffect(() => {
    const storedMode = getStoredInvertMode();
    setIsInverted(storedMode);

    if (storedMode) {
      document.body.classList.add("invert-mode");
    }

    return () => {
      document.body.classList.remove("invert-mode");
    };
  }, []);

  const toggleInvertMode = () => {
    const newInverted = !isInverted;
    setIsInverted(newInverted);
    if (newInverted) {
      document.body.classList.add("invert-mode");
    } else {
      document.body.classList.remove("invert-mode");
    }
    setStoredInvertMode(newInverted);
  };

  const drawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  const handleSpeedDialOpen = () => setSpeedDialOpen(true);
  const handleSpeedDialClose = () => setSpeedDialOpen(false);

  useEffect(() => {
    if (userLogged) {
      setShowSpeedDial(true);
    } else {
      setShowSpeedDial(false);
    }
  }, [userLogged]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleLogout = () => {
    localStorage.setItem("userLogged", false);
    setUserLogged(false);
    localStorage.removeItem("userData");
    setUser(null);
    setProfilePic(null);
    navigate("/");
    window.location.reload();
  };
  useEffect(() => {
    setNavbarTitlesIcons(
      userLogged
        ? [...navbarTitlesIconsBase, ...navbarTitlesIconsAuth]
        : navbarTitlesIconsBase
    );
  }, [userLogged]);
  const fetchUserData = async () => {
    if (userLogged) {
      try {
        const userResponse = await axios.get("/api/v1/users/me");
        if (userResponse.status === 200) {
          localStorage.setItem("userData", JSON.stringify(userResponse.data));
          setUser(userResponse.data);
          try {
            const picResponse = await axios.get(
              `/api/v1/users/${userResponse.data.userId}/profile-picture`,
              { responseType: "blob" }
            );
            if (picResponse.status === 200) {
              const imageUrl = URL.createObjectURL(picResponse.data);
              setProfilePic(imageUrl);
            } else {
              setProfilePic(null);
            }
          } catch (picError) {
            setProfilePic(null);
            console.error("Error fetching profile picture:", picError);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        handleLogout();
      }
    } else {
      localStorage.removeItem("userData");
      setUser(null);
      setProfilePic(null);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);
  useEffect(() => {
    fetchUserData();
  }, [userLogged]);
  const [postPopupOpen, setPostPopupOpen] = React.useState(false);
  const [eventPopupOpen, setEventPopupOpen] = React.useState(false);
  const handleEventPopupOpen = () => {
    setEventPopupOpen(true);
    setSpeedDialOpen(false);
  };
  const handleEventPopupClose = () => {
    setEventPopupOpen(false);
    setSpeedDialOpen(false);
  };
  const handlePostPopupOpen = () => {
    setPostPopupOpen(true);
    setSpeedDialOpen(false);
  };
  const handlePostPopupClose = () => {
    setPostPopupOpen(false);
    setSpeedDialOpen(false);
  };
  const handleFeelinHungry = async () => {
    const randomSeed = Math.floor(Math.random() * 1000);
    try {
      const response = await axios.get(
        `/api/v1/feed/recipe?pageSize=1&seed=${randomSeed}`
      );
      if (response.status === 200 && response.data.items.length > 0) {
        const recipeId = response.data.items[0].id;
        navigate(`/recipe?id=${recipeId}`);
      }
    } catch (error) {
      console.error("Error fetching random recipe", error);
    }
  };
  const userActions = [
    {
      text: "Profile",
      icon: <AccountCircleIcon />,
      action: () => {
        handleCloseUserMenu();
        if (user?.userId) {
          navigate(`/profile?id=${user.userId}`);
        }
      },
    },
    {
      text: "Settings",
      icon: <SettingsApplicationsIcon />,
      action: () => {
        handleCloseUserMenu();
        navigate("/settings");
      },
    },
    {
      text: "Logout",
      icon: <LogoutIcon />,
      action: handleLogout,
    },
  ];
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={drawerOpen}>
        <StyledToolbar>
          <LeftSection>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={drawerToggle}
              edge="start"
              sx={{ marginRight: isMdUp ? 2 : isSmUp ? 1.5 : 1 }}
            >
              <MenuIcon />
            </IconButton>
            {isMdUp && (
              <Typography
                noWrap
                component="div"
                color="White"
                sx={{
                  fontFamily: "'Jersey 25', sans-serif",
                  fontSize: "2.3rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate("/");
                }}
              >
                ENGINAR
              </Typography>
            )}
          </LeftSection>

          <SearchBar />

          <RightSection sx={{ mr: 3 }}>
            {userLogged ? (
              <>
                <Tooltip title="Profile Menu">
                  <IconButton onClick={handleOpenUserMenu}>
                    {profilePic ? (
                      <Avatar
                        src={profilePic}
                        sx={{ width: 45, height: 45 }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 45,
                          height: 45,
                          borderRadius: "50%",
                          backgroundColor: "#A5E072",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                        }}
                      >
                        {userInitials}
                      </Box>
                    )}
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {userActions.map((action) => (
                    <MenuItem
                      key={action.text}
                      onClick={action.action}
                      style={{
                        width: "140px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography sx={{ textAlign: "left" }}>
                        {action.text}
                      </Typography>
                      {action.icon}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <AuthPopup
                setUserLogged={setUserLogged}
                setAnchorElUser={setAnchorElUser}
              />
            )}
          </RightSection>
        </StyledToolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={drawerOpen}
        PaperProps={{
          sx: {
            backgroundColor: "#A5E072",
          },
        }}
      >
        <DrawerHeader />
        <List sx={{ marginTop: "6px" }}>
          {navbarTitlesIcons.map((item) => (
            <ListItem
              key={item.text}
              disablePadding
              sx={{ display: "block", position: "relative" }}
            >
              <ListItemButton
                to={item.link}
                onClick={
                  item.text.props?.children === "Feelin' Hungry"
                    ? handleFeelinHungry
                    : undefined
                }
                sx={[
                  {
                    minHeight: 48,
                    paddingLeft: 0,
                    paddingRight: 0,
                  },
                  drawerOpen
                    ? {
                        justifyContent: "initial",
                      }
                    : {
                        justifyContent: "center",
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: "center",
                      position: "relative",
                      left: isSmUp ? 16 : 12,
                    },
                    drawerOpen
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: "auto",
                        },
                  ]}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={[
                    drawerOpen
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <DrawerHeader />
        {props.body}
      </Box>
      {showSpeedDial && (
        <ActionSpeedDial
          ariaLabel="SpeedDial tooltip example"
          icon={<SpeedDialIcon />}
          onClose={handleSpeedDialClose}
          onOpen={handleSpeedDialOpen}
          open={speedDialOpen}
          FabProps={{
            sx: {
              bgcolor: "#4B9023",
              "&:hover": {
                bgcolor: "#4B9023",
              },
              width: "50px",
              height: "50px",
            },
          }}
        >
          <SpeedDialAction
            key={"Blog"}
            icon={<PostAddIcon />}
            tooltipTitle={"Blog"}
            tooltipOpen
            onClick={handlePostPopupOpen}
            tooltipPlacement={isSmUp ? "right" : "left"}
          />
          <SpeedDialAction
            key={"Event"}
            icon={<GroupAddIcon />}
            tooltipTitle={"Event"}
            tooltipOpen
            onClick={handleEventPopupOpen}
            tooltipPlacement={isSmUp ? "right" : "left"}
          />
          <SpeedDialAction
            key={"Recipe"}
            icon={<RestaurantMenuIcon />}
            tooltipTitle={"Recipe"}
            tooltipOpen
            onClick={() => navigate("/createRecipe")}
            tooltipPlacement={isSmUp ? "right" : "left"}
          />
        </ActionSpeedDial>
      )}
      <PostPopup open={postPopupOpen} handleClose={handlePostPopupClose} />
      <EventPopup open={eventPopupOpen} handleClose={handleEventPopupClose} />
    </Box>
  );
}
