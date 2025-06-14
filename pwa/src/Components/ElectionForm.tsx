import {
  Autocomplete,
  Button,
  Grid2,
  GridSize,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FormStatus } from "../Components/FormStatus";
import { MyDatePicker } from "../Components/MyDatePicker";
import {
  Election_election_write,
  Position_jsonld_position_read,
} from "../endpoints/types";
import { useGetPositionsQuery } from "../endpoints/positions";
import { ResponsiveStyleValue } from "@mui/system";
import { Election } from "../types";
import { differenceInDays, subDays, parse } from "date-fns";

const dateSize: ResponsiveStyleValue<GridSize> = { xs: 12, md: 6 };

type keys =
  | "announcementDate"
  | "registrationOfCandidatesDate"
  | "campaignDate"
  | "electronicVotingDate"
  | "ballotVotingDate"
  | "preliminaryResultsDate"
  | "complaintsDeadlineDate"
  | "countingVotesDate"
  | "finalResultsDate";
const nextDateMapper: Record<keys, keys | undefined> = {
  announcementDate: "registrationOfCandidatesDate",
  registrationOfCandidatesDate: "campaignDate",
  campaignDate: "electronicVotingDate",
  electronicVotingDate: "ballotVotingDate",
  ballotVotingDate: "preliminaryResultsDate",
  preliminaryResultsDate: "complaintsDeadlineDate",
  complaintsDeadlineDate: "countingVotesDate",
  countingVotesDate: "finalResultsDate",
  finalResultsDate: undefined,
};
function getNumberOfDays(key: keyof typeof nextDateMapper, election: Election) {
  const date = election[key];
  const nextKey = nextDateMapper[key];
  if (!date || !nextKey) return null;
  const nextDate = election[nextKey];
  if (!nextDate) return null;

  const d = new Date(date);
  const dd = new Date(nextDate);
  if (key == "announcementDate") {
    return election.registrationOfCandidatesDate
      ? differenceInDays(d, dd)
      : null;
  }
}
function getEndDate(
  key: keyof typeof nextDateMapper,
  election: Election
): string {
  const nextKey = nextDateMapper[key];
  if (!nextKey) return "";
  const nextDateStr = election[nextKey];
  if (!nextDateStr) return "";

  let nextDate = parse(nextDateStr, "dd.MM.yyyy", new Date());
  if (isNaN(nextDate.getTime())) {
    nextDate = new Date(nextDateStr);
  }

  return subDays(nextDate, 1).toLocaleDateString();
}

