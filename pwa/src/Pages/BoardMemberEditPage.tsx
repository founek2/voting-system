import { enqueueSnackbar } from "notistack";
import React from "react";
import ElectionForm from "../Components/ElectionForm";
import {
  useAddElectionMutation,
  useGetElectionQuery,
} from "../endpoints/elections";
import {
  BoardMember_jsonld_member_write,
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
import {
  useDeleteBoardMemberMutation,
  useGetBoardMemberQuery,
  useUpdateBoardMemberMutation,
} from "../endpoints/board";
import BoardMemberForm from "../Components/BoardMemberForm";

export default function BoardMemberEditPage() {
  const params = useParams<{ id: string }>();
  const {
    data: member,
    isLoading,
    isError,
  } = useGetBoardMemberQuery(Number(params.id!));
  const [updateMember, { isLoading: isLoadingUpdate }] =
    useUpdateBoardMemberMutation();
  const [deleteMember, { isLoading: isLoadingDelete }] =
    useDeleteBoardMemberMutation();
  const navigate = useNavigate();
  const isLoadingMutation = isLoadingUpdate || isLoading || isLoadingDelete;

  async function onSubmit(data: BoardMember_jsonld_member_write) {
    const { error } = await updateMember({
      id: member?.id!,
      body: data,
    });
    if (error) handleError(error);
    else {
      enqueueSnackbar("Aktualizováno");
      navigate("/auth/admin/board");
    }
  }
  async function onDelete() {
    const { error } = await deleteMember(member?.id!);
    if (error) handleError(error);
    else {
      enqueueSnackbar("Odstraněno");
      navigate("/auth/admin/board");
    }
  }

  if (isLoading) return <Loader />;
  if (isError) return <Typography>Nastala chyba</Typography>;

  return (
    <BoardMemberForm
      onSubmit={onSubmit}
      disabled={isLoadingMutation}
      defaultValues={{
        appUser: member?.appUser,
        position: member?.position,
      }}
      onDelete={onDelete}
    />
  );
}
