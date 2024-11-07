import { enqueueSnackbar } from "notistack";
import React from "react";
import ElectionForm from "../Components/ElectionForm";
import { useAddElectionMutation } from "../endpoints/elections";
import {
  Election_election_write,
  Position_jsonld_position_write,
} from "../endpoints/types";
import { useNavigate } from "react-router-dom";
import { useAddPositionMutation } from "../endpoints/positions";
import PositionForm from "../Components/PositionForm";

export default function PositionCreatePage() {
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
