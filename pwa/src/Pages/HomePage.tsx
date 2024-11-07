import { Button, Typography } from "@mui/material";
import React, { Suspense, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetAuthorizationUrlQuery } from "../endpoints/signIn";

export default function HomePage() {
  return <Typography>Homepage</Typography>;
}
