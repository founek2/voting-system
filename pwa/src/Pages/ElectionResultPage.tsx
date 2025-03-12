import { Breadcrumbs, Grid2, Typography, Link as MuiLink } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import { CandidateFancyCard } from "../Components/CandidateFancyCard";
import Loader from "../Components/Loader";
import {
  useGetElectionQuery,
  useGetElectionResultQuery,
} from "../endpoints/elections";
import { electionTitle } from "../util/electionTitle";
import { TypographyInfo } from "../Components/TypographyInfo";
import { Box } from "@mui/system";

const breadcrumbs = [
  {
    label: "Elektronické",
    href: "#electronic",
    current: false,
  },
  {
    label: "Urnové",
    href: "#ballot",
    current: false,
  },
  {
    label: "Celkové",
    href: "#",
    current: true,
  },
];

function BreadcrumItem({ label, href, current }: any) {
  if (current) {
    return <Typography color="textPrimary">{label}</Typography>;
  }

  return (
    <MuiLink underline="hover" color="inherit" href={href}>
      {label}
    </MuiLink>
  );
}

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
    return (
      <TypographyInfo>Nelze načíst informace o zvolené volbě.</TypographyInfo>
    );

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12} display="flex" alignItems="center">
        <Typography variant="h3" color="textPrimary" component="span" pr={1}>
          Výsledek volby {electionTitle(election)}
        </Typography>
      </Grid2>
      <Box display="flex" justifyContent="center" width="100%">
        <Breadcrumbs aria-label="breadcrumb">
          {breadcrumbs.map((breadcrumb) => (
            <BreadcrumItem {...breadcrumb} />
          ))}
        </Breadcrumbs>
      </Box>
      <Grid2 container size={12} spacing={2}>
        {results?.candidates?.length === 0 ? (
          <TypographyInfo>Nebyli přihlášení žádní kandidáti.</TypographyInfo>
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
