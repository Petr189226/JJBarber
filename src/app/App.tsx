import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { PrivacyModal } from "./components/PrivacyModal";
import { TermsModal } from "./components/TermsModal";
import { LanguageProvider } from "./i18n";
import { useInView } from "./hooks/useInView";

const WhyUs = lazy(() => import("./components/WhyUs").then((m) => ({ default: m.WhyUs })));
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

/**
 * Renders children (lazy chunk) only when the sentinel scrolls into view.
 * Uses useInView so the hook lives in the main bundle and lazy chunks don't pull it (shorter critical chain).
 */
function LazySection({ children, minH = "40vh" }: { children: ReactNode; minH?: string }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sentinelRef, { once: true, margin: "0px 0px -25% 0px" });

  if (!inView) return <div ref={sentinelRef} style={{ minHeight: minH }} aria-hidden />;
  return <Suspense fallback={<SectionFallback minH={minH} />}>{children}</Suspense>;
}

export default function App() {
  const [showFooterExtras, setShowFooterExtras] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const footerSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = footerSentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setShowFooterExtras(true);
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onPrivacy = () => setPrivacyOpen(true);
    const onTerms = () => setTermsOpen(true);
    window.addEventListener("jj-open-privacy", onPrivacy);
    window.addEventListener("jj-open-terms", onTerms);
    return () => {
      window.removeEventListener("jj-open-privacy", onPrivacy);
      window.removeEventListener("jj-open-terms", onTerms);
    };
  }, []);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#0A0A0A]">
        <Navbar />
        <main>
          <Hero />
          <LazySection><WhyUs /></LazySection>
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
          </Suspense>
        )}
        <Suspense fallback={null}>
          <CookieBanner />
        </Suspense>
        <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
        <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
      </div>
    </LanguageProvider>
  );
}
