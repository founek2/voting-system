import HowToVoteIcon from "@mui/icons-material/HowToVote";
import { Card, CardContent, CardHeader } from "@mui/material";
import React from "react";
import type { Election } from "../endpoints/types";

interface ElectionCardProps {
  election: Election;
}
export function ElectionCard({ election }: ElectionCardProps) {
  return (
    <Card>
      <CardHeader title="10.10.2024 - 30.10.2024" />
      <CardContent>
        <HowToVoteIcon fontSize="large" />
      </CardContent>
    </Card>
  );
}
