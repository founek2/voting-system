import {
  Autocomplete,
  Button,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FormStatus } from "../Components/FormStatus";
import { MyDatePicker } from "../Components/MyDatePicker";
import {
  Election_election_write,
  Position_jsonld_position_write,
  Zone_jsonld_zone_read,
} from "../endpoints/types";
import { useGetZonesQuery } from "../endpoints/zones";

const top100Films = [
  { label: "The Shawshank Redemption", year: 1994 },
  { label: "The Godfather", year: 1972 },
  { label: "The Godfather", year: 1972 },
  { label: "The Godfather", year: 1972 },
  { label: "The Godfather", year: 1972 },
  { label: "The Godfather", year: 1972 },
  { label: "The Godfather", year: 1972 },
  { label: "The Godfather: Part II", year: 1974 },
];

interface PositionFormProps {
  defaultValues?: Position_jsonld_position_write;
  onSubmit: SubmitHandler<Position_jsonld_position_write>;
  disabled?: boolean;
}
export default function PositionForm({
  defaultValues,
  onSubmit,
  disabled,
}: PositionFormProps) {
  const methods = useForm<Position_jsonld_position_write>({ defaultValues });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;
  const { data: zones } = useGetZonesQuery();
  const handleOnSubmit = handleSubmit(onSubmit);

  // const autocompleteField = register("zoneRestrictions", { required: true });

  return (
    <Grid2 component="form" container spacing={2} onSubmit={handleOnSubmit}>
      <Grid2 size={12}>
        <FormStatus errors={errors} />
      </Grid2>

      <Grid2 size={12}>
        <Typography variant="h4">Pozice</Typography>
      </Grid2>

      <Grid2 size={3}>
        <TextField
          label="Název"
          {...register("name", { required: true })}
          fullWidth
        />
      </Grid2>

      <Grid2 size={5}>
        <Controller
          control={methods.control}
          name="zoneRestrictions"
          render={({ field }) => (
            <Autocomplete
              options={
                zones?.member || []
                // top100Films
              }
              getOptionKey={(z) => z["@id"]!}
              getOptionLabel={(z) => z.name!}
              renderInput={(params) => (
                <TextField {...params} label="Omezení volby na zóny" />
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
                  ?.map((id) => zones?.member.find((z) => z["@id"] == id))
                  .filter(Boolean) as Zone_jsonld_zone_read[]
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
