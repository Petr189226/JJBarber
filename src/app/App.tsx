import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
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

/** Renders children (lazy chunk) only when the sentinel is near the viewport. */
function LazySection({ children, minH = "40vh" }: { children: ReactNode; minH?: string }) {
  const [inView, setInView] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setInView(true);
      },
      { rootMargin: "120px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!inView) return <div ref={sentinelRef} style={{ minHeight: minH }} aria-hidden />;
  return <Suspense fallback={<SectionFallback minH={minH} />}>{children}</Suspense>;
}

export default function App() {
  const [showFooterExtras, setShowFooterExtras] = useState(false);
  const footerSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = footerSentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setShowFooterExtras(true);
      },
      { rootMargin: "100px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#0A0A0A]">
        <Navbar />
        <main>
          <Hero />
          <LazySection><Locations /></LazySection>
          <LazySection><Team /></LazySection>
          <LazySection><Services /></LazySection>
          <LazySection><Reviews /></LazySection>
          <LazySection><Booking /></LazySection>
        </main>
        <div ref={footerSentinelRef} style={{ minHeight: 1 }} aria-hidden />
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
