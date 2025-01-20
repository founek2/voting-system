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
import { DARK_BACKGROUND } from "../Containers/ThemeProvider";
import { PosterButton } from "./PosterButton";

interface ElectionCardProps {
  candidate: Candidate;
  children?: JSX.Element | JSX.Element[];
}
export function CandidateFancyCard({ candidate, children }: ElectionCardProps) {
  return (
    <Card
      sx={{
        overflow: "hidden",
        position: "relative",
        opacity: candidate.withdrewAt ? 0.7 : undefined,
        height: "100%",
      }}
    >
      {candidate.withdrewAt ? (
        <Typography
          sx={{
            position: "absolute",
            backgroundColor: DARK_BACKGROUND,
            transform: "rotate(50deg) translate(50%, 0%)",
            top: "7%",
            right: "10%",
            transformOrigin: "100% 0",
            textAlign: "center",
          }}
          width="100%"
        >
          Odstoupil
        </Typography>
      ) : null}
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
        {children}
      </CardContent>
      <CardActions>
        <PosterButton candidate={candidate} />
      </CardActions>
    </Card>
  );
}
