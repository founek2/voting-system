import { Button, Grid2, Typography } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { FormStatus } from "../Components/FormStatus";
import { MyDatePicker } from "../Components/MyDatePicker";
import { Election } from "../endpoints/types";
import ElectionForm from "../Components/ElectionForm";
import { useGetElectionQuery } from "../endpoints/elections";
import Loader from "../Components/Loader";

export default function ElectionEditPage() {
  const params = useParams<{ id: string }>();
  const {
    data: election,
    isLoading,
    isError,
  } = useGetElectionQuery(Number(params.id));

  function onSubmit(data: Election) {
    console.log(data);
  }

  if (isLoading) return <Loader />;
  if (isError)
    return <Typography>Nelze načíst informace o zvolené volbě.</Typography>;
  return <ElectionForm onSubmit={onSubmit} defaultValues={election} />;
}
