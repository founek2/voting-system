import { Box, Grid2, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import PublicElectionStepper from "../Components/PublicElectionStepper";

export default function HomePage() {
  return (
    <Grid2 container justifyContent="center" spacing={4}>
      <Grid2
        size={12}
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection={{ xs: "column", lg: "row" }}
      >
        <Link to="https://www.siliconhill.cz/">
          <Box
            component="img"
            sx={{
              left: { lg: "5%" },
              top: { lg: 100 },
              maxWidth: { xs: 250, md: 300 },
            }}
            alt="The house from the offer."
            src="/assets/SH-logo.png"
            position={{ lg: "absolute" }}
          />
        </Link>

        <Typography variant="h3" color="primary" component="span">
          Volby do představenstva klubu Silicon Hill
        </Typography>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 6, lg: 3 }}>
        <PublicElectionStepper />
      </Grid2>
    </Grid2>
  );
}
