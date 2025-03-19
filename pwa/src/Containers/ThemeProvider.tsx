import React, { useEffect, useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import { orange } from "@mui/material/colors";
import { PaletteMode } from "@mui/material";

export const LIGHT_BACKGROUND = "#fafafa";
export const DARK_BACKGROUND = "#4c4c4c";
export const WINNER_COLOR = "#c88d2e";

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

export function MyThemeProvider({ children }: { children: React.ReactNode }) {
  //   const colorMode = useAppSelector(getColorMode);
  const colorMode = "dark" as PaletteMode;
  const theme = useMemo(
    () =>
      createTheme({
        status: {
          danger: orange[500],
        },
        palette: {
          mode: colorMode,
        },
      }),
    [colorMode]
  );

  useEffect(() => {
    const body = window.document.querySelector("body");
    if (!body) return;

    switch (colorMode) {
      case "light":
        body.style.backgroundColor = LIGHT_BACKGROUND;
        break;
      case "dark":
        body.style.backgroundColor = DARK_BACKGROUND;
        break;
    }
  });

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </>
  );
}
