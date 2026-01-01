import { Button, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Loader from "../Components/Loader";
import { useSignInMutation } from "../endpoints/signIn";
import internalStorage from "../storage/internalStorage";
import { handleError } from "../util/handleError";
import { useTranslation } from "react-i18next";

export default function OAuthCallback() {
  const [params, setParams] = useSearchParams({ code: "" });
  const [signIn, { isLoading }] = useSignInMutation();
  const navigate = useNavigate();
  const initialized = useRef(false)
  const { t } = useTranslation()
  const code = params.get("code");

  async function run() {
    if (!code || isLoading) return;

    setParams(new URLSearchParams());

    const result = await signIn({ code });
    if (result.error) {
      handleError(result.error, t("oauth.loginError"));
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
      {t("oauth.loginError")}{" "}
      <Link to="/">
        <Button>{t("common.actionMainPage")}</Button>
      </Link>
    </Typography>
  );
}
