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
import { useGetPositionsQuery } from "../endpoints/positions";
import { BoardMember_jsonld_member_write } from "../endpoints/types";

interface PositionFormProps {
  defaultValues?: BoardMember_jsonld_member_write;
  onSubmit: SubmitHandler<BoardMember_jsonld_member_write>;
  disabled?: boolean;
  onDelete?: () => any;
}
export default function BoardMemberForm({
  defaultValues,
  onSubmit,
  disabled,
  onDelete,
}: PositionFormProps) {
  const methods = useForm<BoardMember_jsonld_member_write>({ defaultValues });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;
  const handleOnSubmit = handleSubmit(onSubmit);
  const { data: allPositions, isLoading } = useGetPositionsQuery();

  // const autocompleteField = register("zoneRestrictions", { required: true });

  return (
    <Grid2 component="form" container spacing={2} onSubmit={handleOnSubmit}>
      <Grid2 size={12}>
        <FormStatus errors={errors} />
      </Grid2>

      <Grid2 size={12}>
        <Typography variant="h4" color="textPrimary">
          Člen komise
        </Typography>
      </Grid2>

      <Grid2 size={5}>
        <Controller
          control={methods.control}
          name="appUser"
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              label="UID uživatele"
              defaultValue={defaultValues?.appUser || ""}
              value={field.value?.split("/").pop()}
              fullWidth
              onChange={(e) => {
                const newE = {
                  ...e,
                  target: {
                    ...e.target,
                    value: `/api/users/${e.target.value}`,
                  },
                };
                field.onChange(newE);
              }}
              onBlur={field.onBlur}
            />
          )}
        />
      </Grid2>
      <Grid2 size={5}>
        <Controller
          control={methods.control}
          name="position"
          defaultValue={defaultValues?.position}
          rules={{ required: true }}
          render={({ field }) => (
            <Autocomplete
              options={allPositions?.member || []}
              getOptionKey={(z) => z["@id"]!}
              getOptionLabel={(z) => z.name!}
              renderInput={(params) => (
                <TextField {...params} label="Vyberte pozici" />
              )}
              onChange={(e, value) => {
                field.onChange(value?.["@id"]);
              }}
              onBlur={field.onBlur}
              value={allPositions?.member.find(
                (position) => position["@id"] == field.value
              )}
            />
          )}
        />
      </Grid2>
      <Grid2 size={12}>
        <Button type="submit" disabled={disabled}>
          Uložit
        </Button>
        <Button disabled={disabled} color="error" onClick={onDelete}>
          Smazat
        </Button>
      </Grid2>
    </Grid2>
  );
}
