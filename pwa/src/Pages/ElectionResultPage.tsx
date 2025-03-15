import { Breadcrumbs, Grid2, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { TypographyInfo } from "../Components/TypographyInfo";
import { useGetElectionQuery } from "../endpoints/elections";
import { electionTitle } from "../util/electionTitle";
import { BallotResultList } from "./ElectionResultPage/BallotResultList";
import { ElectronicResultList } from "./ElectionResultPage/ElectronicResultList";
import { TotalResultList } from "./ElectionResultPage/TotalResultList";

const breadcrumbs = [
  {
    label: "Elektronické",
    href: "#electronic",
    current: false,
  },
  {
    label: "Urnové",
    href: "#ballot",
    current: false,
  },
  {
    label: "Celkové",
    href: "",
    current: true,
  },
];

function BreadcrumItem({ label, href, current }: any) {
  if (current) {
    return <Typography color="textPrimary">{label}</Typography>;
  }

  return (
    <Link to={{ hash: href }}>
      <Typography>{label}</Typography>
    </Link>
  );
}

export default function ElectionResultPage() {
  const params = useParams<{ id: string }>();
  const location = useLocation();

  const {
    data: election,
    isLoading,
    isError,
  } = useGetElectionQuery(Number(params.id));

  if (isError || !election)
    return (
      <TypographyInfo>Nelze načíst informace o zvolené volbě.</TypographyInfo>
    );

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12} display="flex" alignItems="center">
        <Typography variant="h3" color="textPrimary" component="span" pr={1}>
          Výsledek volby {electionTitle(election)}
        </Typography>
      </Grid2>
      <Box display="flex" justifyContent="center" width="100%">
        <Breadcrumbs aria-label="breadcrumb">
          {breadcrumbs.map((breadcrumb) => (
            <BreadcrumItem
              key={breadcrumb.href}
              {...breadcrumb}
              current={breadcrumb.href == location.hash}
            />
          ))}
        </Breadcrumbs>
      </Box>
      {location.hash === "#electronic" ? (
        <ElectronicResultList election={election} />
      ) : null}
      {location.hash === "#ballot" ? (
        <BallotResultList election={election} />
      ) : null}
      {location.hash === "" ? <TotalResultList election={election} /> : null}
    </Grid2>
  );
}
