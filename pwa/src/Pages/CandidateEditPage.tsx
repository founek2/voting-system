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
  useWithdrawCandidateMutation,
} from "../endpoints/candidates";
import { useAppSelector } from "../hooks/app";
import CandidateForm from "../Components/CandidateForm";
import Loader from "../Components/Loader";
import { Typography } from "@mui/material";
import { parseId } from "../util/parseId";
import { handleError } from "../util/handleError";
import { TypographyInfo } from "../Components/TypographyInfo";

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
  const [updateCandidate, { isLoading: isLoadingUpdate }] =
    useUpdateCandidateMutation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.authorization.currentUser);
  const [withdraw, { isLoading: isLoadingWithdraw }] =
    useWithdrawCandidateMutation();
  const isLoadingMutation = isLoadingUpdate || isLoadingWithdraw;

  async function onSubmit(data: Candidate_candidate_edit) {
    const { error } = await updateCandidate({
      id: candidate?.id!,
      body: data,
    });
    if (error) handleError(error);
    else {
      enqueueSnackbar("Aktualizováno");
      navigate("/auth/user");
    }
  }

  async function handleWithdraw() {
    if (!candidate?.id) return;

    const result = await withdraw(Number(candidate.id));
    if (result.error) {
      handleError(result.error);
    } else {
      enqueueSnackbar("Kandidátka zrušena");
      navigate("/auth/user");
    }
  }

  if (isLoading || loadingCandidate) return <Loader />;
  if (isError || errorCandidate)
    return <TypographyInfo>Nastala chyba</TypographyInfo>;

  return (
    <CandidateForm
      onSubmit={onSubmit}
      onWithdraw={handleWithdraw}
      disabled={isLoadingMutation || Boolean(candidate?.withdrewAt)}
      election={election!}
      defaultValues={candidate}
      edit
    />
  );
}
