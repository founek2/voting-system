import { enqueueSnackbar } from 'notistack';
import rootReducer from './slices'
import { configureStore, isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import { logger } from '../logger';
import { api } from '../endpoints/api';
import { FLUSH, PAUSE, PERSIST, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import internalStorage from '../storage/internalStorage';
import { authorizationReducerActions } from './slices/authorizationSlice';

export const rtkQueryErrorLogger: Middleware =
    ({ dispatch }) =>
        (next) =>
            (action) => {
                // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
                if (isRejectedWithValue(action)) {
                    console.error(action)
                    if (/* got token expired error */ false) {

                    } else if ((action.payload as any).status === 401) {
                        enqueueSnackbar({ message: 'Přihlášení vypršelo' })
                        dispatch(authorizationReducerActions.signOut() as any);
                    } else {
                        logger.error(action)
                        // enqueueSnackbar({ message: 'Nastala chyba', variant: 'error' })
                    }

                    // if (action.payload?.data?.error === 'disabledToken') {
                    //     dispatch(authorizationActions.signOut() as any);
                    //     dispatch(notificationActions.add({ message: errorMessages.getMessage("invalidToken"), options: { variant: 'warning' } }))
                    // } else if (action?.payload?.data?.error) {
                    //     dispatch(
                    //         notificationActions.add({
                    //             message: errorMessages.getMessage(action.payload.data.error),
                    //             options: { variant: 'error' },
                    //         })
                    //     );
                    // } else {
                    //     dispatch(notificationActions.add({ message: 'Nastala chyba', options: { variant: 'error' } }))
                    // };
                }

                return next(action);
            };

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })

            .concat(api.middleware)
            .concat(rtkQueryErrorLogger),
})

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export type AppStore = typeof store;