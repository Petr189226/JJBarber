/**
 * Auth proxy: přeposílá přihlášení na Supabase.
 * Použití z petrchajda.cz (nebo jiné domény), když tamní síť/hosting nemůže volat supabase.co.
 * URL: https://jjbarbershopcz.netlify.app/.netlify/functions/auth-proxy
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

function getEnv(name) {
  if (typeof Netlify !== "undefined" && Netlify.env && Netlify.env.get) {
    const v = Netlify.env.get(name);
    if (v) return v;
  }
  return process.env[name] || "";
}

export default async (req, _context) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method === "GET") {
    return new Response(
      JSON.stringify({ ok: true, message: "auth-proxy ready" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const url = getEnv("VITE_SUPABASE_URL") || getEnv("SUPABASE_URL");
  const anonKey = getEnv("VITE_SUPABASE_ANON_KEY") || getEnv("SUPABASE_ANON_KEY");

  if (!url || !anonKey) {
    return new Response(
      JSON.stringify({ error: "Supabase URL or anon key not configured" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  if (!body?.email || !body?.password) {
    return new Response(JSON.stringify({ error: "Missing email or password" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const tokenUrl = `${url.replace(/\/$/, "")}/auth/v1/token?grant_type=password`;
  let res;
  try {
    res = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ email: body.email, password: body.password }),
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Proxy request failed: " + (err.message || String(err)) }),
      { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
};
