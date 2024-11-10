import {
  Autocomplete,
  Button,
  Grid2,
  GridSize,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FormStatus } from "../Components/FormStatus";
import { MyDatePicker } from "../Components/MyDatePicker";
import {
  Candidate_candidate_edit,
  Candidate_candidate_write,
  Election_election_write,
  Position_jsonld_position_read,
} from "../endpoints/types";
import { useGetPositionsQuery } from "../endpoints/positions";
import { ResponsiveStyleValue } from "@mui/system";
import { Candidate, Election } from "../types";
import { MuiFileInput } from "mui-file-input";
import { useAddPosterMutation } from "../endpoints/mediaPoster";
import { enqueueSnackbar } from "notistack";
import Loader from "./Loader";

interface CandidateFormProps {
  defaultValues?: Candidate;
  onSubmit: SubmitHandler<Candidate_candidate_write>;
  disabled?: boolean;
  election: Election;
  edit?: boolean;
}
export default function CandidateForm({
  defaultValues,
  onSubmit,
  disabled,
  election,
  edit,
}: CandidateFormProps) {
  const methods = useForm<Candidate_candidate_write>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;
  const { data: allPositions, isLoading } = useGetPositionsQuery();

  const availablePositions =
    allPositions?.member.filter((position) =>
      election.positions?.includes(position["@id"] || "")
    ) || [];
  const handleOnSubmit = handleSubmit(onSubmit);

  if (isLoading) return <Loader />;

  return (
    <Grid2 component="form" container spacing={2} onSubmit={handleOnSubmit}>
      <Input
        value={election["@id"]}
        sx={{ display: "none" }}
        {...register("election")}
      />
      <Grid2 size={12}>
        <FormStatus errors={errors} />
      </Grid2>

      <Grid2 size={12}>
        <Typography variant="h4" color="textPrimary">
          Kandidátka:
        </Typography>
      </Grid2>

      <Grid2 size={{ xs: 12, md: 6, lg: 3 }}>
        <Controller
          control={methods.control}
          name="position"
          defaultValue={defaultValues?.position["@id"]}
          rules={{ required: true }}
          render={({ field }) => (
            <Autocomplete
              options={availablePositions}
              getOptionKey={(z) => z["@id"]!}
              getOptionLabel={(z) => z.name!}
              disabled={edit}
              renderInput={(params) => (
                <TextField {...params} label="Vyberte pozici" />
              )}
              onChange={(e, value) => {
                field.onChange(value?.["@id"]);
              }}
              onBlur={field.onBlur}
              value={availablePositions.find(
                (position) => position["@id"] == field.value
              )}
            />
          )}
        />
      </Grid2>

      <Grid2 size={{ xs: 12, md: 6, lg: 3 }}>
        <Controller
          control={methods.control}
          name="poster"
          defaultValue={defaultValues?.poster?.["@id"]}
          render={({ field }) => {
            const [value, setValue] = React.useState<File | null>(null);
            const [addPoster] = useAddPosterMutation();

            const handleChange = async (newValue: File | null) => {
              setValue(newValue);

              if (!newValue) return field.onChange(null);
              else {
                const result = await addPoster({ file: newValue });
                if (result.error) {
                  enqueueSnackbar({
                    message: "Plakát se nepodařilo nahrát",
                    variant: "error",
                  });
                  setValue(null);
                  field.onChange(undefined);
                } else {
                  enqueueSnackbar("Plakát byl nahrán");
                  field.onChange(result.data["@id"]);
                }
              }
            };

            return (
              <MuiFileInput
                value={value}
                onChange={handleChange}
                label="Vyberte plakát"
              />
            );
          }}
        />
      </Grid2>

      <Grid2 size={{ xs: 12, md: 6, lg: 3 }}></Grid2>

      <Grid2 size={12}>
        <Button type="submit" disabled={disabled}>
          Uložit
        </Button>
      </Grid2>
    </Grid2>
  );
}
