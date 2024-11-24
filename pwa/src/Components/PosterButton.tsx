import HowToVoteIcon from "@mui/icons-material/HowToVote";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Link,
  Typography,
} from "@mui/material";
import React from "react";
import { Candidate } from "../types";
import { candidateTitle } from "../util/candidateTitle";
import { MediaPoster_jsonld_candidate_read } from "../endpoints/types";

interface ElectionCardProps {
  poster: MediaPoster_jsonld_candidate_read | null | undefined;
  disabled?: boolean;
  children?: JSX.Element | JSX.Element[] | null;
}
export function PosterButton({ poster, disabled }: ElectionCardProps) {
  return (
    <Link href={window.origin + poster?.contentUrl} target="_blank">
      <Button size="small" disabled={disabled || !Boolean(poster?.contentUrl)}>
        {poster?.contentUrl ? "Plakát" : "Plakát neuveden"}
      </Button>
    </Link>
  );
}
