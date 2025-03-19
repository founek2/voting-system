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
import { DARK_BACKGROUND, WINNER_COLOR } from "../Containers/ThemeProvider";
import { PosterButton } from "./PosterButton";
import CrownIcon from "./assets/crown.svg";
import { Box } from "@mui/system";

interface ElectionCardProps {
  candidate: Candidate;
  children?: JSX.Element | JSX.Element[];
  showResult?: boolean;
}
export function CandidateFancyCard({
  candidate,
  children,
  showResult,
}: ElectionCardProps) {
  const fullName = `${candidate.appUser?.firstName} ${candidate.appUser?.lastName}`;
  const disabled = candidate.withdrewAt || candidate.rejectedAt;
  const isWinner = Boolean(candidate.winnerMarkedAt);

  return (
    <Card
      sx={{
        overflow: "hidden",
        position: "relative",
        opacity: disabled ? 0.7 : undefined,
        height: "100%",
      }}
    >
      {disabled || showResult ? (
        <Typography
          sx={{
            position: "absolute",
            backgroundColor:
              showResult && isWinner ? WINNER_COLOR : DARK_BACKGROUND,
            transform: "rotate(50deg) translate(50%, 0%)",
            top: "8.5%",
            right: "8%",
            transformOrigin: "100% 0",
            textAlign: "center",
          }}
          width="100%"
        >
          {candidate.rejectedAt
            ? "Zamítnut"
            : candidate.withdrewAt
            ? "Odstoupil"
            : showResult && isWinner
            ? "Zvolen"
            : showResult
            ? "Nezvolen"
            : null}
        </Typography>
      ) : null}
      <CardHeader title={candidate.position.name} />
      <CardMedia
        sx={{ height: 140 }}
        image={candidate.appUser?.photoSmallUrl || undefined}
        title={fullName}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {fullName}
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
        {children}
      </CardContent>
      <CardActions>
        <PosterButton candidate={candidate} />
      </CardActions>
    </Card>
  );
}
