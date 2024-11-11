import { Alert } from "@mui/material";
import React from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import { useAddPosterMutation } from "../endpoints/mediaPoster";
import { enqueueSnackbar } from "notistack";
import { MuiFileInput } from "mui-file-input";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";

export function MyUploadFileInput({
  onChange,
  value,
}: Omit<React.ComponentProps<typeof MuiFileInput>, "onChange" | "value"> & {
  onChange: (value: string | null) => any;
  value?: string | null;
}) {
  const [file, setFile] = React.useState<File | null>(null);
  const [addPoster] = useAddPosterMutation();

  const handleChange = async (newValue: File | null) => {
    setFile(newValue);

    if (!newValue) onChange(newValue);
    else {
      const result = await addPoster({ file: newValue });
      if (result.error) {
        enqueueSnackbar({
          message: "Plakát se nepodařilo nahrát",
          variant: "error",
        });
        setFile(null);
        onChange(null);
      } else {
        enqueueSnackbar("Plakát byl nahrán");
        onChange(result.data["@id"]!);
      }
    }
  };

  return (
    <MuiFileInput
      value={file}
      onChange={handleChange}
      label="Vyberte plakát"
      placeholder="Klikněte pro výběr souboru"
      InputProps={{
        startAdornment: <AttachFileIcon />,
      }}
      clearIconButtonProps={{
        children: <CloseIcon fontSize="small" />,
      }}
      fullWidth
    />
  );
}
