import React, { useState } from "react";
import { Election, Hydra } from "../../types";
import { TypographyInfo } from "../../Components/TypographyInfo";
import { useGetElectionElectronicResultQuery } from "../../endpoints/elections";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid2,
  Paper,
  Typography,
} from "@mui/material";
import Loader from "../../Components/Loader";
import {
  Candidate_jsonld_candidate_read,
  CandidateResult_jsonld_candidate_read,
  ElectionResultResource_jsonld_candidate_read,
} from "../../endpoints/types";
import {
  useGetCandidatesForElectionQuery,
  useSaveWinnerResultMutation,
} from "../../endpoints/candidates";
import { VoteResultRow } from "../../Components/VoteResultRow";
import { useTotalElectionResults } from "../../hooks/useTotalElectionResults";
import { Controller, useForm } from "react-hook-form";
import { handleError } from "../../util/handleError";
import { enqueueSnackbar } from "notistack";

interface FormType {
  candidates: {
    candidateId: number;
    winner: boolean;
  }[];
}

interface ContentProps {
  results: ElectionResultResource_jsonld_candidate_read;
  candidates: Hydra<Candidate_jsonld_candidate_read>;
}
function Content({ candidates, results }: ContentProps) {
  const [isEdit, setIsEdit] = useState(false);
  const methods = useForm<FormType>({
    defaultValues: {
      candidates: candidates.member.map((c) => {
        return {
          winner: Boolean(c.winnerMarkedAt),
          candidateId: c.id,
        };
      }),
    },
  });
  const { handleSubmit, register } = methods;
  const [saveResults, { isLoading: isMutating }] =
    useSaveWinnerResultMutation();

  async function onSubmit(data: FormType) {
    console.log("data", data);
    const { error } = await saveResults(data.candidates);
    if (error) {
      handleError(error);
    } else {
      enqueueSnackbar("Uloženo");
      setIsEdit(false);
    }
  }

  return (
    <Grid2
      container
      size={12}
      spacing={2}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {candidates.member.map((candidate, idx) => {
        const result = results?.candidates?.find(
          (r) => r?.candidate?.["@id"] === candidate["@id"]
        );
        return (
          <>
            <VoteResultRow
              key={candidate["@id"]}
              result={result}
              candidate={candidate}
            />
            <Grid2 size={{ xs: 3, md: 1 }}>
              {isEdit ? (
                <FormControlLabel
                  control={
                    <Controller
                      control={methods.control}
                      name={`candidates.${idx}.winner`}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                  }
                  label="Vítěz"
                />
              ) : candidate.winnerMarkedAt ? (
                "Vítěz"
              ) : (
                ""
              )}
            </Grid2>
          </>
        );
      })}
      <Grid2 size={12}>
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
      </Grid2>
    </Grid2>
  );
}

export function TotalResultList({ election }: { election: Election }) {
  const { data: candidates, isError: isErrorCandidates } =
    useGetCandidatesForElectionQuery(election.id!);
  const { data: results, isError } = useTotalElectionResults(election);

  if (isError || isErrorCandidates)
    return <TypographyInfo>Nastala chyba při načítání dat.</TypographyInfo>;

  if (results?.candidates?.length === 0) {
    return <TypographyInfo>Nebyli přihlášení žádní kandidáti.</TypographyInfo>;
  }
  return (
    <Paper sx={{ width: "100%", p: 2 }}>
      {candidates ? (
        <Content candidates={candidates} results={results} />
      ) : (
        <Loader />
      )}
    </Paper>
  );
}
