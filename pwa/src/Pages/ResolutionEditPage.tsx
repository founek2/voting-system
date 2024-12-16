import { Typography } from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Components/Loader";
import ReportForm from "../Components/ReportForm";
import {
  useGetPublicResolutionQuery,
  useUpdateResolutionMutation,
} from "../endpoints/mediaResolution";
import { handleError } from "../util/handleError";

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

  async function onSubmit(data: {
    file: File;
    name: string;
    publishedAt: string;
  }) {
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
