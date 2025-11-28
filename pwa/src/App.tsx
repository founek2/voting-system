import { SnackbarProvider } from "notistack";
import "./locales/i18n";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { router } from "./Containers/Routes";
import { MyThemeProvider } from "./Containers/ThemeProvider";
import { persistor, store } from "./store";
import { ColorModeContext } from "./context/colorMode";
import { PaletteMode } from "@mui/material";


const COLOR_MODE_KEY = 'colorMode'
function loadDefault(): PaletteMode {
  const isDarkPreferred = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const savedValue = localStorage.getItem(COLOR_MODE_KEY)
  if (savedValue) {
    return savedValue as PaletteMode
  }

  return isDarkPreferred ? 'dark' : 'light'
}
const defaultColorMode = loadDefault()

function App() {
  const contextValue = useState<PaletteMode>(defaultColorMode)
  const colorMode = contextValue[0];

  useEffect(() => {
    if (colorMode) {
      localStorage.setItem(COLOR_MODE_KEY, colorMode)
    }
  }, [colorMode])

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ColorModeContext.Provider value={contextValue}>
          <MyThemeProvider>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <RouterProvider router={router} />
            </SnackbarProvider>
          </MyThemeProvider>
        </ColorModeContext.Provider>
      </PersistGate>
    </Provider>
  );
}

export default App;
