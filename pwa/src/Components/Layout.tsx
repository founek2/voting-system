import LoginIcon from "@mui/icons-material/Login";
import {
  Box,
  Button,
  Grid2,
  Paper,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useGetUserMeQuery } from "../endpoints/users";
import { useAppSelector } from "../hooks/app";
import { Role } from "../types";
import { grey } from "@mui/material/colors";
import { Footer } from "./Footer";

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

function LoginButton({ admin }: { admin?: boolean }) {
  return (
    <Link to="/auth/admin">
      <Button
        color="secondary"
        aria-label="enter candidate"
        startIcon={<LoginIcon />}
      >
        Přihlásit
      </Button>
    </Link>
  );
}

function AdminButton({ admin }: { admin?: boolean }) {
  return (
    <Link to={admin ? "/auth/admin" : "/auth/user"}>
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

  return (
    <Box>
      <Box p={2}>
        <Box display="flex" justifyContent="flex-end">
          {loggedId ? (
            <AdminButton admin={user?.roles?.includes(Role.ROLE_ADMIN)} />
          ) : (
            <LoginButton />
          )}
        </Box>
        <main>
          <Outlet />
        </main>
      </Box>
      <Footer />
    </Box>
  );
}
