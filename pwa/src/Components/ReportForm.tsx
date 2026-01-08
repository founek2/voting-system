import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import {
    Autocomplete,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { FormStatus } from "../Components/FormStatus";
import { MediaReport_jsonld_media_read } from "../endpoints/types";
import { MyDatePickerControlled } from "./MyDatePicker";
import AlertDialog from "./AlertDialog";
import { useGetElectionsQuery } from "../endpoints/elections";
import { electionTitle } from "../util/electionTitle";

type ReportFormData = {
    file: File;
    name: string;
    publishedAt: Date | string;
    election: string | null;
};

type ReportFormDataResult = Omit<ReportFormData, 'publishedAt'> & {
    publishedAt: string;
};
interface CandidateFormProps {
    defaultValues?: Partial<MediaReport_jsonld_media_read>;
    onSubmit: SubmitHandler<ReportFormDataResult>;
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
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ReportFormData>({
        defaultValues,
    });
    const handleOnSubmit = handleSubmit((a) => onSubmit({
        ...a,
        publishedAt: a.publishedAt instanceof Date ? a.publishedAt.toISOString() : a.publishedAt,
    }));
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
            <Grid container spacing={4}>
                <Grid
                    container
                    spacing={4}
                    alignItems="flex-start"
                    size={{ xs: 12, md: 12, lg: 6 }}
                >
                    <Grid
                        container
                        spacing={2}
                        component="form"
                        onSubmit={handleOnSubmit}
                    >
                        <Grid size={12}>
                            <FormStatus errors={errors} />
                        </Grid>

                        <Grid size={12}>
                            <Typography variant="h4" color="textPrimary">
                                {title}:
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Název"
                                fullWidth
                                {...register("name", { required: true })}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                            <MyDatePickerControlled
                                label="Datum zvěřejnění"
                                name="publishedAt"
                                rules={{ required: true }}
                                control={control}
                            />
                        </Grid>

                        {edit ? null : (
                            <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                                <Controller
                                    control={control}
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
                            </Grid>
                        )}

                        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
                            <Controller
                                control={control}
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
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Grid container>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <Button type="submit" disabled={disabled}>
                                        Uložit
                                    </Button>
                                </Grid>
                                {edit && onDelete ? (
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <Button
                                            disabled={disabled}
                                            color="error"
                                            onClick={() => setOpenDialog(true)}
                                        >
                                            Smazat
                                        </Button>
                                    </Grid>
                                ) : null}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid size={{ xs: 12, md: 12, lg: 6 }}>
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
                </Grid>
            </Grid>
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
