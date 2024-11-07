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
  useTheme,
} from "@mui/material";
import React, { Suspense, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useGetAuthorizationUrlQuery } from "../endpoints/signIn";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useAppDispatch, useAppSelector } from "../hooks/app";
import { useGetUserMeQuery } from "../endpoints/users";
import LogoutIcon from "@mui/icons-material/Logout";
import { authorizationReducerActions } from "../store/slices/authorizationSlice";
import { enqueueSnackbar } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import BoyIcon from "@mui/icons-material/Boy";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const menuItems = [
  { path: "/auth/admin", text: "Volby", Icon: <MailIcon /> },
  { path: "/auth/admin", text: "Usnesení", Icon: <InboxIcon /> },
  { path: "/auth/admin/positions", text: "Pozice", Icon: <BoyIcon /> },
];

export default function LayoutAdmin() {
  const loggedId = useAppSelector((state) => state.authorization.loggedIn);
  const user = useAppSelector((state) => state.authorization.currentUser);
  useGetUserMeQuery(undefined, { skip: !loggedId });

  const [open, setOpen] = useState(loggedId);
  const { data } = useGetAuthorizationUrlQuery();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
          variant="persistent"
          anchor="left"
          open={open}
          onClose={handleDrawerClose}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <Link to={item.path} key={item.text}>
                <ListItem disablePadding>
                  <ListItemButton>
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

            {loggedId ? (
              <Paper sx={{ display: "flex", alignItems: "center", p: 1 }}>
                <Avatar
                  alt="Remy Sharp"
                  src={user?.photoSmallUrl || undefined}
                  sx={{ mr: 1 }}
                />
                <Typography>{user?.username}</Typography>
              </Paper>
            ) : (
              <Link to={data?.authorizationUrl || ""}>
                <Button disabled={!data?.authorizationUrl}>Přihlásit</Button>
              </Link>
            )}
          </Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box p={2}>
              <Outlet />
            </Box>
          </LocalizationProvider>
        </Box>
      </Box>
    </>
  );
}
