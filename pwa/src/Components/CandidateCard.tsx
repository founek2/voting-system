import HowToVoteIcon from "@mui/icons-material/HowToVote";
import { Card, CardContent, CardHeader } from "@mui/material";
import React from "react";
import { Candidate } from "../types";
import { candidateTitle } from "../util/candidateTitle";

interface ElectionCardProps {
  candidate: Candidate;
  title?: string;
}
export function CandidateCard({ candidate, title }: ElectionCardProps) {
  return (
    <Card>
      <CardHeader title={title ? title : candidateTitle(candidate)} />
      <CardContent>
        <HowToVoteIcon fontSize="large" />
      </CardContent>
    </Card>
  );
}
