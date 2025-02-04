import { Box, Button, Grid2, Paper, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import BasicInformation from "../Components/BasicInformation";
import { CandidateFancyCard } from "../Components/CandidateFancyCard";
import FileButton from "../Components/FileButton";
import Loader from "../Components/Loader";
import PublicElectionStepper from "../Components/PublicElectionStepper";
import { useGetPublicCandidatesQuery } from "../endpoints/candidates";
import { useGetPublicElectionsQuery } from "../endpoints/elections";
import { head } from "../util/head";
import { splitElections } from "../util/splitElections";

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

  if (!ongoingElection) return null;

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
        justifyContent="center"
        container
        spacing={4}
      >
        {isLoading || loadingCandidates ? <Loader /> : null}
        {isError || errorCandidates ? (
          <Typography>Nelze načíst kandidáty</Typography>
        ) : null}
        {candidates?.member.map((candidate) => (
          <Grid2 size={{ xs: 8, md: 3, lg: 2, xl: 1.7 }} key={candidate.id}>
            <CandidateFancyCard candidate={candidate} />
          </Grid2>
        ))}
      </Grid2>
    </Grid2>
  );
}

function BasicInformationSection() {
  return (
    <Grid2>
      <BasicInformation />
    </Grid2>
  );
}

function FilesSection() {
  return (
    <Grid2
      container
      spacing={4}
      size={12}
      justifyContent="center"
      display="flex"
    >
      <Grid2 size={12}>
        <Typography variant="h3" color="primary" textAlign="center">
          Dokumenty
        </Typography>
      </Grid2>
      <Grid2>
        <Paper
          sx={{ width: "100%", display: "flex", flexDirection: "column", p: 2 }}
        >
          <FileButton href="http://www.siliconhill.cz/uploads/stanovy_klubu_siliconhill.pdf">
            Stanovy klubu Silicon Hill (účinné od 1. 1. 2017)
          </FileButton>
          <FileButton href="https://zapisy.sh.cvut.cz/prilohy/20240515-Volebni-rad-klubu-Silicon-Hill.pdf">
            Volební řád klubu Silicon Hill (účinný od 15. 05. 2024)
          </FileButton>
          <Link to="/resolutions">
            <Button color="secondary">Usnesení volební komise</Button>
          </Link>
          <Link to="/reports">
            <Button color="secondary">Závěrečné zprávy</Button>
          </Link>
        </Paper>
      </Grid2>
    </Grid2>
  );
}

export default function HomePage() {
  return (
    <Grid2 container spacing={15}>
      <StepperSection />
      <CandidatesSection />
      <BasicInformationSection />
      <FilesSection />
    </Grid2>
  );
}
