import AddIcon from "@mui/icons-material/Add";
import { Grid2, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { ElectionCard } from "../Components/ElectionCard";
import Loader from "../Components/Loader";
import { useGetPublicElectionsQuery } from "../endpoints/elections";
import { dateToString } from "../util/dateToString";
import { head } from "../util/head";
import { splitElections } from "../util/splitElections";
import { Election } from "../types";
import {
  useGetCandidateQuery,
  useGetCandidatesQuery,
  useGetUserCandidatesQuery,
} from "../endpoints/candidates";
import { useAppSelector } from "../hooks/app";
import { CandidateCard } from "../Components/CandidateCard";

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

export default function DashboardUserPage() {
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
                <Link
                  to={`/auth/user/elections/${election.id}/vote`}
                  key={election.id}
                >
                  <ElectionCard
                    election={election}
                    title={`${dateToString(
                      election.electronicVotingDate
                    )} - ${dateToString(election.ballotVotingDate)}`}
                  />
                </Link>
              ))
            ) : (
              <Typography color="textSecondary">
                Neprobíhá žádné elektronické hlasování
              </Typography>
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
                  <CandidateCard candidate={candidate} />
                </Link>
              ))
            ) : (
              <Typography color="textSecondary">
                Nemáte žádné podané kandidátky
              </Typography>
            )
          ) : (
            <Loader />
          )}
        </Grid2>
      </Grid2>
    </Grid2>
  );
}