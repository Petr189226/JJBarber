import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Zásady ochrany osobních údajů | J&J Barber shop",
  description:
    "Zásady ochrany osobních údajů JJ Barbershop – jak nakládáme s údaji z webu, rezervací a newsletteru. GDPR.",
};

export default function ZasadyOchranyUdajuPage() {
  return (
    <div className="barbershop-bg min-h-[calc(100dvh-56px)]">
      <article className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Zásady ochrany osobních údajů – JJ Barbershop
        </h1>
        <p className="mt-4 text-gray-400">
          Platné od: 25. 11. 2025 · Web: www.jjbarbershop.cz · Kontakt: +420 777 507 662
        </p>

        <div className="mt-12 space-y-8 text-gray-300 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-1">
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white">1. Úvodní ustanovení</h2>
            <p className="mt-2 leading-relaxed">
              Tato stránka popisuje, jakým způsobem nakládáme s osobními údaji návštěvníků webu{" "}
              <strong>www.jjbarbershop.cz</strong>, našich zákazníků a osob registrovaných k odběru
              newsletteru. Ochrana osobních údajů je pro nás důležitá a probíhá v souladu s nařízením
              GDPR a dalšími platnými předpisy.
            </p>
            <p className="mt-2 leading-relaxed">Používáním našeho webu vyjadřujete souhlas s těmito zásadami.</p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-white">2. Jaké osobní údaje zpracováváme</h2>

            <h3 className="mt-6 font-semibold text-white">2.1 Údaje z návštěvy webu</h3>
            <p className="mt-2 leading-relaxed">
              Při návštěvě našeho webu mohou být automaticky zpracovávány údaje jako: IP adresa, typ
              zařízení a prohlížeče, provozní a analytická data, chování na webu (zobrazené stránky,
              kliknutí apod.). Tyto údaje mohou být ukládány pomocí cookies a podobných technologií.
            </p>

            <h3 className="mt-6 font-semibold text-white">2.2 Údaje z rezervačního systému Reservio</h3>
            <p>
              Pokud si u nás rezervujete termín přes systém <strong>Reservio</strong>, zpracováváme:
              jméno a příjmení, e-mailovou adresu, telefonní číslo (pokud je uvedeno), informace o
              rezervaci (datum, služba apod.).
            </p>

            <h3 className="mt-6 font-semibold text-white">2.3 Newsletter</h3>
            <p>
              Váš e-mail uvedený v systému Reservio můžeme využít pro rozesílání newsletteru s
              novinkami, akcemi a informacemi o službách JJ Barbershop. Z odběru se můžete kdykoliv
              odhlásit kliknutím na odhlašovací odkaz v každém e-mailu nebo nás kontaktovat.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-white">3. Cookies a podobné technologie</h2>
            <p>
              Na webu zobrazujeme lištu pro souhlas s cookies, kde můžete udělit nebo odmítnout
              souhlas (pouze nezbytné / přijmout vše). Cookies používáme zejména pro: správné
              fungování webu, analýzu návštěvnosti, personalizaci reklamy a zlepšení uživatelského
              zážitku. Podrobnosti naleznete v této stránce a v nastavení prohlížeče.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-white">4. Komu údaje předáváme</h2>
            <p>
              Vaše osobní údaje nepředáváme třetím stranám mimo níže uvedené poskytovatele služeb.
            </p>
            <ul className="list-disc pl-6">
              <li>
                <strong>Google</strong> – Google Analytics 4 (GA4), Google Ads (remarketing,
                personalizovaná reklama). Google může data kombinovat s dalšími informacemi, pokud
                máte účet Google a jste přihlášeni.
              </li>
              <li>
                <strong>Meta (Facebook, Instagram)</strong> – měření konverzí (Meta Pixel),
                remarketing, cílená reklama.
              </li>
              <li>
                <strong>Reservio</strong> – rezervační systém, správa rezervací, uchování
                kontaktních údajů a jejich využití pro newsletter.
              </li>
            </ul>
            <p className="mt-2">
              Všichni výše uvedení mají vlastní zásady ochrany osobních údajů a fungují jako
              zpracovatelé nebo samostatní správci.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-white">5. Právní důvody pro zpracování</h2>
            <p>Osobní údaje zpracováváme na základě:</p>
            <ul className="list-disc pl-6">
              <li>oprávněného zájmu (marketing, statistiky, newsletter stávajícím zákazníkům)</li>
              <li>plnění smlouvy (rezervace termínu)</li>
              <li>souhlasu (volitelné analytické a marketingové cookies)</li>
              <li>splnění právních povinností</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-white">6. Doba uchování údajů</h2>
            <ul className="list-disc pl-6">
              <li>Údaje z rezervací: po dobu trvání poskytování služeb a dle zákonných lhůt.</li>
              <li>Newsletter: do odvolání souhlasu nebo odhlášení z odběru.</li>
              <li>Cookies: dle vašeho výběru v cookie liště a nastavení prohlížeče.</li>
              <li>Analytická data: obvykle 14–26 měsíců podle nastavení platforem.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-white">7. Vaše práva</h2>
            <p>Máte právo na:</p>
            <ul className="list-disc pl-6">
              <li>přístup ke svým osobním údajům</li>
              <li>opravu nebo doplnění údajů</li>
              <li>výmaz (pokud je to právně možné)</li>
              <li>omezení zpracování</li>
              <li>přenositelnost údajů</li>
              <li>vznést námitku proti marketingovému zpracování</li>
              <li>podat stížnost u ÚOOÚ</li>
            </ul>
            <p className="mt-2">
              Chcete-li uplatnit jakékoli právo, kontaktujte nás na tel.{" "}
              <a href="tel:+420777507662">+420 777 507 662</a>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-white">8. Bezpečnost</h2>
            <p>
              Dbáme na bezpečné nakládání s osobními údaji. Všechna data chráníme technickými i
              organizačními opatřeními, aby nedošlo k jejich zneužití, ztrátě nebo neoprávněnému
              přístupu.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-white">9. Změny zásad</h2>
            <p>
              Tyto zásady můžeme příležitostně aktualizovat. Aktuální verze je vždy dostupná na této
              stránce.
            </p>
          </section>
        </div>

        <p className="mt-12 border-t border-[var(--border)] pt-8 text-sm text-gray-400">
          Provozovatel: JJ Barbershop · Kontakt:{" "}
          <a href="tel:+420777507662" className="text-[var(--accent)] hover:underline">
            +420 777 507 662
          </a>
        </p>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            ← Zpět na úvodní stránku
          </Link>
        </div>
      </article>
    </div>
  );
}
