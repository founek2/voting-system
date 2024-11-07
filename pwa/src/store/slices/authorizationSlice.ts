import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { signInApi } from '../../endpoints/signIn';
// import { usersApi } from '../../../endpoints/users';
import internalStorage, { AccessToken } from '../../storage/internalStorage';
import { User_jsonld_user_read as User } from '../../endpoints/types';
import { usersApi } from '../../endpoints/users';

export interface AuthorizationState {
    loggedIn: boolean;
    accessTokenExpiresAt: number | undefined;
    currentUser: User | null;
}

const initialState: AuthorizationState = {
    loggedIn: false,
    accessTokenExpiresAt: 0,
    currentUser: null,
};

export const authorizationSlice = createSlice({
    name: 'authorization',
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<User>) => {
            state.loggedIn = action.payload ? true : false;
            state.currentUser = action.payload;
        },
        setAccessToken: (state, action: PayloadAction<AccessToken>) => {
            internalStorage.setAccessToken(action.payload)
        },
        signOut: (state, action: PayloadAction<void>) => {
            internalStorage.deleteAccessToken()
            // state = initialState

            return initialState
        },
    },
    extraReducers: (builder) => {
        builder.addCase('store/reset', (state) => {
            internalStorage.deleteAccessToken()

            return initialState
        });
        builder.addMatcher(signInApi.endpoints.signIn.matchFulfilled, (state, { payload }) => {
            state.loggedIn = true;
            state.accessTokenExpiresAt = payload.expires;

            if (payload.accessToken) internalStorage.setAccessToken({
                accessToken: payload.accessToken!,
                expires: payload.expires!,
                scope: ""
            })
        });
        builder.addMatcher(usersApi.endpoints.getUserMe.matchFulfilled, (state, { payload }) => {
            state.currentUser = payload
        });
        // builder.addMatcher(signInApi.endpoints.signInRefresh.matchFulfilled, (state, { payload }) => {
        //     const tokenPayload = parseJwt(payload.accessToken)

        //     internalStorage.emit("new_access_token", { token: payload.accessToken, expiresAt: tokenPayload.exp })
        // });
        // builder.addMatcher(signInApi.endpoints.signInOauth.matchFulfilled, (state, { payload }) => {
        //     const tokenPayload = parseJwt(payload.accessToken)

        //     state.loggedIn = true;
        //     state.refreshToken = payload.refreshToken;
        //     state.currentUser = payload.user;

        //     internalStorage.emit("new_access_token", { token: payload.accessToken, expiresAt: tokenPayload.exp })
        // });
        // builder.addMatcher(usersApi.endpoints.registerAndSignIn.matchFulfilled, (state, { payload }) => {
        //     const tokenPayload = parseJwt(payload.accessToken)

        //     state.loggedIn = true;
        //     state.refreshToken = payload.refreshToken;
        //     state.currentUser = payload.user;

        //     internalStorage.emit("new_access_token", { token: payload.accessToken, expiresAt: tokenPayload.exp })
        // });
        // builder.addMatcher(usersApi.endpoints.users.matchFulfilled, (state, { payload }) => {
        //     const currentUser = payload.find(user => user._id === state.currentUser?._id)
        //     if (currentUser) {
        //         state.currentUser = currentUser
        //     }
        // });
    },
});

export const authorizationReducerActions = authorizationSlice.actions;

export default authorizationSlice.reducer;