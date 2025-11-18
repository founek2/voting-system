import AddIcon from "@mui/icons-material/Add";
import { Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import Loader from "../Components/Loader";
import { SimpleCard } from "../Components/SimpleCard";
import { useGetPublicReportsQuery } from "../endpoints/mediaReport";
import { TypographyInfo } from "../Components/TypographyInfo";

function Content() {
  const { data: reports, isError } = useGetPublicReportsQuery();

  if (isError) return <TypographyInfo>Nelze načíst data</TypographyInfo>;
  if (reports?.totalItems === 0)
    return (
      <TypographyInfo>Nebyli nalezeny žádné závěrečné zprávy.</TypographyInfo>
    );

  return (
    <>
      {reports ? (
        reports.member?.map((report) => (
          <Grid size={{ xs: 12, lg: 6, xl: 4 }} key={report["@id"]}>
            <Link to={`${report.id}`}>
              <SimpleCard title={report.name} />
            </Link>
          </Grid>
        ))
      ) : (
        <Loader />
      )}
    </>
  );
}

export function Component() {
  return (
    <Grid container spacing={2}>
      <Grid size={12} display="flex" alignItems="center">
        <Typography variant="h3" color="textPrimary" component="span" pr={1}>
          Závěrečné zprávy
        </Typography>
        <Link to="create">
          <IconButton>
            <AddIcon fontSize="large" />
          </IconButton>
        </Link>
      </Grid>
      <Grid container size={12} spacing={4}>
        <Content />
      </Grid>
    </Grid>
  );
}

export { ErrorBoundary } from "../Components/ErrorBoundary2";
