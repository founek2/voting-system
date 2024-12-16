import React from "react";
import { useNavigate } from "react-router-dom";
import ReportForm from "../Components/ReportForm";
import { useAddResolutionMutation } from "../endpoints/mediaResolution";
import { handleError } from "../util/handleError";

export default function ResolutionCreatePage() {
  const [createResolution, { isLoading: isMutation }] =
    useAddResolutionMutation();
  const navigate = useNavigate();

  async function onSubmit(data: {
    file: File;
    name: string;
    publishedAt: string;
  }) {
    const { error } = await createResolution(data);
    if (error) {
      handleError(error);
    } else {
      navigate("/auth/admin/resolutions");
    }
  }

  return (
    <ReportForm onSubmit={onSubmit} disabled={isMutation} title="Usnesení" />
  );
}
