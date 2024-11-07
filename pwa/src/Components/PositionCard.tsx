import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import { Card, CardContent, CardHeader } from "@mui/material";
import React from "react";
import { Position } from "../types";

interface PositionCardProps {
  position: Position;
}
export function PositionCard({ position }: PositionCardProps) {
  return (
    <Card>
      <CardHeader title={position.name} />
      <CardContent>
        <EmojiPeopleIcon fontSize="large" />
      </CardContent>
    </Card>
  );
}
