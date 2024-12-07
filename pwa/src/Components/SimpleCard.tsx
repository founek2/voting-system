import HowToVoteIcon from "@mui/icons-material/HowToVote";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  Link,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Candidate } from "../types";
import { candidateTitle } from "../util/candidateTitle";
import {
  Candidate_jsonld_candidate_read,
  MediaPoster_jsonld_candidate_read,
} from "../endpoints/types";

interface SimpleCardProps {
  title?: string;
}
export function SimpleCard({ title }: SimpleCardProps) {
  return (
    <Card>
      <CardHeader title={title} />
    </Card>
  );
}
