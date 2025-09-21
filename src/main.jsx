import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./services/i18n/i18n.js";
import PublicProviders from "./providers/public/PublicProviders.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <PublicProviders>
            <App />
        </PublicProviders>
    </React.StrictMode>
);
