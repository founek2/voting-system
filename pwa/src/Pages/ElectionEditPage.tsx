import { Grid2 } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ElectionEmailsForm } from "../Components/ElectionEmails.Form";
import ElectionForm from "../Components/ElectionForm";
import Loader from "../Components/Loader";
import { TypographyInfo } from "../Components/TypographyInfo";
import {
  useGetElectionQuery,
  useUpdateElectionMutation,
} from "../endpoints/elections";
import { useSendAllNotificationMutation, useSendSingleNotificationMutation } from "../endpoints/emails";
import { Election_election_write } from "../endpoints/types";

export function Component() {
  const params = useParams<{ id: string }>();
  const {
    data: election,
    isLoading,
    isError,
  } = useGetElectionQuery(Number(params.id));
  const [updateElection, { isLoading: isMutation }] =
    useUpdateElectionMutation();
  const [sendSignle, { isLoading: isLoadingSingle }] = useSendSingleNotificationMutation()
  const [sendAll, { isLoading: isLoadingAll }] = useSendAllNotificationMutation()
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

  async function onSingle(emailAddress: string) {
    if (!election?.id) return;

    const { error } = await sendSignle({ electionId: election.id, emailAddress })
    if (error) enqueueSnackbar({ variant: "error", message: "Nastala chyba" });
    else {
      enqueueSnackbar("Odesláno");
    }
  }

  async function onSendAll() {
    if (!election?.id) return;

    const { error } = await sendAll(election.id)
    if (error) enqueueSnackbar({ variant: "error", message: "Nastala chyba" });
    else {
      enqueueSnackbar("Odesláno");
    }
  }

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <TypographyInfo>Nelze načíst informace o zvolené volbě.</TypographyInfo>
    );

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12, md: 6 }}>
        <ElectionForm
          defaultValues={election}
          onSubmit={onSubmit}
          disabled={isMutation}
        />
      </Grid2>
      <Grid2 size={{ xs: 12, md: 6 }}>
        <ElectionEmailsForm
          onSendAll={onSendAll}
          onSendSingle={onSingle}
          disabled={isLoadingSingle || isLoadingAll}
        />
      </Grid2>
    </Grid2>
  );
}

export { ErrorBoundary } from "../Components/ErrorBoundary2";
