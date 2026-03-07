import { createRoot } from "react-dom/client";
import { Component } from "react";
import { AdminApp } from "./app/admin/AdminApp";
import "./styles/index.css";

class ErrorBoundary extends Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(e: Error) {
    return { error: e };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
          <div className="max-w-lg text-red-400">
            <h2 className="text-lg font-semibold mb-2">Chyba</h2>
            <pre className="text-sm whitespace-pre-wrap overflow-auto">{this.state.error.message}</pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <AdminApp />
  </ErrorBoundary>
);
