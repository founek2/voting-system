import PersonIcon from '@mui/icons-material/Person';
import { List, ListItem, ListItemAvatar, ListItemText, Typography, useTheme } from "@mui/material";
import React from "react";
import { Position_jsonld_position_read } from "../endpoints/types";

export function PositionElectionList({ positions }: { positions: Position_jsonld_position_read[] }) {
    const theme = useTheme()
    return <List dense={true}>
        {positions
            .sort((a, b) => a.name!.localeCompare(b.name!, undefined, { sensitivity: 'base', numeric: true }))
            .map((position) => <ListItem key={position["@id"]} disablePadding>
                <ListItemAvatar>
                    <PersonIcon sx={{ fill: theme.palette.text.secondary }} />
                </ListItemAvatar>
                <ListItemText primary={<Typography color="textSecondary">{position.name}</Typography>} />
            </ListItem>)}
    </List>
}