import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const notifyEmail = Deno.env.get("NOTIFY_EMAIL");
    if (!resendKey || !notifyEmail) {
      return Response.json(
        { error: "Nastav RESEND_API_KEY a NOTIFY_EMAIL v Supabase Secrets" },
        { status: 500, headers: corsHeaders }
      );
    }

    const payload = await req.json();
    const record = payload.record ?? payload;
    const { name, surname, email, phone, service, branch, note } = record;

    const subject = `[J&J] Nová objednávka voucheru – ${name} ${surname || ""}`;
    const body = `
Nová objednávka dárkového poukazu:

Jméno: ${name} ${surname || ""}
E-mail: ${email}
Telefon: ${phone || "–"}
Služba: ${service}
Pobočka: ${branch}
${note ? `Poznámka: ${note}` : ""}

---
J&J Barber Shop Admin
    `.trim();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "J&J Barber <onboarding@resend.dev>",
        to: [notifyEmail],
        subject,
        text: body,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return Response.json({ error: `Resend: ${err}` }, { status: 500, headers: corsHeaders });
    }

    return Response.json({ success: true }, { headers: corsHeaders });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Chyba" },
      { status: 500, headers: corsHeaders }
    );
  }
});
