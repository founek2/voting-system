import { Grid, Typography } from "@mui/material";
import React from "react";
import FileList from "../Components/FileList";
import Loader from "../Components/Loader";
import { useGetPublicResolutionsQuery } from "../endpoints/mediaResolution";
import { TypographyInfo } from "../Components/TypographyInfo";

export default function PublicReportPage() {
  const { data, isLoading, error } = useGetPublicResolutionsQuery();

  if (isLoading) return <Loader />;
  if (error || !data)
    return (
      <TypographyInfo>Nelze načíst usnesení volební komise.</TypographyInfo>
    );

  return (
    <Grid container spacing={4}>
      <Grid container justifyContent="center" spacing={4} size={12}>
        <Grid size={12}>
          <Typography variant="h3" color="primary" textAlign="center">
            Usnesení volební komise
          </Typography>
        </Grid>
        <FileList data={data} />
      </Grid>
    </Grid>
  );
}
