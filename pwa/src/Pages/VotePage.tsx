import {
  Button,
  Grid2,
  IconButton,
  Paper,
  Typography,
  Link as MuiLink,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Box,
  useMediaQuery,
  useTheme,
  FormLabel,
  FormControl,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import Loader from "../Components/Loader";
import AddIcon from "@mui/icons-material/Add";
import { useGetPositionsQuery } from "../endpoints/positions";
import { PositionCard } from "../Components/PositionCard";
import {
  useGetElectionsQuery,
  useGetPublicElectionsElectronicQuery,
} from "../endpoints/elections";
import { useGetCandidatesUnvotedQuery } from "../endpoints/candidates";
import { Candidate_jsonld_candidate_read } from "../endpoints/types";
import { ConditionalTooltip } from "../Components/ConditionalTooltip";
import { isAfter, isBefore } from "date-fns";
import { CandidateVoteCard } from "../Components/CandidateVoteCard";
import { PosterButton } from "../Components/PosterButton";

// Mobiles cannot show tables -> needs special view
function VoteListMobile({ candidates }: VoteListProps) {
  return (
    <Grid2 container spacing={2} display="flex" justifyContent="center">
      {candidates.map((candidate) => (
        <CandidateVoteCard candidate={candidate}>
          {candidate.withdrewAt ? (
            <Typography>Odstoupil z kandidatury</Typography>
          ) : (
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">
                Hlasování
              </FormLabel>

              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="0"
                name={`votes.${candidate.id}`}
              >
                <FormControlLabel
                  value="-1"
                  control={<Radio />}
                  label="Proti"
                />
                <FormControlLabel
                  value="0"
                  control={<Radio />}
                  label="Zdržuji se"
                />
                <FormControlLabel value="1" control={<Radio />} label="Pro" />
              </RadioGroup>
            </FormControl>
          )}
        </CandidateVoteCard>
      ))}
    </Grid2>
  );
}

interface VoteListProps {
  candidates: Candidate_jsonld_candidate_read[];
}
function VoteList({ candidates }: VoteListProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const sizeName = { sm: 3 };
  const sizeUid = { sm: 1 };
  const sizeVoting = { sm: 3 };
  const sizePosition = { sm: 3 };

  if (candidates.length === 0)
    return <Typography>Již máte odhlasováno.</Typography>;

  if (isMobile) return <VoteListMobile candidates={candidates} />;

  return (
    <Paper sx={{ p: 2 }}>
      <Grid2 container>
        <Grid2 size={sizeName}>
          <Typography variant="h6">Jméno</Typography>
        </Grid2>
        <Grid2 size={sizeUid}>
          <Typography variant="h6" textAlign="center">
            UID
          </Typography>
        </Grid2>
        <Grid2 size={sizePosition}>
          <Typography variant="h6" textAlign="center">
            Pozice
          </Typography>
        </Grid2>
        <Grid2 size={2}>
          <Typography variant="h6" textAlign="center">
            Plakát
          </Typography>
        </Grid2>
        <Grid2 size={3}>
          <Typography variant="h6" textAlign="center">
            Hlasování
          </Typography>
        </Grid2>

        <Grid2 size={12}>
          <Divider sx={{ mb: 2 }} />
        </Grid2>
        {candidates.map((candidate) => {
          const withdrew = Boolean(candidate.withdrewAt);
          const strikeThrough = {
            textDecoration: withdrew ? "line-through" : undefined,
          };

          return (
            <React.Fragment key={candidate.id}>
              <Grid2 size={sizeName}>
                <ConditionalTooltip
                  disabled={!withdrew}
                  title="Odstoupil z kandidatury"
                >
                  <Typography component="span" sx={strikeThrough}>
                    {candidate.appUser?.firstName} {candidate.appUser?.lastName}
                  </Typography>
                </ConditionalTooltip>
              </Grid2>
              <Grid2 size={sizeUid}>
                <Typography textAlign="center" sx={strikeThrough}>
                  {candidate.appUser?.id}
                </Typography>
              </Grid2>
              <Grid2 size={sizePosition}>
                <ConditionalTooltip
                  disabled={!withdrew}
                  title="Odstoupil z kandidatury"
                >
                  <Typography textAlign="center" sx={strikeThrough}>
                    {candidate.position?.name}
                  </Typography>
                </ConditionalTooltip>
              </Grid2>
              <Grid2 size={2} justifyContent="center" display="flex">
                <PosterButton poster={candidate.poster} />
              </Grid2>
              <Grid2 size={sizeVoting} justifyContent="center" display="flex">
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-radio-buttons-group-label"
                    sx={{ visibility: withdrew ? "hidden" : undefined }}
                    defaultValue={withdrew ? undefined : "0"}
                    name={withdrew ? undefined : `votes.${candidate.id}`}
                  >
                    <FormControlLabel
                      value="-1"
                      control={<Radio />}
                      label="Proti"
                    />
                    <FormControlLabel
                      value="0"
                      control={<Radio />}
                      label="Zdržuji se"
                    />
                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      label="Pro"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid2>
            </React.Fragment>
          );
        })}
      </Grid2>
    </Paper>
  );
}

export default function VotePage() {
  const { data: elections, isLoading: isLoadingElections } =
    useGetPublicElectionsElectronicQuery();
  const election = elections ? elections.member[0] : undefined;
  const { data: candidatesData, isLoading: isLoadingCandidates } =
    useGetCandidatesUnvotedQuery(Number(election?.id), {
      skip: !election?.id,
    });
  const isLoading = isLoadingElections || isLoadingCandidates;

  const candidates = (candidatesData?.member || []).filter((c) =>
    c.withdrewAt && election?.electronicVotingDate
      ? isAfter(new Date(c.withdrewAt), new Date(election.electronicVotingDate))
      : true
  );

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12} display="flex" alignItems="center">
        <Typography variant="h3" color="textPrimary" component="span">
          Elektronické hlasování
        </Typography>
      </Grid2>
      <Grid2 container size={12} spacing={2}>
        {isLoading ? <Loader /> : <VoteList candidates={candidates} />}
      </Grid2>
    </Grid2>
  );
}
