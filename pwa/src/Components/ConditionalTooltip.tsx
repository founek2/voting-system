import React from "react";
import { Tooltip } from "@mui/material";

export function ConditionalTooltip({
  disabled,
  children,
  title,
}: {
  disabled?: boolean;
  children: JSX.Element;
  title?: string;
}) {
  if (disabled) return children;

  return <Tooltip title={title}>{children}</Tooltip>;
}
