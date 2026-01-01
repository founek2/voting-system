import { Button, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../Components/Loader";
import { useSignInMutation } from "../endpoints/signIn";
import internalStorage from "../storage/internalStorage";
import { handleError } from "../util/handleError";

export default function OAuthCallback() {
  const [params, setParams] = useSearchParams({ code: "" });
  const [signIn, { isLoading }] = useSignInMutation();
  const navigate = useNavigate();
  const initialized = useRef(false)
  const code = params.get("code");

  async function run() {
    if (!code || isLoading) return;

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
    if (initialized.current) return;
    initialized.current = true;
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
