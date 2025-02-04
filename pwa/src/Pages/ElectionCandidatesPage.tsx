import AddIcon from "@mui/icons-material/Add";
import { Grid2, IconButton, Typography } from "@mui/material";
import React from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../Components/Loader";
import { SimpleCard } from "../Components/SimpleCard";
import { useGetPublicReportsQuery } from "../endpoints/mediaReport";
import { useGetCandidatesQuery } from "../endpoints/candidates";
import { Election } from "../types";
import { useGetElectionQuery } from "../endpoints/elections";
import { CandidateFancyCard } from "../Components/CandidateFancyCard";

interface ContentProps {
  election: Election;
}
function Content({ election }: ContentProps) {
  const { data: candidates, isError } = useGetCandidatesQuery({
    election: election["@id"]!,
  });

  if (isError) return <Typography>Nelze načíst data</Typography>;
  if (candidates?.totalItems === 0)
    return <Typography>Nebyli nalezeni žádní kandidáti.</Typography>;

  return (
    <>
      {candidates ? (
        candidates.member?.map((candidate) => (
          <Grid2 size={{ xs: 8, md: 3, lg: 2, xl: 1.7 }} key={candidate.id}>
            <Link to={`/auth/admin/candidates/${candidate.id}`}>
              <CandidateFancyCard candidate={candidate} />
            </Link>
          </Grid2>
        ))
      ) : (
        <Loader />
      )}
    </>
  );
}

export default function ElectionCandidatesPage() {
  const params = useParams<{ id: string }>();
  const {
    data: election,
    isLoading,
    isError,
  } = useGetElectionQuery(Number(params.id));

  if (isLoading) return <Loader />;
  if (isError || !election)
    return <Typography>Nelze načíst informace o zvolené volbě.</Typography>;

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12} display="flex" alignItems="center">
        <Typography variant="h3" color="textPrimary" component="span" pr={1}>
          Kandidáti
        </Typography>
        <Link to="create">
          <IconButton>
            <AddIcon fontSize="large" />
          </IconButton>
        </Link>
      </Grid2>
      <Grid2 container size={12} spacing={2}>
        {params.id ? <Content election={election} /> : null}
      </Grid2>
    </Grid2>
  );
}
