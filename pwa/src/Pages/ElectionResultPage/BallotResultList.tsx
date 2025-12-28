import { Button, Divider, Grid, Paper } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FormStatus } from "../../Components/FormStatus";
import Loader from "../../Components/Loader";
import { TypographyInfo } from "../../Components/TypographyInfo";
import { FormType, VoteResultRow } from "../../Components/VoteResultRow";
import {
  useGetElectionBallotResultQuery,
  useSaveBallotResultMutation,
} from "../../endpoints/ballotResult";
import { useGetCandidatesForElectionQuery } from "../../endpoints/candidates";
import {
  BallotResult_jsonld_result_read_candidate_read,
  Candidate_jsonld_candidate_read,
} from "../../endpoints/types";
import { Election, Hydra } from "../../types";
import { handleError } from "../../util/handleError";
import { isEmpty } from "../../util/isEmpty";

function Content({
  results,
  candidates,
}: {
  results: Hydra<BallotResult_jsonld_result_read_candidate_read>;
  candidates: Hydra<Candidate_jsonld_candidate_read>;
}) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormType>({
    defaultValues: {
      candidates: candidates.member.map((c) => {
        const result = results?.member.find(
          (r) => r?.candidate?.["@id"] === c["@id"]
        );

        return {
          resultId: result?.id,
          candidate: c["@id"],
          negativeVotes: result?.negativeVotes || 0,
          positiveVotes: result?.positiveVotes || 0,
          neutralVotes: result?.neutralVotes || 0,
        };
      }),
    },
  });
  const [saveBallotResult, { isLoading: isMutating }] =
    useSaveBallotResultMutation();
  const [isEdit, setIsEdit] = useState(false);

  async function onSubmit(data: FormType) {
    const { error } = await saveBallotResult(data);
    if (error) {
      handleError(error);
    } else {
      enqueueSnackbar("Uloženo");
      setIsEdit(false);
    }
  }

  const rows = candidates.member?.map((candidate, idx) => {
    const result = results?.member.find(
      (r) => r?.candidate?.["@id"] === candidate["@id"]
    );
    return (<>
      {idx !== 0 ? <Grid size={12}><Divider /></Grid> : null}
      <VoteResultRow
        index={idx}
        key={candidate["@id"]}
        result={result}
        candidate={candidate}
        edit={isEdit}
        register={register}
      />
    </>
    );
  });

  return (
    <Grid
      container
      size={12}
      columnSpacing={2}
      rowSpacing={1}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {!isEmpty(errors) ? (
        <Grid size={12}>
          <FormStatus errors={errors} />
        </Grid>
      ) : null}
      {rows}
      <Grid size={12} display="flex" justifyContent="end">
        {isEdit ? (
          <Button type="submit" id="save" disabled={isMutating}>
            Uložit
          </Button>
        ) : (
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsEdit(true);
            }}
            id="edit"
          >
            Editace
          </Button>
        )}
      </Grid>
    </Grid>
  );
}

export function BallotResultList({ election }: { election: Election }) {
  const { data: candidates, isError: isErrorCandidates } =
    useGetCandidatesForElectionQuery(election.id!);
  const { data: results, isError } = useGetElectionBallotResultQuery(
    election?.id!
  );

  if (isError || isErrorCandidates)
    return <TypographyInfo>Nastala chyba při načítání dat.</TypographyInfo>;

  if (candidates?.totalItems === 0) {
    return <TypographyInfo>Nebyli přihlášeni žádní kandidáti.</TypographyInfo>;
  }

  return (
    <Paper sx={{ width: "100%", p: 2 }}>
      {candidates && results ? (
        <Content candidates={candidates} results={results} />
      ) : (
        <Loader />
      )}
    </Paper>
  );
}
