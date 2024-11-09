import { Grid2, IconButton, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { useGetElectionsQuery } from "../endpoints/elections";
import { ElectionCard } from "../Components/ElectionCard";
import { Election } from "../types";
import Loader from "../Components/Loader";
import AddIcon from "@mui/icons-material/Add";
import { isPassed } from "../util/isPassed";
import { splitElections } from "../util/splitElections";

export default function ElectionPage() {
  const { data: elections } = useGetElectionsQuery();

  const electionsData = splitElections(elections?.member || []);

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12} display="flex" alignItems="center">
        <Typography variant="h3" component="span" pr={1}>
          Probíhající volby
        </Typography>
        <Link to="create">
          <IconButton>
            <AddIcon fontSize="large" />
          </IconButton>
        </Link>
      </Grid2>
      <Grid2 container size={12} spacing={2}>
        {elections ? (
          electionsData.current?.map((e) => (
            <Grid2 size={4} key={e.id}>
              <Link to={`${e.id}`}>
                <ElectionCard election={e} />
              </Link>
            </Grid2>
          ))
        ) : (
          <Loader />
        )}
      </Grid2>
      <Grid2 size={12} display="flex" alignItems="center" pt={10}>
        <Typography variant="h3" component="span" pr={1}>
          Minulé volby
        </Typography>
      </Grid2>
      <Grid2 container size={12} spacing={2}>
        {elections ? (
          electionsData.passed?.map((e: Election) => (
            <Grid2 size={4} key={e.id}>
              <Link to={`${e.id}`}>
                <ElectionCard election={e} />
              </Link>
            </Grid2>
          ))
        ) : (
          <Loader />
        )}
      </Grid2>
    </Grid2>
  );
}
