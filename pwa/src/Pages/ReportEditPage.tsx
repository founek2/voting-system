import { Typography } from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Components/Loader";
import ReportForm from "../Components/ReportForm";
import {
  useGetPublicReportQuery,
  useUpdateReportMutation,
} from "../endpoints/mediaReport";
import { handleError } from "../util/handleError";

export default function ReportEditPage() {
  const params = useParams<{ id: string }>();
  const {
    data: report,
    isLoading,
    isError,
  } = useGetPublicReportQuery(Number(params.id));
  const [updateReport, { isLoading: isMutation }] = useUpdateReportMutation();
  const navigate = useNavigate();

  async function onSubmit(data: {
    file: File;
    name: string;
    publishedAt: string;
  }) {
    if (!report) return;

    const { error } = await updateReport({ id: report.id!, body: data });
    if (error) {
      handleError(error);
    } else {
      navigate("/auth/admin/reports");
    }
  }

  if (isLoading) return <Loader />;
  if (isError)
    return <Typography>Nelze načíst informace o zvolené zprávě.</Typography>;

  return (
    <ReportForm
      onSubmit={onSubmit}
      disabled={isMutation}
      title="Závěrečná zpráva"
      defaultValues={report}
      edit
    />
  );
}
