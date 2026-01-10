import HowToVoteIcon from "@mui/icons-material/HowToVote";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardProps,
  Grid,
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
  sx?: CardProps["sx"];
  children?: React.ReactNode;
}
export function ElectionCard({
  election,
  title,
  isAdmin,
  onViewVotes,
  onViewResult,
  onViewCandidates,
  sx,
  children,
}: ElectionCardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card sx={sx}>
      <CardHeader title={title ? title : electionTitle(election)} />
      <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {!isMobile ? (
          <Box>
            <HowToVoteIcon fontSize="large" />
          </Box>
        ) : null}
        {children}
        {isAdmin ? (
          <Grid
            container
            spacing={2}
            justifyContent={{ xs: "center", md: "flex-end" }}
          >
            <Grid>
              {onViewCandidates ? (
                <Button onClick={(e) => onViewCandidates(e, election)}>
                  Zobrazit kandidáty
                </Button>
              ) : null}
            </Grid>
            <Grid>
              {onViewResult ? (
                <Button onClick={(e) => onViewResult(e, election)}>
                  Výsledky hlasování
                </Button>
              ) : null}
            </Grid>
            {onViewVotes ? (
              <Grid>
                <Button onClick={(e) => onViewVotes(e, election)}>
                  Zobrazit hlasy
                </Button>
              </Grid>
            ) : null}
          </Grid>
        ) : null}
      </CardContent>
    </Card>
  );
}
