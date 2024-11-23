import { Box, Grid2, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import PublicElectionStepper from "../Components/PublicElectionStepper";
import { useGetPublicElectionsQuery } from "../endpoints/elections";
import { splitElections } from "../util/splitElections";
import { head } from "../util/head";
import Loader from "../Components/Loader";
import { useGetPublicCandidatesQuery } from "../endpoints/candidates";
import { CandidateFancyCard } from "../Components/CandidateFancyCard";

function StepperSection() {
  return (
    <Grid2 container justifyContent="center" spacing={4} size={12}>
      <Grid2
        size={12}
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection={{ xs: "column", lg: "row" }}
      >
        <Link to="https://www.siliconhill.cz/">
          <Box
            component="img"
            sx={{
              left: { lg: "5%" },
              top: { lg: 100 },
              maxWidth: { xs: 250, md: 300 },
            }}
            alt="The house from the offer."
            src="/assets/SH-logo.png"
            position={{ lg: "absolute" }}
          />
        </Link>

        <Typography
          variant="h3"
          color="primary"
          component="span"
          textAlign="center"
        >
          Volby do představenstva klubu Silicon Hill
        </Typography>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 6, lg: 3 }}>
        <PublicElectionStepper />
      </Grid2>
    </Grid2>
  );
}

function CandidatesSection() {
  const { data: elections, isLoading, isError } = useGetPublicElectionsQuery();
  const electionData = splitElections(elections?.member || []);
  const ongoingElection = head(electionData.current);
  const {
    data: candidates,
    isLoading: loadingCandidates,
    isError: errorCandidates,
  } = useGetPublicCandidatesQuery(Number(ongoingElection?.id!), {
    skip: !ongoingElection?.id,
  });

  return (
    <Grid2 container spacing={4} size={12}>
      <Grid2 size={12} justifyContent="center" display="flex">
        <Typography variant="h3" color="primary" textAlign="center">
          Přihlášení kandidáti
        </Typography>
      </Grid2>

      <Grid2
        size={12}
        display="flex"
        alignItems="center"
        justifyContent="center"
        container
        spacing={4}
      >
        {isLoading || loadingCandidates ? <Loader /> : null}
        {isError || errorCandidates ? (
          <Typography>Nelze načíst kandidáty</Typography>
        ) : null}
        {candidates?.member.map((candidate) => (
          <Grid2 size={{ xs: 8, md: 3, lg: 2, xl: 1.5 }}>
            <CandidateFancyCard candidate={candidate} />
          </Grid2>
        ))}
      </Grid2>
    </Grid2>
  );
}

export default function HomePage() {
  return (
    <Grid2 container spacing={15}>
      <StepperSection />
      <CandidatesSection />
    </Grid2>
  );
}
