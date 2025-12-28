import { enqueueSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/Loader";
import { useAppDispatch, useAppSelector } from "../hooks/app";
import { authorizationReducerActions } from "../store/slices/authorizationSlice";

// Signout must be done outside of AuthGuard to re-signing
export function SignOutPage() {
    const loggedId = useAppSelector((state) => state.authorization.loggedIn);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loggedId) {
            navigate("/");
            return
        }

        dispatch(authorizationReducerActions.signOut());
        enqueueSnackbar("Byl jste odhlášen");
        navigate("/")
    }, [dispatch, navigate])


    return <Loader />;
}