import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FormStatus } from "../Components/FormStatus";
import { MediaReport_jsonld_media_read } from "../endpoints/types";
import { MyDatePicker } from "./MyDatePicker";
import AlertDialog from "./AlertDialog";
import { useGetElectionsQuery } from "../endpoints/elections";
import { electionTitle } from "../util/electionTitle";

type data = {
  file: File;
  name: string;
  publishedAt: string;
  election: string | null;
};
interface CandidateFormProps {
  defaultValues?: Partial<MediaReport_jsonld_media_read>;
  onSubmit: SubmitHandler<data>;
  onDelete?: (file: Partial<MediaReport_jsonld_media_read>) => Promise<any>;
  disabled?: boolean;
  edit?: boolean;
  title: string;
}
export default function ReportForm({
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  title,
  edit,
}: CandidateFormProps) {
  const methods = useForm<data>({
    defaultValues,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;
  const handleOnSubmit = handleSubmit((a) => onSubmit(a));
  const [currentFileUrl, setFileUrl] = useState<string>();
  const fileUrl = currentFileUrl || defaultValues?.contentUrl;
  const [openDialog, setOpenDialog] = useState(false);
  const { data: elections, isLoading } = useGetElectionsQuery();

  async function handleDelete() {
    if (!defaultValues || !onDelete) return;

    await onDelete(defaultValues);
    setOpenDialog(false);
  }

  const availablePositions = elections?.member || [];

  return (
    <>
      <Grid2 container spacing={4}>
        <Grid2
          container
          spacing={4}
          alignItems="flex-start"
          size={{ xs: 12, md: 12, lg: 6 }}
        >
          <Grid2
            container
            spacing={2}
            component="form"
            onSubmit={handleOnSubmit}
          >
            <Grid2 size={12}>
              <FormStatus errors={errors} />
            </Grid2>

            <Grid2 size={12}>
              <Typography variant="h4" color="textPrimary">
                {title}:
              </Typography>
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <TextField
                label="Název"
                fullWidth
                {...register("name", { required: true })}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6, lg: 6 }}>
              <MyDatePicker
                label="Datum zvěřejnění"
                {...register("publishedAt", { required: true })}
                defaultValue={defaultValues?.publishedAt}
              />
            </Grid2>

            {edit ? null : (
              <Grid2 size={{ xs: 12, md: 6, lg: 6 }}>
                <Controller
                  control={methods.control}
                  name="file"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <MuiFileInput
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        if (e) setFileUrl(URL.createObjectURL(e));
                        else setFileUrl(undefined);
                      }}
                      label="Vyberte zprávu"
                      placeholder="Klikněte pro výběr souboru"
                      InputProps={{
                        startAdornment: <AttachFileIcon />,
                      }}
                      inputProps={{ accept: ".png, .jpeg, .pdf" }}
                      clearIconButtonProps={{
                        children: <CloseIcon fontSize="small" />,
                      }}
                      fullWidth
                    />
                  )}
                />
              </Grid2>
            )}

            <Grid2 size={{ xs: 12, md: 6, lg: 6 }}>
              <Controller
                control={methods.control}
                name="election"
                defaultValue={undefined}
                render={({ field }) => (
                  <Autocomplete
                    options={availablePositions}
                    getOptionKey={(z) => z["@id"]!}
                    getOptionLabel={(z) => electionTitle(z)}
                    renderInput={(params) => (
                      <TextField {...params} label="Vyberte volby" />
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

            <Grid2 size={{ xs: 12 }}>
              <Grid2 container>
                <Grid2 size={{ xs: 12, md: 3 }}>
                  <Button type="submit" disabled={disabled}>
                    Uložit
                  </Button>
                </Grid2>
                {edit && onDelete ? (
                  <Grid2 size={{ xs: 12, md: 3 }}>
                    <Button
                      disabled={disabled}
                      color="error"
                      onClick={() => setOpenDialog(true)}
                    >
                      Smazat
                    </Button>
                  </Grid2>
                ) : null}
              </Grid2>
            </Grid2>
          </Grid2>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 12, lg: 6 }}>
          {fileUrl ? (
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Náhled {title.toLowerCase()}
                </Typography>
              </CardContent>
              <iframe
                src={fileUrl}
                width="100%"
                style={{ border: 0, height: "auto", aspectRatio: 8.5 / 8 }}
              ></iframe>
            </Card>
          ) : null}
        </Grid2>
      </Grid2>
      {onDelete ? (
        <AlertDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={handleDelete}
          title="Opravdu si přeješ smazat zprávu?"
          description="Vybraný soubor bude odstraněn z veřejných seznamů a již ho nebude možné ani dohledat v administraci."
        />
      ) : null}
    </>
  );
}
