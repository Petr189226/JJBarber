"use client";

import { useState } from "react";
import Link from "next/link";

const SLUZBY = [
  { label: "Klasický střih – 550 Kč", value: "klasicky-strih" },
  { label: "Střih dlouhých vlasů – 690 Kč", value: "strih-dlouhych-vlasu" },
  { label: "Úprava vousů – 390 Kč", value: "uprava-vousu" },
  { label: "Střih + vousy – 790 Kč", value: "strih-vousy" },
  { label: "Dětský střih – 450 Kč", value: "detsky-strih" },
];

const POBOCKY = [
  { label: "Vršovice", value: "vrsovice" },
  { label: "Strašnice", value: "strasnice" },
];

const FORMSPREE_ENDPOINT = "https://formspree.io/f/maqdzrpp";

export default function VoucherPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const formAction = process.env.NEXT_PUBLIC_VOUCHER_FORM_URL || FORMSPREE_ENDPOINT;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (formAction && formAction !== "#") {
      setLoading(true);
      try {
        const res = await fetch(formAction, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          setSent(true);
          setError(false);
        } else {
          setSent(false);
          setError(true);
        }
      } catch {
        setSent(false);
        setError(true);
      }
      setLoading(false);
      return;
    }

    // Záložka: bez nastaveného NEXT_PUBLIC_VOUCHER_FORM_URL (např. Formspree) se jen otevře mailto.
    // Pro ukládání objednávek viz docs/VOUCHER-UKLADANI.md
    const mailto =
      "mailto:info@jjbarber.cz?subject=Objednávka dárkového poukazu" +
      "&body=" +
      encodeURIComponent(
        `Jméno: ${data.get("jmeno")}\nPříjmení: ${data.get("prijmeni")}\nEmail: ${data.get("email")}\nTelefon: ${data.get("telefon")}\nSlužba: ${data.get("sluzba")}\nPobočka: ${data.get("pobocka")}\nPoznámka: ${data.get("poznamka") || ""}`,
      );
    window.location.href = mailto;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="min-h-[calc(100dvh-56px)] bg-[var(--bg)] flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <h1 className="text-2xl font-bold text-white">Odesláno</h1>
          <p className="mt-3 text-gray-300">
            Vaše objednávka poukazu byla odeslána. Ozveme se vám co nejdříve.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-6 py-3 font-semibold text-black hover:bg-[var(--accent-hover)]"
          >
            Zpět na úvodní stránku
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-56px)] bg-[var(--bg)] py-12 px-4">
      <div className="mx-auto max-w-lg">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
        >
          <span aria-hidden>←</span> Zpět
        </Link>

        <h1 className="text-2xl font-bold text-white mb-2">Objednávka dárkového poukazu</h1>
        <p className="text-gray-400 text-sm mb-8">
          Vyplňte formulář. Vyzvednutí a platba na vybrané pobočce.
        </p>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 space-y-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="block text-sm font-medium text-gray-300 mb-1">Jméno</span>
              <input
                type="text"
                name="jmeno"
                required
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-white placeholder-gray-500 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                placeholder="Jan"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-300 mb-1">Příjmení</span>
              <input
                type="text"
                name="prijmeni"
                required
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-white placeholder-gray-500 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                placeholder="Novák"
              />
            </label>
          </div>

          <label className="block">
            <span className="block text-sm font-medium text-gray-300 mb-1">Email</span>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-white placeholder-gray-500 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              placeholder="jan@email.cz"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-300 mb-1">Telefon</span>
            <input
              type="tel"
              name="telefon"
              required
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-white placeholder-gray-500 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              placeholder="+420 777 123 456"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-300 mb-1">Výběr služby</span>
            <select
              name="sluzba"
              required
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-white focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            >
              {SLUZBY.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-300 mb-1">Vyzvednout a zaplatit na pobočce</span>
            <select
              name="pobocka"
              required
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-white focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            >
              {POBOCKY.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-300 mb-1">Poznámka</span>
            <textarea
              name="poznamka"
              rows={3}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-white placeholder-gray-500 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] resize-none"
              placeholder="Chcete více poukazů, nebo máte nějaké speciální přání? Dejte nám vědět."
            />
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="souhlas"
              required
              className="mt-1 h-4 w-4 rounded border-[var(--border)] bg-[var(--bg)] text-[var(--accent)] focus:ring-[var(--accent)]"
            />
            <span className="text-sm text-gray-400">
              Souhlasím se zásadami zpracování osobních údajů.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--accent)] py-3.5 font-semibold text-black hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)] disabled:opacity-60"
          >
            {loading ? "Odesílám…" : "Odeslat"}
          </button>
          {error && (
            <p className="text-sm text-red-400">
              Odeslání se nepovedlo. Zkuste to znovu nebo napište na{" "}
              <a href="mailto:info@jjbarber.cz" className="underline">info@jjbarber.cz</a>.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
