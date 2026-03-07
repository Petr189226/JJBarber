import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type AdminWithEmail = { user_id: string; role: string; email: string; last_sign_in_at?: string | null };

async function ensureMajitel(
  supabaseAdmin: ReturnType<typeof createClient>,
  supabaseAuth: ReturnType<typeof createClient>,
  authHeader: string
) {
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const { data: { user: caller }, error: userError } = await supabaseAuth.auth.getUser(token);
  if (!caller || userError) {
    return { ok: false as const, error: userError?.message || "Neplatný token", status: 401 };
  }
  const { data: roleRow } = await supabaseAdmin
    .from("admin_roles")
    .select("role")
    .eq("user_id", caller.id)
    .single();
  if (roleRow?.role !== "majitel") {
    return { ok: false as const, error: "Pouze Majitel může spravovat účty", status: 403 };
  }
  return { ok: true as const, caller };
}

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
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey || supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const check = await ensureMajitel(supabaseAdmin, supabaseAuth, authHeader);
    if (!check.ok) {
      return Response.json({ error: check.error }, {
        status: check.status,
        headers: corsHeaders,
      });
    }

    const body = await req.json().catch(() => ({}));
    const action = body.action;

    if (action === "list") {
      const { data: roles } = await supabaseAdmin.from("admin_roles").select("user_id, role");
      if (!roles?.length) {
        return Response.json({ admins: [] }, { headers: corsHeaders });
      }
      const admins: AdminWithEmail[] = [];
      for (const r of roles) {
        const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(r.user_id);
        admins.push({
          user_id: r.user_id,
          role: r.role,
          email: user?.email ?? "(neznámý e-mail)",
          last_sign_in_at: user?.last_sign_in_at ?? null,
        });
      }
      return Response.json({ admins }, { headers: corsHeaders });
    }

    if (action === "update-password") {
      const { user_id, new_password } = body;
      if (!user_id || !new_password || new_password.length < 6) {
        return Response.json(
          { error: "Chybí user_id nebo nové heslo (min. 6 znaků)" },
          { status: 400, headers: corsHeaders }
        );
      }
      const { error } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
        password: new_password,
      });
      if (error) {
        return Response.json({ error: error.message }, {
          status: 400,
          headers: corsHeaders,
        });
      }
      return Response.json({ success: true }, { headers: corsHeaders });
    }

    if (action === "delete") {
      const { user_id } = body;
      if (!user_id) {
        return Response.json({ error: "Chybí user_id" }, {
          status: 400,
          headers: corsHeaders,
        });
      }
      if (user_id === check.caller.id) {
        return Response.json(
          { error: "Nemůžeš odstranit sám sebe" },
          { status: 400, headers: corsHeaders }
        );
      }
      const { error: delRole } = await supabaseAdmin
        .from("admin_roles")
        .delete()
        .eq("user_id", user_id);
      if (delRole) {
        return Response.json({ error: delRole.message }, {
          status: 400,
          headers: corsHeaders,
        });
      }
      const { error: delUser } = await supabaseAdmin.auth.admin.deleteUser(user_id);
      if (delUser) {
        return Response.json({ error: delUser.message }, {
          status: 400,
          headers: corsHeaders,
        });
      }
      return Response.json({ success: true }, { headers: corsHeaders });
    }

    if (action === "update-role") {
      const { user_id, new_role } = body;
      if (!user_id || !new_role || !["majitel", "barber"].includes(new_role)) {
        return Response.json(
          { error: "Chybí user_id nebo new_role (majitel/barber)" },
          { status: 400, headers: corsHeaders }
        );
      }
      if (user_id === check.caller.id) {
        return Response.json(
          { error: "Nemůžeš změnit roli sám sobě" },
          { status: 400, headers: corsHeaders }
        );
      }
      const { error: updErr } = await supabaseAdmin
        .from("admin_roles")
        .update({ role: new_role })
        .eq("user_id", user_id);
      if (updErr) {
        return Response.json({ error: updErr.message }, {
          status: 400,
          headers: corsHeaders,
        });
      }
      return Response.json({ success: true }, { headers: corsHeaders });
    }

    return Response.json(
      { error: "Neplatná akce. Použij action: list | update-password | update-role | delete" },
      { status: 400, headers: corsHeaders }
    );
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Chyba serveru" },
      { status: 500, headers: corsHeaders }
    );
  }
});
