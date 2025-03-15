import { enqueueSnackbar } from "notistack";
import React from "react";
import { useNavigate } from "react-router-dom";
import PositionForm from "../Components/PositionForm";
import { useAddPositionMutation } from "../endpoints/positions";
import { Position_jsonld_position_write } from "../endpoints/types";

export function Component() {
  const [createPosition, { isLoading: isMutation }] = useAddPositionMutation();
  const navigate = useNavigate();

  async function onSubmit(data: Position_jsonld_position_write) {
    const { error } = await createPosition(data);
    if (error) enqueueSnackbar({ variant: "error", message: "Nastala chyba" });
    else {
      enqueueSnackbar("Přidáno");
      navigate(-1);
    }
  }

  return <PositionForm onSubmit={onSubmit} disabled={isMutation} />;
}

export { ErrorBoundary } from "../Components/ErrorBoundary2";
