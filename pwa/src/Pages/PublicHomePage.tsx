import { Box, Button, Grid, Paper, Typography, useTheme } from "@mui/material";
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
import { TypographyInfo } from "../Components/TypographyInfo";
import { useTranslation } from "react-i18next";
import { dateToString } from "../util/dateToString";

function StepperSection() {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Grid container justifyContent="center" spacing={4} size={12}>
      <Grid
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
            alt="Logo of Silicon Hill club."
            src={theme.palette.mode === "light" ? "/assets/SH-logo-color.png" : "/assets/SH-logo.png"}
            position={{ lg: "absolute" }}
          />
        </Link>

        <Typography
          variant="h3"
          color="primary"
          component="span"
          textAlign="center"
        >
          {t('homepage.title')}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <PublicElectionStepper />
      </Grid>
    </Grid>
  );
}

function CandidatesSection() {
  const { t } = useTranslation()
  const { data: elections, isLoading, isError } = useGetPublicElectionsQuery();
  const electionData = splitElections(elections?.member || [], { stillCurrentAfterDays: 15 });
  const ongoingElection = head(electionData.current);
  const {
    data: candidates,
    isLoading: loadingCandidates,
    isError: errorCandidates,
  } = useGetPublicCandidatesQuery(Number(ongoingElection?.id!), {
    skip: !ongoingElection?.id,
  });
  const showResult = Boolean(
    ongoingElection?.evaluatedAt || ongoingElection?.completedAt
  );

  if (!ongoingElection) return null;

  return (
    <Grid container spacing={4} size={12}>
      <Grid size={12} justifyContent="center" display="flex">
        <Typography variant="h3" color="primary" textAlign="center">
          {ongoingElection.completedAt
            ? t('election.finalResults')
            : ongoingElection.evaluatedAt
              ? t('election.preliminaryResults')
              : t('election.candidatesSigned')}
        </Typography>
      </Grid>

      <Grid
        size={12}
        display="flex"
        justifyContent="center"
        container
        spacing={4}
      >
        {isLoading || loadingCandidates ? <Loader /> : null}
        {isError || errorCandidates ? (
          <TypographyInfo>{t('election.failCandidates')}</TypographyInfo>
        ) : null}
        {candidates?.member.length === 0 ? (
          <TypographyInfo>
            {t('election.noCandidates')}
          </TypographyInfo>
        ) : null}
        {candidates?.member.map((candidate) => (
          <Grid
            size={{ xs: 8, md: 4, lg: 3, xl: 1.7 }}
            key={candidate.id}
            sx={{ maxWidth: 270 }}
          >
            <CandidateFancyCard candidate={candidate} showResult={showResult} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

function BasicInformationSection() {
  return <BasicInformation />;
}

function FilesSection() {
  const { t } = useTranslation()
  return (
    <Grid
      container
      spacing={4}
      size={12}
      justifyContent="center"
      display="flex"
    >
      <Grid size={12}>
        <Typography variant="h3" color="primary" textAlign="center">
          {t('files.title')}
        </Typography>
      </Grid>
      <Grid>
        <Paper
          sx={{ width: "100%", display: "flex", flexDirection: "column", p: 2 }}
        >
          <FileButton href="https://wiki.sh.cvut.cz/vedeni/dokumenty/predpisy/stanovy">
            {t('files.clubStatus')}
          </FileButton>
          <FileButton href="https://wiki.sh.cvut.cz/vedeni/dokumenty/predpisy/volebni_rad">
            {t('files.clubElectionRules')}
          </FileButton>
          <Link to="/resolutions">
            <Button color="secondary">{t('files.resolutions')}</Button>
          </Link>
          <Link to="/reports">
            <Button color="secondary">{t('files.reports')}</Button>
          </Link>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default function HomePage() {
  return (
    <Grid container spacing={15}>
      <StepperSection />
      <CandidatesSection />
      <BasicInformationSection />
      <FilesSection />
    </Grid>
  );
}
