import { Grid2, IconButton, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { useGetElectionsQuery } from "../endpoints/elections";
import { ElectionCard } from "../Components/ElectionCard";
import { Election } from "../types";
import Loader from "../Components/Loader";
import AddIcon from "@mui/icons-material/Add";
import { isPassed } from "../util/isPassed";
import { useGetPositionsQuery } from "../endpoints/positions";
import { PositionCard } from "../Components/PositionCard";
import { splitElections } from "../util/splitElections";
import { head } from "../util/head";
import ElectionStepper from "../Components/ElectionStepper";
import { electionTitle } from "../util/electionTitle";

export default function DashboardPage() {
  const { data: elections, isLoading } = useGetElectionsQuery();

  const electionsData = splitElections(elections?.member || []);
  const ongoingElection = head(electionsData.current);

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12} display="flex" alignItems="center">
        <Typography variant="h3" component="span" pr={1}>
          Přehled volby {ongoingElection ? electionTitle(ongoingElection) : ""}
        </Typography>
      </Grid2>
      <Grid2 container size={12} spacing={2}>
        {!isLoading ? (
          ongoingElection ? (
            <ElectionStepper
              election={ongoingElection}
              sx={{ maxWidth: 600 }}
            />
          ) : (
            <Typography>Neprobíhá žádná volba</Typography>
          )
        ) : (
          <Loader />
        )}
      </Grid2>
    </Grid2>
  );
}
