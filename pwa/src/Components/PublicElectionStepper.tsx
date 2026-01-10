import { Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useGetPublicElectionsQuery } from "../endpoints/elections";
import { useGetPublicPositionsQuery } from "../endpoints/positions";
import { head } from "../util/head";
import { splitElections } from "../util/splitElections";
import ElectionStepper from "./ElectionStepper";
import Loader from "./Loader";

export default function PublicElectionStepper() {
  const { t } = useTranslation()
  const { data: elections, isLoading } = useGetPublicElectionsQuery(undefined, {
    refetchOnFocus: true,
  });
  const electionData = splitElections(elections?.member || [], { stillCurrentAfterDays: 15 });
  const ongoingElection = head(electionData.current);
  const {
    data: allPositions,
  } = useGetPublicPositionsQuery(undefined);

  if (isLoading) return <Loader />;
  const electionPositions = allPositions?.member.filter(position => ongoingElection?.positions?.includes(position['@id']!))

  return ongoingElection ? (
    <ElectionStepper election={ongoingElection} positions={electionPositions} />
  ) : (
    <Typography color="textSecondary">
      {t('election.noElections')}
    </Typography>
  );
}
