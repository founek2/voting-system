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
import React, { useEffect } from "react";
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
import {
  Control,
  Controller,
  useFieldArray,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { FormStatus } from "../Components/FormStatus";
import { useAddBallotVoteMutation } from "../endpoints/ballots";
import { handleError } from "../util/handleError";

// Mobiles cannot show tables -> needs special view
function VoteListMobile({
  candidates,
  register,
  control,
  disabled,
}: VoteListProps) {
  return (
    <Grid2 container spacing={2} display="flex" justifyContent="center">
      {candidates.map((candidate, i) => (
        <CandidateVoteCard
          candidate={candidate}
          key={candidate.id}
          sx={{ width: "100%" }}
        >
          {candidate.withdrewAt ? (
            <Typography>Odstoupil z kandidatury</Typography>
          ) : (
            <>
              <input
                type="hidden"
                value={candidate["@id"]}
                {...register(`votes.${i}.candidate`)}
              />
              <Controller
                control={control}
                name={`votes.${i}.value`}
                rules={{ required: true }}
                defaultValue="0"
                render={({ field }) => (
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-radio-buttons-group-label"
                      onChange={(val) => field.onChange(val.target.value)}
                      value={field.value}
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label="Pro"
                      />
                      <FormControlLabel
                        value="0"
                        control={<Radio />}
                        label="Zdržuji se"
                      />
                      <FormControlLabel
                        value="-1"
                        control={<Radio />}
                        label="Proti"
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </>
          )}
        </CandidateVoteCard>
      ))}
      <Grid2 size={12}>
        <Button type="submit" disabled={disabled}>
          Uložit
        </Button>
      </Grid2>
    </Grid2>
  );
}

interface VoteListProps {
  candidates: Candidate_jsonld_candidate_read[];
  disabled?: boolean;
  register: UseFormRegister<FormType>;
  control: Control<FormType, any>;
}
function VoteList({ candidates, disabled, register, control }: VoteListProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const sizeName = { sm: 3 };
  const sizeUid = { sm: 1 };
  const sizeVoting = { sm: 3 };
  const sizePosition = { sm: 3 };

  if (candidates.every((c) => Boolean(c.withdrewAt)))
    return <Typography color="textPrimary">Již máte odhlasováno ✅</Typography>;

  if (isMobile)
    return (
      <VoteListMobile
        candidates={candidates}
        register={register}
        disabled={disabled}
        control={control}
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
        {candidates.map((candidate, i) => {
          const withdrew = Boolean(candidate.withdrewAt);
          const opacity = {
            opacity: withdrew ? 0.6 : undefined,
          };

          return (
            <React.Fragment key={candidate.id}>
              <Grid2 size={sizeName} minHeight={42}>
                <ConditionalTooltip
                  disabled={!withdrew}
                  title="Odstoupil z kandidatury"
                >
                  <Typography component="span" sx={opacity}>
                    {candidate.appUser?.firstName} {candidate.appUser?.lastName}
                  </Typography>
                </ConditionalTooltip>
              </Grid2>
              <Grid2 size={sizeUid}>
                <Typography textAlign="center" sx={opacity}>
                  {candidate.appUser?.id}
                </Typography>
              </Grid2>
              <Grid2 size={sizePosition}>
                <ConditionalTooltip
                  disabled={!withdrew}
                  title="Odstoupil z kandidatury"
                >
                  <Typography textAlign="center" sx={opacity}>
                    {candidate.position?.name}
                  </Typography>
                </ConditionalTooltip>
              </Grid2>
              <Grid2 size={2} justifyContent="center" display="flex">
                <PosterButton candidate={candidate} disabled={withdrew} />
              </Grid2>
              <Grid2 size={sizeVoting} justifyContent="center" display="flex">
                {withdrew ? (
                  <Typography sx={opacity}>Odstoupil z kandidatury</Typography>
                ) : (
                  <>
                    <input
                      type="hidden"
                      value={candidate["@id"]}
                      {...register(`votes.${i}.candidate`)}
                    />
                    <Controller
                      control={control}
                      name={`votes.${i}.value`}
                      rules={{ required: true }}
                      defaultValue="0"
                      render={({ field }) => (
                        <FormControl>
                          <RadioGroup
                            row
                            aria-labelledby="demo-radio-buttons-group-label"
                            onChange={(val) => field.onChange(val.target.value)}
                            value={field.value}
                          >
                            <FormControlLabel
                              value="1"
                              control={<Radio />}
                              label="Pro"
                            />
                            <FormControlLabel
                              value="0"
                              control={<Radio />}
                              label="Zdržuji se"
                            />
                            <FormControlLabel
                              value="-1"
                              control={<Radio />}
                              label="Proti"
                            />
                          </RadioGroup>
                        </FormControl>
                      )}
                    />
                  </>
                )}
              </Grid2>
            </React.Fragment>
          );
        })}
        <Grid2 size={12}>
          <Button type="submit" disabled={disabled}>
            Uložit
          </Button>
        </Grid2>
      </Grid2>
    </Paper>
  );
}

const isValidVote = (item: VoteValue | undefined): item is VoteValue => {
  return !!item;
};

interface VoteValue {
  candidate: string;
  value: "-1" | "0" | "1";
}
interface FormType {
  votes: (VoteValue | undefined)[];
}
export function Component() {
  const { data: elections, isLoading: isLoadingElections } =
    useGetPublicElectionsElectronicQuery();
  const election = elections ? elections.member[0] : undefined;
  const { data: candidatesData, isLoading: isLoadingCandidates } =
    useGetCandidatesUnvotedQuery(Number(election?.id), {
      skip: !election?.id,
    });
  const methods = useForm<FormType>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = methods;
  const [ballotVote, { isLoading: isMutating }] = useAddBallotVoteMutation();

  const candidates = (candidatesData?.member || []).filter((c) =>
    c.withdrewAt && election?.electronicVotingDate
      ? isAfter(new Date(c.withdrewAt), new Date(election.electronicVotingDate))
      : true
  );

  useEffect(() => {
    if (candidates.length) {
      reset({
        votes: candidates.map((c) =>
          c.withdrewAt ? undefined : { value: "0", candidate: c["@id"]! }
        ),
      });
    }
  }, [candidates.length]);

  async function onSubmit(data: FormType) {
    const votes = data.votes
      .filter(isValidVote)
      .map((v) => ({ ...v, value: Number(v?.value) as -1 | 0 | 1 }));

    const result = await ballotVote({ votes: votes });
    if (result.error) handleError(result.error);
  }
  const handleOnSubmit = handleSubmit(onSubmit);

  const isLoading = isLoadingElections || isLoadingCandidates;

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12} display="flex" alignItems="center">
        <Typography variant="h3" color="textPrimary" component="span">
          Elektronické hlasování
        </Typography>
      </Grid2>
      <Grid2
        container
        size={12}
        spacing={2}
        component="form"
        onSubmit={handleOnSubmit}
      >
        <FormStatus errors={errors} />
        {isLoading ? (
          <Loader />
        ) : (
          <VoteList
            candidates={candidates}
            register={register}
            control={control}
            disabled={isMutating}
          />
        )}
      </Grid2>
    </Grid2>
  );
}

export { ErrorBoundary } from "../Components/ErrorBoundary2";
