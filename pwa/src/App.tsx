import { SnackbarProvider } from "notistack";
import React from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { router } from "./Containers/Routes";
import { MyThemeProvider } from "./Containers/ThemeProvider";
import { persistor, store } from "./store";

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <MyThemeProvider>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <RouterProvider router={router} />
          </SnackbarProvider>
        </MyThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
