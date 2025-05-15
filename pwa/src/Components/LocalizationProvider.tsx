import React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { cs } from "date-fns/locale/cs";
import { LocalizationProvider as MuiLocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function LocalizationProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <MuiLocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={cs}>
      {children}
    </MuiLocalizationProvider>
  );
}
