import React, { useState } from "react";
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

import HomeIcon from "@mui/icons-material/Home";
import FilterAltSharpIcon from "@mui/icons-material/FilterAltSharp";
import CasinoSharpIcon from "@mui/icons-material/CasinoSharp";
import GroupIcon from "@mui/icons-material/Group";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import LogoutIcon from "@mui/icons-material/Logout";

import PostAddIcon from "@mui/icons-material/PostAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";

import AuthPopup from "./AuthPopup";
import SearchBar from "./SearchBar";
import PostPopup from "./PostPopup";

const drawerWidth = 280;
const drawerIconStyle = { fontSize: { xs: 24, sm: 32, md: 32, lg: 32 } };

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
  width: `calc(${theme.spacing(6)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
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
    left: 5,
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
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.up('lg')]: {
    justifyContent: 'space-between',
    '& > *:nth-of-type(2)': {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: '600px',
      width: '100%'
    },
  },
}));

const LeftSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

const RightSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const navbarTitlesIcons = [
  { text: "Anasayfa", icon: <HomeIcon sx={drawerIconStyle} /> },
  {
    text: "Dolabımdan Yemek",
    icon: <FilterAltSharpIcon sx={drawerIconStyle} />,
  },
  {
    text: "Kendimi Aç Hissediyorum",
    icon: <CasinoSharpIcon sx={drawerIconStyle} />,
  },
  { text: "Etkinlik Merkezi", icon: <GroupIcon sx={drawerIconStyle} /> },
  { text: "Favorilerim", icon: <FavoriteIcon sx={drawerIconStyle} /> },
  { text: "Kaydettiklerim", icon: <BookmarkIcon sx={drawerIconStyle} /> },
];

const dialActions = [
  { icon: <GroupAddIcon />, name: "Etkinlik" },
  { icon: <RestaurantMenuIcon />, name: "Tarif" },
];

export default function Navbar(props) {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [userLogged, setUserLogged] = useState(
    localStorage.getItem("userLogged") === "true"
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const drawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSpeedDialOpen = () => setSpeedDialOpen(true);
  const handleSpeedDialClose = () => setSpeedDialOpen(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [postPopupOpen, setPostPopupOpen] = React.useState(false);

  const handlePostPopupOpen = () => {
    setPostPopupOpen(true);
    setSpeedDialOpen(false);
  };

  const handlePostPopupClose = () => {
    setPostPopupOpen(false);
    setSpeedDialOpen(false);
  };

  const userActions = [
    {
      text: "Profile",
      icon: <AccountCircleIcon />,
      action: handleCloseUserMenu,
    },
    {
      text: "Settings",
      icon: <SettingsApplicationsIcon />,
      action: handleCloseUserMenu,
    },
    {
      text: "Logout",
      icon: <LogoutIcon />,
      action: () => {
        localStorage.setItem("userLogged", false);
        setUserLogged(false);
      },
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
                sx={{ fontFamily: "'Jersey 25', sans-serif", fontSize: "2.3rem" }}
              >
                ENGINAR
              </Typography>
            )}
          </LeftSection>

          <SearchBar />

          <RightSection>
            {userLogged ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu}>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
              <AuthPopup setUserLogged={setUserLogged} setAnchorElUser={setAnchorElUser} />
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
        <DrawerHeader/>
        <List>
          {navbarTitlesIcons.map((item) => (
            <ListItem
              key={item.text}
              disablePadding
              sx={{ display: "block", position: "relative" }}
            >
              <ListItemButton
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
      <Box component="main" sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center"}}>
        <DrawerHeader />
        {props.body}
      </Box>
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
            key={"Post"}
            icon={<PostAddIcon/>}
            tooltipTitle={"Post"}
            tooltipOpen
            onClick={handlePostPopupOpen}
            tooltipPlacement={isSmUp ? "right" : "left"}
          />
        {dialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={handleSpeedDialClose}
            tooltipPlacement={isSmUp ? "right" : "left"}
          />
        ))}
      </ActionSpeedDial>
      <PostPopup
        open={postPopupOpen}
        handleClose={handlePostPopupClose}
      />
    </Box>
  );
}
