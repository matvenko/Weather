import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryProvider } from "./QueryProvider";
import { GlobalProvider } from "./GlobalProvider";
import { Provider } from "react-redux";
import { store } from "@src/app/store";

export default function PublicProviders({ children }) {
  return (
      <Provider store={store}>
        <BrowserRouter>
          <QueryProvider>
              <GlobalProvider>{children}</GlobalProvider>
          </QueryProvider>
        </BrowserRouter>
      </Provider>
  );
}
