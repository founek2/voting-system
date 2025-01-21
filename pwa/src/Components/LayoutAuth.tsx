import AppsIcon from "@mui/icons-material/Apps";
import BoyIcon from "@mui/icons-material/Boy";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from "@mui/icons-material/Logout";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import TimelineIcon from "@mui/icons-material/Timeline";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useGetUserMeQuery } from "../endpoints/users";
import { useAppDispatch, useAppSelector } from "../hooks/app";
import { authorizationReducerActions } from "../store/slices/authorizationSlice";
import { Role } from "../types";
import { cs } from "date-fns/locale/cs";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const adminMenuItems = [
  { path: "/auth/admin", text: "Přehled", Icon: <TimelineIcon /> },
  { path: "/auth/admin/elections", text: "Volby", Icon: <MailIcon /> },
  { path: "/auth/admin/resolutions", text: "Usnesení", Icon: <InboxIcon /> },
  {
    path: "/auth/admin/reports",
    text: "Závěřečné zprávy",
    Icon: <InboxIcon />,
  },
  { path: "/auth/admin/positions", text: "Pozice", Icon: <BoyIcon /> },
];

const userMenuItems = [
  {
    path: "/auth/user",
    text: "Aktuální volby",
    Icon: <AppsIcon />,
  },
];

export default function LayoutAuth() {
  const loggedId = useAppSelector((state) => state.authorization.loggedIn);
  const user = useAppSelector((state) => state.authorization.currentUser);
  useGetUserMeQuery(undefined, { skip: !loggedId });
  const location = useLocation();

  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (open && isMobile) setOpen(false);
    if (!open && !isMobile) setOpen(true);
  }, [isMobile]);

  // Redirect regular user to non-admin part
  if (user?.roles) {
    if (
      !user.roles.includes(Role.ROLE_ADMIN) &&
      location.pathname.startsWith("/auth/admin")
    )
      navigate("/auth/user", { replace: true });
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box display="flex">
        <Drawer
          sx={{
            width: open ? drawerWidth : 0,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
            // height: "100%",
          }}
          variant={isMobile ? "temporary" : "persistent"}
          anchor="left"
          open={open}
          onClose={handleDrawerClose}
        >
          <DrawerHeader>
            <Box
              display="flex"
              width="100%"
              height="100%"
              alignContent="cenetr"
              alignItems="center"
              p={1}
            >
              <Link
                to="/"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  component="img"
                  sx={{
                    display: "block",
                    maxWidth: 130,
                  }}
                  alt="The house from the offer."
                  src="/assets/SH-logo.png"
                  position={{ lg: "absolute" }}
                />
              </Link>
            </Box>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          {user?.roles?.includes(Role.ROLE_ADMIN) ? (
            <List>
              {adminMenuItems.map((item) => (
                <Link to={item.path} key={item.text}>
                  <ListItem disablePadding>
                    <ListItemButton selected={location.pathname === item.path}>
                      <ListItemIcon>{item.Icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </ListItem>
                </Link>
              ))}
            </List>
          ) : null}
          {user?.roles?.includes(Role.ROLE_ADMIN) ? <Divider /> : null}
          <List>
            {userMenuItems.map((item) => (
              <Link to={item.path} key={item.text}>
                <ListItem disablePadding>
                  <ListItemButton selected={location.pathname === item.path}>
                    <ListItemIcon>{item.Icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem key="logout" disablePadding>
              <ListItemButton
                onClick={() => {
                  dispatch(authorizationReducerActions.signOut());
                  enqueueSnackbar("Byl jste odhlášen");
                  navigate("/");
                }}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary={"Odhlásit"} />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>

        <Box display="flex" flexDirection="column" flexGrow={1}>
          <Box p={1} display="flex" justifyContent="space-between" flexGrow={1}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[
                {
                  mr: 2,
                  alignSelf: "flex-start",
                },
                open && { visibility: "hidden" },
              ]}
            >
              <MenuIcon />
            </IconButton>
            <Paper sx={{ display: "flex", alignItems: "center", p: 1 }}>
              <Avatar
                alt="Remy Sharp"
                src={user?.photoSmallUrl || undefined}
                sx={{ mr: 1 }}
              />
              <Typography>{user?.username}</Typography>
            </Paper>
          </Box>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={cs}>
            <Box p={2}>
              <Outlet />
            </Box>
          </LocalizationProvider>
        </Box>
      </Box>
    </>
  );
}
