import {
  Grid,
  Link,
  Typography
} from "@mui/material";
import React from "react";
import { SimpleCard } from "../Components/SimpleCard";
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
    <Grid size={12} container spacing={4}>
      {entries.map(([year, data]) => (
        <Grid size={12} key={year}>
          <Grid>
            <Typography variant="h3" color="textPrimary">
              {year}
            </Typography>
          </Grid>
          <Grid container spacing={2}>
            {data.map((resolution) => (
              <Grid size={{ xs: 12, lg: 6, xl: 4 }} key={resolution["@id"]}>
                <Link
                  underline="none"
                  target="_blank"
                  href={`${resolution.contentUrl}`}
                >
                  <SimpleCard title={resolution.name} />
                </Link>
              </Grid>
            ))}
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}
