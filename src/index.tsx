import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { Helmet } from "react-helmet";
import { APP_DESCRIPTION, APP_TITLE } from "./utils/constants";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <Helmet>
      <title>{APP_TITLE}</title>
      <meta name="description" content={APP_DESCRIPTION} />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Helmet>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
