import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import React from "react";
import { Position } from "../types";
import { BoardMember_jsonld_member_public_read } from "../endpoints/types";

interface MemberBoardCardProps {
  member: BoardMember_jsonld_member_public_read;
}
export function MemberBoardCard({ member }: MemberBoardCardProps) {
  return (
    <Card>
      <CardHeader
        title={`${member.appUser?.firstName} ${member.appUser?.lastName}`}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {member.position?.name}
        </Typography>
      </CardContent>
    </Card>
  );
}
