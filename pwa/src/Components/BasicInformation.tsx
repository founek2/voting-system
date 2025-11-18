import { Grid, Link, Paper, Typography, withStyles } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useGetPublicAuthorizationUrlQuery } from "../endpoints/signIn";
import { useAppSelector } from "../hooks/app";
import Loader from "./Loader";
import internalStorage from "../storage/internalStorage";
import { useTranslation } from "react-i18next";

const TypographyPadded = styled(Typography)({ pt: 2 });

export default function BasicInformation() {
  const { t } = useTranslation()

  return (
    <Grid
      container
      spacing={5}
      display="flex"
      flexDirection="column"
      alignItems="center"
      size={12}
    >
      <Grid>
        <Typography variant="h3" color="primary" textAlign="center">
          {t('information.title')}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 10, lg: 8, xl: 6 }}>
        <Paper sx={{ p: 2, "& p:not(:first-of-type)": { pt: 1 } }}>
          <Typography variant="h3">{t('information.wantCandidate')}</Typography>
          <Typography variant="h5" pt={2}>
            {t('information.signIn')}
          </Typography>
          <Typography>
            {t('information.signInText1')}
          </Typography>
          <Typography>
            {t('information.signInText2')}
          </Typography>
          <Typography>{t('information.validadCandidateApplication')}</Typography>
          <Typography component="ul">
            <Typography component="li">{t('information.uidNumber')}</Typography>
            <Typography component="li">{t('information.fullName')}</Typography>
            <Typography component="li">{t('information.position')}</Typography>
            <Typography component="li">
              {t('information.skenedConsent')} ({t('common.eg')}{" "}
              <Link href="/assets/souhlas-jednotlivec.docx" target="_blank">
                DOCX
              </Link>
              ,{" "}
              <Link href="/assets/souhlas-jednotlivec.pdf" target="_blank">
                PDF
              </Link>
              )
            </Typography>
          </Typography>

          <Typography variant="h5" pt={2}>
            {t('information.poster')}
          </Typography>
          <Typography>
            {t('information.posterText1')}
          </Typography>
          <Typography>
            {t('information.posterText2')}
          </Typography>
          <Typography>
            {t('information.posterText3')}
          </Typography>
          <Typography>
            {t('information.posterText4')}
          </Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 10, lg: 8, xl: 6 }}>
        <Paper sx={{ p: 2, "& p:not(:first-of-type)": { pt: 1 } }}>
          <Typography variant="h3">{t('information.board')}</Typography>
          <Typography>
            {t('information.boardMembers')}
          </Typography>

          <Typography variant="h5" pt={2}>
            {t('information.boardMembersSubtitle1')}
          </Typography>
          <Typography>
            {t('information.boardMembersText2')}
          </Typography>
          <Typography>
            {t('information.boardMembersText3')}
          </Typography>

          <Typography variant="h5" pt={2}>
            {t('information.boardMembersSubtitle2')}
          </Typography>
          <Typography>
            {t('information.boardMembersText4')}
          </Typography>
          <Typography>
            {t('information.boardMembersText5')}
          </Typography>

          <Typography variant="h5" pt={2}>
            {t('information.chairman')}
          </Typography>
          <Typography>{t('information.chairmanText')}</Typography>
          <Typography>
            {t('information.chairmanDescription')}
          </Typography>
        </Paper>
      </Grid>
    </Grid >
  );
}
