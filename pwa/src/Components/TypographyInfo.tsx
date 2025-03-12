import React from "react";
import { Typography } from "@mui/material";

interface TypographyInfoProps {
  children: JSX.Element | string;
}
export function TypographyInfo({ children }: TypographyInfoProps) {
  return <Typography color="textSecondary">{children}</Typography>;
}
