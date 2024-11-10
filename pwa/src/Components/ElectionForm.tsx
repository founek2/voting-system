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

const dateSize: ResponsiveStyleValue<GridSize> = { xs: 12, md: 6, lg: 3 };

interface ElectionFormProps {
  defaultValues?: Omit<Election_election_write, "candidates">;
  onSubmit: SubmitHandler<Election_election_write>;
  disabled?: boolean;
}
export default function ElectionForm({
  defaultValues,
  onSubmit,
  disabled,
}: ElectionFormProps) {
  const methods = useForm<Election_election_write>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;
  const { data: positions } = useGetPositionsQuery();

  const handleOnSubmit = handleSubmit(onSubmit);

  return (
    <Grid2 component="form" container spacing={2} onSubmit={handleOnSubmit}>
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
        <MyDatePicker
          label="Přihlašování kandidátů"
          {...register("registrationOfCandidatesDate", { required: true })}
          defaultValue={defaultValues?.registrationOfCandidatesDate}
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
        <MyDatePicker
          label="Elektronické hlasování"
          {...register("electronicVotingDate", { required: true })}
          defaultValue={defaultValues?.electronicVotingDate}
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
        <MyDatePicker
          label="Vyhlášení předběžných výsledků"
          {...register("preliminaryResultsDate", { required: true })}
          defaultValue={defaultValues?.preliminaryResultsDate}
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
        <MyDatePicker
          label="Vyhlášení konečních výsledků"
          {...register("finalResultsDate", { required: true })}
          defaultValue={defaultValues?.finalResultsDate}
        />
      </Grid2>

      <Grid2 size={{ xs: 12, md: 6 }}>
        <Controller
          control={methods.control}
          name="positions"
          defaultValue={defaultValues?.positions}
          render={({ field }) => (
            <Autocomplete
              options={
                positions?.member || []
                // top100Films
              }
              getOptionKey={(z) => z["@id"]!}
              getOptionLabel={(z) => z.name!}
              renderInput={(params) => (
                <TextField {...params} label="Volené pozice" />
              )}
              multiple
              // {...autocompleteField}
              onChange={(e, values) => {
                field.onChange(values.map((v) => v["@id"]));
                // autocompleteField.onChange({
                //   target: { value, name: autocompleteField.name },
                // });
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
