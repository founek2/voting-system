import { enqueueSnackbar } from "notistack";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import BoardMemberForm from "../Components/BoardMemberForm";
import Loader from "../Components/Loader";
import { TypographyInfo } from "../Components/TypographyInfo";
import {
  useDeleteBoardMemberMutation,
  useGetBoardMemberQuery,
  useUpdateBoardMemberMutation,
} from "../endpoints/board";
import { BoardMember_jsonld_member_write } from "../endpoints/types";
import { handleError } from "../util/handleError";

export function Component() {
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
  if (isError) return <TypographyInfo>Nastala chyba</TypographyInfo>;

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

export { ErrorBoundary } from "../Components/ErrorBoundary2";
