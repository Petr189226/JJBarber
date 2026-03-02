# Kam ukládat objednávky dárkových poukazů

Teď se po odeslání formuláře buď otevře **mailto:** (e-mail v počítači) a data nikde nejsou uložená, nebo – pokud je nastavená proměnná `NEXT_PUBLIC_VOUCHER_FORM_URL` – jdou na vámi zadané URL.

**Doporučené řešení: Formspree** (ukládání + e-mail, funguje i při statickém nasazení).

---

## 1. Formspree (doporučeno)

- Objednávky se **ukládají** v dashboardu Formspree a zároveň dostanete **e-mail** na info@jjbarber.cz.
- Funguje s aktuálním statickým webem (nemusíte měnit hosting).
- Zdarma do 50 odeslání/měsíc; pro barbershop obvykle stačí.

### Postup

1. Jděte na [formspree.io](https://formspree.io) a založte účet.
2. **Create a new form** → pojmenujte např. „Dárkové poukazy J&J“.
3. Do **Email** zadejte `info@jjbarber.cz` (kam chcete dostávat notifikace).
4. Formspree vám dá adresu formuláře, např. `https://formspree.io/f/xxxxxx`.
5. V projektu nebo na hostingu (Vercel, Netlify…) nastavte proměnnou prostředí:
   - **Název:** `NEXT_PUBLIC_VOUCHER_FORM_URL`
   - **Hodnota:** `https://formspree.io/f/xxxxxx` (vaše konkrétní adresa).
6. Znovu nasaďte web (nebo u Vercel/Netlify se nasadí po uložení env).

Po odeslání formuláře na webu:

- data doputují do Formspree a **uloží se** v sekci Submissions,
- na info@jjbarber.cz přijde e-mail s obsahem formuláře,
- v přehledu u Formspree můžete objednávky prohlížet, filtrovat a exportovat (např. CSV).

---

## 2. Web3Forms (alternativa)

Podobné jako Formspree: [web3forms.com](https://web3forms.com). Získáte **Access Key**, formulář pak pošle data na jejich endpoint. V dokumentaci Web3Forms je uvedeno, jak endpoint sestavit; ten pak nastavíte jako `NEXT_PUBLIC_VOUCHER_FORM_URL`. Data jsou u nich v dashboardu a můžete si nechat posílat e-mail.

---

## 3. Vlastní databáze (API + např. Vercel Postgres)

Pokud budete chtít mít objednávky **ve vlastní databázi** (např. pro vlastní admin nebo reporting):

- Přidá se **API route** v Next.js (např. `POST /api/voucher`), která přijme data z formuláře a zapíše je do DB.
- Použitelná je např. **Vercel Postgres** nebo **Turso** (SQLite).
- Web pak musí běžet na Vercelu (ne čistě statický export), protože API route potřebuje server.

Toto je vhodné až když budete chtít mít přehled objednávek přímo u sebe v systému; pro „ukládat někam + dostat e-mail“ stačí Formspree.

---

## Shrnutí

| Řešení        | Ukládání        | E-mail      | Co udělat                                      |
|---------------|-----------------|------------|------------------------------------------------|
| **Formspree** | Ano (dashboard)| Ano        | Účet → vytvořit form → nastavit `NEXT_PUBLIC_VOUCHER_FORM_URL` |
| **Web3Forms** | Ano             | Ano        | Účet → access key → nastavit URL do env        |
| **mailto**    | Ne              | Jen u klienta | Nic – jen záložka, data se nikde neukládají   |

Doporučení: nastavte **Formspree** podle kroku 1 výše; formulář na webu už je na to připravený.
