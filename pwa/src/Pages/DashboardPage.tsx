import { Divider, Grid2, Paper, Typography } from "@mui/material";
import { differenceInDays, subDays } from "date-fns";
import React from "react";
import Loader from "../Components/Loader";
import { useGetElectionsQuery } from "../endpoints/elections";
import { Election } from "../types";
import { electionTitle } from "../util/electionTitle";
import { head } from "../util/head";
import { splitElections } from "../util/splitElections";
import { TypographyInfo } from "../Components/TypographyInfo";
import { dayText } from "../util/dayText";

function toDate(
  date?: string | null,
  dateEnd?: string | null
): JSX.Element | null {
  if (date && !dateEnd) {
    const d = new Date(date);
    return (
      <Typography color="textPrimary">{d.toLocaleDateString()}</Typography>
    );
  }
  if (!date || !dateEnd) return null;
  const d = new Date(date);
  const d2 = new Date(dateEnd);
  return (
    <Typography color="textPrimary">
      {d.toLocaleDateString()} - {subDays(d2, 1).toLocaleDateString()}
    </Typography>
  );
}

function DateRow({
  from,
  to,
  children,
}: {
  from?: string | null;
  to?: string | null;
  children: React.ReactNode;
}) {
  const numberOfDays =
    from && to ? differenceInDays(new Date(to), new Date(from)) : 0;

  return (
    <>
      <Grid2 size={{ xs: 12, md: 5 }}>{toDate(from, to)}</Grid2>
      <Grid2 size={{ xs: 9, md: 5 }}>
        <Typography color="textPrimary">{children}</Typography>
      </Grid2>
      <Grid2 size={{ xs: 3, md: 2 }}>
        <Typography color="textPrimary">
          {numberOfDays} {dayText(numberOfDays)}
        </Typography>
      </Grid2>
    </>
  );
}

function DateList({ election }: { election: Election }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Grid2 container spacing={2}>
        <DateRow
          from={election.announcementDate}
          to={election.registrationOfCandidatesDate}
        >
          Vyhlášení voleb
        </DateRow>
        <DateRow
          from={election.registrationOfCandidatesDate}
          to={election.campaignDate}
        >
          Registrace kandidátů
        </DateRow>
        <DateRow
          from={election.campaignDate}
          to={election.electronicVotingDate}
        >
          Kampaň
        </DateRow>
        <DateRow
          from={election.electronicVotingDate}
          to={election.ballotVotingDate}
        >
          Elektronické hlasování
        </DateRow>
        <DateRow
          from={election.ballotVotingDate}
          to={election.preliminaryResultsDate}
        >
          Urnové hlasování
        </DateRow>
        <DateRow
          from={election.preliminaryResultsDate}
          to={election.complaintsDeadlineDate}
        >
          Vyhlášení předběžných výsledků
        </DateRow>
        <DateRow
          from={election.complaintsDeadlineDate}
          to={election.countingVotesDate}
        >
          Uzávěrka podávání stížností
        </DateRow>
        <DateRow
          from={election.countingVotesDate}
          to={election.finalResultsDate}
        >
          Vyhodnocení výsledků
        </DateRow>
        <DateRow from={election.finalResultsDate}>
          Vyhlášení konečných výsledků
        </DateRow>
      </Grid2>
    </Paper>
  );
}

export function Component() {
  const { data: elections, isLoading } = useGetElectionsQuery();

  const electionsData = splitElections(elections?.member || []);
  const ongoingElection = head(electionsData.current);

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={12} display="flex" alignItems="center">
        <Typography variant="h3" color="textPrimary" pr={1}>
          Přehled voleb {ongoingElection ? electionTitle(ongoingElection) : ""}
        </Typography>
      </Grid2>
      <Grid2 container size={{ xs: 12, sm: 9, md: 8, xl: 5 }} spacing={2}>
        {!isLoading ? (
          ongoingElection ? (
            <DateList election={ongoingElection} />
          ) : (
            <TypographyInfo>Neprobíhá žádná volba</TypographyInfo>
          )
        ) : (
          <Loader />
        )}
      </Grid2>
    </Grid2>
  );
}

export { ErrorBoundary } from "../Components/ErrorBoundary2";
