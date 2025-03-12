import { Button, Grid2, Typography } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { FormStatus } from "../Components/FormStatus";
import { MyDatePicker } from "../Components/MyDatePicker";
import { Election } from "../types";
import ElectionForm from "../Components/ElectionForm";
import {
  useGetElectionQuery,
  useUpdateElectionMutation,
} from "../endpoints/elections";
import Loader from "../Components/Loader";
import { Election_election_write } from "../endpoints/types";
import { enqueueSnackbar } from "notistack";
import { TypographyInfo } from "../Components/TypographyInfo";

export default function ElectionEditPage() {
  const params = useParams<{ id: string }>();
  const {
    data: election,
    isLoading,
    isError,
  } = useGetElectionQuery(Number(params.id));
  const [updateElection, { isLoading: isMutation }] =
    useUpdateElectionMutation();
  const navigate = useNavigate();

  async function onSubmit(data: Election_election_write) {
    const { error } = await updateElection({
      id: Number(params.id!),
      body: data,
    });
    if (error) enqueueSnackbar({ variant: "error", message: "Nastala chyba" });
    else {
      enqueueSnackbar("Přidáno");
      navigate(-1);
    }
  }

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <TypographyInfo>Nelze načíst informace o zvolené volbě.</TypographyInfo>
    );

  return (
    <ElectionForm
      onSubmit={onSubmit}
      defaultValues={election}
      disabled={isMutation}
    />
  );
}
