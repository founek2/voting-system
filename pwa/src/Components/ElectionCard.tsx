import HowToVoteIcon from "@mui/icons-material/HowToVote";
import { Card, CardContent, CardHeader } from "@mui/material";
import React from "react";
import { Election } from "../types";
import { electionTitle } from "../util/electionTitle";

interface ElectionCardProps {
  election: Election;
  title?: string;
}
export function ElectionCard({ election, title }: ElectionCardProps) {
  return (
    <Card>
      <CardHeader title={title ? title : electionTitle(election)} />
      <CardContent>
        <HowToVoteIcon fontSize="large" />
      </CardContent>
    </Card>
  );
}
