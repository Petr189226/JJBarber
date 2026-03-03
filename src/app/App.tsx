import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { Locations } from "./components/Locations";
import { Team } from "./components/Team";
import { Reviews } from "./components/Reviews";
import { Booking } from "./components/Booking";
import { Footer } from "./components/Footer";
import { StickyBookBar } from "./components/StickyBookBar";
import { CookieBanner } from "./components/CookieBanner";
import { LanguageProvider } from "./i18n";

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#0A0A0A]">
        <Navbar />
        <main>
          <Hero />
          <Locations />
          <Team />
          <Services />
          <Reviews />
          <Booking />
        </main>
        <Footer />
        <StickyBookBar />
        <CookieBanner />
      </div>
    </LanguageProvider>
  );
}
