import { lazy, Suspense, useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { LanguageProvider } from "./i18n";

const Locations = lazy(() => import("./components/Locations").then((m) => ({ default: m.Locations })));
const Team = lazy(() => import("./components/Team").then((m) => ({ default: m.Team })));
const Services = lazy(() => import("./components/Services").then((m) => ({ default: m.Services })));
const Reviews = lazy(() => import("./components/Reviews").then((m) => ({ default: m.Reviews })));
const Booking = lazy(() => import("./components/Booking").then((m) => ({ default: m.Booking })));
const Footer = lazy(() => import("./components/Footer").then((m) => ({ default: m.Footer })));
const StickyBookBar = lazy(() => import("./components/StickyBookBar").then((m) => ({ default: m.StickyBookBar })));
const CookieBanner = lazy(() => import("./components/CookieBanner").then((m) => ({ default: m.CookieBanner })));

function SectionFallback({ minH = "40vh" }: { minH?: string }) {
  return <div style={{ minHeight: minH }} aria-hidden />;
}

export default function App() {
  const [showBelowFold, setShowBelowFold] = useState(false);
  const [showFooterExtras, setShowFooterExtras] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const schedule = (cb: () => void, delay: number) => {
      if ("requestIdleCallback" in window) {
        (window as any).requestIdleCallback(cb);
      } else {
        return window.setTimeout(cb, delay);
      }
      return undefined;
    };

    const belowFoldId = schedule(() => setShowBelowFold(true), 1200);
    const footerId = schedule(() => setShowFooterExtras(true), 2000);

    return () => {
      if (belowFoldId) window.clearTimeout(belowFoldId);
      if (footerId) window.clearTimeout(footerId);
    };
  }, []);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#0A0A0A]">
        <Navbar />
        <main>
          <Hero />
          {showBelowFold && (
            <>
              <Suspense fallback={<SectionFallback />}><Locations /></Suspense>
              <Suspense fallback={<SectionFallback />}><Team /></Suspense>
              <Suspense fallback={<SectionFallback />}><Services /></Suspense>
              <Suspense fallback={<SectionFallback />}><Reviews /></Suspense>
              <Suspense fallback={<SectionFallback />}><Booking /></Suspense>
            </>
          )}
        </main>
        {showFooterExtras && (
          <Suspense fallback={null}>
            <Footer />
            <StickyBookBar />
            <CookieBanner />
          </Suspense>
        )}
      </div>
    </LanguageProvider>
  );
}
