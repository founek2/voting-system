import React from "react";
import { Election } from "../../types";
import { TypographyInfo } from "../../Components/TypographyInfo";
import { useGetElectionElectronicResultQuery } from "../../endpoints/elections";
import { Grid2, Paper, Typography } from "@mui/material";
import Loader from "../../Components/Loader";
import {
  Candidate_jsonld_candidate_read,
  CandidateResult_jsonld_candidate_read,
} from "../../endpoints/types";
import { useGetCandidatesForElectionQuery } from "../../endpoints/candidates";
import { VoteResultRow } from "../../Components/VoteResultRow";
import { useTotalElectionResults } from "../../hooks/useTotalElectionResults";

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
      <Grid2 container size={12} spacing={2}>
        {candidates ? (
          candidates.member.map((candidate) => {
            const result = results?.candidates?.find(
              (r) => r?.candidate?.["@id"] === candidate["@id"]
            );
            return (
              <VoteResultRow
                key={candidate["@id"]}
                result={result}
                candidate={candidate}
              />
            );
          })
        ) : (
          <Loader />
        )}
      </Grid2>
    </Paper>
  );
}
