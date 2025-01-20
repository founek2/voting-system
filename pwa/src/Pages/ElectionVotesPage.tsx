import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Link as MuiLink,
  Paper,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Components/Loader";
import { useGetElectionQuery } from "../endpoints/elections";
import {
  User_jsonld_user_read,
  User_jsonld_vote_read,
  Vote_jsonld_vote_read,
  Zone_jsonld_zone_read,
} from "../endpoints/types";
import {
  useGetVotesForElectionQuery,
  useInvalidateVoteMutation,
  useLazyGetVotesForElectionQuery,
} from "../endpoints/votes";
import { useGetZonesQuery } from "../endpoints/zones";
import { electionTitle } from "../util/electionTitle";
import AlertDialog from "../Components/AlertDialog";
import { handleError } from "../util/handleError";
import { enqueueSnackbar } from "notistack";
import { CandidateVoteCard } from "../Components/CandidateVoteCard";
import { VoteCard } from "../Components/VoteCard";
import { useDebounce } from "use-debounce";
import { useGetVotedForElectionQuery } from "../endpoints/users";

// Mobiles cannot show tables -> needs special view
function VoteListMobile({
  users,
  disabled,
  onInvalidate,
  zones,
}: VoteListProps) {
  return (
    <Grid2 container spacing={2} display="flex" justifyContent="center">
      {users.map((user, i) => {
        const zone = zones.find((z) => z["@id"] === user.zone);
        const invalidated = false;
        return (
          <VoteCard
            user={user}
            key={user.id}
            sx={{ width: "100%" }}
            zone={zone?.alias ?? ""}
          >
            <Button
              type="submit"
              disabled={invalidated || disabled}
              onClick={() => onInvalidate(user)}
            >
              {invalidated ? "Hlas byl zneplatněn" : "Zneplatnit hlas"}
            </Button>
          </VoteCard>
        );
      })}
    </Grid2>
  );
}

interface VoteListProps {
  users: User_jsonld_vote_read[];
  disabled?: boolean;
  zones: Zone_jsonld_zone_read[];
  onInvalidate: (user: User_jsonld_vote_read) => any;
}
function VoteList({ users, disabled, zones, onInvalidate }: VoteListProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const sizeName = { sm: 3 };
  const sizeUid = { sm: 1 };
  const sizeVoting = { sm: 3 };
  const sizePosition = { sm: 3 };

  if (users.length == 0)
    return (
      <Typography color="textPrimary">
        Žádné platné hlasy nebyli zaznamenány ☨
      </Typography>
    );

  if (isMobile)
    return (
      <VoteListMobile
        users={users}
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
        {users.map((user, i) => {
          const zone = zones.find((z) => z["@id"] === user.zone);
          // const invalidated = Boolean(user.invalidatedAt);
          const invalidated = Boolean(false);
          const opacity = {
            opacity: invalidated ? 0.6 : undefined,
          };

          return (
            <React.Fragment key={user.id}>
              <Grid2 size={sizeName} minHeight={42} sx={opacity}>
                <Typography component="span">
                  {user.firstName} {user.lastName}
                </Typography>
              </Grid2>
              <Grid2 size={sizeUid} sx={opacity}>
                <MuiLink
                  href={`https://is.sh.cvut.cz/users/${user.id}`}
                  target="_blank"
                  underline="none"
                >
                  <Typography textAlign="center">{user.id}</Typography>
                </MuiLink>
              </Grid2>
              <Grid2 size={sizePosition} sx={opacity}>
                <Typography textAlign="center">{zone?.name}</Typography>
              </Grid2>
              <Grid2 size={sizeVoting} justifyContent="center" display="flex">
                <Button
                  type="submit"
                  disabled={invalidated || disabled}
                  onClick={() => onInvalidate(user)}
                >
                  {invalidated ? "Hlas byl zneplatněn" : "Zneplatnit hlas"}
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
  const [zoneValue, setZoneValue] = useState("");
  const {
    data: election,
    isLoading,
    isError,
  } = useGetElectionQuery(Number(params.id));
  const { data: users, isLoading: isLoadingUsers } =
    useGetVotedForElectionQuery(
      { electionId: election?.["@id"]!, zoneId: zoneValue },
      {
        skip: !election,
      }
    );
  const { data: zones } = useGetZonesQuery();
  const [invalidateVote, { isLoading: isLoadingInvalidate }] =
    useInvalidateVoteMutation();
  const [selectedUser, setSelectedVote] = useState<User_jsonld_user_read>();
  const [searchText, setSearchText] = useState("");
  const [searchTextDebounced] = useDebounce(searchText, 300);
  const [filteredUsers, setFilteredUsers] = useState<User_jsonld_user_read[]>(
    []
  );
  const [getVotes, { isLoading: isLoadingVotes }] =
    useLazyGetVotesForElectionQuery();

  useEffect(() => {
    if (!users?.member) return;

    const filtered = users.member.filter((m) => {
      const v = searchText.toLocaleLowerCase();
      return (
        m.firstName?.toLocaleLowerCase().includes(v) ||
        m.lastName?.toLocaleLowerCase().includes(v) ||
        `${m.firstName} ${m.lastName}`.toLocaleLowerCase().includes(v)
      );
    });

    setFilteredUsers(filtered);
  }, [searchTextDebounced, zoneValue, users]);

  async function handleInvalidateVote() {
    if (!selectedUser || !election) return;

    const votes = await getVotes({
      electionId: election["@id"]!,
      userId: selectedUser["@id"],
    }).unwrap();

    let success = true;
    for (const vote of votes.member) {
      const { error } = await invalidateVote(vote.id!);
      if (error) {
        success = false;
        handleError(error);
      }
    }

    if (success) {
      enqueueSnackbar("Hlas byl zneplatněn");
      setSelectedVote(undefined);
    }
  }

  if (isLoading) return <Loader />;
  if (isError || !election)
    return <Typography>Nelze načíst informace o zvolené volbě.</Typography>;

  return (
    <>
      <Grid2 container spacing={2}>
        <Grid2 size={12} display="flex" alignItems="center">
          <Typography variant="h3" color="textPrimary" component="span" pr={1}>
            Hlasování pro volby {electionTitle(election)}{" "}
            {users?.totalItems !== undefined ? `(${users?.totalItems})` : ""}
          </Typography>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6, lg: 3 }}>
          <TextField
            fullWidth
            label="Vyhledávání"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4, lg: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Oblast</InputLabel>
            <Select
              fullWidth
              label="Oblast"
              value={zoneValue}
              onChange={(e) => setZoneValue(e.target.value)}
            >
              <MenuItem value={""}>Nevybráno</MenuItem>
              {zones?.member.map((zone) => (
                <MenuItem value={zone["@id"]} key={zone.id}>
                  {zone.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 container size={12} spacing={2}>
          {!isLoadingUsers ? (
            <VoteList
              users={filteredUsers}
              zones={zones?.member || []}
              disabled={isLoadingInvalidate || isLoadingVotes}
              onInvalidate={(vote) => setSelectedVote(vote)}
            />
          ) : (
            <Loader />
          )}
        </Grid2>
      </Grid2>

      <AlertDialog
        open={Boolean(selectedUser)}
        onClose={() => setSelectedVote(undefined)}
        onConfirm={handleInvalidateVote}
        title="Opravdu si přeješ zneplatnit hlas?"
        description={`Hlas uživatele ${selectedUser?.firstName} ${selectedUser?.lastName} bude nenávratně zneplatně.`}
      />
    </>
  );
}
