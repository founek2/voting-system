import React, { useState } from "react";
import { Election, Hydra } from "../../types";
import { TypographyInfo } from "../../Components/TypographyInfo";
import {
  useCompleteElectionMutation,
  useEvaluateElectionMutation,
  useGetElectionElectronicResultQuery,
} from "../../endpoints/elections";
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
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
import AlertDialog from "../../Components/AlertDialog";
import { getCandidateStyle } from "../../util/candidateOpacity";

interface FormType {
  candidates: {
    candidateId: number;
    winner: boolean;
  }[];
}

interface ContentProps {
  results: ElectionResultResource_jsonld_candidate_read;
  candidates: Hydra<Candidate_jsonld_candidate_read>;
  election: Election;
}
function Content({ candidates, results, election }: ContentProps) {
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
  const [saveResults, { isLoading: isSaving }] = useSaveWinnerResultMutation();
  const [evaluateElection, { isLoading: isEvaluating }] =
    useEvaluateElectionMutation();
  const [completeElection, { isLoading }] = useCompleteElectionMutation();
  const [isOpenComplete, setIsOpenComplete] = useState(false);
  const isMutating = isEvaluating || isSaving || isLoading;

  async function onSubmit(data: FormType) {
    const { error } = await saveResults(data.candidates);
    if (error) return handleError(error);

    const { error: errorEval } = await evaluateElection(election.id!);
    if (errorEval) {
      handleError(errorEval);
    } else {
      enqueueSnackbar("Uloženo");
      setIsEdit(false);
    }
  }

  async function onCompleteElection() {
    const { error } = await completeElection(election.id!);
    if (error) return handleError(error);
    else {
      enqueueSnackbar("Volby byli uzavřeny");
      setIsOpenComplete(false);
    }
  }

  return (
    <>
      <Grid
        container
        size={12}
        columnSpacing={2}
        rowSpacing={1}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        {candidates.member.map((candidate, idx) => {
          const result = results?.candidates?.find(
            (r) => r?.candidate?.["@id"] === candidate["@id"]
          );
          const opacity = getCandidateStyle(candidate);
          return (
            <>
              {idx !== 0 ? <Grid size={12}><Divider /></Grid> : null}
              <VoteResultRow
                key={candidate["@id"]}
                result={result}
                candidate={candidate}
              />
              <Grid size={{ xs: 12, md: 1.4, xl: 1 }} sx={opacity}>
                {isEdit ? (
                  <FormControlLabel
                    control={
                      <Controller
                        control={methods.control}
                        name={`candidates.${idx}.winner`}
                        render={({ field }) => (
                          <Checkbox
                            size="small"
                            checked={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            sx={{ height: "1em" }}
                          />
                        )}
                      />
                    }
                    label="Vítěz"
                  />
                ) : candidate.winnerMarkedAt ? (
                  "Vítěz"
                ) : (
                  "Nezvolen"
                )}
              </Grid>
            </>
          );
        })}
        <Grid size={12} display="flex" justifyContent="end">
          <Button
            color="error"
            sx={{ mr: 6 }}
            onClick={() => setIsOpenComplete(true)}
            disabled={isMutating}
          >
            Uzavřít volby
          </Button>
          {isEdit ? (
            <Button type="submit" id="save" disabled={isMutating}>
              Uložit a zveřejnit
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

      <AlertDialog
        open={isOpenComplete}
        onClose={() => setIsOpenComplete(false)}
        onConfirm={onCompleteElection}
        title="Opravdu si přeješ uzavřít volby?"
        description="Volby budou označeny jako ukončené, budou zveřejněny finální výsledky a na hlavní stránce zůstanou informace zobrazené ještě 15 dní."
      />
    </>
  );
}

export function TotalResultList({ election }: { election: Election }) {
  const { data: candidates, isError: isErrorCandidates } =
    useGetCandidatesForElectionQuery(election.id!);
  const { data: results, isError, isLoading } = useTotalElectionResults(election);

  if (isError || isErrorCandidates)
    return <TypographyInfo>Nastala chyba při načítání dat.</TypographyInfo>;

  if (results?.candidates?.length === 0) {
    return <TypographyInfo>Nebyli přihlášení žádní kandidáti.</TypographyInfo>;
  }

  return (
    <Paper sx={{ width: "100%", p: 2 }}>
      {candidates && results ? (
        <Content
          candidates={candidates}
          results={results}
          election={election}
        />
      ) : (
        <Loader />
      )}
    </Paper>
  );
}
