import { Alert } from "@mui/material";
import React from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

interface ElectionCardProps<T extends FieldValues> {
  errors: FieldErrors<T>;
}
export function FormStatus<T extends FieldValues>({
  errors,
}: ElectionCardProps<T>) {
  const [path, params] = Object.entries(errors).slice(0, 1)?.[0] || [];
  if (!path) return null;

  if (params?.type == "required")
    return <Alert severity="warning">Pole {path} je povinné</Alert>;

  return <Alert severity="error">Pole {path} není validní</Alert>;
}
