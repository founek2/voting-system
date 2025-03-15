import React from "react";
import { useNavigate } from "react-router-dom";
import ReportForm from "../Components/ReportForm";
import { useAddReportMutation } from "../endpoints/mediaReport";
import { handleError } from "../util/handleError";

export function Component() {
  const [createReport, { isLoading: isMutation }] = useAddReportMutation();
  const navigate = useNavigate();

  async function onSubmit(data: {
    file: File;
    name: string;
    publishedAt: string;
  }) {
    const { error } = await createReport(data);
    if (error) {
      handleError(error);
    } else {
      navigate("/auth/admin/reports");
    }
  }

  return (
    <ReportForm
      onSubmit={onSubmit}
      disabled={isMutation}
      title="Závěrečná zpráva"
    />
  );
}

export { ErrorBoundary } from "../Components/ErrorBoundary2";
