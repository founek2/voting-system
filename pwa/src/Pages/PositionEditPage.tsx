import { enqueueSnackbar } from "notistack";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Components/Loader";
import PositionForm from "../Components/PositionForm";
import { TypographyInfo } from "../Components/TypographyInfo";
import {
  useGetPositionQuery,
  useUpdatePositionMutation,
} from "../endpoints/positions";
import { Position_jsonld_position_write } from "../endpoints/types";

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
    return (
      <TypographyInfo>Nelze načíst informace o zvolené volbě.</TypographyInfo>
    );

  return (
    <PositionForm
      onSubmit={onSubmit}
      defaultValues={position}
      disabled={isMutation}
    />
  );
}