interface ElectionFormProps {
  defaultValues?: Omit<Election_election_write, "candidates">;
  onSubmit: SubmitHandler<Election_election_write>;
  disabled?: boolean;
}
function ElectionForm({
  defaultValues,
  onSubmit,
  disabled,
}: ElectionFormProps) {
  const methods = useForm<Election_election_write>();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;
  const { data: positions } = useGetPositionsQuery();

  const handleOnSubmit = handleSubmit(onSubmit);
  const formData = watch();

  return (
    <Grid2
      component="form"
      container
      spacing={2}
      onSubmit={handleOnSubmit}
      maxWidth={600}
    >
      <Grid2 size={12}>
        <FormStatus errors={errors} />
      </Grid2>

      <Grid2 size={12}>
        <Typography variant="h4" color="textPrimary">
          Volby:
        </Typography>
      </Grid2>

      <Grid2 size={dateSize}>
        <MyDatePicker
          label="Vyhlášení voleb"
          {...register("announcementDate", { required: true })}
          defaultValue={defaultValues?.announcementDate}
        />
      </Grid2>
      <Grid2 size={dateSize}>
        <TextField
          fullWidth
          value={getEndDate("announcementDate", formData)}
          disabled
        />
      </Grid2>

      <Grid2 size={dateSize}>
        <MyDatePicker
          label="Přihlašování kandidátů"
          {...register("registrationOfCandidatesDate", { required: true })}
          defaultValue={defaultValues?.registrationOfCandidatesDate}
        />
      </Grid2>
      <Grid2 size={dateSize}>
        <TextField
          fullWidth
          value={getEndDate("registrationOfCandidatesDate", formData)}
          disabled
        />
      </Grid2>

      <Grid2 size={dateSize}>
        <MyDatePicker
          label="Volební kampaň"
          {...register("campaignDate", { required: true })}
          defaultValue={defaultValues?.campaignDate}
        />
      </Grid2>
      <Grid2 size={dateSize}>
        <TextField
          fullWidth
          value={getEndDate("campaignDate", formData)}
          disabled
        />
      </Grid2>

      <Grid2 size={dateSize}>
        <MyDatePicker
          label="Elektronické hlasování"
          {...register("electronicVotingDate", { required: true })}
          defaultValue={defaultValues?.electronicVotingDate}
        />
      </Grid2>
      <Grid2 size={dateSize}>
        <TextField
          fullWidth
          value={getEndDate("electronicVotingDate", formData)}
          disabled
        />
      </Grid2>

      <Grid2 size={dateSize}>
        <MyDatePicker
          label="Urnové hlasování"
          {...register("ballotVotingDate", { required: true })}
          defaultValue={defaultValues?.ballotVotingDate}
        />
      </Grid2>
      <Grid2 size={dateSize}>
        <TextField
          fullWidth
          value={getEndDate("ballotVotingDate", formData)}
          disabled
        />
      </Grid2>

      <Grid2 size={dateSize}>
        <MyDatePicker
          label="Vyhlášení předběžných výsledků"
          {...register("preliminaryResultsDate", { required: true })}
          defaultValue={defaultValues?.preliminaryResultsDate}
        />
      </Grid2>
      <Grid2 size={dateSize}>
        <TextField
          fullWidth
          value={getEndDate("preliminaryResultsDate", formData)}
          disabled
        />
      </Grid2>

      <Grid2 size={dateSize}>
        <MyDatePicker
          label="Uzávěr podávání stížností"
          {...register("complaintsDeadlineDate", { required: true })}
          defaultValue={defaultValues?.complaintsDeadlineDate}
        />
      </Grid2>
      <Grid2 size={dateSize}>
        <TextField
          fullWidth
          value={getEndDate("complaintsDeadlineDate", formData)}
          disabled
        />
      </Grid2>

      <Grid2 size={dateSize}>
        <MyDatePicker
          label="Vyhodnocení výsledků"
          {...register("countingVotesDate", { required: true })}
          defaultValue={defaultValues?.countingVotesDate}
        />
      </Grid2>
      <Grid2 size={dateSize}>
        <TextField
          fullWidth
          value={getEndDate("countingVotesDate", formData)}
          disabled
        />
      </Grid2>

      <Grid2 size={dateSize}>
        <MyDatePicker
          label="Vyhlášení konečných výsledků"
          {...register("finalResultsDate", { required: true })}
          defaultValue={defaultValues?.finalResultsDate}
        />
      </Grid2>

      <Grid2 size={{ xs: 12 }}>
        <Controller
          control={methods.control}
          name="positions"
          defaultValue={defaultValues?.positions}
          render={({ field }) => (
            <Autocomplete
              options={positions?.member || []}
              getOptionKey={(z) => z["@id"]!}
              getOptionLabel={(z) => z.name!}
              renderInput={(params) => (
                <TextField {...params} label="Volené pozice" />
              )}
              multiple
              onChange={(e, values) => {
                field.onChange(values.map((v) => v["@id"]));
              }}
              onBlur={field.onBlur}
              value={
                field.value
                  ?.map((id) => positions?.member.find((z) => z["@id"] == id))
                  .filter(Boolean) as Position_jsonld_position_read[]
              }
            />
          )}
        />
      </Grid2>

      <Grid2 size={12}>
        <Button type="submit" disabled={disabled}>
          Uložit
        </Button>
      </Grid2>
    </Grid2>
  );
}

export default function ({
  defaultValues,
  onSubmit,
  disabled,
}: ElectionFormProps) {
  return (
    <ElectionForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      disabled={disabled}
    />
  );
}
