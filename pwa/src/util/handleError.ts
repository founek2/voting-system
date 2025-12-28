
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { enqueueSnackbar } from "notistack";

export function handleError(error: FetchBaseQueryError | SerializedError | undefined, defaultMessage: string = 'Nastala chyba') {
    if (!error) {
        enqueueSnackbar({ message: defaultMessage, variant: 'error' })
    }
    else if ('status' in error && 'data' in error && error.status === 422) {
        const err = error as { data?: { detail: string }, status?: string | number }
        enqueueSnackbar({ message: err.data?.detail || defaultMessage, variant: 'error' })
    } else {
        enqueueSnackbar({ message: defaultMessage, variant: 'error' })
    }
}