import React from "react";
import { useNavigate } from "react-router-dom";
import ReportForm from "../Components/ReportForm";
import { useAddResolutionMutation } from "../endpoints/mediaResolution";
import { handleError } from "../util/handleError";
import { useAddBoardMemberMutation } from "../endpoints/board";
import { BoardMember_jsonld_member_write } from "../endpoints/types";
import BoardMemberForm from "../Components/BoardMemberForm";

export default function BoardMemberCreatePage() {
  const [createBoardMember, { isLoading: isMutation }] =
    useAddBoardMemberMutation();
  const navigate = useNavigate();

  async function onSubmit(data: BoardMember_jsonld_member_write) {
    const { error } = await createBoardMember(data);
    if (error) {
      handleError(error);
    } else {
      navigate("/auth/admin/board");
    }
  }

  return <BoardMemberForm onSubmit={onSubmit} disabled={isMutation} />;
}
