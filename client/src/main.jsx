import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import {BrowserRouter} from 'react-router-dom'
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <GoogleOAuthProvider clientId="820731786570-o1e5tcai4353mg32k6cns0c6dfqs9atl.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
  </BrowserRouter>
);
