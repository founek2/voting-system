import {
  Button,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Candidate_jsonld_candidate_read
} from "../endpoints/types";

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
    <>
      <Button
        size="small"
        disabled={disabled || !Boolean(poster?.contentUrl)}
        onClick={() => setOpen(true)}
      >
        {poster?.contentUrl ? t("common.actionPoster") : t("common.posterNotProvided")}
      </Button>
      <Dialog open={open} fullWidth maxWidth="md" onClose={() => setOpen(false)}>
        <DialogTitle>
          {candidate?.appUser?.firstName} {candidate?.appUser?.lastName} -{" "}
          {candidate?.position.name}
        </DialogTitle>
        <DialogContent>
          {poster?.contentUrl?.endsWith('.pdf') ? <iframe
            src={window.origin + poster?.contentUrl}
            width="100%"
            style={{ border: 0, height: "auto", aspectRatio: 7 / 8 }}
          ></iframe> : <CardMedia
            component="img"
            // height="194"
            image={window.origin + poster?.contentUrl}
            alt="Poster of candidate"
          />}
        </DialogContent>
      </Dialog>
    </>
  );
}
