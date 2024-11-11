import { enqueueSnackbar } from "notistack";
import React from "react";
import ElectionForm from "../Components/ElectionForm";
import {
  useAddElectionMutation,
  useGetElectionQuery,
} from "../endpoints/elections";
import {
  Candidate_candidate_edit,
  Candidate_candidate_write,
  Election_election_write,
} from "../endpoints/types";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddCandidateMutation,
  useGetCandidateQuery,
  useUpdateCandidateMutation,
} from "../endpoints/candidates";
import { useAppSelector } from "../hooks/app";
import CandidateForm from "../Components/CandidateForm";
import Loader from "../Components/Loader";
import { Typography } from "@mui/material";
import { parseId } from "../util/parseId";
import { handleError } from "../util/handleError";

export default function CandidateEditPage() {
  const params = useParams<{ id: string }>();
  const {
    data: candidate,
    isLoading: loadingCandidate,
    isError: errorCandidate,
  } = useGetCandidateQuery(Number(params.id!));
  const {
    data: election,
    isLoading: isLoading,
    isError,
  } = useGetElectionQuery(parseId(candidate?.election)!, {
    skip: !candidate?.election,
  });
  const [updateCandidate, { isLoading: isMutation }] =
    useUpdateCandidateMutation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.authorization.currentUser);

  async function onSubmit(data: Candidate_candidate_edit) {
    const { error } = await updateCandidate({
      userId: user?.id!,
      id: candidate?.id!,
      body: data,
    });
    if (error) handleError(error);
    else {
      enqueueSnackbar("Aktualizováno");
      navigate("/auth/user");
    }
  }

  if (isLoading || loadingCandidate) return <Loader />;
  if (isError || errorCandidate) return <Typography>Nastala chyba</Typography>;

  return (
    <CandidateForm
      onSubmit={onSubmit}
      disabled={isMutation}
      election={election!}
      defaultValues={candidate}
      edit
    />
  );
}
