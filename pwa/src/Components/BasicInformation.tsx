import { Grid2, Link, Paper, Typography, withStyles } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useGetPublicAuthorizationUrlQuery } from "../endpoints/signIn";
import { useAppSelector } from "../hooks/app";
import Loader from "./Loader";
import internalStorage from "../storage/internalStorage";

const TypographyPadded = styled(Typography)({ pt: 2 });

export default function BasicInformation() {
  return (
    <Grid2
      container
      spacing={5}
      display="flex"
      flexDirection="column"
      alignItems="center"
      size={12}
    >
      <Grid2>
        <Typography variant="h3" color="primary" textAlign="center">
          Základní informace
        </Typography>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 10, lg: 8, xl: 6 }}>
        <Paper sx={{ p: 2, "& p:not(:first-of-type)": { pt: 1 } }}>
          <Typography variant="h3">Chceš kandidovat?</Typography>
          <Typography variant="h5" pt={2}>
            Přihlášení
          </Typography>
          <Typography>
            Kandidovat do představenstva klubu může pouze člen SH, který není
            zároveň členem volební komise. Kandidovat lze současně pouze na
            jednu pozici.
          </Typography>
          <Typography>
            Přihlašuje se elektronicky na e-mail volební komise volby@sh.cvut.cz
            z klubové e-mailové adresy. Tou se rozumí adresa v doméně
            siliconhill.cz nebo sh.cvut.cz.
          </Typography>
          <Typography>Platná přihláška kandidáta musí obsahovat:</Typography>
          <Typography component="ul">
            <Typography component="li">Číslo člena klubu (UID)</Typography>
            <Typography component="li">Jméno a příjmení</Typography>
            <Typography component="li">Pozici, na kterou kandiduje</Typography>
            <Typography component="li">
              Naskenovaný nebo vyfocený podepsaný souhlas s kandidaturou (např.{" "}
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
            Informační plakát
          </Typography>
          <Typography>
            Každý kandidát má možnost zaslat informační plakát, který bude
            vystaven na těchto stránkách. Zveřejněn bude pouze plakát, nikoli
            video či audio.
          </Typography>
          <Typography>
            Doporučovaný a preferovaný je formát PDF a doporučenými prvky
            plakátu jsou – formát A4, osobní údaje, fotografie, kontaktní
            e-mail, důvod kandidatury, volební program, osobní zásluhy v klubu
            Silicon Hill apod.
          </Typography>
          <Typography>
            Informační plakát by neměl napadat či osočovat jiné osoby.
          </Typography>
          <Typography>
            V případě, že informační plakát nebude vyhovovat popsaným
            požadavkům, volební komise ho nemusí přijmout a vrátí ho kandidátovi
            k opravení.
          </Typography>
        </Paper>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 10, lg: 8, xl: 6 }}>
        <Paper sx={{ p: 2, "& p:not(:first-of-type)": { pt: 1 } }}>
          <Typography variant="h3">Představenstvo</Typography>
          <Typography>
            Představenstvo klubu Silicon Hill má nejvýše 15 členů:
          </Typography>

          <Typography variant="h5" pt={2}>
            10 zástupců bloků
          </Typography>
          <Typography>
            Voleni všemi obyvateli daného bloku, členové klubu mohou využít
            elektronické verze hlasování.
          </Typography>
          <Typography>
            Řeší kromě celoklubových záležitostí také problémy bloku. Jedná se o
            udržení chodu služeb (síť, zájmové místnosti) a také o zajištění
            důstojné prezentace názorů ubytovaných/zastupovaných studentů
            (nespokojenost s úklidem, potížisté, rozvoj bloku). Předpokládá se
            úzká spolupráce s hospodářkou bloku a s technicko-síťovým manažerem.
          </Typography>

          <Typography variant="h5" pt={2}>
            4 celokluboví zástupci
          </Typography>
          <Typography>
            Voleni pouze členy klubu v elektronickém hlasování.
          </Typography>
          <Typography>
            Nemají blokovou příslušnost, nejsou tedy zatíženi starostmi o
            konkrétní blok a mohou se plně věnovat dalšímu rozvoji studentských
            aktivit na kolejích.
          </Typography>

          <Typography variant="h5" pt={2}>
            Předseda
          </Typography>
          <Typography>Volen představenstvem klubu.</Typography>
          <Typography>
            Zastupuje klub navenek, každopádně neměl by být jedinou akční
            složkou.
          </Typography>
        </Paper>
      </Grid2>
    </Grid2>
  );
}
