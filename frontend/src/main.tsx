import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./utils/routerConfig.tsx";
import { ThemeProvider } from "@mui/material";
import { theme } from "./utils/theme.ts";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import { getToken } from "./utils/helpers.ts";

const stripePromise = loadStripe(
  "pk_test_51OzWAsCze0fcYUhcfQYrMghHwYyKUfWDtnXB9151uP8mQtEDMr9IjhrHFtiAxJqVYyUCAq3GNGrYL0fMfo1FXv3V00Zw8GUq9Q"
);

axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Elements>
  </React.StrictMode>
);
