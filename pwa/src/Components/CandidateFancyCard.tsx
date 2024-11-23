import HowToVoteIcon from "@mui/icons-material/HowToVote";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
  Link,
} from "@mui/material";
import React from "react";
import { Candidate } from "../types";
import { candidateTitle } from "../util/candidateTitle";
// import { Link } from "react-router-dom";

interface ElectionCardProps {
  candidate: Candidate;
  title?: string;
}
export function CandidateFancyCard({ candidate, title }: ElectionCardProps) {
  return (
    <Card>
      <CardHeader title={candidate.position.name} />
      <CardMedia
        sx={{ height: 140 }}
        image={candidate.appUser?.photoSmallUrl || undefined}
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {candidate.appUser?.firstName} {candidate.appUser?.lastName}
        </Typography>
        <Link
          href={`https://is.sh.cvut.cz/users/${candidate.appUser?.id}`}
          target="_blank"
          underline="none"
        >
          <Typography variant="body1" component="div" color="textSecondary">
            UID: {candidate.appUser?.id}
          </Typography>
        </Link>
      </CardContent>
      <CardActions>
        {candidate.poster?.contentUrl ? (
          <Link
            href={window.origin + candidate.poster?.contentUrl}
            target="_blank"
          >
            <Button size="small">Plakát</Button>
          </Link>
        ) : null}
      </CardActions>
    </Card>
  );
}
