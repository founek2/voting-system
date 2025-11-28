import React, { useContext } from "react"
import { IconButton } from "@mui/material";
import { ColorModeContext } from "../context/colorMode";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

export function ColorModeButton() {
    const [colorMode, setColorMode] = useContext(ColorModeContext)

    return <IconButton onClick={() => setColorMode(colorMode == "dark" ? "light" : "dark")}>
        {colorMode == "dark" ? <LightModeIcon color="disabled" /> : <DarkModeIcon color="disabled" />}
    </IconButton>
}