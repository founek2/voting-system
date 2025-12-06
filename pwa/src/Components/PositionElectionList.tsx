import React from "react";
import { List, ListItem, ListItemAvatar, ListItemText, Typography, useTheme } from "@mui/material";
import { Candidate_jsonld_candidate_read } from "../endpoints/types";
import { groupByPosition } from "../util/candidateGroup";
import PersonIcon from '@mui/icons-material/Person';

export function PositionElectionList({ candidates }: { candidates: Candidate_jsonld_candidate_read[] }) {
    const theme = useTheme()
    return <List dense={true}>
        {Object.entries(groupByPosition(candidates))
            .sort(([a], [b]) => a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true }))
            .map(([position, candidates]) => <ListItem key={position} disablePadding>
                <ListItemAvatar>
                    <PersonIcon sx={{ fill: theme.palette.text.secondary }} />
                </ListItemAvatar>
                <ListItemText primary={<Typography color="textSecondary">{position}</Typography>} />
            </ListItem>)}
    </List>
}