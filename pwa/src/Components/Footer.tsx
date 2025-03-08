import { Box, Grid2, Paper, Typography, Link as MuiLink } from "@mui/material";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/system";
import React from "react";

const TypographyStyled = styled(Typography)({
  variant: "body2",
  color: grey[400],
});

export function Footer() {
  return (
    <Paper component="footer" sx={{ py: 2, mt: 8 }}>
      <Grid2 container justifyContent="space-around" spacing={2}>
        <Grid2 size={{ xs: 12, md: 5 }} display="flex">
          <Grid2 container>
            <Grid2 px={2} size={{}}>
              <Typography color={grey[300]}>Členové volební komise:</Typography>
              <TypographyStyled>Tomáš Taraba (předseda)</TypographyStyled>
              <TypographyStyled>Jaroslav Rozmuš</TypographyStyled>
              <TypographyStyled>Filip Smolek</TypographyStyled>
            </Grid2>
            <Grid2 px={2}>
              <TypographyStyled>&nbsp;</TypographyStyled>
              <TypographyStyled>Ondřej Svoboda</TypographyStyled>
              <TypographyStyled>Jaroslav Rozmuš</TypographyStyled>
              <TypographyStyled>Barbora Svobodová</TypographyStyled>
            </Grid2>
          </Grid2>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 3 }} display="flex" alignItems="center">
          <TypographyStyled px={2}>
            Chyby systému hlašte na{" "}
            <MuiLink
              href="https://github.com/founek2/voting-system/issues"
              underline="none"
            >
              Issue tracker
            </MuiLink>
          </TypographyStyled>
        </Grid2>
      </Grid2>
    </Paper>
  );
}
