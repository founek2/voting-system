import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Grid2,
  Typography,
} from "@mui/material";
import React, { Suspense, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetAuthorizationUrlQuery } from "../endpoints/signIn";
import { DatePicker } from "@mui/x-date-pickers";
import { useGetElectionsQuery } from "../endpoints/elections";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import { ElectionCard } from "../Components/ElectionCard";
import { Election } from "../types";

export default function ElectionPage() {
  const { data: elections } = useGetElectionsQuery();

  return (
    <Grid2 container p={2}>
      <Grid2 size={12}>
        <Typography variant="h3">Probíhající volby</Typography>
      </Grid2>
      <Grid2 container size={12} spacing={2}>
        {[{}].map((e: Election) => (
          <Grid2 size={4}>
            <Link to={`/auth/admin/elections/${e.id}`}>
              <ElectionCard election={e} />
            </Link>
          </Grid2>
        ))}
      </Grid2>
    </Grid2>
  );
}
