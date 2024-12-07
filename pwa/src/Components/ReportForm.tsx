import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import {
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
import { MediaReport_jsonld_report_object_read } from "../endpoints/types";

type data = { file: File; name: string };
interface CandidateFormProps {
  defaultValues?: Partial<MediaReport_jsonld_report_object_read>;
  onSubmit: SubmitHandler<data>;
  disabled?: boolean;
  edit?: boolean;
  title: string;
}
export default function ReportForm({
  defaultValues,
  onSubmit,
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

  return (
    <Grid2 container spacing={4}>
      <Grid2
        container
        spacing={4}
        alignItems="flex-start"
        size={{ xs: 12, md: 12, lg: 6 }}
      >
        <Grid2 container spacing={2} component="form" onSubmit={handleOnSubmit}>
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

          {edit ? null : (
            <Grid2 size={{ xs: 12, md: 6, lg: 6 }}>
              <Controller
                control={methods.control}
                name="file"
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
                    clearIconButtonProps={{
                      children: <CloseIcon fontSize="small" />,
                    }}
                    fullWidth
                  />
                )}
              />
            </Grid2>
          )}

          <Grid2 size={{ xs: 12 }}>
            <Button type="submit" disabled={disabled}>
              Uložit
            </Button>
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
  );
}
