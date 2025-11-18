import AddIcon from "@mui/icons-material/Add";
import { Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import Loader from "../Components/Loader";
import { SimpleCard } from "../Components/SimpleCard";
import { TypographyInfo } from "../Components/TypographyInfo";
import { useGetPublicResolutionsQuery } from "../endpoints/mediaResolution";

function Content() {
  const { data: resolutions, isError } = useGetPublicResolutionsQuery();

  if (isError) return <TypographyInfo>Nelze načíst data</TypographyInfo>;
  if (resolutions?.totalItems === 0)
    return <TypographyInfo>Nebyli nalezeny žádné usnesení.</TypographyInfo>;

  return (
    <>
      {resolutions ? (
        resolutions.member?.map((resolution) => (
          <Grid size={{ xs: 12, lg: 6, xl: 4 }} key={resolution["@id"]}>
            <Link to={`${resolution.id}`}>
              <SimpleCard title={resolution.name} />
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
          Usnesení
        </Typography>
        <Link to="create">
          <IconButton>
            <AddIcon fontSize="large" />
          </IconButton>
        </Link>
      </Grid>
      <Grid container size={12} spacing={2}>
        <Content />
      </Grid>
    </Grid>
  );
}

export { ErrorBoundary } from "../Components/ErrorBoundary2";
