import HowToVoteIcon from "@mui/icons-material/HowToVote";
import { Card, CardContent, CardHeader } from "@mui/material";
import React from "react";
import { Election } from "../types";
import { electionTitle } from "../util/electionTitle";

interface ElectionCardProps {
  election: Election;
}
export function ElectionCard({ election }: ElectionCardProps) {
  return (
    <Card>
      <CardHeader title={electionTitle(election)} />
      <CardContent>
        <HowToVoteIcon fontSize="large" />
      </CardContent>
    </Card>
  );
}
