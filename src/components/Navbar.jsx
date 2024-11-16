import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


import HomeIcon from "@mui/icons-material/Home";
import FilterAltSharpIcon from "@mui/icons-material/FilterAltSharp";
import CasinoSharpIcon from "@mui/icons-material/CasinoSharp";
import GroupIcon from '@mui/icons-material/Group';
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import LogoutIcon from '@mui/icons-material/Logout';

import PostAddIcon from "@mui/icons-material/PostAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";

const drawerWidth = 280;

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
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
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

const navbarTitlesIcons = [
  { text: "Anasayfa", icon: <HomeIcon sx={{ fontSize: 36 }} /> },
  {
    text: "Dolabımdan Yemek",
    icon: <FilterAltSharpIcon sx={{ fontSize: 36 }} />,
  },
  {
    text: "Kendimi Aç Hissediyorum",
    icon: <CasinoSharpIcon sx={{ fontSize: 36 }} />,
  },
  { text: "Etkinlik Merkezi", icon: <GroupIcon sx={{ fontSize: 36 }} /> },
  { text: "Favorilerim", icon: <FavoriteIcon sx={{ fontSize: 36 }} /> },
  { text: "Kaydettiklerim", icon: <BookmarkIcon sx={{ fontSize: 36 }} /> },
];

const dialActions = [
  { icon: <PostAddIcon />, name: "Post" },
  { icon: <GroupAddIcon />, name: "Etkinlik" },
  { icon: <RestaurantMenuIcon />, name: "Tarif" },
];

const userActions = [{text: "Profile", icon: <AccountCircleIcon/>}, {text: "Settings", icon: <SettingsApplicationsIcon/>}, {text: "Logout", icon: <LogoutIcon/>}];

export default function MiniDrawer() {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [speedDialOpen, setSpeedDialOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

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

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={drawerOpen}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={drawerToggle}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography  noWrap component="div" color="White" sx={{fontFamily: "'Jersey 25', sans-serif", fontSize: "2.3rem"}}>
            ENGINAR
          </Typography>

          <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ position: "absolute", right: 2 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {userActions.map((action, index) => (
                <>
                <MenuItem key={action.text} onClick={handleCloseUserMenu} style={{width: "140px", display: "flex", justifyContent: "space-between"}}>
                  <Typography sx={{ textAlign: 'left' }}>{action.text}</Typography>
                  {action.icon}
                </MenuItem>
                </>
              ))}
            </Menu>
        </Toolbar>
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
        <DrawerHeader>
          <IconButton>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {navbarTitlesIcons.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 1,
                  },
                  drawerOpen
                    ? {
                        justifyContent: "flex-start",
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
                    },
                    drawerOpen
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: 3,
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
      <ActionSpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: "absolute", bottom: 16, left: 5 }}
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
        {dialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={handleSpeedDialClose}
            tooltipPlacement="right"
          />
        ))}
      </ActionSpeedDial>
    </Box>
  );
}
