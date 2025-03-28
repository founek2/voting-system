import { Typography } from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Components/Loader";
import ReportForm from "../Components/ReportForm";
import {
  useDeleteResolutionMutation,
  useGetPublicResolutionQuery,
  useUpdateResolutionMutation,
} from "../endpoints/mediaResolution";
import { handleError } from "../util/handleError";
import { TypographyInfo } from "../Components/TypographyInfo";

export function Component() {
  const params = useParams<{ id: string }>();
  const {
    data: resolution,
    isLoading,
    isError,
  } = useGetPublicResolutionQuery(Number(params.id));
  const [updateResolution, { isLoading: isMutation }] =
    useUpdateResolutionMutation();
  const [deleteResolution, { isLoading: isDeleteMutation }] =
    useDeleteResolutionMutation();
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

  async function onDelete(data: { id?: number }) {
    if (!data.id) return;

    const { error } = await deleteResolution(data.id);
    if (error) {
      handleError(error);
    } else {
      navigate("/auth/admin/reports");
    }
  }

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <TypographyInfo>
        Nelze načíst informace o zvoleném usnesení.
      </TypographyInfo>
    );

  return (
    <ReportForm
      onSubmit={onSubmit}
      onDelete={onDelete}
      disabled={isMutation || isDeleteMutation}
      title="Usnesení"
      defaultValues={resolution}
      edit
    />
  );
}

export { ErrorBoundary } from "../Components/ErrorBoundary2";
