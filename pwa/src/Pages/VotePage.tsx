import {
  Button,
  Grid,
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
import { getCandidateStyle } from "../util/candidateOpacity";
import { useTranslation } from "react-i18next";

// Mobiles cannot show tables -> needs special view
function VoteListMobile({
  candidates,
  register,
  control,
  disabled,
}: VoteListProps) {
  const { t } = useTranslation()

  return (
    <Grid container spacing={2} display="flex" justifyContent="center">
      {candidates.map((candidate, i) => (
        <CandidateVoteCard
          candidate={candidate}
          key={candidate.id}
          sx={{ width: "100%" }}
        >
          {candidate.withdrewAt ? (
            <Typography>{t('vote.candidateWithdrew')}</Typography>
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
                        label={t('vote.agree')}
                      />
                      <FormControlLabel
                        value="0"
                        control={<Radio />}
                        label={t('vote.abstain')}
                      />
                      <FormControlLabel
                        value="-1"
                        control={<Radio />}
                        label={t('vote.against')}
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </>
          )}
        </CandidateVoteCard>
      ))}
      <Grid size={12} display="flex" justifyContent="center">
        <Button type="submit" disabled={disabled}>
          {t('common.actionVote')}
        </Button>
      </Grid>
    </Grid>
  );
}

interface VoteListProps {
  candidates: Candidate_jsonld_candidate_read[];
  disabled?: boolean;
  register: UseFormRegister<FormType>;
  control: Control<FormType, any>;
}
function VoteList({ candidates, disabled, register, control }: VoteListProps) {
  const { t } = useTranslation()
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const sizeName = { sm: 3 };
  const sizeUid = { sm: 1 };
  const sizeVoting = { sm: 3 };
  const sizePosition = { sm: 3 };

  if (candidates.every((c) => Boolean(c.withdrewAt)))
    return <Typography color="textPrimary">{t('vote.done')} ✅</Typography>;

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
      <Grid container>
        <Grid size={sizeName}>
          <Typography variant="h6">{t('common.name')}</Typography>
        </Grid>
        <Grid size={sizeUid}>
          <Typography variant="h6" textAlign="center">
            UID
          </Typography>
        </Grid>
        <Grid size={sizePosition}>
          <Typography variant="h6" textAlign="center">
            {t('common.position')}
          </Typography>
        </Grid>
        <Grid size={2}>
          <Typography variant="h6" textAlign="center">
            {t('common.poster')}
          </Typography>
        </Grid>
        <Grid size={3}>
          <Typography variant="h6" textAlign="center">
            {t('vote.voting')}
          </Typography>
        </Grid>

        <Grid size={12}>
          <Divider sx={{ mb: 2 }} />
        </Grid>
        {candidates.map((candidate, i) => {
          const withdrew = Boolean(candidate.withdrewAt);
          const opacity = getCandidateStyle(candidate);

          return (
            <React.Fragment key={candidate.id}>
              <Grid size={sizeName} minHeight={42}>
                <ConditionalTooltip
                  disabled={!withdrew}
                  title={t('vote.candidateWithdrew')}
                >
                  <Typography component="span" sx={opacity}>
                    {candidate.appUser?.firstName} {candidate.appUser?.lastName}
                  </Typography>
                </ConditionalTooltip>
              </Grid>
              <Grid size={sizeUid}>
                <Typography textAlign="center" sx={opacity}>
                  {candidate.appUser?.id}
                </Typography>
              </Grid>
              <Grid size={sizePosition}>
                <ConditionalTooltip
                  disabled={!withdrew}
                  title={t('vote.candidateWithdrew')}
                >
                  <Typography textAlign="center" sx={opacity}>
                    {candidate.position?.name}
                  </Typography>
                </ConditionalTooltip>
              </Grid>
              <Grid size={2} justifyContent="center" display="flex">
                <PosterButton candidate={candidate} disabled={withdrew} />
              </Grid>
              <Grid size={sizeVoting} justifyContent="center" display="flex">
                {withdrew ? (
                  <Typography sx={opacity}>{t('vote.candidateWithdrew')}</Typography>
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
                              label={t('vote.agree')}
                            />
                            <FormControlLabel
                              value="0"
                              control={<Radio />}
                              label={t('vote.abstain')}
                            />
                            <FormControlLabel
                              value="-1"
                              control={<Radio />}
                              label={t('vote.against')}
                            />
                          </RadioGroup>
                        </FormControl>
                      )}
                    />
                  </>
                )}
              </Grid>
            </React.Fragment>
          );
        })}
        <Grid size={12} display="flex" justifyContent="end">
          <Button type="submit" disabled={disabled}>
            {t('common.actionVote')}
          </Button>
        </Grid>
      </Grid>
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
  const { t } = useTranslation()
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
    <Grid container spacing={2}>
      <Grid size={12} display="flex" alignItems="center">
        <Typography variant="h3" color="textPrimary" component="span">
          {t('vote.title')}
        </Typography>
      </Grid>
      <Grid
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
      </Grid>
    </Grid>
  );
}

export { ErrorBoundary } from "../Components/ErrorBoundary2";
