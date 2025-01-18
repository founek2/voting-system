import HowToVoteIcon from "@mui/icons-material/HowToVote";
import { Box, Button, Card, CardContent, CardHeader } from "@mui/material";
import React from "react";
import { Election } from "../types";
import { electionTitle } from "../util/electionTitle";

interface ElectionCardProps {
  election: Election;
  title?: string;
  isAdmin?: boolean;
  onViewVotes?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    election: Election
  ) => any;
}
export function ElectionCard({
  election,
  title,
  isAdmin,
  onViewVotes,
}: ElectionCardProps) {
  return (
    <Card>
      <CardHeader title={title ? title : electionTitle(election)} />
      <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <HowToVoteIcon fontSize="large" />
        </Box>
        {isAdmin ? (
          <Button onClick={(e) => onViewVotes && onViewVotes(e, election)}>
            Zobrazit hlasy
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
