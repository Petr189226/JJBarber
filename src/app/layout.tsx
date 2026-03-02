import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { CookieBar } from "@/components/cookie-bar";
import { PreconnectReservio } from "@/components/preconnect-reservio";
import { LocaleProvider } from "@/lib/locale-context";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "J&J Barber Shop – Praha 10",
  description:
    "Kvalitní střihy a úprava vousů v srdci Prahy. Rezervujte si termín online – pobočky Strašnice a Vršovice.",
  icons: [
    { url: "/icon.svg", type: "image/svg+xml" },
    { url: "/logo.png", type: "image/png", sizes: "192x192" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs" className="dark">
      <body className={`${geist.variable} font-sans antialiased`}>
        <LocaleProvider>
        <a
          href="#main"
          className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-black focus:font-semibold focus:not-sr-only"
        >
          Přeskočit na obsah
        </a>
        <Header />
        <PreconnectReservio />
        <main id="main" className="w-full">
          {children}
        </main>
        <CookieBar />
        </LocaleProvider>
      </body>
    </html>
  );
}
