import { Grid2, Link as MuiLink, Paper, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/system";
import React from "react";
import { useGetPublicBoardMemebersQuery } from "../endpoints/board";
import { BoardMember_jsonld_member_public_read } from "../endpoints/types";

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
  const { data: membersData } = useGetPublicBoardMemebersQuery();
  const members = membersData?.member || [];

  const membersRows = members.map((member) => (
    <MemberRow key={member["@id"]} member={member} />
  ));

  return (
    <Paper component="footer" sx={{ py: 2, mt: 8 }}>
      <Grid2 container justifyContent="space-around" spacing={2}>
        <Grid2 size={{ xs: 12, md: 5 }} display="flex">
          <Grid2 container>
            <Grid2 px={2} size={{}}>
              <Typography color={grey[300]}>Členové volební komise:</Typography>
              {...membersRows.slice(0, 3)}
            </Grid2>
            <Grid2 px={2}>
              <TypographyStyled>&nbsp;</TypographyStyled>
              {...membersRows.slice(3)}
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
