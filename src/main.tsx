import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// Static import so the browser discovers App chunk when parsing entry and can load it in parallel
// instead of waiting for entry to execute (shorter critical path, better LCP).
createRoot(document.getElementById("root")!).render(<App />);
  