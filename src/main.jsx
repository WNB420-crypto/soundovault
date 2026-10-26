// localStorage polyfill for window.storage API
if (!window.storage) {
  window.storage = {
    get: async (key) => {
      try {
        const v = localStorage.getItem(key);
        return v ? { key, value: v } : null;
      } catch { return null; }
    },
    set: async (key, value) => {
      try {
        localStorage.setItem(key, value);
        return { key, value };
      } catch { return null; }
    },
    delete: async (key) => {
      try { localStorage.removeItem(key); return { key }; } catch { return null; }
    },
    list: async () => {
      try {
        const keys = Object.keys(localStorage);
        return { keys };
      } catch { return { keys: [] }; }
    }
  };
}

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
