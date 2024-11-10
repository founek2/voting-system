import { enqueueSnackbar } from "notistack";
import React from "react";
import ElectionForm from "../Components/ElectionForm";
import {
  useAddElectionMutation,
  useGetElectionQuery,
} from "../endpoints/elections";
import {
  Candidate_candidate_write,
  Election_election_write,
} from "../endpoints/types";
import { useNavigate, useParams } from "react-router-dom";
import { useAddCandidateMutation } from "../endpoints/candidates";
import { useAppSelector } from "../hooks/app";
import CandidateForm from "../Components/CandidateForm";
import Loader from "../Components/Loader";
import { Typography } from "@mui/material";
import { handleError } from "../util/handleError";

export default function CandidateCreatePage() {
  const params = useParams<{ electionId: string }>();
  const {
    data: election,
    isLoading: isLoading,
    isError,
  } = useGetElectionQuery(Number(params.electionId!));
  const [createCandidate, { isLoading: isMutation }] =
    useAddCandidateMutation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.authorization.currentUser);

  async function onSubmit(data: Candidate_candidate_write) {
    const { error } = await createCandidate({ userId: user?.id!, body: data });
    if (error) {
      handleError(error);
    } else {
      navigate("/auth/user");
    }
  }

  if (isLoading) return <Loader />;
  if (isError) return <Typography>Nastala chyba</Typography>;

  return (
    <CandidateForm
      onSubmit={onSubmit}
      disabled={isMutation}
      election={election!}
    />
  );
}
