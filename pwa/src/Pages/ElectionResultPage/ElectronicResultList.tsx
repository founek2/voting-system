import { Divider, Grid, Paper } from "@mui/material";
import React from "react";
import Loader from "../../Components/Loader";
import { TypographyInfo } from "../../Components/TypographyInfo";
import { VoteResultRow } from "../../Components/VoteResultRow";
import { useGetCandidatesForElectionQuery } from "../../endpoints/candidates";
import { useGetElectionElectronicResultQuery } from "../../endpoints/elections";
import { Election } from "../../types";

export function ElectronicResultList({ election }: { election: Election }) {
  const { data: candidates, isError: isErrorCandidates } =
    useGetCandidatesForElectionQuery(election.id!);
  const { data: results, isError } = useGetElectionElectronicResultQuery(
    election?.id!
  );

  if (isError || isErrorCandidates)
    return <TypographyInfo>Nastala chyba při načítání dat.</TypographyInfo>;

  if (results?.candidates?.length === 0) {
    return <TypographyInfo>Nebyli přihlášení žádní kandidáti.</TypographyInfo>;
  }
  return (
    <Paper sx={{ width: "100%", p: 2 }}>
      <Grid container size={12} columnSpacing={2} rowSpacing={1}>
        {candidates ? (
          candidates.member.map((candidate, i) => {
            const result = results?.candidates?.find(
              (r) => r?.candidate?.["@id"] === candidate["@id"]
            );
            return (<>
              {i !== 0 ? <Grid size={12}> <Divider /> </Grid> : null}
              <VoteResultRow
                key={candidate["@id"]}
                result={result}
                candidate={candidate}
              />

            </>
            );
          })
        ) : (
          <Loader />
        )}
      </Grid>
    </Paper>
  );
}
