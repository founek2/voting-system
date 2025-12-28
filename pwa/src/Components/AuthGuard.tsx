import { Typography } from "@mui/material";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useGetPublicAuthorizationUrlQuery } from "../endpoints/signIn";
import { useAppSelector } from "../hooks/app";
import Loader from "./Loader";
import internalStorage from "../storage/internalStorage";

export default function AuthGuard() {
  const { data, isLoading, isError } = useGetPublicAuthorizationUrlQuery();
  const loggedId = useAppSelector((state) => state.authorization.loggedIn);
  const location = useLocation();

  console.log("authGuard", location.search, location.pathname)
  if (!loggedId && data?.authorizationUrl) {
    internalStorage.setOriginalUrl(location.pathname);
    window.location.assign(data.authorizationUrl);
  }
  if (isError) return <Typography>Nelze načíst autorizační URL</Typography>;

  if (isLoading && !loggedId) return <Loader />;
  if (loggedId) return <Outlet />;

  return null;
}
