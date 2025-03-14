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
import {
  Position_jsonld_position_write,
  Zone_jsonld_zone_read,
} from "../endpoints/types";
import { useGetZonesQuery } from "../endpoints/zones";
import { head } from "../util/head";

const allZone = {
  name: "Všichni",
  "@id": "all",
};

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

  const zoneOptions: Zone_jsonld_zone_read[] = [
    allZone,
    ...(zones?.member || []),
  ];
  return (
    <Grid2 component="form" container spacing={2} onSubmit={handleOnSubmit}>
      <Grid2 size={12}>
        <FormStatus errors={errors} />
      </Grid2>

      <Grid2 size={12}>
        <Typography variant="h4" color="textPrimary">
          Pozice
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, md: 4, lg: 3 }}>
        <TextField
          label="Název"
          {...register("name", { required: true })}
          fullWidth
        />
      </Grid2>

      <Grid2 size={{ xs: 12, md: 4, lg: 3 }}>
        <Controller
          control={methods.control}
          name="zoneRestrictions"
          render={({ field }) => (
            <Autocomplete
              options={zoneOptions}
              getOptionKey={(z) => z["@id"]!}
              getOptionLabel={(z) => z.name!}
              renderInput={(params) => (
                <TextField {...params} label="Omezení volby na zóny" />
              )}
              multiple
              onChange={(e, values) => {
                const filtered = values.filter((v) => v !== allZone);
                field.onChange(filtered.map((v) => v["@id"]));
              }}
              onBlur={field.onBlur}
              value={
                field.value && field.value.length > 0
                  ? (field.value
                      ?.map((id) => zoneOptions.find((z) => z["@id"] == id))
                      .filter(Boolean) as Zone_jsonld_zone_read[])
                  : [allZone]
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
