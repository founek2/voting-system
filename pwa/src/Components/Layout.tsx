import LoginIcon from "@mui/icons-material/Login";
import {
  Box,
  Button
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router-dom";
import { useGetUserMeQuery } from "../endpoints/users";
import { useAppSelector } from "../hooks/app";
import { Role } from "../types";
import { ColorModeButton } from './ColorModeButton';
import { Footer } from "./Footer";

function LoginButton({ admin }: { admin?: boolean }) {
  const { t } = useTranslation();
  return (
    <Link to={admin ? "/auth/admin" : "/auth/user"}>
      <Button
        color="secondary"
        aria-label="enter candidate"
        startIcon={<LoginIcon />}
      >
        {t('common.actionLogin')}
      </Button>
    </Link>
  );
}

function AdminButton({ admin }: { admin?: boolean }) {
  const { t } = useTranslation();
  return (
    <Link to={admin ? "/auth/admin" : "/auth/user"}>
      <Button
        color="secondary"
        aria-label="enter administration"
        // sx={}
        startIcon={<LoginIcon />}
      >
        {admin ? t('common.actionAdmin') : t('common.actionEnter')}
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
        <Box display="flex" justifyContent="flex-end" alignItems="center" sx={{ gap: 1 }}>
          <ColorModeButton />
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
