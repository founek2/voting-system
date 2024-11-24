import HowToVoteIcon from "@mui/icons-material/HowToVote";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import React from "react";
import { Candidate } from "../types";
import { candidateTitle } from "../util/candidateTitle";
import { PosterButton } from "./PosterButton";

interface ElectionCardProps {
  candidate: Candidate;
  title?: string;
  children?: JSX.Element | JSX.Element[] | null;
}
export function CandidateVoteCard({
  candidate,
  title,
  children,
}: ElectionCardProps) {
  return (
    <Card
      sx={{ minWidth: 250, opacity: candidate.withdrewAt ? 0.6 : undefined }}
    >
      <CardHeader title={title ? title : candidateTitle(candidate)} />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {candidate.appUser?.firstName} {candidate.appUser?.lastName}
        </Typography>
        <Typography>UID: {candidate.appUser?.id}</Typography>
        <PosterButton candidate={candidate} />
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "center" }}>
        {children}
      </CardActions>
    </Card>
  );
}
