import { render } from "preact";
import { App } from "./App";
import "./styles/global.css";

const root = document.getElementById("app");

if (!root) {
  throw new Error("Missing application root: #app");
}

render(<App />, root);
