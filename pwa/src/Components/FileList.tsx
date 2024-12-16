import {
  Box,
  Button,
  Grid2,
  Paper,
  Typography,
  Link,
  Grid,
} from "@mui/material";
import React from "react";
import PublicElectionStepper from "../Components/PublicElectionStepper";
import { useGetPublicElectionsQuery } from "../endpoints/elections";
import { splitElections } from "../util/splitElections";
import { head } from "../util/head";
import Loader from "../Components/Loader";
import { useGetPublicCandidatesQuery } from "../endpoints/candidates";
import { CandidateFancyCard } from "../Components/CandidateFancyCard";
import BasicInformation from "../Components/BasicInformation";
import FileButton from "../Components/FileButton";
import { useGetPublicReportsQuery } from "../endpoints/mediaReport";
import { SimpleCard } from "../Components/SimpleCard";
import { useGetPublicResolutionsQuery } from "../endpoints/mediaResolution";
import { MediaResolution_jsonld_media_read } from "../endpoints/types";
import { Hydra } from "../types";

function sortByYear([a]: [string, any], [b]: [string, any]) {
  return Number(b) - Number(a);
}

interface PublicReportPageProps {
  data: Hydra<MediaResolution_jsonld_media_read>;
}
export default function FileList({ data }: PublicReportPageProps) {
  const grouped = Object.groupBy(data.member, (item) => {
    const d = new Date(item.publishedAt!);
    return d.getFullYear();
  });

  const entries = Object.entries(grouped) as [
    string,
    MediaResolution_jsonld_media_read[]
  ][];
  entries.sort(sortByYear);

  return (
    <Grid2 size={12} container spacing={4}>
      {entries.map(([year, data]) => (
        <Grid2 size={12} key={year}>
          <Grid2>
            <Typography variant="h3" color="textPrimary">
              {year}
            </Typography>
          </Grid2>
          {data.map((resolution) => (
            <Grid2 size={{ xs: 12, lg: 6, xl: 4 }} key={resolution["@id"]}>
              <Link
                underline="none"
                target="_blank"
                href={`${resolution.contentUrl}`}
              >
                <SimpleCard title={resolution.name} />
              </Link>
            </Grid2>
          ))}
        </Grid2>
      ))}
    </Grid2>
  );
}
