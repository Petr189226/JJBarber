import { lazy, Suspense } from "react";
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
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#0A0A0A]">
        <Navbar />
        <main>
          <Hero />
          <Suspense fallback={<SectionFallback />}><Locations /></Suspense>
          <Suspense fallback={<SectionFallback />}><Team /></Suspense>
          <Suspense fallback={<SectionFallback />}><Services /></Suspense>
          <Suspense fallback={<SectionFallback />}><Reviews /></Suspense>
          <Suspense fallback={<SectionFallback />}><Booking /></Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
          <StickyBookBar />
          <CookieBanner />
        </Suspense>
      </div>
    </LanguageProvider>
  );
}
