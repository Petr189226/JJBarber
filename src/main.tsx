import { createRoot } from "react-dom/client";
import { createElement } from "react";
import "./styles/index.css";

// App shell in separate chunk: initial parse is minimal (react-vendor + this stub).
// App chunk (Navbar, Hero, i18n, etc.) loads right after and renders without blocking first paint.
import("./app/App.tsx").then((m) => {
  const root = document.getElementById("root");
  if (root) createRoot(root).render(createElement(m.default));
});
  