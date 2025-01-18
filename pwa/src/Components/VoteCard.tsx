import HowToVoteIcon from "@mui/icons-material/HowToVote";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Link,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import React from "react";
import { Candidate } from "../types";
import { candidateTitle } from "../util/candidateTitle";
import { PosterButton } from "./PosterButton";
import { Vote_jsonld_vote_read } from "../endpoints/types";
import { voteTitle } from "../util/voteTitle";

interface VoteCardProps {
  vote: Vote_jsonld_vote_read;
  title?: string;
  children?: JSX.Element | JSX.Element[] | null;
  sx?: SxProps<Theme>;
  zone: string;
}
export function VoteCard({ vote, title, children, sx, zone }: VoteCardProps) {
  return (
    <Card
      sx={[
        {
          minWidth: 250,
          opacity: vote.invalidatedAt ? 0.6 : undefined,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <CardHeader title={title ? title : voteTitle(vote)} />
      <CardContent sx={{ py: 0 }}>
        <Link
          href={`https://is.sh.cvut.cz/users/${vote.appUser?.id}`}
          target="_blank"
          underline="none"
        >
          <Typography>UID: {vote.appUser?.id}</Typography>
        </Link>
        <Typography>Oblast: {zone}</Typography>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "center" }}>
        {children}
      </CardActions>
    </Card>
  );
}
