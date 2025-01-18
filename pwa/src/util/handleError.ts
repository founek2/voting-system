
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { enqueueSnackbar } from "notistack";

export function handleError(error: FetchBaseQueryError | SerializedError | undefined) {
    if (!error) {
        enqueueSnackbar({ message: 'Nastala chyba', variant: 'error' })
    }
    else if ('status' in error && 'data' in error && error.status === 422) {
        console.log("here")
        const err = error as { data?: { detail: string }, status?: string | number }
        enqueueSnackbar({ message: err.data?.detail || 'Nastala chyba', variant: 'error' })
    } else {
        enqueueSnackbar({ message: 'Nastala chyba', variant: 'error' })
    }
}