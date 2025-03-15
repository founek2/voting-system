import { Button, Grid2, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import Loader from "../../Components/Loader";
import { TypographyInfo } from "../../Components/TypographyInfo";
import { useGetCandidatesForElectionQuery } from "../../endpoints/candidates";
import {
  useAddBallotResultMutation,
  useGetElectionBallotResultQuery,
  useUpdateBallotResultMutation,
} from "../../endpoints/ballotResult";
import {
  BallotResult_jsonld_result_read_candidate_read,
  BallotResult_jsonld_result_write,
  Candidate_jsonld_candidate_read,
} from "../../endpoints/types";
import { Election, Hydra } from "../../types";
import { FormType, VoteResultRow } from "../../Components/VoteResultRow";
import { useForm } from "react-hook-form";
import { handleError } from "../../util/handleError";
import { FormStatus } from "../../Components/FormStatus";
import { enqueueSnackbar } from "notistack";
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
  const [addBallotResult] = useAddBallotResultMutation();
  const [updateBallotResult] = useUpdateBallotResultMutation();
  const [isEdit, setIsEdit] = useState(false);

  async function onSubmit(data: FormType) {
    let errorDetected = false;
    for (const result of data.candidates) {
      const resultConverted: BallotResult_jsonld_result_write = {
        candidate: result.candidate,
        negativeVotes: Number(result.negativeVotes),
        neutralVotes: Number(result.neutralVotes),
        positiveVotes: Number(result.positiveVotes),
      };
      if (result.resultId) {
        const { error } = await updateBallotResult({
          id: result.resultId,
          body: resultConverted,
        });
        if (error) {
          errorDetected = true;
          handleError(error);
        }
      } else {
        const { error } = await addBallotResult(resultConverted);
        if (error) {
          errorDetected = true;
          handleError(error);
        }
      }
    }
    if (!errorDetected) {
      enqueueSnackbar("Uloženo");
      setIsEdit(false);
    }
  }

  const rows = candidates.member?.map((candidate, idx) => {
    const result = results?.member.find(
      (r) => r?.candidate?.["@id"] === candidate["@id"]
    );
    return (
      <VoteResultRow
        index={idx}
        key={candidate["@id"]}
        result={result}
        candidate={candidate}
        edit={isEdit}
        register={register}
      />
    );
  });

  return (
    <Grid2
      container
      size={12}
      spacing={2}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {!isEmpty(errors) ? (
        <Grid2 size={12}>
          <FormStatus errors={errors} />
        </Grid2>
      ) : null}
      {rows}
      <Grid2>
        {isEdit ? (
          <Button type="submit" id="save">
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
      </Grid2>
    </Grid2>
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
    return <TypographyInfo>Nebyli přihlášení žádní kandidáti.</TypographyInfo>;
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
