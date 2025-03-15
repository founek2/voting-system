import { enqueueSnackbar } from "notistack";
import React, { lazy, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Components/Loader";
import { TypographyInfo } from "../Components/TypographyInfo";
import {
  useGetElectionQuery,
  useUpdateElectionMutation,
} from "../endpoints/elections";
import { Election_election_write } from "../endpoints/types";
import ElectionForm from "../Components/ElectionForm";

export default function Component() {
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
      defaultValues={election}
      onSubmit={onSubmit}
      disabled={isMutation}
    />
  );
}

export { ErrorBoundary } from "../Components/ErrorBoundary2";
