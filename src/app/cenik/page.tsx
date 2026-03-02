import Link from "next/link";

const CENIK_ITEMS = [
  { title: "Úprava vousů", price: 390, desc: "zkrácení délky vousů, zaholení kontur břitvou, úprava obočí, odstranění chloupků z uší, ošetření pokožky" },
  { title: "Holení vousů", price: 390, desc: "napaření vousů párou, oholení břitvou, úprava obočí, odstranění chloupků z uší, ošetření pokožky" },
  { title: "Dětský střih", price: 450, desc: "střihání strojkem, střihání nůžkami, úprava kontur, styling, možnost hair tattoo" },
  { title: "Klasický střih", price: 490, desc: "střihání strojkem, střihání nůžkami, zaholení kontur, úprava obočí, mytí hlavy, masáž hlavy, styling" },
  { title: "Střih dlouhých vlasů", price: 690, desc: "střihání nůžkami, zaholení kontur, úprava obočí, mytí hlavy, masáž hlavy, styling" },
  { title: "Střih + vousy", price: 790, desc: "střihání strojkem, nůžkami, zaholení kontur, úprava obočí, mytí hlavy, úprava nebo holení vousů, ošetření pokožky" },
];

export const metadata = {
  title: "Ceník | J&J Barber shop",
  description: "Kompletní ceník služeb J&J Barber shop – střihy, vousy, holení. Praha 10 – Vršovice a Strašnice.",
};

export default function CenikPage() {
  return (
    <div className="barbershop-bg min-h-[calc(100dvh-56px)]">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <h1 className="text-center text-3xl font-bold text-white sm:text-4xl">Kompletní ceník</h1>
        <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-[var(--accent)]" />
        <p className="mx-auto mt-4 max-w-xl text-center text-gray-300">
          Ceny jsou orientační. Rezervujte si termín online a vyberte službu přímo u nás.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {CENIK_ITEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)]/90 p-6 transition hover:border-[var(--accent)]/40"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-bold text-white">{item.title}</h2>
                <span className="shrink-0 text-xl font-bold text-[var(--accent)]">{item.price} Kč</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <Link
            href="/#sluzby"
            className="rounded-lg border border-[var(--border)] px-6 py-3 font-medium text-white transition hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
          >
            ← Zpět na úvod
          </Link>
          <Link
            href="https://j-j-barbershop.reservio.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-[var(--accent)] px-8 py-4 font-semibold text-black transition hover:bg-[var(--accent-hover)]"
          >
            Rezervovat termín
          </Link>
        </div>
      </div>
    </div>
  );
}
