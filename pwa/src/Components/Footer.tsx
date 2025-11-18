import { Grid, Link as MuiLink, Paper, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/system";
import React, { useTransition } from "react";
import { useGetPublicBoardMemebersQuery } from "../endpoints/board";
import { BoardMember_jsonld_member_public_read } from "../endpoints/types";
import { useTranslation } from "react-i18next";

const TypographyStyled = styled(Typography)({
  variant: "body2",
  color: grey[400],
});

function MemberRow({
  member,
}: {
  member: BoardMember_jsonld_member_public_read;
}) {
  if (!member) return null;
  return (
    <TypographyStyled>
      {member.appUser?.firstName} {member.appUser?.lastName} (
      {member.position?.name})
    </TypographyStyled>
  );
}

export function Footer() {
  const { t, i18n } = useTranslation()
  const { data: membersData } = useGetPublicBoardMemebersQuery();
  const members = membersData?.member || [];

  const membersRows = members.map((member) => (
    <MemberRow key={member["@id"]} member={member} />
  ));

  const changeLanguageTo = i18n.language === 'cs' ? 'en' : 'cs';

  const half = Math.ceil(membersRows.length / 2);
  return (
    <Paper component="footer" sx={{ py: 2, mt: 8 }}>
      <Grid container justifyContent="space-around" spacing={2}>
        <Grid size={{ xs: 12, md: 5 }} display="flex">
          <Grid container>
            <Grid px={2} size={{}}>
              <Typography color={grey[300]}>{t('footer.electionComiteeMembers')}</Typography>
              {...membersRows.slice(0, half)}
            </Grid>
            <Grid px={2}>
              <TypographyStyled>&nbsp;</TypographyStyled>
              {...membersRows.slice(half)}
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }} display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <TypographyStyled>
            <MuiLink href={`/?lng=${changeLanguageTo}`} onClick={e => {
              e.preventDefault();
              i18n.changeLanguage(changeLanguageTo);
            }}>
              {t('footer.language')}
            </MuiLink>
          </TypographyStyled>
          <TypographyStyled px={2}>
            {t('footer.reportIssues')}{" "}
            <MuiLink
              href="https://github.com/founek2/voting-system/issues"
              underline="none"
            >
              Issue tracker
            </MuiLink>
          </TypographyStyled>
        </Grid>
      </Grid>
    </Paper>
  );
}
