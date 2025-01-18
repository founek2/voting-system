import {
  Box,
  Button,
  Divider,
  Grid2,
  Link as MuiLink,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Components/Loader";
import { useGetElectionQuery } from "../endpoints/elections";
import {
  Vote_jsonld_vote_read,
  Zone_jsonld_zone_read,
} from "../endpoints/types";
import {
  useGetVotesForElectionQuery,
  useInvalidateVoteMutation,
} from "../endpoints/votes";
import { useGetZonesQuery } from "../endpoints/zones";
import { electionTitle } from "../util/electionTitle";
import AlertDialog from "../Components/AlertDialog";
import { handleError } from "../util/handleError";
import { enqueueSnackbar } from "notistack";
import { CandidateVoteCard } from "../Components/CandidateVoteCard";
import { VoteCard } from "../Components/VoteCard";

// Mobiles cannot show tables -> needs special view
function VoteListMobile({
  votes,
  disabled,
  onInvalidate,
  zones,
}: VoteListProps) {
  return (
    <Grid2 container spacing={2} display="flex" justifyContent="center">
      {votes.map((vote, i) => {
        const zone = zones.find((z) => z["@id"] === vote.appUser?.zone);
        return (
          <VoteCard
            vote={vote}
            key={vote.id}
            sx={{ width: "100%" }}
            zone={zone?.alias ?? ""}
          >
            <Button
              type="submit"
              disabled={Boolean(vote.invalidatedAt) || disabled}
              onClick={() => onInvalidate(vote)}
            >
              {vote.invalidatedAt ? "Hlas byl zneplatněn" : "Zneplatnit hlas"}
            </Button>
          </VoteCard>
        );
      })}
      <Grid2 size={12}>
        <Button type="submit" disabled={disabled}>
          Uložit
        </Button>
      </Grid2>
    </Grid2>
  );
}

interface VoteListProps {
  votes: Vote_jsonld_vote_read[];
  disabled?: boolean;
  zones: Zone_jsonld_zone_read[];
  onInvalidate: (vote: Vote_jsonld_vote_read) => any;
}
function VoteList({ votes, disabled, zones, onInvalidate }: VoteListProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const sizeName = { sm: 3 };
  const sizeUid = { sm: 1 };
  const sizeVoting = { sm: 3 };
  const sizePosition = { sm: 3 };

  if (votes.length == 0)
    return (
      <Typography color="textPrimary">
        Žádné hlasy nebyli zaznamenány ☨
      </Typography>
    );

  if (isMobile)
    return (
      <VoteListMobile
        votes={votes}
        disabled={disabled}
        onInvalidate={onInvalidate}
        zones={zones}
      />
    );

  return (
    <Paper sx={{ p: 2, width: "100%" }}>
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
            Umístění
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
        {votes.map((vote, i) => {
          const zone = zones.find((z) => z["@id"] === vote.appUser?.zone);
          const invalidated = Boolean(vote.invalidatedAt);
          const opacity = {
            opacity: invalidated ? 0.6 : undefined,
          };

          return (
            <React.Fragment key={vote.id}>
              <Grid2 size={sizeName} minHeight={42} sx={opacity}>
                <Typography component="span">
                  {vote.appUser?.firstName} {vote.appUser?.lastName}
                </Typography>
              </Grid2>
              <Grid2 size={sizeUid} sx={opacity}>
                <MuiLink
                  href={`https://is.sh.cvut.cz/users/${vote.appUser?.id}`}
                  target="_blank"
                  underline="none"
                >
                  <Typography textAlign="center">{vote.appUser?.id}</Typography>
                </MuiLink>
              </Grid2>
              <Grid2 size={sizePosition} sx={opacity}>
                <Typography textAlign="center">{zone?.name}</Typography>
              </Grid2>
              <Grid2 size={sizeVoting} justifyContent="center" display="flex">
                <Button
                  type="submit"
                  disabled={invalidated || disabled}
                  onClick={() => onInvalidate(vote)}
                >
                  {vote.invalidatedAt
                    ? "Hlas byl zneplatněn"
                    : "Zneplatnit hlas"}
                </Button>
              </Grid2>
            </React.Fragment>
          );
        })}
      </Grid2>
    </Paper>
  );
}

export default function ElectionVotesPage() {
  const params = useParams<{ id: string }>();
  const {
    data: election,
    isLoading,
    isError,
  } = useGetElectionQuery(Number(params.id));
  const { data: votes } = useGetVotesForElectionQuery(election?.["@id"]!, {
    skip: !election,
  });
  const { data: zones } = useGetZonesQuery();
  const [invalidateVote, { isLoading: isLoadingInvalidate }] =
    useInvalidateVoteMutation();
  const [selectedVote, setSelectedVote] = useState<Vote_jsonld_vote_read>();

  async function handleInvalidateVote() {
    if (!selectedVote) return;

    const { error } = await invalidateVote(selectedVote.id!);
    if (error) {
      handleError(error);
    } else {
      enqueueSnackbar("Hlas byl zneplatněn");
      setSelectedVote(undefined);
    }
  }

  if (isLoading) return <Loader />;
  if (isError || !election)
    return <Typography>Nelze načíst informace o zvolené volbě.</Typography>;

  // TODO add fulltext search
  return (
    <>
      <Grid2 container spacing={2}>
        <Grid2 size={12} display="flex" alignItems="center">
          <Typography variant="h3" color="textPrimary" component="span" pr={1}>
            Hlasování pro volby {electionTitle(election)}{" "}
            {votes?.totalItems !== undefined ? `(${votes?.totalItems})` : ""}
          </Typography>
        </Grid2>
        <Grid2 container size={12} spacing={2}>
          {votes ? (
            <VoteList
              votes={votes.member}
              zones={zones?.member || []}
              disabled={isLoadingInvalidate}
              onInvalidate={(vote) => setSelectedVote(vote)}
            />
          ) : (
            <Loader />
          )}
        </Grid2>
      </Grid2>

      <AlertDialog
        open={Boolean(selectedVote)}
        onClose={() => setSelectedVote(undefined)}
        onConfirm={handleInvalidateVote}
        title="Opravdu si přeješ zneplatnit hlas?"
        description={`Hlas uživatele ${selectedVote?.appUser?.firstName} ${selectedVote?.appUser?.lastName} bude nenávratně zneplatně.`}
      />
    </>
  );
}
