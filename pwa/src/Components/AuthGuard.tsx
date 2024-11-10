import { Typography } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import { useGetPublicAuthorizationUrlQuery } from "../endpoints/signIn";
import { useAppSelector } from "../hooks/app";
import Loader from "./Loader";

export default function AuthGuard() {
  const { data, isLoading, isError } = useGetPublicAuthorizationUrlQuery();
  const loggedId = useAppSelector((state) => state.authorization.loggedIn);

  if (!loggedId && data?.authorizationUrl)
    window.location.assign(data.authorizationUrl);
  if (isError) return <Typography>Nelze načíst autorizační URL</Typography>;

  if (isLoading && !loggedId) return <Loader />;
  if (loggedId) return <Outlet />;

  return null;
}
