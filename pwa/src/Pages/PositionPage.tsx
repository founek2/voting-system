import AddIcon from "@mui/icons-material/Add";
import { Grid2, IconButton, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import Loader from "../Components/Loader";
import { PositionCard } from "../Components/PositionCard";
import { useGetPositionsQuery } from "../endpoints/positions";

export default function PositionPage() {
  const { data: positions } = useGetPositionsQuery();

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12} display="flex" alignItems="center">
        <Typography variant="h3" color="textPrimary" component="span" pr={1}>
          Pozice
        </Typography>
        <Link to="create">
          <IconButton>
            <AddIcon fontSize="large" />
          </IconButton>
        </Link>
      </Grid2>
      <Grid2 container size={12} spacing={2}>
        {positions ? (
          positions.member?.map((position) => (
            <Grid2 size={4} key={position.id}>
              <Link to={`${position.id}`}>
                <PositionCard position={position} />
              </Link>
            </Grid2>
          ))
        ) : (
          <Loader />
        )}
      </Grid2>
    </Grid2>
  );
}
