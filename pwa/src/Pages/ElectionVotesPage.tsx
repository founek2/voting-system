import {
  Autocomplete,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Link as MuiLink,
  Paper,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { format } from "date-fns/format";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import AlertDialog from "../Components/AlertDialog";
import Loader from "../Components/Loader";
import { TypographyInfo } from "../Components/TypographyInfo";
import { VoteCard } from "../Components/VoteCard";
import { useGetElectionQuery } from "../endpoints/elections";
import { useGetPositionsQuery } from "../endpoints/positions";
import {
  User_jsonld_user_read,
  User_jsonld_vote_read,
  Zone_jsonld_zone_read
} from "../endpoints/types";
import { useGetVotedForElectionQuery } from "../endpoints/users";
import {
  useInvalidateVoteMutation,
  useLazyGetVotesForElectionQuery
} from "../endpoints/votes";
import { useGetZonesQuery } from "../endpoints/zones";
import { downloadBlob } from "../util/downloadBlob";
import { electionTitle } from "../util/electionTitle";
import { handleError } from "../util/handleError";

// Mobiles cannot show tables -> needs special view
function VoteListMobile({
  users,
  disabled,
  onInvalidate,
  zones,
}: VoteListProps) {
  return (
    <Grid container spacing={2} display="flex" justifyContent="center">
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
    </Grid>
  );
}

interface VoteListProps {
  users: User_jsonld_user_read[];
  disabled?: boolean;
  zones: Zone_jsonld_zone_read[];
  onInvalidate: (user: User_jsonld_vote_read) => any;
}
function VoteList({ users, disabled, zones, onInvalidate }: VoteListProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const sizeName = { sm: 4 };
  const sizeUid = { sm: 1 };
  const sizeVoting = { sm: 3 };
  const sizePosition = { sm: 3 };

  if (users.length == 0)
    return (
      <Typography color="textPrimary">
        Žádné platné hlasy nebyly zaznamenány ☨
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
    <Paper sx={{ p: 2 }}>
      <Grid container>
        <Grid size={sizeName}>
          <Typography variant="h6">Jméno</Typography>
        </Grid>
        <Grid size={sizeUid}>
          <Typography variant="h6" textAlign="center">
            UID
          </Typography>
        </Grid>
        <Grid size={sizePosition}>
          <Typography variant="h6" textAlign="center">
            Umístění
          </Typography>
        </Grid>
        <Grid size={3}>
          <Typography variant="h6" textAlign="center">
            Hlasování
          </Typography>
        </Grid>

        <Grid size={12}>
          <Divider sx={{ mb: 2 }} />
        </Grid>
        {users.map((user, i) => {
          const zone = zones.find((z) => z["@id"] === user.zone);
          // invalidated votes are not being displayed
          const invalidated = Boolean(false);
          const opacity = {
            opacity: invalidated ? 0.6 : undefined,
          };

          return (
            <React.Fragment key={user.id}>
              <Grid size={sizeName} minHeight={42} sx={opacity}>
                <Typography component="span">
                  {user.firstName} {user.lastName}
                </Typography>
              </Grid>
              <Grid size={sizeUid} sx={opacity}>
                <MuiLink
                  href={`https://is.sh.cvut.cz/users/${user.id}`}
                  target="_blank"
                  underline="none"
                >
                  <Typography textAlign="center">{user.id}</Typography>
                </MuiLink>
              </Grid>
              <Grid size={sizePosition} sx={opacity}>
                <Typography textAlign="center">
                  {zone?.name}/{user.doorNumber}
                </Typography>
              </Grid>
              <Grid size={sizeVoting} justifyContent="center" display="flex">
                <Button
                  type="submit"
                  disabled={invalidated || disabled}
                  onClick={() => onInvalidate(user)}
                >
                  {invalidated ? "Hlas byl zneplatněn" : "Zneplatnit hlas"}
                </Button>
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>
    </Paper>
  );
}

export function Component() {
  const params = useParams<{ id: string }>();
  const [zoneValue, setZoneValue] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>('');
  const {
    data: election,
    isLoading,
    isError,
  } = useGetElectionQuery(Number(params.id));
  const { data: users, isLoading: isLoadingUsers } =
    useGetVotedForElectionQuery(
      { electionId: election?.["@id"]!, zoneId: zoneValue ? zoneValue : undefined, positionId: positionFilter ? positionFilter : undefined },
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
  const { data: allPositions } = useGetPositionsQuery();
  const availablePositions =
    allPositions?.member.filter((position) =>
      election?.positions?.includes(position["@id"] || "")
    ) || [];
  // availablePositions.push({ "@id": "", "@type": "", "name": "Nevybráno" })

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

  function handleDownloadCSV() {
    if (!filteredUsers) return;

    const header = `uuid,first name,last name,zone,door number\n`
    const data = filteredUsers
      .map(user => {
        const zone = zones?.member.find(z => z["@id"] === user.zone);
        return `${user.id},${user.firstName},${user.lastName},${zone?.name},${user.doorNumber}`
      })
      .join('\n')
    const csv = header + data;
    downloadBlob(csv, `hlasy_${format(new Date(), 'yyyy-MM-dd')}.csv`, 'text/csv;charset=utf-8;')
  }

  if (isLoading) return <Loader />;
  if (isError || !election)
    return (
      <TypographyInfo>Nelze načíst informace o zvolené volbě.</TypographyInfo>
    );

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={12} display="flex" alignItems="center">
          <Typography variant="h3" color="textPrimary" component="span" pr={1}>
            Hlasování pro volby {electionTitle(election)}{" "}
            {users?.totalItems !== undefined ? `(${users?.totalItems})` : ""}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <TextField
            fullWidth
            label="Vyhledávání"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4, lg: 2 }}>
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
        </Grid>
        <Grid size={{ xs: 12, md: 4, lg: 2 }}>
          <Autocomplete
            options={availablePositions}
            getOptionKey={(z) => z["@id"]!}
            getOptionLabel={(z) => z.name!}
            renderInput={(params) => (
              <TextField {...params} label="Vyberte pozici" />
            )}
            onChange={(e, value) => {
              setPositionFilter(value?.["@id"] || '');
            }}
            value={availablePositions.find(
              (position) => position["@id"] == positionFilter
            ) || { "@id": "", "@type": "", name: "" }}
          />
        </Grid>
        <Grid display="flex" alignItems="center" >
          <Button onClick={handleDownloadCSV}>Exportovat do CSV</Button>
        </Grid>
        <Grid container size={{ xs: 12, xl: 8 }} spacing={2}>
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
        </Grid>
      </Grid>

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

export { ErrorBoundary } from "../Components/ErrorBoundary2";
