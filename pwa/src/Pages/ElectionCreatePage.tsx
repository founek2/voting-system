import { enqueueSnackbar } from "notistack";
import React from "react";
import ElectionForm from "../Components/ElectionForm";
import { useAddElectionMutation } from "../endpoints/elections";
import { Election_election_write } from "../endpoints/types";
import { useNavigate } from "react-router-dom";

export default function ElectionCreatePage() {
  const [createElection, { isLoading: isMutation }] = useAddElectionMutation();
  const navigate = useNavigate();

  async function onSubmit(data: Election_election_write) {
    const { error } = await createElection(data);
    if (error) enqueueSnackbar({ variant: "error", message: "Nastala chyba" });
    else {
      enqueueSnackbar("Přidáno");
      navigate(-1);
    }
  }

  return <ElectionForm onSubmit={onSubmit} disabled={isMutation} />;
}
