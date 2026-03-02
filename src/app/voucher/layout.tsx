import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Objednat dárkový poukaz | J&J Barber shop",
  description: "Objednejte si dárkový poukaz na služby J&J Barber shop. Vyzvednutí a platba na pobočce Vršovice nebo Strašnice.",
};

export default function VoucherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
