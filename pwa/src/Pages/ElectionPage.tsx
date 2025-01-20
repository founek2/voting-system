import { Grid2, IconButton, Typography } from "@mui/material";
import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useGetElectionsQuery } from "../endpoints/elections";
import { ElectionCard } from "../Components/ElectionCard";
import { Election, Role } from "../types";
import Loader from "../Components/Loader";
import AddIcon from "@mui/icons-material/Add";
import { splitElections } from "../util/splitElections";
import { useAppSelector } from "../hooks/app";

export default function ElectionPage() {
  const { data: elections } = useGetElectionsQuery();
  const electionsData = splitElections(elections?.member || []);
  const roles = useAppSelector(
    (state) => state.authorization.currentUser?.roles
  );
  const navigate = useNavigate();
  const isAdmin = roles?.includes(Role.ROLE_ADMIN) || false;

  function onViewVotes(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    election: Election
  ) {
    e.preventDefault();
    navigate(`${election.id}/votes`);
  }

  function onViewResult(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    election: Election
  ) {
    e.preventDefault();
    navigate(`${election.id}/result`);
  }

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12} display="flex" alignItems="center">
        <Typography variant="h3" color="textPrimary" component="span" pr={1}>
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
            <Grid2 size={12} key={e.id}>
              <Link to={`${e.id}`}>
                <ElectionCard
                  election={e}
                  isAdmin={isAdmin}
                  onViewVotes={onViewVotes}
                  onViewResult={onViewResult}
                />
              </Link>
            </Grid2>
          ))
        ) : (
          <Loader />
        )}
      </Grid2>
      <Grid2 size={12} display="flex" alignItems="center" pt={10}>
        <Typography variant="h3" color="textSecondary" component="span" pr={1}>
          Minulé volby
        </Typography>
      </Grid2>
      <Grid2 container size={12} spacing={2}>
        {elections ? (
          electionsData.passed?.map((e: Election) => (
            <Grid2 size={4} key={e.id}>
              <Link to={`${e.id}`}>
                <ElectionCard election={e} isAdmin />
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
