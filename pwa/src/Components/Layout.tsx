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
import { Link, Outlet } from "react-router-dom";
import { useGetAuthorizationUrlQuery } from "../endpoints/signIn";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useAppSelector } from "../hooks/app";
import { useGetUserMeQuery } from "../endpoints/users";
import LogoutIcon from "@mui/icons-material/Logout";
import { Role } from "../types";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import AssistWalkerIcon from "@mui/icons-material/AssistWalker";
import LoginIcon from "@mui/icons-material/Login";

function VoteButton() {
  return (
    <Button
      color="inherit"
      aria-label="enter administration"
      // sx={}
      startIcon={<ThumbUpIcon />}
    >
      Hlasovat
    </Button>
  );
}

function CandidateButton() {
  return (
    <Button
      color="inherit"
      aria-label="enter candidate"
      // sx={}
      startIcon={<AssistWalkerIcon />}
    >
      Kandidovat
    </Button>
  );
}

function LoginButton() {
  return (
    <Link to="/auth/admin">
      <Button
        color="inherit"
        aria-label="enter candidate"
        // sx={}
        startIcon={<LoginIcon />}
      >
        Přihlásit
      </Button>
    </Link>
  );
}

function AdminButton() {
  return (
    <Link to="/auth/admin">
      <Button
        color="inherit"
        aria-label="enter administration"
        // sx={}
        startIcon={<LoginIcon />}
      >
        Administrace
      </Button>
    </Link>
  );
}

export default function Layout() {
  const loggedId = useAppSelector((state) => state.authorization.loggedIn);
  const user = useAppSelector((state) => state.authorization.currentUser);
  useGetUserMeQuery(undefined, { skip: !loggedId });

  const vottingHasStarted = false;

  return (
    <>
      <Box p={2} display="flex" justifyContent="flex-end">
        {user?.roles?.includes(Role.chairman) ||
        user?.roles?.includes(Role.member) ? (
          <AdminButton />
        ) : vottingHasStarted ? (
          <VoteButton />
        ) : (
          <LoginButton />
        )}
      </Box>
      <Outlet />
    </>
  );
}
