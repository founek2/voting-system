import LoginIcon from "@mui/icons-material/Login";
import { Box, Button } from "@mui/material";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useGetUserMeQuery } from "../endpoints/users";
import { useAppSelector } from "../hooks/app";
import { Role } from "../types";

// function VoteButton() {
//   return (
//     <Button
//       color="primary"
//       aria-label="enter administration"
//       // sx={}
//       startIcon={<ThumbUpIcon />}
//     >
//       Hlasovat
//     </Button>
//   );
// }

// function CandidateButton() {
//   return (
//     <Button
//       color="primary"
//       aria-label="enter candidate"
//       // sx={}
//       startIcon={<AssistWalkerIcon />}
//     >
//       Kandidovat
//     </Button>
//   );
// }

function LoginButton() {
  return (
    <Link to="/auth/admin">
      <Button
        color="secondary"
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
        color="secondary"
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
    <Box p={2}>
      <Box pb={2} display="flex" justifyContent="flex-end">
        {user?.roles?.includes(Role.ROLE_ADMIN) ||
        user?.roles?.includes(Role.member) ? (
          <AdminButton />
        ) : (
          <LoginButton />
        )}
      </Box>
      <Outlet />
    </Box>
  );
}
