import { render } from "preact";
import { App } from "./App";
import { AppProvider } from "./context";
import { initializeI18n } from "./i18n";
import { createBrowserKV } from "./kv";
import { createAppState } from "./stores/app";
import "./styles/global.css";

const root = document.getElementById("app");

if (!root) {
  throw new Error("Missing application root: #app");
}

const state = createAppState(createBrowserKV());
void initializeI18n().then(() =>
  render(
    <AppProvider state={state}>
      <App />
    </AppProvider>,
    root,
  ),
);
