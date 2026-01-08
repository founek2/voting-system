import {
  Autocomplete,
  Button,
  Grid,
  GridSize,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FormStatus } from "../Components/FormStatus";
import { MyDatePickerControlled } from "../Components/MyDatePicker";
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
  election: Omit<Election, '@context' | '@id' | '@type'>
): string {
  const nextKey = nextDateMapper[key];
  if (!nextKey) return "";
  const nextDateStr = election[nextKey];
  if (!nextDateStr) return "";


  let nextDate = (nextDateStr as any instanceof Date) ? new Date(nextDateStr) : parse(nextDateStr, "dd.MM.yyyy", new Date());
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
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, },
  } = useForm<Election_election_write>({ defaultValues });

  const { data: positions } = useGetPositionsQuery();

  const handleOnSubmit = handleSubmit(onSubmit);
  const formData = watch();

  return (
    <Grid
      component="form"
      container
      spacing={2}
      onSubmit={handleOnSubmit}
      maxWidth={600}
    >
      {Object.keys(errors).length > 0 ? <Grid size={12}>
        <FormStatus errors={errors} />
      </Grid> : null}

      <Grid size={12}>
        <Typography variant="h4" color="textPrimary">
          Volby:
        </Typography>
      </Grid>

      <Grid size={dateSize}>
        <MyDatePickerControlled
          name="announcementDate"
          label="Vyhlášení voleb"
          rules={{ required: true }}
          control={control}
        />
      </Grid>
      <Grid size={dateSize}>
        <TextField
          fullWidth
          value={getEndDate("announcementDate", formData)}
          disabled
        />
      </Grid>

      <Grid size={dateSize}>
        <MyDatePickerControlled
          label="Přihlašování kandidátů"
          name="registrationOfCandidatesDate"
          rules={{ required: true }}
          control={control}
        />
      </Grid>
      <Grid size={dateSize}>
        <TextField
          fullWidth
          value={getEndDate("registrationOfCandidatesDate", formData)}
          disabled
        />
      </Grid>

      <Grid size={dateSize}>
        <MyDatePickerControlled
          label="Volební kampaň"
          name="campaignDate"
          rules={{ required: true }}
          control={control}
        />
      </Grid>
      <Grid size={dateSize}>
        <TextField
          fullWidth
          value={getEndDate("campaignDate", formData)}
          disabled
        />
      </Grid>

      <Grid size={dateSize}>
        <MyDatePickerControlled
          label="Elektronické hlasování"
          name="electronicVotingDate"
          rules={{ required: true }}
          control={control}
        />
      </Grid>
      <Grid size={dateSize}>
        <TextField
          fullWidth
          value={getEndDate("electronicVotingDate", formData)}
          disabled
        />
      </Grid>

      <Grid size={dateSize}>
        <MyDatePickerControlled
          label="Urnové hlasování"
          name="ballotVotingDate"
          rules={{ required: true }}
          control={control}
        />
      </Grid>
      <Grid size={dateSize}>
        <TextField
          fullWidth
          value={getEndDate("ballotVotingDate", formData)}
          disabled
        />
      </Grid>

      <Grid size={dateSize}>
        <MyDatePickerControlled
          label="Vyhlášení předběžných výsledků"
          name="preliminaryResultsDate"
          rules={{ required: true }}
          control={control}
        />
      </Grid>
      <Grid size={dateSize}>
        <TextField
          fullWidth
          value={getEndDate("preliminaryResultsDate", formData)}
          disabled
        />
      </Grid>

      <Grid size={dateSize}>
        <MyDatePickerControlled
          label="Uzávěr podávání stížností"
          name="complaintsDeadlineDate"
          rules={{ required: true }}
          control={control}
        />
      </Grid>
      <Grid size={dateSize}>
        <TextField
          fullWidth
          value={getEndDate("complaintsDeadlineDate", formData)}
          disabled
        />
      </Grid>

      <Grid size={dateSize}>
        <MyDatePickerControlled
          label="Vyhodnocení výsledků"
          name="countingVotesDate"
          rules={{ required: true }}
          control={control}
        />
      </Grid>
      <Grid size={dateSize}>
        <TextField
          fullWidth
          value={getEndDate("countingVotesDate", formData)}
          disabled
        />
      </Grid>

      <Grid size={dateSize}>
        <MyDatePickerControlled
          label="Vyhlášení konečných výsledků"
          name="finalResultsDate"
          rules={{ required: true }}
          control={control}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Controller
          control={control}
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
      </Grid>
      <Grid size={12}>
        <Button type="submit" disabled={disabled}>
          Uložit
        </Button>
      </Grid>
    </Grid>
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
