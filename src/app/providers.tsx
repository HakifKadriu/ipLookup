"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./state/store";
import Navbar from "./components/navbar";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <Navbar />
      {children}
    </Provider>
  );
}
