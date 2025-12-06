import AppsIcon from "@mui/icons-material/Apps";
import BoyIcon from "@mui/icons-material/Boy";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from "@mui/icons-material/Logout";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import SnowboardingIcon from "@mui/icons-material/Snowboarding";
import TimelineIcon from "@mui/icons-material/Timeline";
import {
  Avatar,
  Box,
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
import { enqueueSnackbar } from "notistack";
import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ColorModeContext } from "../context/colorMode";
import { useGetUserMeQuery } from "../endpoints/users";
import { useAppDispatch, useAppSelector } from "../hooks/app";
import { authorizationReducerActions } from "../store/slices/authorizationSlice";
import { Role } from "../types";
import { ColorModeButton } from "./ColorModeButton";
import LocalizationProvider from "./LocalizationProvider";
import { LanguageButton } from "./LanguageButton";
import { LocalizedLabelKey } from "../locales/i18n";
import { useTranslation } from "react-i18next";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

type MenuItem = { path: string, text: LocalizedLabelKey, Icon: React.ReactNode }
const adminMenuItems: MenuItem[] = [
  { path: "/auth/admin", text: "menu.overview", Icon: <TimelineIcon /> },
  { path: "/auth/admin/elections", text: "menu.elections", Icon: <MailIcon /> },
  { path: "/auth/admin/resolutions", text: "menu.resolutions", Icon: <InboxIcon /> },
  {
    path: "/auth/admin/reports",
    text: "menu.reports",
    Icon: <InboxIcon />,
  },
  { path: "/auth/admin/positions", text: "menu.positions", Icon: <BoyIcon /> },
  { path: "/auth/admin/board", text: "menu.electionComiteeMembers", Icon: <SnowboardingIcon /> },
];

const userMenuItems: MenuItem[] = [
  {
    path: "/auth/user",
    text: "menu.userDashboard",
    Icon: <AppsIcon />,
  },
];

export function Component() {
  const loggedId = useAppSelector((state) => state.authorization.loggedIn);
  const user = useAppSelector((state) => state.authorization.currentUser);
  useGetUserMeQuery(undefined, { skip: !loggedId });
  const location = useLocation();
  const { t } = useTranslation()

  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [counter, setCount] = useState(0);

  useEffect(() => {
    if (open && isMobile) setOpen(false);
    if (!open && !isMobile) setOpen(true);
  }, [isMobile]);

  // close menu on route change
  useEffect(() => {
    if (isMobile) setOpen(false);
  }, [isMobile, location.pathname]);

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

  function handleEaesterEgg() {
    setCount(counter + 1);
  }
  useEffect(() => {
    if (counter % 6 == 5) {
      enqueueSnackbar("Devtools tady nenajdeš 🙈");
    }
  }, [counter]);

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
                  src={theme.palette.mode === "light" ? "/assets/SH-logo-color.png" : "/assets/SH-logo.png"}
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
                <Link to={item.path} key={t(item.text)}>
                  <ListItem disablePadding>
                    <ListItemButton selected={location.pathname === item.path}>
                      <ListItemIcon>{item.Icon}</ListItemIcon>
                      <ListItemText primary={t(item.text)} />
                    </ListItemButton>
                  </ListItem>
                </Link>
              ))}
            </List>
          ) : null}
          {user?.roles?.includes(Role.ROLE_ADMIN) ? <Divider /> : null}
          <List>
            {userMenuItems.map((item) => (
              <Link to={item.path} key={t(item.text)}>
                <ListItem disablePadding>
                  <ListItemButton selected={location.pathname === item.path}>
                    <ListItemIcon>{item.Icon}</ListItemIcon>
                    <ListItemText primary={t(item.text)} />
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
                <ListItemText primary={t('menu.signOut')} />
              </ListItemButton>
            </ListItem>
          </List>

          <Box textAlign={"center"}>
            <ColorModeButton />
          </Box>
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

            <Box display="flex" flexDirection="row" gap={2}>
              <LanguageButton />
              <Paper
                sx={{ display: "flex", alignItems: "center", p: 1 }}
                onClick={handleEaesterEgg}
              >
                <Avatar
                  alt="Remy Sharp"
                  src={user?.photoSmallUrl || undefined}
                  sx={{ mr: 1 }}
                />
                <Typography>{user?.username}</Typography>
              </Paper>
            </Box>
          </Box>

          <Box p={2}>
            <LocalizationProvider>
              <Outlet />
            </LocalizationProvider>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export { ErrorBoundary } from "../Components/ErrorBoundary2";
