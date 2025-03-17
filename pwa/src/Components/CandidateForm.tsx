import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Grid2,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FormStatus } from "../Components/FormStatus";
import { useGetPosterQuery } from "../endpoints/mediaPoster";
import { useGetPositionsQuery } from "../endpoints/positions";
import { Candidate_jsonld_candidate_write } from "../endpoints/types";
import { Candidate, Election } from "../types";
import { parseId } from "../util/parseId";
import AlertDialog from "./AlertDialog";
import { ConditionalTooltip } from "./ConditionalTooltip";
import Loader from "./Loader";
import { MyUploadFileInput } from "./MyUploadFileInput";

interface CandidateFormProps {
  defaultValues?: Candidate;
  onSubmit: SubmitHandler<Candidate_jsonld_candidate_write>;
  onWithdraw?: () => any;
  onReject?: () => any;
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
  onWithdraw,
  onReject,
}: CandidateFormProps) {
  const methods = useForm<Candidate_jsonld_candidate_write>({
    defaultValues: { poster: defaultValues?.poster?.["@id"] },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;
  const { data: allPositions, isLoading } = useGetPositionsQuery();
  const posterId = methods.watch("poster");
  const { data: posterMedia } = useGetPosterQuery(parseId(posterId || "")!, {
    skip: !posterId,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);

  const availablePositions =
    allPositions?.member.filter((position) =>
      election.positions?.includes(position["@id"] || "")
    ) || [];
  const handleOnSubmit = handleSubmit(onSubmit);

  if (isLoading) return <Loader />;

  return (
    <>
      <Grid2 container spacing={4} alignItems="flex-start">
        <Grid2
          container
          spacing={2}
          size={{ xs: 12, md: 12, lg: 6 }}
          component="form"
          onSubmit={handleOnSubmit}
        >
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

          <Grid2 size={{ xs: 12, md: 6, lg: 6 }}>
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

          <Grid2 size={{ xs: 12, md: 6, lg: 6 }}>
            <Controller
              control={methods.control}
              name="poster"
              render={({ field }) => (
                <MyUploadFileInput
                  onChange={(value) => field.onChange(value)}
                  value={field.value}
                />
              )}
            />
          </Grid2>

          {defaultValues?.withdrewAt ? (
            <Grid2 size={12}>
              <TextField
                value={new Date(defaultValues.withdrewAt).toLocaleString()}
                label="Odstoupeno"
                disabled
                fullWidth
              />
            </Grid2>
          ) : null}

          <Grid2 size={{ xs: 12, md: 3 }}>
            <Button type="submit" disabled={disabled}>
              Uložit
            </Button>
          </Grid2>
          {onWithdraw ? (
            <Grid2 size={{ xs: 12, md: 3 }}>
              <ConditionalTooltip
                disabled={defaultValues?.withdrawAllowed}
                title="Odstroupit lze pouze před zveřejněním výsledků"
              >
                <Button
                  disabled={!defaultValues?.withdrawAllowed || disabled}
                  color="error"
                  onClick={() => setOpenDialog(true)}
                >
                  Odstoupit
                </Button>
              </ConditionalTooltip>
            </Grid2>
          ) : null}
          {onReject ? (
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Button
                disabled={!defaultValues?.withdrawAllowed || disabled}
                color="error"
                onClick={() => setOpenRejectDialog(true)}
              >
                Zamítnout
              </Button>
            </Grid2>
          ) : null}
        </Grid2>
        <Grid2 size={{ xs: 12, md: 12, lg: 6 }}>
          {posterMedia?.contentUrl ? (
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Náhled plakátu
                </Typography>
              </CardContent>
              <iframe
                src={posterMedia.contentUrl}
                width="100%"
                style={{ border: 0, height: "auto", aspectRatio: 8.5 / 8 }}
              ></iframe>
            </Card>
          ) : null}
        </Grid2>
      </Grid2>
      {onWithdraw ? (
        <AlertDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={onWithdraw}
          title="Opravdu si přeješ odstoupit?"
          description="V seznamech tvoje kandidátka zůstane, ale bude označena jako neplatná."
        />
      ) : null}
      {onReject ? (
        <AlertDialog
          open={openRejectDialog}
          onClose={() => setOpenRejectDialog(false)}
          onConfirm={onReject}
          title="Opravdu si přeješ zamítnout jeho kandidaturu?"
          description="V seznamech kandidátka zůstane, ale bude označena jako zamítnutá."
        />
      ) : null}
    </>
  );
}
