import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React, { Suspense, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSignInMutation } from "../endpoints/signIn";
import { useAsyncEffect } from "../hooks/useAsyncEffect";
import { enqueueSnackbar } from "notistack";
import Loader from "../Components/Loader";
import internalStorage from "../storage/internalStorage";
import { Link } from "react-router-dom";
import { handleError } from "../util/handleError";

let firsRender = true;

export default function OAuthCallback() {
  const [params, setParams] = useSearchParams({ code: "" });
  const code = params.get("code");
  const [signIn, { isLoading }] = useSignInMutation();
  const navigate = useNavigate();

  async function run() {
    if (!code || isLoading || !firsRender) return;
    firsRender = false;
    setParams(new URLSearchParams());

    const result = await signIn({ code });
    if (result.error) {
      handleError(result.error, 'Nastala chyba při přihlašování. Zkuste to znovu');
    } else {
      const originalUrl = internalStorage.popOriginalUrl();
      if (originalUrl) navigate(originalUrl);
      else navigate("/auth/user");
    }
  }

  useEffect(() => {
    run();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <Typography color="textPrimary">
      Nastala chyba v procesu přihlašování. Zkuste to znovu.{" "}
      <Link to="/">
        <Button>Hlavní stránka</Button>
      </Link>
    </Typography>
  );
}
