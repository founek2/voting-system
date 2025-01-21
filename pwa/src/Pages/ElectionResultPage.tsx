import AddIcon from "@mui/icons-material/Add";
import { Grid2, IconButton, Typography } from "@mui/material";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { CandidateFancyCard } from "../Components/CandidateFancyCard";
import Loader from "../Components/Loader";
import {
  useGetElectionQuery,
  useGetElectionResultQuery,
} from "../endpoints/elections";
import { electionTitle } from "../util/electionTitle";

export default function ElectionResultPage() {
  const params = useParams<{ id: string }>();
  const {
    data: election,
    isLoading,
    isError,
  } = useGetElectionQuery(Number(params.id));
  const { data: results } = useGetElectionResultQuery(election?.id!, {
    skip: !election,
  });

  if (isError || !election)
    return <Typography>Nelze načíst informace o zvolené volbě.</Typography>;

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12} display="flex" alignItems="center">
        <Typography variant="h3" color="textPrimary" component="span" pr={1}>
          Výsledek volby {electionTitle(election)}
        </Typography>
      </Grid2>
      <Grid2 container size={12} spacing={2}>
        {results?.candidates?.length === 0 ? (
          <Typography> Nebyli přihlášení žádní kandidáti.</Typography>
        ) : null}
        {results ? (
          results.candidates?.map((result) => (
            <Grid2 size={{ xs: 12, sm: 8, md: 5, lg: 2 }} key={result["@id"]}>
              <CandidateFancyCard candidate={result.candidate!}>
                <Typography variant="body1" component="div">
                  Pro {result.positiveVotes}
                </Typography>
                <Typography variant="body1" component="div">
                  Zdrželo se {result.neutralVotes}
                </Typography>
                <Typography variant="body1" component="div">
                  Proti {result.negativeVotes}
                </Typography>
              </CandidateFancyCard>
            </Grid2>
          ))
        ) : (
          <Loader />
        )}
      </Grid2>
    </Grid2>
  );
}
