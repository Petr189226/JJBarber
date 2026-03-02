# Homepage UX checklist (8.8 → 9.5)

## A) UX audit – 10 doporučení

| # | Doporučení | Dopad | Náročnost |
|---|------------|-------|-----------|
| 1 | Hero: přidat social proof (rating, pobočky, online rezervace) bez scrollu | High | S |
| 2 | Hero: sekundární CTA „Vybrat pobočku“ pro uživatele, kteří chtějí nejdřív místo | High | S |
| 3 | Pobočky: „Rezervovat u této pobočky“ jako tlačítko (ne text link) – lepší affordance | High | S |
| 4 | Služby: u každé služby 1 řádek benefitu + 1× badge „Nejoblíbenější“ + CTA jako tlačítko | High | M |
| 5 | Ceník: na homepage jen krátký blok + CTA na /cenik (odstranit duplicitu 6 karet) | Med | S |
| 6 | Tým: tag specializace + CTA „Rezervovat u [jméno]“ pro personalizaci | High | M |
| 7 | Recenze: vyšší kontrast textu, „Zobrazit všechny“ jako výrazné tlačítko; desktop 3 karty bez slideru | Med | M |
| 8 | Sticky CTA na mobilu: snížit threshold (200–300 px) + přidat odkaz Pobočky | Med | S |
| 9 | Hero + CTA: jemný fade-in (CSS), kontrola kontrastu a focus states (a11y) | Med | S |
| 10 | Pobočky: micro-interaction hover (border/glow) na desktopu | Low | S |

---

## B–I) Implementační checklist

- [x] **B Hero** – badges (4.9/5, 2 pobočky Praha 10, Online rezervace), sekundární CTA, fade-in, a11y
- [x] **C Sticky CTA** – threshold 250px, odkaz „Pobočky“
- [x] **D Pobočky** – tlačítko místo linku, hover glow
- [x] **E Služby** – benefit řádek, „Nejoblíbenější“, button-like CTA
- [x] **F Ceník** – minimalizovat na CTA → /cenik
- [x] **G Tým** – specializace + Rezervovat u [jméno]
- [x] **H Recenze** – kontrast, CTA button, desktop 3 bez slideru
- [x] **I Performance** – next/image sizes, dynamický import, prefetch

## A11y a performance
- A11y: Hero CTA aria-label, focus-visible ring (gold), reduced-motion pro fade-in, skip link. Sticky CTA 48px touch target.
- LCP: `priority` jen na hero (pozadí + logo v hero). Ostatní obrázky lazy (včetně loga v headeru). Preconnect Reservio. Správné `sizes` u všech obrázků.
- CLS: pevná výška hero, sticky CTA až po scrollu, obrázky mají sizes.
- INP: animace pouze `transform` a `opacity` (neblokují main thread). Recenze dynamický import, desktop 3 karty bez slideru. Bundle: reviews v samostatném chunku.
- Lighthouse (teoreticky): LCP &lt; 2.5 s díky priority hero; CLS &lt; 0.1 díky pevným rozměrům; INP v pořádku díky GPU-friendly animacím a méně JS na desktopu u recenzí.
