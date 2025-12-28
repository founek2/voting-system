import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Link,
  Typography
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { DARK_BACKGROUND, DARK_ERROR, WINNER_COLOR } from "../Containers/ThemeProvider";
import { Candidate } from "../types";
import { PosterButton } from "./PosterButton";

function Ribbon({ candidate, isWinner, showResult }: { candidate: Candidate, isWinner: boolean, showResult?: boolean }) {
  const { t } = useTranslation()

  return <Typography
    sx={{
      position: "absolute",
      backgroundColor:
        isWinner ? WINNER_COLOR : candidate.rejectedAt ? DARK_ERROR : DARK_BACKGROUND,
      transform: "rotate(-45deg) translate(50%, 0%)",
      bottom: "6%",
      right: "17%",
      transformOrigin: "100% 0",
      textAlign: "center",
    }}
    width="100%"
  >
    {candidate.rejectedAt
      ? t("candidates.state.rejected")
      : candidate.withdrewAt
        ? t("candidates.state.withdraw")
        : showResult && isWinner
          ? t("candidates.state.elected")
          : showResult
            ? t("candidates.state.notElected")
            : null}
  </Typography>
}

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
  const { t } = useTranslation()
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
        <Ribbon candidate={candidate} isWinner={isWinner} showResult={showResult} />
      ) : null}
      <CardHeader title={candidate.position.name} />
      <CardMedia
        sx={{ height: 140 }}
        image={candidate.appUser?.photoSmallUrl && !candidate.appUser.photoSmallUrl.startsWith('https://static.is.sh.cvut.cz') ? candidate.appUser?.photoSmallUrl : '/assets/bag_on_head_white.jpg'}
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
