import { enqueueSnackbar } from "notistack";
import React from "react";
import ElectionForm from "../Components/ElectionForm";
import { useAddElectionMutation } from "../endpoints/elections";
import {
  Election_election_write,
  Position_jsonld_position_write,
} from "../endpoints/types";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddPositionMutation,
  useGetPositionQuery,
  useGetPositionsQuery,
  useUpdatePositionMutation,
} from "../endpoints/positions";
import PositionForm from "../Components/PositionForm";
import Loader from "../Components/Loader";
import { Typography } from "@mui/material";

export default function PositionEditPage() {
  const params = useParams<{ id: string }>();
  const {
    data: position,
    isLoading,
    isError,
  } = useGetPositionQuery(Number(params.id));
  const [updatePosition, { isLoading: isMutation }] =
    useUpdatePositionMutation();
  const navigate = useNavigate();

  async function onSubmit(data: Position_jsonld_position_write) {
    const { error } = await updatePosition({
      id: Number(params.id!),
      body: data,
    });
    if (error) enqueueSnackbar({ variant: "error", message: "Nastala chyba" });
    else {
      enqueueSnackbar("Aktualizováno");
      navigate(-1);
    }
  }

  if (isLoading) return <Loader />;
  if (isError)
    return <Typography>Nelze načíst informace o zvolené volbě.</Typography>;

  return (
    <PositionForm
      onSubmit={onSubmit}
      defaultValues={position}
      disabled={isMutation}
    />
  );
}
