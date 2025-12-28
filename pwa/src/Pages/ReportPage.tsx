import AddIcon from "@mui/icons-material/Add";
import { Grid2, IconButton, Typography } from "@mui/material";
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
      <TypographyInfo>Nebyly nalezeny žádné závěrečné zprávy.</TypographyInfo>
    );

  return (
    <>
      {reports ? (
        reports.member?.map((report) => (
          <Grid2 size={{ xs: 12, lg: 6, xl: 4 }} key={report["@id"]}>
            <Link to={`${report.id}`}>
              <SimpleCard title={report.name} />
            </Link>
          </Grid2>
        ))
      ) : (
        <Loader />
      )}
    </>
  );
}

export function Component() {
  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12} display="flex" alignItems="center">
        <Typography variant="h3" color="textPrimary" component="span" pr={1}>
          Závěrečné zprávy
        </Typography>
        <Link to="create">
          <IconButton>
            <AddIcon fontSize="large" />
          </IconButton>
        </Link>
      </Grid2>
      <Grid2 container size={12} spacing={4}>
        <Content />
      </Grid2>
    </Grid2>
  );
}

export { ErrorBoundary } from "../Components/ErrorBoundary2";
