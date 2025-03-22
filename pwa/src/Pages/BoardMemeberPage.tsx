import AddIcon from "@mui/icons-material/Add";
import { Grid2, IconButton, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import Loader from "../Components/Loader";
import { MemberBoardCard } from "../Components/MemberBoardCard";
import { useGetPublicBoardMemebersQuery } from "../endpoints/board";
import { parseId } from "../util/parseId";

export function Component() {
  const { data: members } = useGetPublicBoardMemebersQuery();

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12} display="flex" alignItems="center">
        <Typography variant="h3" color="textPrimary" component="span" pr={1}>
          Členové komise
        </Typography>
        <Link to="create">
          <IconButton>
            <AddIcon fontSize="large" />
          </IconButton>
        </Link>
      </Grid2>
      <Grid2 container size={12} spacing={2}>
        {members ? (
          members.member?.map((member) => (
            <Grid2 size={4} key={member["@id"]}>
              <Link to={`${parseId(member["@id"])}`}>
                <MemberBoardCard member={member} />
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

export { ErrorBoundary } from "../Components/ErrorBoundary2";
