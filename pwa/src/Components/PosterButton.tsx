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
import { useTranslation } from "react-i18next";

interface ElectionCardProps {
  candidate: Candidate_jsonld_candidate_read | null | undefined;
  disabled?: boolean;
  children?: JSX.Element | JSX.Element[] | null;
}
export function PosterButton({ candidate, disabled }: ElectionCardProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false);
  const poster = candidate?.poster;

  return (
    // <Link href={window.origin + poster?.contentUrl} target="_blank">
    // </Link>
    <>
      <Button
        size="small"
        disabled={disabled || !Boolean(poster?.contentUrl)}
        onClick={() => setOpen(true)}
      >
        {poster?.contentUrl ? t("common.actionPoster") : t("common.posterNotProvided")}
      </Button>
      <Dialog open={open} fullWidth onClose={() => setOpen(false)}>
        <DialogTitle>
          {candidate?.appUser?.firstName} {candidate?.appUser?.lastName} -{" "}
          {candidate?.position.name}
        </DialogTitle>
        <DialogContent>
          <iframe
            src={window.origin + poster?.contentUrl}
            width="100%"
            style={{ border: 0, height: "auto", aspectRatio: 8.5 / 8 }}
          ></iframe>
        </DialogContent>
      </Dialog>
    </>
  );
}
