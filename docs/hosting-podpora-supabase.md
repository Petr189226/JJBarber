# Žádost na podporu hostingu – přístup na Supabase

Pošli níže uvedený text na podporu svého hostingu (WEDOS, Forpsi, Wedos, atd.), aby povolili odchozí připojení na Supabase.

---

**Předmět:** Odchozí HTTPS / DNS na supabase.co

Dobrý den,

z našeho webu (PHP aplikace na vašem hostingu) potřebujeme volat API služby Supabase (backend pro přihlášení a databázi). Z serveru se nyní při volání na doménu **dtijmhosifocowsgdgx.supabase.co** vrací chyba „Could not resolve host“ – DNS překlad této domény z vašeho prostředí tedy nefunguje, nebo je odchozí připojení blokované.

Prosím o:
1. Povolení odchozích HTTPS požadavků z našeho hostingu na domény **\*.supabase.co** (nebo konkrétně **dtijmhosifocowsgdgx.supabase.co**).
2. Ověření, že z vašeho serveru funguje DNS překlad pro tyto domény.

Děkuji.

---

Po úpravě na straně hostingu by měl soubor **auth-proxy.php** (nahraný v kořeni webu) fungovat a přihlášení do adminu bude možné.
