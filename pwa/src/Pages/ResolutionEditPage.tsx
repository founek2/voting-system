import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReportForm from "../Components/ReportForm";
import {
  useAddReportMutation,
  useGetPublicReportQuery,
  useUpdateReportMutation,
} from "../endpoints/mediaReport";
import { handleError } from "../util/handleError";
import Loader from "../Components/Loader";
import { Typography } from "@mui/material";
import {
  useGetPublicResolutionQuery,
  useUpdateResolutionMutation,
} from "../endpoints/mediaResolution";

export default function ResolutionEditPage() {
  const params = useParams<{ id: string }>();
  const {
    data: resolution,
    isLoading,
    isError,
  } = useGetPublicResolutionQuery(Number(params.id));
  const [updateResolution, { isLoading: isMutation }] =
    useUpdateResolutionMutation();
  const navigate = useNavigate();

  async function onSubmit(data: { file: File; name: string }) {
    if (!resolution) return;

    const { error } = await updateResolution({
      id: resolution.id!,
      body: data,
    });
    if (error) {
      handleError(error);
    } else {
      navigate("/auth/admin/resolutions");
    }
  }

  if (isLoading) return <Loader />;
  if (isError)
    return <Typography>Nelze načíst informace o zvoleném usnesení.</Typography>;

  return (
    <ReportForm
      onSubmit={onSubmit}
      disabled={isMutation}
      title="Usnesení"
      defaultValues={resolution}
      edit
    />
  );
}
