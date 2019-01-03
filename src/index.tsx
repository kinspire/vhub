import * as log from "loglevel";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

log.setLevel("debug");

ReactDOM.render(
  <BrowserRouter basename="/vhub">
    <App />
  </BrowserRouter>,
  document.getElementById("root") as HTMLElement
);
