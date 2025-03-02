// import React from 'react'
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router } from "react-router-dom";
import { FirebaseProvider } from "./config/Firebase.jsx";
import { store } from "./redux/store.js";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <FirebaseProvider>
        <Router>
          <App />
          <Toaster />
        </Router>
      </FirebaseProvider>
    </Provider>
  </StrictMode>
);
