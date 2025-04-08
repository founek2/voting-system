import AddIcon from "@mui/icons-material/Add";
import { Grid2, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { CandidateFancyCard } from "../Components/CandidateFancyCard";
import { ElectionCard } from "../Components/ElectionCard";
import Loader from "../Components/Loader";
import { useGetUserCandidatesQuery } from "../endpoints/candidates";
import { useGetPublicElectionsQuery } from "../endpoints/elections";
import { useAppSelector } from "../hooks/app";
import { Election } from "../types";
import { dateToString } from "../util/dateToString";
import { head } from "../util/head";
import { splitElections } from "../util/splitElections";
import { TypographyInfo } from "../Components/TypographyInfo";

interface AddCandidateProps {
  disabled?: boolean;
  election?: Election;
}
function AddCandidate({ disabled, election }: AddCandidateProps) {
  if (disabled || !election)
    return (
      <Tooltip title="Aktuálně neprobíhá příhlašávání kandidátů">
        <span>
          <IconButton disabled>
            <AddIcon fontSize="large" />
          </IconButton>
        </span>
      </Tooltip>
    );

  return (
    <Link to={`elections/${election.id}/candidates/create`}>
      <IconButton>
        <AddIcon fontSize="large" />
      </IconButton>
    </Link>
  );
}

export function Component() {
  const user = useAppSelector((state) => state.authorization.currentUser);
  const { data: elections, isLoading } = useGetPublicElectionsQuery();
  const electionsData = splitElections(elections?.member || []);

  const { data: candidates, isLoading: loadingCandidates } =
    useGetUserCandidatesQuery(
      {
        userId: user?.id!,
        electionIds: electionsData.current?.map((e) => e["@id"]!) || [],
      },
      { skip: !user?.id || !electionsData }
    );

  const electronicVotingElections = (elections?.member || []).filter(
    (e) => e.stage === "electronic_voting"
  );
  const registrationElections = (elections?.member || []).filter(
    (e) => e.stage === "registration_of_candidates"
  );

  const ongoingElection = head(electionsData.current);

  return (
    <Grid2 container spacing={10}>
      <Grid2 container spacing={2} size={12}>
        <Grid2 size={12} display="flex" alignItems="center">
          <Typography variant="h3" color="textPrimary" pr={1}>
            Probíhající hlasování
          </Typography>
        </Grid2>
        <Grid2 container size={12} spacing={2}>
          {!isLoading ? (
            electronicVotingElections.length > 0 ? (
              electronicVotingElections.map((election) => (
                <Grid2 size={{ xs: 12, md: 8, lg: 6, xl: 5 }} key={election.id}>
                  <Link to={`/auth/user/vote`}>
                    <ElectionCard
                      election={election}
                      title={`${dateToString(
                        election.electronicVotingDate
                      )} - ${dateToString(election.ballotVotingDate)}`}
                    />
                  </Link>
                </Grid2>
              ))
            ) : (
              <TypographyInfo>
                Neprobíhá žádné elektronické hlasování
              </TypographyInfo>
            )
          ) : (
            <Loader />
          )}
        </Grid2>
      </Grid2>

      <Grid2 container spacing={2} size={12}>
        <Grid2 size={12} display="flex" alignItems="center">
          <Typography variant="h3" color="textPrimary" component="span" pr={1}>
            Podané kandidátky
          </Typography>
          <AddCandidate
            disabled={registrationElections.length === 0}
            election={ongoingElection}
          />
        </Grid2>

        <Grid2 container size={12} spacing={2}>
          {!loadingCandidates ? (
            candidates?.member && candidates.member.length > 0 ? (
              candidates.member.map((candidate) => (
                <Link
                  to={`/auth/user/candidates/${candidate.id}`}
                  key={candidate.id}
                >
                  <CandidateFancyCard candidate={candidate} />
                </Link>
              ))
            ) : (
              <TypographyInfo>Nemáte žádné podané kandidátky</TypographyInfo>
            )
          ) : (
            <Loader />
          )}
        </Grid2>
      </Grid2>
    </Grid2>
  );
}

export { ErrorBoundary } from "../Components/ErrorBoundary2";
