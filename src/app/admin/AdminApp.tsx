import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type VoucherOrder = {
  id: string;
  name: string;
  surname: string | null;
  email: string;
  phone: string | null;
  service: string;
  branch: string;
  note: string | null;
  status: "new" | "pending" | "done";
  created_at: string;
};

type AdminRole = "majitel" | "barber" | null;

const inputClass =
  "w-full bg-[#111111] border border-[#2A2A2A] focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/25 text-[#C4BEB4] rounded-xl px-4 py-3 outline-none transition-all";
const btnClass =
  "px-6 py-3 bg-[#C9A84C] hover:bg-[#D4B85A] text-[#0A0A0A] rounded-xl font-semibold transition-all";

export function AdminApp() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [orders, setOrders] = useState<VoucherOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [addAdminError, setAddAdminError] = useState("");
  const [addAdminSuccess, setAddAdminSuccess] = useState(false);
  const [addAdminLoading, setAddAdminLoading] = useState(false);
  const [newAdminRole, setNewAdminRole] = useState<"majitel" | "barber">("barber");
  const [role, setRole] = useState<AdminRole>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !supabase) return;
    setOrdersLoading(true);
    supabase
      .from("voucher_orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        setOrdersLoading(false);
        if (!error) setOrders((data as VoucherOrder[]) ?? []);
      });
  }, [user]);

  useEffect(() => {
    if (!user || !supabase) {
      setRoleLoading(false);
      return;
    }
    setRoleLoading(true);
    supabase
      .from("admin_roles")
      .select("role")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        setRole((data?.role as AdminRole) ?? null);
        setRoleLoading(false);
      })
      .catch(() => {
        setRole(null);
        setRoleLoading(false);
      });
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !email || !password) return;
    setLoginLoading(true);
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoginLoading(false);
    if (error) setLoginError(error.message);
  };

  const handleLogout = async () => {
    await supabase?.auth.signOut();
  };

  const updateStatus = async (id: string, status: VoucherOrder["status"]) => {
    if (!supabase) return;
    setUpdatingId(id);
    await supabase.from("voucher_orders").update({ status }).eq("id", id);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setUpdatingId(null);
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !newAdminEmail || !newAdminPassword || role !== "majitel") return;
    setAddAdminLoading(true);
    setAddAdminError("");
    setAddAdminSuccess(false);
    const { data, error } = await supabase.auth.signUp({
      email: newAdminEmail.trim(),
      password: newAdminPassword,
      options: { emailRedirectTo: window.location.origin + "/jj-backstage" },
    });
    if (error) {
      setAddAdminLoading(false);
      setAddAdminError(error.message);
      return;
    }
    if (data.user) {
      const { error: roleErr } = await supabase.from("admin_roles").insert({
        user_id: data.user.id,
        role: newAdminRole,
      });
      if (roleErr) setAddAdminError(roleErr.message);
      else {
        setAddAdminSuccess(true);
        setNewAdminEmail("");
        setNewAdminPassword("");
        setShowAddAdmin(false);
      }
    }
    setAddAdminLoading(false);
  };

  const formatDate = (s: string) => {
    const d = new Date(s);
    return d.toLocaleDateString("cs-CZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const adminLayout = "min-h-screen relative";
  const adminBg = (
    <>
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/admin-bg.png)" }}
      />
      <div className="fixed inset-0 bg-[#0A0A0A]/85 z-[1]" />
    </>
  );

  if (!isSupabaseConfigured()) {
    return (
      <div className={`${adminLayout} flex items-center justify-center p-6`}>
        {adminBg}
        <div className="relative z-10 max-w-md text-center">
          <h1 className="text-[#C4BEB4] text-xl mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Admin není nakonfigurován
          </h1>
          <p className="text-[#8A8580] text-sm leading-relaxed">
            Přidej VITE_SUPABASE_URL a VITE_SUPABASE_ANON_KEY do .env. Viz .env.example.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`${adminLayout} flex items-center justify-center`}>
        {adminBg}
        <div className="relative z-10 w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`${adminLayout} flex items-center justify-center p-6`}>
        {adminBg}
        <div className="relative z-10 w-full max-w-sm">
          <h1 className="text-[#C4BEB4] text-2xl mb-2 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            J&J Admin
          </h1>
          <p className="text-[#8A8580] text-sm mb-8 text-center">Přihlášení pro správu voucherů</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              required
              className={inputClass}
              autoComplete="email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Heslo"
              required
              className={inputClass}
              autoComplete="current-password"
            />
            {loginError && (
              <p className="text-red-400 text-sm">{loginError}</p>
            )}
            <button type="submit" disabled={loginLoading} className={`w-full ${btnClass}`}>
              {loginLoading ? "Přihlašuji…" : "Přihlásit"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const isMajitel = role === "majitel";
  const isBarber = role === "barber";
  const noRole = role === null && !roleLoading;

  return (
    <div className={adminLayout}>
      {adminBg}
      <div className="relative z-10">
      <header className="border-b border-[#1F1F1F] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-[#C4BEB4] text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              Objednávky voucherů
            </h1>
            {role && (
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  isMajitel ? "bg-[#C9A84C]/20 text-[#C9A84C]" : "bg-[#2A2A2A] text-[#8A8580]"
                }`}
              >
                {isMajitel ? "Majitel" : "Barber"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {isMajitel && (
              <button
                onClick={() => setShowAddAdmin((v) => !v)}
                className={`text-sm font-medium transition-colors ${showAddAdmin ? "text-[#C9A84C]" : "text-[#8A8580] hover:text-[#C4BEB4]"}`}
              >
                + Přidat správce
              </button>
            )}
            <a href="/" className="text-[#8A8580] hover:text-[#C4BEB4] text-sm transition-colors">
              ← Web
            </a>
            <button
              onClick={handleLogout}
              className="text-[#8A8580] hover:text-[#C4BEB4] text-sm transition-colors"
            >
              Odhlásit
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {noRole && (
          <div className="mb-8 p-4 bg-[#111111] border border-[#2A2A2A] rounded-xl">
            <p className="text-[#B5AEA4] text-sm">
              Nemáte přiřazenou roli. Přidejte svůj účet do tabulky <code className="text-[#C4BEB4]">admin_roles</code> v Supabase (Table Editor) s rolí <code className="text-[#C4BEB4]">majitel</code> nebo <code className="text-[#C4BEB4]">barber</code>. První Majitel se vytváří ručně v Supabase.
            </p>
          </div>
        )}

        {isBarber && (
          <div className="mb-8 p-4 bg-[#111111] border border-[#2A2A2A] rounded-xl">
            <p className="text-[#8A8580] text-sm">
              Jako Barber máte jen náhled – nemůžete měnit stavy voucherů ani přidávat správce.
            </p>
          </div>
        )}

        {!noRole && (ordersLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-[#8A8580] text-center py-20">Zatím žádné objednávky.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#1F1F1F]">
                  <th className="py-3 pr-4 text-[#8A8580] text-xs font-semibold uppercase tracking-wider">Datum</th>
                  <th className="py-3 pr-4 text-[#8A8580] text-xs font-semibold uppercase tracking-wider">Jméno</th>
                  <th className="py-3 pr-4 text-[#8A8580] text-xs font-semibold uppercase tracking-wider">E-mail</th>
                  <th className="py-3 pr-4 text-[#8A8580] text-xs font-semibold uppercase tracking-wider">Telefon</th>
                  <th className="py-3 pr-4 text-[#8A8580] text-xs font-semibold uppercase tracking-wider">Služba</th>
                  <th className="py-3 pr-4 text-[#8A8580] text-xs font-semibold uppercase tracking-wider">Pobočka</th>
                  <th className="py-3 pr-4 text-[#8A8580] text-xs font-semibold uppercase tracking-wider">Stav</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-[#1A1A1A] hover:bg-[#111111]/50">
                    <td className="py-4 pr-4 text-[#B5AEA4] text-sm whitespace-nowrap">{formatDate(o.created_at)}</td>
                    <td className="py-4 pr-4 text-[#C4BEB4]">
                      {o.name} {o.surname || ""}
                    </td>
                    <td className="py-4 pr-4 text-[#B5AEA4] text-sm">
                      <a href={`mailto:${o.email}`} className="hover:text-[#C9A84C] transition-colors">
                        {o.email}
                      </a>
                    </td>
                    <td className="py-4 pr-4 text-[#B5AEA4] text-sm">
                      {o.phone ? (
                        <a href={`tel:${o.phone}`} className="hover:text-[#C9A84C] transition-colors">
                          {o.phone}
                        </a>
                      ) : (
                        "–"
                      )}
                    </td>
                    <td className="py-4 pr-4 text-[#B5AEA4] text-sm">{o.service}</td>
                    <td className="py-4 pr-4 text-[#B5AEA4] text-sm">{o.branch}</td>
                    <td className="py-4 pr-4">
                      {isMajitel ? (
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o.id, e.target.value as VoucherOrder["status"])}
                          disabled={updatingId === o.id}
                          className="bg-[#111111] border border-[#2A2A2A] text-[#C4BEB4] text-sm rounded-lg px-2 py-1.5 cursor-pointer"
                        >
                          <option value="new">Nový</option>
                          <option value="pending">Rozpracováno</option>
                          <option value="done">Vyřízeno</option>
                        </select>
                      ) : (
                        <span className="text-[#B5AEA4] text-sm">
                          {o.status === "new" ? "Nový" : o.status === "pending" ? "Rozpracováno" : "Vyřízeno"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {!noRole && orders.some((o) => o.note) && (
          <details className="mt-8">
            <summary className="text-[#8A8580] text-sm cursor-pointer hover:text-[#C4BEB4]">
              Zobrazit poznámky
            </summary>
            <div className="mt-4 space-y-4">
              {orders.filter((o) => o.note).map((o) => (
                <div key={o.id} className="bg-[#111111] rounded-xl p-4 border border-[#1F1F1F]">
                  <div className="text-[#8A8580] text-xs mb-1">
                    {o.name} {o.surname} · {formatDate(o.created_at)}
                  </div>
                  <p className="text-[#B5AEA4] text-sm">{o.note}</p>
                </div>
              ))}
            </div>
          </details>
        )}

        {isMajitel && (showAddAdmin ? (
          <div className="mb-8 p-6 bg-[#111111] border border-[#2A2A2A] rounded-xl max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#C4BEB4] font-medium" style={{ fontFamily: "'Playfair Display', serif" }}>
                Přidat dalšího správce
              </h2>
              <button
                onClick={() => setShowAddAdmin(false)}
                className="text-[#8A8580] hover:text-[#C4BEB4] text-sm"
              >
                Zavřít
              </button>
            </div>
            <div>
              <p className="text-[#6B6B6B] text-xs mb-4">
                Vytvoř účet pro kolegu. Majitel může měnit stavy voucherů, barber má jen náhled.
              </p>
              <form onSubmit={handleAddAdmin} className="space-y-3">
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as "majitel" | "barber")}
                  className={inputClass}
                >
                  <option value="barber">Barber (jen náhled)</option>
                  <option value="majitel">Majitel (plný přístup)</option>
                </select>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => { setNewAdminEmail(e.target.value); setAddAdminError(""); }}
                  placeholder="E-mail nového správce"
                  required
                  className={inputClass}
                />
                <input
                  type="password"
                  value={newAdminPassword}
                  onChange={(e) => { setNewAdminPassword(e.target.value); setAddAdminError(""); }}
                  placeholder="Heslo (min. 6 znaků)"
                  required
                  minLength={6}
                  className={inputClass}
                />
                {addAdminError && <p className="text-red-400 text-sm">{addAdminError}</p>}
                {addAdminSuccess && (
                  <p className="text-emerald-400 text-sm">
                    Účet vytvořen. Nový správce se může přihlásit na e-mail a heslo.
                  </p>
                )}
                <button type="submit" disabled={addAdminLoading} className={btnClass}>
                  {addAdminLoading ? "Vytvářím…" : "Vytvořit účet"}
                </button>
              </form>
            </div>
          </div>
        ) : null)}
      </main>
      </div>
    </div>
  );
}
