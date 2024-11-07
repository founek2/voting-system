import CircularProgress from "@mui/material/CircularProgress";
import { SnackbarProvider } from "notistack";
import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import MyRoutes from "./Containers/Routes";
import { MyThemeProvider } from "./Containers/ThemeProvider";
import { persistor, store } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <MyThemeProvider>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <BrowserRouter>
              <Suspense fallback={<CircularProgress />}>
                <MyRoutes />
              </Suspense>
            </BrowserRouter>
          </SnackbarProvider>
        </MyThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
