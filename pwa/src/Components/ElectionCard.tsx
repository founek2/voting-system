import HowToVoteIcon from "@mui/icons-material/HowToVote";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid2,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { Election } from "../types";
import { electionTitle } from "../util/electionTitle";

interface ElectionCardProps {
  election: Election;
  title?: string;
  isAdmin?: boolean;
  onViewVotes?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    election: Election
  ) => any;
  onViewResult?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    election: Election
  ) => any;
  onViewCandidates?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    election: Election
  ) => any;
}
export function ElectionCard({
  election,
  title,
  isAdmin,
  onViewVotes,
  onViewResult,
  onViewCandidates,
}: ElectionCardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card>
      <CardHeader title={title ? title : electionTitle(election)} />
      <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
        {!isMobile ? (
          <Box>
            <HowToVoteIcon fontSize="large" />
          </Box>
        ) : null}
        {isAdmin ? (
          <Grid2
            container
            spacing={2}
            justifyContent={{ xs: "center", md: "flex-end" }}
          >
            <Grid2>
              {onViewCandidates ? (
                <Button onClick={(e) => onViewCandidates(e, election)}>
                  Zobrazit kandidáty
                </Button>
              ) : null}
            </Grid2>
            <Grid2>
              {onViewResult ? (
                <Button onClick={(e) => onViewResult(e, election)}>
                  Výsledky hlasování
                </Button>
              ) : null}
            </Grid2>
            {onViewVotes ? (
              <Grid2>
                <Button onClick={(e) => onViewVotes(e, election)}>
                  Zobrazit hlasy
                </Button>
              </Grid2>
            ) : null}
          </Grid2>
        ) : null}
      </CardContent>
    </Card>
  );
}
