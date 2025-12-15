import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import queryClient from "./utils/queryClient";
import "./index.css";
import { store } from "./redux/store.jsx";
import { Provider } from "react-redux";
import AuthBootstrap from "./utils/authBootstrap.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthBootstrap>
          <App />
        </AuthBootstrap>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
