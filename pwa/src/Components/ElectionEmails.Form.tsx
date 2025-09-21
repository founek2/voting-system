import React, { useState } from "react"
import { Button, Grid2, TextField, Typography } from "@mui/material";
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

    return <> <Grid2 container spacing={2}>
        <Grid2 size={12}>
            <Typography variant="h4" color="textPrimary">
                Emaily:
            </Typography>
        </Grid2>
        <Grid2
            component="form"
            container
            spacing={2}
            onSubmit={handleOnSubmit}
            size={12}
        >
            <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField label="Na jaký email zprávu odeslat" fullWidth {...register('emailAddress', { required: true })} />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
                <Button disabled={disabled} type="submit">Odeslat na adresu</Button>
            </Grid2>
        </Grid2>
        <Grid2>
            <Grid2 >
                <Button disabled={disabled} onClick={() => setOpenDialog(true)} >Odeslat upozornění všem členům</Button>
            </Grid2>
        </Grid2>
    </Grid2>
        <AlertDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onConfirm={onConfirm}
            title="Opravdu si přeješ odeslat všem emailové upozornění na volby?"
            description="Email bude odeslán všem členům klubu Silicon Hill. Tento seznam se načítá z ISu přes API."
        />
    </>
}