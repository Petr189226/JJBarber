import { createRoot } from "react-dom/client";
import { lazy, Suspense } from "react";
import App from "./app/App.tsx";
import "./styles/index.css";

const AdminApp = lazy(() => import("./app/admin/AdminApp.tsx").then((m) => ({ default: m.AdminApp })));

const isAdmin = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");

createRoot(document.getElementById("root")!).render(
  isAdmin ? (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" /></div>}>
      <AdminApp />
    </Suspense>
  ) : (
    <App />
  )
);
  