import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import React from "react";
import { Position } from "../types";

interface PositionCardProps {
  position: Position;
}
export function PositionCard({ position }: PositionCardProps) {
  return (
    <Card>
      <CardHeader title={position.name} />
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <EmojiPeopleIcon fontSize="large" />
        {position.description ? (
          <Typography variant="body2">{position.description}</Typography>
        ) : null}
      </CardContent>
    </Card>
  );
}
