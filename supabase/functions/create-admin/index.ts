import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return Response.json({ error: "Chybí Authorization header" }, {
        status: 401,
        headers: corsHeaders,
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseServiceKey) {
      return Response.json(
        { error: "Nastav SUPABASE_SERVICE_ROLE_KEY v Supabase Secrets" },
        { status: 500, headers: corsHeaders }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey || supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user: caller }, error: userError } = await supabaseAuth.auth.getUser(token);
    if (!caller || userError) {
      return Response.json(
        { error: userError?.message || "Neplatný token" },
        { status: 401, headers: corsHeaders }
      );
    }

    const { data: roleRow } = await supabaseAdmin
      .from("admin_roles")
      .select("role")
      .eq("user_id", caller.id)
      .single();

    if (roleRow?.role !== "majitel") {
      return Response.json({ error: "Pouze Majitel může přidávat správce" }, {
        status: 403,
        headers: corsHeaders,
      });
    }

    const { email, password, role } = await req.json();
    if (!email || !password || !role || !["majitel", "barber"].includes(role)) {
      return Response.json({ error: "Chybí email, heslo nebo role (majitel/barber)" }, {
        status: 400,
        headers: corsHeaders,
      });
    }

    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password,
      email_confirm: true,
    });

    if (createError) {
      return Response.json({ error: createError.message }, {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!newUser.user) {
      return Response.json({ error: "Nepodařilo se vytvořit uživatele" }, {
        status: 500,
        headers: corsHeaders,
      });
    }

    const { error: insertError } = await supabaseAdmin
      .from("admin_roles")
      .insert({ user_id: newUser.user.id, role });

    if (insertError) {
      return Response.json({ error: insertError.message }, {
        status: 400,
        headers: corsHeaders,
      });
    }

    return Response.json({ success: true, userId: newUser.user.id }, {
      headers: corsHeaders,
    });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Chyba serveru" },
      { status: 500, headers: corsHeaders }
    );
  }
});
