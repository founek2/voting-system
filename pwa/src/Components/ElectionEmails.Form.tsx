import React, { useState } from "react"
import { Button, Grid, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import AlertDialog from "./AlertDialog";

interface ElectionEmailForm {
    emailAddress: string
}

export interface ElectionEmailsFormProps {
    onSendAll: () => any
    onSendSingle: (email: string) => any
    disabled?: boolean
}
export function ElectionEmailsForm({ onSendSingle, onSendAll, disabled }: ElectionEmailsFormProps) {
    const { handleSubmit, register } = useForm<ElectionEmailForm>();
    const handleOnSubmit = handleSubmit(onSubmit);
    const [openDialog, setOpenDialog] = useState(false)

    function onSubmit(data: ElectionEmailForm) {
        onSendSingle(data.emailAddress)
    }
    function onConfirm() {
        onSendAll()
        setOpenDialog(false)
    }

    return <> <Grid container spacing={2}>
        <Grid size={12}>
            <Typography variant="h4" color="textPrimary">
                Emaily:
            </Typography>
        </Grid>
        <Grid
            component="form"
            container
            spacing={2}
            onSubmit={handleOnSubmit}
            size={12}
        >
            <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Na jaký email zprávu odeslat" fullWidth {...register('emailAddress', { required: true })} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Button disabled={disabled} type="submit">Odeslat na adresu</Button>
            </Grid>
        </Grid>
        <Grid>
            <Grid >
                <Button variant="contained" disabled={disabled} onClick={() => setOpenDialog(true)} >Odeslat upozornění všem členům SH</Button>
            </Grid>
        </Grid>
    </Grid >
        <AlertDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onConfirm={onConfirm}
            title="Opravdu si přeješ odeslat všem emailové upozornění na volby?"
            description="Email bude odeslán všem členům klubu Silicon Hill. Tento seznam se načítá z ISu přes API."
        />
    </>
}