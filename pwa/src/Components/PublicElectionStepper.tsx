import { Grid, Typography } from "@mui/material";
import React from "react";
import { useGetPublicElectionsQuery } from "../endpoints/elections";
import { head } from "../util/head";
import { splitElections } from "../util/splitElections";
import ElectionStepper from "./ElectionStepper";
import Loader from "./Loader";
import { useTranslation } from "react-i18next";

export default function PublicElectionStepper() {
  const { t } = useTranslation()
  const { data: elections, isLoading } = useGetPublicElectionsQuery(undefined, {
    refetchOnFocus: true,
  });

  const electionData = splitElections(elections?.member || []);
  const ongoingElection = head(electionData.current);

  if (isLoading) return <Loader />;

  return ongoingElection ? (
    <ElectionStepper election={ongoingElection} />
  ) : (
    <Typography color="textSecondary">
      {t('election.noElections')}
    </Typography>
  );
}
