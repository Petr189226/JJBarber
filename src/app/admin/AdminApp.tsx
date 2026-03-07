import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  ScissorsIcon,
  SearchIcon,
  LogOutIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XIcon,
  CheckIcon,
  ClockIcon,
  AlertCircleIcon,
  RefreshCwIcon,
  EyeIcon,
  Loader2Icon,
  AlertTriangleIcon,
  PhoneOffIcon,
  DownloadIcon,
  MoreVerticalIcon,
  FileTextIcon,
  PrinterIcon,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  getPresetRange,
  getStartOfDayLocal,
  getEndOfDayLocal,
  detectPresetFromRange,
  isDateRangeValid,
  type DatePresetId,
} from "./utils/dateFilter";

type Status = "new" | "pending" | "done" | "awaiting_payment" | "storno";

type VoucherOrder = {
  id: string;
  name: string;
  surname: string | null;
  email: string;
  phone: string | null;
  service: string;
  branch: string;
  note: string | null;
  admin_note?: string | null;
  voucher_number?: string | null;
  status: Status;
  created_at: string;
};

type AdminRole = "majitel" | "barber" | null;

const statusLabels: Record<Status, string> = {
  new: "Nový",
  pending: "Rozpracováno",
  done: "Vyřízeno",
  awaiting_payment: "Čeká na platbu",
  storno: "Storno",
};

const statusConfig: Record<Status, { color: string; bg: string; icon: React.ReactNode }> = {
  new: { color: "text-blue-600", bg: "bg-blue-100 border-blue-300", icon: <ClockIcon size={12} /> },
  done: { color: "text-emerald-600", bg: "bg-emerald-100 border-emerald-300", icon: <CheckIcon size={12} /> },
  pending: { color: "text-amber-600", bg: "bg-amber-100 border-amber-300", icon: <ClockIcon size={12} /> },
  awaiting_payment: { color: "text-yellow-700", bg: "bg-yellow-100 border-yellow-300", icon: <AlertCircleIcon size={12} /> },
  storno: { color: "text-red-600", bg: "bg-red-100 border-red-300", icon: <XIcon size={12} /> },
};

function parseAmount(service: string): number {
  const m = service.match(/(\d+)\s*Kč/);
  return m ? parseInt(m[1], 10) : 0;
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function StatusBadge({ status }: { status: Status }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium ${cfg.color} ${cfg.bg}`}>
      {cfg.icon}
      {statusLabels[status]}
    </span>
  );
}

function StatsCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number | string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex flex-col gap-0.5">
      <span className="text-gray-600 text-[10px] uppercase tracking-wider font-medium">{label}</span>
      <span className={`text-2xl font-semibold tabular-nums ${color}`}>{value}</span>
      {sub && <span className="text-gray-600 text-[11px]">{sub}</span>}
    </div>
  );
}

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
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "Vše">("Vše");
  const [filterPobocka, setFilterPobocka] = useState("Všechny pobočky");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterDatePreset, setFilterDatePreset] = useState<DatePresetId>("");
  const [filterJenNove, setFilterJenNove] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedOrder, setSelectedOrder] = useState<VoucherOrder | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [sortCol, setSortCol] = useState<"created_at" | "name" | "branch" | "status" | "service">("created_at");
  const [sortAsc, setSortAsc] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const detailPanelRef = useRef<HTMLDivElement>(null);

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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchOrders = useCallback(() => {
    if (!user || !supabase) return;
    setOrdersLoading(true);
    setFetchError("");
    supabase
      .from("voucher_orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        setOrdersLoading(false);
        if (error) {
          setFetchError(error.message);
          return;
        }
        const list = (data as VoucherOrder[]) ?? [];
        setOrders(list);
        setSelectedOrder((prev) => (prev ? list.find((o) => o.id === prev.id) ?? prev : null));
      });
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (!user || !supabase) return;
    const interval = setInterval(fetchOrders, 60000);
    return () => clearInterval(interval);
  }, [user, fetchOrders]);

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

  const dateRangeValid = isDateRangeValid(filterDateFrom, filterDateTo);

  const filtered = useMemo(() => {
    if (!dateRangeValid) return orders;
    return orders.filter((o) => {
      const fullName = `${o.name} ${o.surname || ""}`.toLowerCase();
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        fullName.includes(q) ||
        o.email.toLowerCase().includes(q) ||
        (o.phone && o.phone.includes(search)) ||
        o.id.toLowerCase().includes(q);
      const matchStatus = filterStatus === "Vše" || o.status === filterStatus;
      const matchPobocka = filterPobocka === "Všechny pobočky" || o.branch === filterPobocka;
      const orderTime = new Date(o.created_at).getTime();
      const fromOk = !filterDateFrom || orderTime >= getStartOfDayLocal(filterDateFrom);
      const toOk = !filterDateTo || orderTime <= getEndOfDayLocal(filterDateTo);
      const matchJenNove = !filterJenNove || o.status === "new";
      return matchSearch && matchStatus && matchPobocka && fromOk && toOk && matchJenNove;
    });
  }, [orders, search, filterStatus, filterPobocka, filterDateFrom, filterDateTo, filterJenNove, dateRangeValid]);

  const applyDatePreset = (preset: Exclude<DatePresetId, "custom" | "">) => {
    const range = getPresetRange(preset);
    setFilterDateFrom(range.from);
    setFilterDateTo(range.to);
    setFilterDatePreset(range.preset);
  };

  const handleDateFromChange = (value: string) => {
    setFilterDateFrom(value);
    setFilterDatePreset(detectPresetFromRange(value, filterDateTo));
  };

  const handleDateToChange = (value: string) => {
    setFilterDateTo(value);
    setFilterDatePreset(detectPresetFromRange(filterDateFrom, value));
  };

  const branches = useMemo(() => {
    const set = new Set(orders.map((o) => o.branch));
    return ["Všechny pobočky", ...Array.from(set).sort()];
  }, [orders]);

  const totalRevenue = useMemo(
    () =>
      orders
        .filter((o) => o.status !== "awaiting_payment" && o.status !== "storno")
        .reduce((s, o) => s + parseAmount(o.service), 0),
    [orders]
  );
  const counts = useMemo(
    () => ({
      novy: orders.filter((o) => o.status === "new").length,
      vyrizeno: orders.filter((o) => o.status === "done").length,
      ceka: orders.filter((o) => o.status === "awaiting_payment").length,
      pending: orders.filter((o) => o.status === "pending").length,
      storno: orders.filter((o) => o.status === "storno").length,
    }),
    [orders]
  );

  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const dayAgo = useMemo(() => Date.now() - 24 * 60 * 60 * 1000, []);

  const metrics = useMemo(() => {
    const novyDnes = orders.filter((o) => o.status === "new" && new Date(o.created_at).getTime() >= todayStart).length;
    const trzbyDnes = orders
      .filter((o) => new Date(o.created_at).getTime() >= todayStart && o.status !== "awaiting_payment" && o.status !== "storno")
      .reduce((s, o) => s + parseAmount(o.service), 0);
    const sHodnotou = orders.filter((o) => o.status !== "awaiting_payment" && o.status !== "storno");
    const prumer = sHodnotou.length
      ? Math.round(sHodnotou.reduce((s, o) => s + parseAmount(o.service), 0) / sHodnotou.length)
      : 0;
    const serviceCounts = orders.reduce((acc, o) => {
      acc[o.service] = (acc[o.service] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    const staryNovy = orders.filter((o) => o.status === "new" && new Date(o.created_at).getTime() < dayAgo).length;
    const bezTelefonu = orders.filter((o) => !o.phone || o.phone.trim() === "").length;
    return { novyDnes, trzbyDnes, prumer, topService, staryNovy, bezTelefonu };
  }, [orders, todayStart, dayAgo]);

  const sortedFiltered = useMemo(() => {
    const arr = [...filtered];
    const mult = sortAsc ? 1 : -1;
    arr.sort((a, b) => {
      if (sortCol === "created_at") {
        return mult * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      }
      if (sortCol === "name") {
        return mult * `${a.name} ${a.surname}`.localeCompare(`${b.name} ${b.surname}`);
      }
      if (sortCol === "branch") return mult * a.branch.localeCompare(b.branch);
      if (sortCol === "status") return mult * a.status.localeCompare(b.status);
      if (sortCol === "service") return mult * a.service.localeCompare(b.service);
      return 0;
    });
    return arr;
  }, [filtered, sortCol, sortAsc]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !email || !password) return;
    setLoginLoading(true);
    setLoginError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const msg = error.message;
        const cause = (error as Error & { cause?: Error })?.cause?.message;
        setLoginError(
          msg === "Failed to fetch"
            ? `Síťová chyba: ${cause || msg}. Zkontrolujte Supabase Dashboard → Auth → URL Configuration (Site URL, Redirect URLs). Vypněte adblocker.`
            : msg
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const cause = err instanceof Error && err.cause instanceof Error ? err.cause.message : "";
      setLoginError(
        msg === "Failed to fetch"
          ? `Síťová chyba: ${cause || msg}. Zkontrolujte Supabase URL Configuration a síťové připojení.`
          : msg
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase?.auth.signOut();
  };

  const saveAdminNote = async () => {
    if (!supabase || !selectedOrder || savingNote) return;
    setSavingNote(true);
    try {
      await supabase.from("voucher_orders").update({ admin_note: adminNote || null }).eq("id", selectedOrder.id);
      setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? { ...o, admin_note: adminNote || null } : o)));
      setSelectedOrder((prev) => (prev?.id === selectedOrder.id ? { ...prev, admin_note: adminNote || null } : prev));
    } finally {
      setSavingNote(false);
    }
  };

  const saveAdminNoteFor = useCallback(
    (id: string, note: string) => {
      if (!supabase) return;
      supabase.from("voucher_orders").update({ admin_note: note || null }).eq("id", id).then(() => {
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, admin_note: note || null } : o)));
      });
    },
    []
  );

  const handleSelectOrder = (o: VoucherOrder) => {
    if (selectedOrder && selectedOrder.id !== o.id && adminNote !== (selectedOrder.admin_note || "")) {
      saveAdminNoteFor(selectedOrder.id, adminNote);
    }
    setSelectedOrder(o);
    setShowDetail(true);
  };

  const handleCloseDetail = useCallback(() => {
    if (selectedOrder && adminNote !== (selectedOrder.admin_note || "")) {
      saveAdminNoteFor(selectedOrder.id, adminNote);
    }
    setShowDetail(false);
  }, [selectedOrder, adminNote, saveAdminNoteFor]);

  const updateStatus = async (id: string, status: Status) => {
    if (!supabase) return;
    setUpdatingId(id);
    try {
      await supabase.from("voucher_orders").update({ status }).eq("id", id);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      setSelectedOrder((prev) => (prev?.id === id ? { ...prev, status } : prev));
    } finally {
      setUpdatingId(null);
      setOpenDropdown(null);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !newAdminEmail || !newAdminPassword || role !== "majitel") return;
    setAddAdminLoading(true);
    setAddAdminError("");
    setAddAdminSuccess(false);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    const url = import.meta.env.VITE_SUPABASE_URL;
    if (!token || !url) {
      setAddAdminError("Chybí přihlášení nebo konfigurace");
      setAddAdminLoading(false);
      return;
    }
    const res = await fetch(`${url}/functions/v1/create-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: newAdminEmail.trim(),
        password: newAdminPassword,
        role: newAdminRole,
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setAddAdminError(json.error || `Chyba ${res.status}`);
      setAddAdminLoading(false);
      return;
    }
    setAddAdminSuccess(true);
    setNewAdminEmail("");
    setNewAdminPassword("");
    setShowAddAdmin(false);
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

  const resetFilters = () => {
    setSearch("");
    setFilterStatus("Vše");
    setFilterPobocka("Všechny pobočky");
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterDatePreset("");
    setFilterJenNove(false);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === sortedFiltered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sortedFiltered.map((o) => o.id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bulkExportCsv = () => {
    const toExport = selectedIds.size > 0 ? sortedFiltered.filter((o) => selectedIds.has(o.id)) : sortedFiltered;
    const headers = ["ID", "Datum", "Č. voucheru", "Jméno", "E-mail", "Telefon", "Služba", "Pobočka", "Stav", "Částka", "Admin poznámka"];
    const rows = toExport.map((o) => [
      o.id,
      formatDate(o.created_at),
      o.voucher_number || "",
      `${o.name} ${o.surname || ""}`.trim(),
      o.email,
      o.phone || "",
      o.service,
      o.branch,
      statusLabels[o.status],
      parseAmount(o.service).toString(),
      o.admin_note || "",
    ]);
    const csv = [headers.join(";"), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";"))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `voucher-objednavky-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setSelectedIds(new Set());
  };

  const generateVoucherPdf = async (o: VoucherOrder) => {
    let voucherNumber = o.voucher_number ?? null;
    if (!voucherNumber) {
      const d = new Date();
      const yymmdd =
        d.getFullYear().toString().slice(-2) +
        String(d.getMonth() + 1).padStart(2, "0") +
        String(d.getDate()).padStart(2, "0");
      const suffix = o.id.replace(/-/g, "").slice(0, 6).toUpperCase();
      voucherNumber = `V-${yymmdd}-${suffix}`;
      if (supabase) {
        const { error } = await supabase.from("voucher_orders").update({ voucher_number: voucherNumber }).eq("id", o.id);
        if (!error) {
          setOrders((prev) => prev.map((ord) => (ord.id === o.id ? { ...ord, voucher_number: voucherNumber } : ord)));
          setSelectedOrder((prev) => (prev?.id === o.id ? { ...prev, voucher_number: voucherNumber } : prev));
        }
      }
    }
    const width = 1024;
    const height = 682;
    const amountStr = parseAmount(o.service).toLocaleString("cs-CZ");
    const surname = (o.surname || "").trim();
    const layout = {
      voucherNo: { top: 32, right: 40 },
      nameLeft: 417,
      nameBottom: 272,
      surnameLeft: 636,
      surnameBottom: 275,
      serviceLeft: 437,
      serviceBottom: 221,
      serviceRight: 98,
      amountBottom: 88,
      branchBottom: 48,
    };
    const iframe = document.createElement("iframe");
    iframe.setAttribute("style", "position:fixed;left:-9999px;top:0;width:" + width + "px;height:" + height + "px;border:none;");
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
    if (!doc) {
      document.body.removeChild(iframe);
      throw new Error("Nepodařilo se vytvořit iframe pro generování voucheru");
    }
    doc.open();
    doc.write(`
      <!DOCTYPE html><html><head><meta charset="utf-8">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap">
      </head><body style="margin:0;background:#0f0f0f;">
      <div style="position:relative;width:${width}px;height:${height}px;overflow:hidden;background:#0f0f0f;">
        <img src="${window.location.origin}/voucher-card.png?v=2" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:fill;" />
        <div style="position:absolute;top:${layout.voucherNo.top}px;right:${layout.voucherNo.right}px;font-size:11px;color:#8a8a8a;font-family:'Playfair Display',serif;z-index:1;">Č. voucheru: ${escapeHtml(voucherNumber)}</div>
        <div style="position:absolute;left:${layout.nameLeft}px;bottom:${layout.nameBottom}px;font-size:20px;font-weight:600;line-height:1;color:#ffffff;font-family:'Playfair Display',serif;z-index:1;">${escapeHtml(o.name)}</div>
        <div style="position:absolute;left:${layout.surnameLeft}px;bottom:${layout.surnameBottom}px;font-size:20px;font-weight:600;line-height:1;color:#ffffff;font-family:'Playfair Display',serif;z-index:1;">${escapeHtml(surname || "–")}</div>
        <div style="position:absolute;left:${layout.serviceLeft}px;right:${layout.serviceRight}px;bottom:${layout.serviceBottom}px;font-size:17px;line-height:1;color:#C4BEB4;font-family:'Playfair Display',serif;z-index:1;">${escapeHtml(o.service)}</div>
        <div style="position:absolute;left:${layout.serviceLeft}px;bottom:${layout.amountBottom}px;font-size:19px;font-weight:700;color:#C9A84C;font-family:'Playfair Display',serif;z-index:1;">${escapeHtml(amountStr)} Kč</div>
        <div style="position:absolute;left:${layout.serviceLeft}px;bottom:${layout.branchBottom}px;font-size:12px;color:#8a8a8a;font-family:'Playfair Display',serif;z-index:1;">Pobočka: ${escapeHtml(o.branch)}</div>
      </div>
      </body></html>
    `);
    doc.close();
    const container = doc.body;
    const img = container.querySelector("img");
    const imgLoaded = img
      ? new Promise<void>((resolve, reject) => {
          if ((img as HTMLImageElement).complete) resolve();
          else {
            (img as HTMLImageElement).onload = () => resolve();
            (img as HTMLImageElement).onerror = () => reject(new Error("Nepodařilo se načíst obrázek voucheru"));
          }
        })
      : Promise.resolve();
    try {
      await imgLoaded;
      if (doc.fonts?.ready) await doc.fonts.ready;
      await new Promise((r) => setTimeout(r, 150));
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#0f0f0f",
        logging: false,
      });
      document.body.removeChild(iframe);
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [width, height] });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, width, height);
      const safeName = `${o.name}-${o.surname || ""}`.trim().replace(/\s+/g, "-").replace(/[^\w\u00C0-\u024F\-]/gi, "") || "voucher";
      pdf.save(`voucher-${safeName}.pdf`);
    } catch (e) {
      if (iframe.parentNode) document.body.removeChild(iframe);
      throw e;
    }
  };

  const exportCsv = () => {
    const headers = ["ID", "Datum", "Č. voucheru", "Jméno", "E-mail", "Telefon", "Služba", "Pobočka", "Stav", "Částka", "Admin poznámka"];
    const rows = sortedFiltered.map((o) => [
      o.id,
      formatDate(o.created_at),
      o.voucher_number || "",
      `${o.name} ${o.surname || ""}`.trim(),
      o.email,
      o.phone || "",
      o.service,
      o.branch,
      statusLabels[o.status],
      parseAmount(o.service).toString(),
      o.admin_note || "",
    ]);
    const csv = [headers.join(";"), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";"))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `voucher-objednavky-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (selectedOrder) setAdminNote(selectedOrder.admin_note || "");
  }, [selectedOrder?.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (openDropdown) setOpenDropdown(null);
        else if (openActionMenu) setOpenActionMenu(null);
        else if (showDetail) handleCloseDetail();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openDropdown, openActionMenu, showDetail, handleCloseDetail]);

  useEffect(() => {
    if (showDetail && selectedOrder && detailPanelRef.current) {
      const panel = detailPanelRef.current;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      if (first) first.focus();
      const trap = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;
        const list = Array.from(focusable).filter((el) => !el.hasAttribute("disabled"));
        const idx = list.indexOf(document.activeElement as HTMLElement);
        if (idx === -1) return;
        if (e.shiftKey) {
          if (idx === 0) {
            e.preventDefault();
            (list[list.length - 1] as HTMLElement).focus();
          }
        } else {
          if (idx === list.length - 1) {
            e.preventDefault();
            (list[0] as HTMLElement).focus();
          }
        }
      };
      panel.addEventListener("keydown", trap);
      return () => panel.removeEventListener("keydown", trap);
    }
  }, [showDetail, selectedOrder]);

  const adminLayout = "min-h-screen relative";

  const inputClass =
    "w-full bg-white border border-gray-300 focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/25 text-gray-900 rounded-xl px-4 py-3 outline-none transition-all";
  const btnClass = "px-6 py-3 bg-[#C9A84C] hover:bg-[#D4B85A] text-gray-900 rounded-xl font-semibold transition-all";

  if (!isSupabaseConfigured()) {
    return (
      <div className={`${adminLayout} flex items-center justify-center p-6 bg-white`}>
        <div className="max-w-md text-center">
          <h1 className="text-gray-800 text-xl mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Admin není nakonfigurován
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Přidej VITE_SUPABASE_URL a VITE_SUPABASE_ANON_KEY do .env. Viz .env.example.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`${adminLayout} flex items-center justify-center bg-white`} role="status" aria-live="polite">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" aria-hidden />
        <span className="sr-only">Načítám…</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`${adminLayout} flex items-center justify-center p-6 bg-white`}>
        <div className="w-full max-w-sm">
          <h1 className="text-gray-800 text-2xl mb-2 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            J&J Admin
          </h1>
          <p className="text-gray-600 text-sm mb-8 text-center">Přihlášení pro správu voucherů</p>

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
            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
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
    <div className={`${adminLayout} min-h-screen bg-white text-gray-900`} style={{ fontFamily: "Inter, sans-serif" }}>
      <div>
        <header className="border-b border-gray-200 bg-white px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-[#c9a84c] rounded-lg flex items-center justify-center flex-shrink-0">
              <ScissorsIcon size={18} className="text-[#080808]" />
            </div>
            <div>
              <h1 className="text-gray-900 text-lg font-medium" style={{ fontFamily: "Playfair Display, serif" }}>
                Barber Admin
              </h1>
              <span className="text-gray-600 text-xs">Správa dárkových poukazů</span>
            </div>
            {role && (
              <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                <span
                  className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                    isMajitel ? "bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/30" : "bg-gray-50 text-gray-600 border border-gray-200"
                  }`}
                >
                  {isMajitel ? "Majitel" : "Barber"}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isMajitel && (
              <button
                onClick={() => setShowAddAdmin((v) => !v)}
                className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors border ${
                  showAddAdmin
                    ? "bg-[#c9a84c] text-gray-900 border-[#c9a84c]"
                    : "bg-transparent text-gray-600 border-gray-400 hover:border-gray-500 hover:text-gray-800"
                }`}
                aria-expanded={showAddAdmin}
                aria-label={showAddAdmin ? "Skrýt formulář pro přidání správce" : "Přidat nového správce"}
              >
                + Přidat správce
              </button>
            )}
            <a
              href="/"
              className="text-gray-600 hover:text-gray-800 text-sm px-3 py-2 rounded-lg transition-colors"
            >
              ← Web
            </a>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800 text-sm px-3 py-2 rounded-lg transition-colors"
              aria-label="Odhlásit se"
            >
              Odhlásit
            </button>
          </div>
        </header>

        <main className="px-4 sm:px-8 py-4 sm:py-6 max-w-[1920px] mx-auto w-full">
          {noRole && (
            <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-gray-700 text-sm">
                Nemáte přiřazenou roli. Přidejte svůj účet do tabulky <code className="text-gray-600">admin_roles</code> v Supabase s rolí <code className="text-gray-600">majitel</code> nebo <code className="text-gray-600">barber</code>.
              </p>
            </div>
          )}

          {isBarber && (
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-gray-700 text-sm">
                Jste přihlášen jako barber. Máte přístup pouze ke čtení bez možnosti měnit stavy voucherů a správu uživatelů.
              </p>
            </div>
          )}

          {!noRole && (
            <>
              {fetchError && (
                <div className="mb-5 flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircleIcon size={16} className="text-red-600" />
                  <span className="text-sm text-red-700">{fetchError}</span>
                  <button onClick={() => fetchOrders()} className="ml-2 text-xs text-red-600 hover:text-red-700 underline">
                    Zkusit znovu
                  </button>
                </div>
              )}
              {(metrics.staryNovy > 0 || metrics.bezTelefonu > 0) && (
                <div className="mb-5 flex flex-wrap gap-2">
                  {metrics.staryNovy > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertTriangleIcon size={16} className="text-amber-600" />
                      <span className="text-sm text-amber-800">
                        {metrics.staryNovy} nezpracovaných starších než 24 h
                      </span>
                    </div>
                  )}
                  {metrics.bezTelefonu > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                      <PhoneOffIcon size={16} className="text-amber-600" />
                      <span className="text-sm text-amber-800">
                        {metrics.bezTelefonu} objednávek bez telefonu
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
                <StatsCard
                  label="Celkové tržby"
                  value={`${totalRevenue.toLocaleString("cs-CZ")} Kč`}
                  sub="bez čekajících a storno"
                  color="text-[#c9a84c]"
                />
                <StatsCard
                  label="Tržby dnes"
                  value={`${metrics.trzbyDnes.toLocaleString("cs-CZ")} Kč`}
                  sub="vyřízené dnes"
                  color="text-[#c9a84c]"
                />
                <StatsCard
                  label="Nové"
                  value={counts.novy}
                  sub={metrics.novyDnes > 0 ? `${metrics.novyDnes} dnes` : "čekají"}
                  color="text-blue-600"
                />
                <StatsCard label="Vyřízeno" value={counts.vyrizeno} sub="celkem" color="text-emerald-600" />
                <StatsCard
                  label="Čeká / rozpracováno"
                  value={counts.ceka + counts.pending}
                  sub="platba nebo v práci"
                  color="text-amber-600"
                />
                <StatsCard
                  label="Průměr voucheru"
                  value={`${metrics.prumer.toLocaleString("cs-CZ")} Kč`}
                  sub={metrics.topService ? metrics.topService.split("–")[0]?.trim() || "" : ""}
                  color="text-gray-600"
                />
              </div>

              {ordersLoading ? (
                <div className="flex justify-center py-20" role="status" aria-live="polite">
                  <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" aria-hidden />
                  <span className="sr-only">Načítám objednávky…</span>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-200 bg-white flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="text-gray-900 font-medium text-base">
                        Objednávky voucherů
                      </h2>
                      {selectedIds.size > 0 ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-gray-600 text-sm">{selectedIds.size} vybráno</span>
                          <button
                            onClick={bulkExportCsv}
                            className="px-3 py-1.5 text-xs bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40 rounded-lg hover:bg-[#c9a84c]/30 transition-colors"
                          >
                            Export vybraných
                          </button>
                          <select
                            onChange={async (e) => {
                              const v = e.target.value as Status;
                              e.target.value = "";
                              if (!v) return;
                              for (const id of selectedIds) {
                                await updateStatus(id, v);
                              }
                              setSelectedIds(new Set());
                            }}
                            className="px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg text-gray-700 cursor-pointer"
                          >
                            <option value="">Změnit stav…</option>
                            {(["new", "pending", "awaiting_payment", "done", "storno"] as Status[]).map((s) => (
                              <option key={s} value={s}>
                                {statusLabels[s]}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => setSelectedIds(new Set())}
                            className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800"
                          >
                            Zrušit výběr
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-600 text-sm">
                          Zobrazeno {filtered.length} z {orders.length}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 -mx-1">
                      <div className="relative">
                        <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Hledat jméno, email, telefon..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="bg-white border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#c9a84c]/60 w-40 sm:w-52 min-w-[140px]"
                          aria-label="Hledat v objednávkách"
                        />
                      </div>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as Status | "Vše")}
                        className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#c9a84c]/60 cursor-pointer"
                      >
                        <option value="Vše">Všechny stavy</option>
                        {(["new", "pending", "awaiting_payment", "done", "storno"] as Status[]).map((s) => (
                          <option key={s} value={s}>
                            {statusLabels[s]}
                          </option>
                        ))}
                      </select>
                      <select
                        value={filterPobocka}
                        onChange={(e) => setFilterPobocka(e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#c9a84c]/60 cursor-pointer"
                      >
                        {branches.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[
                          { id: "dnes" as const, label: "Dnes" },
                          { id: "tyden" as const, label: "Týden" },
                          { id: "mesic" as const, label: "Měsíc" },
                          { id: "30dni" as const, label: "30 dní" },
                        ].map((p) => (
                          <button
                            key={p.id}
                            onClick={() => applyDatePreset(p.id)}
                            className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                              filterDatePreset === p.id
                                ? "bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/40"
                                : "bg-white text-gray-600 border border-gray-300 hover:text-gray-800 hover:border-gray-400"
                            }`}
                            title={p.id === "dnes" ? "Dnešní datum (lokální čas)" : undefined}
                          >
                            {p.label}
                          </button>
                        ))}
                        {filterDatePreset === "custom" && (
                          <span className="px-2.5 py-1.5 text-xs text-gray-600 border border-gray-300 rounded">
                            Vlastní
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500 text-xs">Od</span>
                        <input
                          type="date"
                          value={filterDateFrom}
                          onChange={(e) => handleDateFromChange(e.target.value)}
                          className={`bg-white border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#c9a84c]/60 ${
                            !dateRangeValid ? "border-red-500/50" : "border-gray-300"
                          }`}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500 text-xs">Do</span>
                        <input
                          type="date"
                          value={filterDateTo}
                          onChange={(e) => handleDateToChange(e.target.value)}
                          className={`bg-white border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#c9a84c]/60 ${
                            !dateRangeValid ? "border-red-500/50" : "border-gray-300"
                          }`}
                          title={!dateRangeValid ? "Datum Do musí být po datu Od" : undefined}
                        />
                      </div>
                      {!dateRangeValid && (
                        <span className="text-red-400 text-xs">Od musí být před Do</span>
                      )}
                      <label className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:border-gray-400 transition-colors">
                        <input
                          type="checkbox"
                          checked={filterJenNove}
                          onChange={(e) => setFilterJenNove(e.target.checked)}
                          className="rounded border-gray-400 bg-white text-[#c9a84c] focus:ring-[#c9a84c]/50"
                        />
                        <span className="text-sm text-gray-700">Jen nové</span>
                      </label>
                      <button
                        onClick={() => fetchOrders()}
                        className="p-2 bg-white border border-gray-300 rounded-lg text-gray-600 hover:text-[#c9a84c] hover:bg-gray-50 transition-colors"
                        aria-label="Obnovit seznam"
                        title="Obnovit"
                      >
                        <RefreshCwIcon size={14} className={ordersLoading ? "animate-spin" : ""} aria-hidden />
                      </button>
                      <button
                        onClick={resetFilters}
                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                        aria-label="Resetovat filtry"
                      >
                        Reset
                      </button>
                      <button
                        onClick={exportCsv}
                        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:text-[#c9a84c] hover:bg-gray-50 hover:border-[#c9a84c]/30 transition-colors"
                        aria-label="Exportovat CSV"
                      >
                        <DownloadIcon size={14} aria-hidden />
                        Export CSV
                      </button>
                    </div>
                  </div>

                  <div className="overflow-auto max-h-[calc(100vh-380px)] sm:max-h-[calc(100vh-420px)]">
                    <table className="w-full min-w-[720px]" role="grid" aria-label="Tabulka objednávek voucherů">
                      <thead className="sticky top-0 z-10 bg-white border-b-2 border-gray-200">
                        <tr>
                          {isMajitel && (
                            <th className="w-10 px-2 py-3">
                              <input
                                type="checkbox"
                                checked={selectedIds.size === sortedFiltered.length && sortedFiltered.length > 0}
                                onChange={toggleSelectAll}
                                className="rounded border-gray-400 bg-white text-[#c9a84c] focus:ring-[#c9a84c]/50"
                                aria-label="Vybrat vše"
                              />
                            </th>
                          )}
                          <th className="px-4 py-3 text-left text-[11px] text-gray-700 tracking-wider uppercase font-semibold first:pl-5">
                            ID
                          </th>
                          <th
                            className="px-4 py-3 text-left text-[11px] text-gray-700 tracking-wider uppercase font-semibold cursor-pointer hover:text-gray-900 select-none"
                            onClick={() => { setSortCol("created_at"); setSortAsc((v) => !v); }}
                          >
                            <span className="inline-flex items-center gap-1">
                              DATUM
                              {sortCol === "created_at" ? (sortAsc ? <ChevronUpIcon size={12} /> : <ChevronDownIcon size={12} />) : null}
                            </span>
                          </th>
                          <th
                            className="px-4 py-3 text-left text-[11px] text-gray-700 tracking-wider uppercase font-semibold cursor-pointer hover:text-gray-900 select-none"
                            onClick={() => { setSortCol("name"); setSortAsc((v) => !v); }}
                          >
                            <span className="inline-flex items-center gap-1">
                              JMÉNO
                              {sortCol === "name" ? (sortAsc ? <ChevronUpIcon size={12} /> : <ChevronDownIcon size={12} />) : null}
                            </span>
                          </th>
                          <th className="px-4 py-3 text-left text-[11px] text-gray-700 tracking-wider uppercase font-semibold">E-MAIL</th>
                          <th className="px-4 py-3 text-left text-[11px] text-gray-700 tracking-wider uppercase font-semibold">TELEFON</th>
                          <th className="px-4 py-3 text-left text-[11px] text-gray-700 tracking-wider uppercase font-semibold">SLUŽBA</th>
                          <th
                            className="px-4 py-3 text-left text-[11px] text-gray-700 tracking-wider uppercase font-semibold cursor-pointer hover:text-gray-900 select-none"
                            onClick={() => { setSortCol("branch"); setSortAsc((v) => !v); }}
                          >
                            <span className="inline-flex items-center gap-1">
                              POBOČKA
                              {sortCol === "branch" ? (sortAsc ? <ChevronUpIcon size={12} /> : <ChevronDownIcon size={12} />) : null}
                            </span>
                          </th>
                          <th
                            className="px-4 py-3 text-left text-[11px] text-gray-700 tracking-wider uppercase font-semibold cursor-pointer hover:text-gray-900 select-none"
                            onClick={() => { setSortCol("status"); setSortAsc((v) => !v); }}
                          >
                            <span className="inline-flex items-center gap-1">
                              STAV
                              {sortCol === "status" ? (sortAsc ? <ChevronUpIcon size={12} /> : <ChevronDownIcon size={12} />) : null}
                            </span>
                          </th>
                          <th className="px-2 py-3 text-left text-[11px] text-gray-700 tracking-wider uppercase font-semibold w-14"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedFiltered.length === 0 ? (
                          <tr>
                            <td colSpan={isMajitel ? 10 : 9} className="py-20 text-center">
                              <div className="flex flex-col items-center gap-2">
                                <span className="text-gray-700 text-sm">
                                  {orders.length === 0 ? "Zatím žádné objednávky" : "Žádné výsledky podle filtrů"}
                                </span>
                                {orders.length > 0 && (
                                  <button
                                    onClick={resetFilters}
                                    className="text-xs text-[#c9a84c] hover:underline"
                                  >
                                    Zrušit filtry
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ) : (
                          sortedFiltered.map((o, i) => (
                            <tr
                              key={o.id}
                              onClick={() => handleSelectOrder(o)}
                              className={`border-b border-gray-100 transition-colors group cursor-pointer ${
                                selectedOrder?.id === o.id
                                  ? "bg-amber-50 ring-inset ring-1 ring-[#c9a84c]/40"
                                  : i % 2 === 0
                                    ? "bg-white hover:bg-gray-50"
                                    : "bg-gray-50 hover:bg-gray-100"
                              } ${o.status === "new" ? "border-l-2 border-l-blue-500/50" : ""}`}
                            >
                              {isMajitel && (
                                <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="checkbox"
                                    checked={selectedIds.has(o.id)}
                                    onChange={() => toggleSelect(o.id)}
                                    className="rounded border-gray-400 bg-white text-[#c9a84c] focus:ring-[#c9a84c]/50"
                                    aria-label={`Vybrat ${o.name}`}
                                  />
                                </td>
                              )}
                              <td className="px-4 pl-5 py-3 text-xs text-[#c9a84c] font-mono">
                                {o.id.slice(0, 8)}…
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">{formatDate(o.created_at)}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 font-medium whitespace-nowrap">
                                {o.name} {o.surname || ""}
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-700">
                                <a href={`mailto:${o.email}`} className="hover:text-[#c9a84c] transition-colors">
                                  {o.email}
                                </a>
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">
                                {o.phone ? (
                                  <a href={`tel:${o.phone}`} className="hover:text-[#c9a84c] transition-colors">
                                    {o.phone}
                                  </a>
                                ) : (
                                  "–"
                                )}
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-700 max-w-[180px] truncate" title={o.service}>
                                {o.service}
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-700">{o.branch}</td>
                              <td className="px-4 py-3 relative">
                                {isMajitel ? (
                                  <>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === o.id ? null : o.id); }}
                                      className="flex items-center gap-1.5 group/btn"
                                      disabled={updatingId === o.id}
                                      aria-label={`Změnit stav objednávky ${o.id}`}
                                      aria-expanded={openDropdown === o.id}
                                      aria-haspopup="listbox"
                                    >
                                      {updatingId === o.id ? (
                                        <Loader2Icon size={12} className="animate-spin text-gray-500" />
                                      ) : (
                                        <>
                                          <StatusBadge status={o.status} />
                                          <ChevronDownIcon
                                            size={10}
                                            className="text-gray-400 group-hover/btn:text-gray-600 transition-colors"
                                          />
                                        </>
                                      )}
                                    </button>
                                    {openDropdown === o.id && (
                                      <div className="absolute left-4 top-full mt-1 bg-white border border-gray-200 rounded-lg overflow-hidden z-50 shadow-xl min-w-[155px]">
                                        {(["new", "pending", "awaiting_payment", "done", "storno"] as Status[]).map((s) => (
                                          <button
                                            key={s}
                                            onClick={(e) => { e.stopPropagation(); updateStatus(o.id, s); }}
                                            className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                                              o.status === s ? "text-[#c9a84c]" : "text-gray-600"
                                            }`}
                                          >
                                            {o.status === s && <CheckIcon size={10} className="text-[#c9a84c]" />}
                                            {o.status !== s && <span className="w-[10px]" />}
                                            {statusLabels[s]}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <StatusBadge status={o.status} />
                                )}
                              </td>
                              <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center gap-0.5 relative">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenActionMenu(openActionMenu === o.id ? null : o.id);
                                    }}
                                    className="p-2 rounded text-gray-500 hover:text-[#c9a84c] hover:bg-gray-100 transition-colors"
                                    aria-label="Akce"
                                    aria-expanded={openActionMenu === o.id}
                                  >
                                    <MoreVerticalIcon size={16} aria-hidden />
                                  </button>
                                  {openActionMenu === o.id && (
                                    <div className="absolute right-0 top-full mt-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden z-50 shadow-xl min-w-[180px] py-1">
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleSelectOrder(o); setOpenActionMenu(null); }}
                                        className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-gray-50 text-gray-700"
                                      >
                                        <EyeIcon size={14} />
                                        Detail
                                      </button>
                                      {isMajitel && (
                                        <button
                                          onClick={(e) => { e.stopPropagation(); setOpenDropdown(o.id); setOpenActionMenu(null); }}
                                          className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-gray-50 text-gray-700"
                                        >
                                          <CheckIcon size={14} />
                                          Změnit stav
                                        </button>
                                      )}
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleSelectOrder(o); setOpenActionMenu(null); }}
                                        className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-gray-50 text-gray-700"
                                      >
                                        <FileTextIcon size={14} />
                                        Poznámka
                                      </button>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); generateVoucherPdf(o).catch((err) => alert(err?.message ?? "Chyba při generování PDF")); setOpenActionMenu(null); }}
                                        className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-gray-50 text-gray-700"
                                      >
                                        <PrinterIcon size={14} />
                                        Vygenerovat voucher
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between bg-white">
                    <span className="text-xs text-gray-600">
                      Zobrazeno {filtered.length} z {orders.length} záznamů
                    </span>
                    <span className="text-xs text-gray-600">
                      Celkem{" "}
                      {filtered
                        .filter((o) => o.status !== "storno")
                        .reduce((s, o) => s + parseAmount(o.service), 0)
                        .toLocaleString("cs-CZ")}{" "}
                      Kč (filtrováno)
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          {isMajitel && showAddAdmin && (
            <div
              className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white border border-gray-200 rounded-xl max-w-md"
              role="region"
              aria-labelledby="add-admin-title"
              aria-busy={addAdminLoading}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 id="add-admin-title" className="text-gray-800 font-medium" style={{ fontFamily: "Playfair Display, serif" }}>
                  Přidat dalšího správce
                </h2>
                <button
                  onClick={() => setShowAddAdmin(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm p-1 disabled:opacity-50"
                  disabled={addAdminLoading}
                  aria-label="Zavřít formulář"
                >
                  Zavřít
                </button>
              </div>
              <p className="text-gray-600 text-xs mb-4">
                Vytvoř účet pro kolegu. Majitel může měnit stavy voucherů, barber má jen náhled.
              </p>
              <form onSubmit={handleAddAdmin} className="space-y-3" aria-describedby={addAdminError ? "add-admin-error" : addAdminSuccess ? "add-admin-success" : undefined}>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as "majitel" | "barber")}
                  className={inputClass}
                  disabled={addAdminLoading}
                  aria-label="Role nového správce"
                >
                  <option value="barber">Barber (jen náhled)</option>
                  <option value="majitel">Majitel (plný přístup)</option>
                </select>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => {
                    setNewAdminEmail(e.target.value);
                    setAddAdminError("");
                  }}
                  placeholder="E-mail nového správce"
                  required
                  className={inputClass}
                  disabled={addAdminLoading}
                  aria-invalid={!!addAdminError}
                  aria-describedby={addAdminError ? "add-admin-error" : undefined}
                />
                <input
                  type="password"
                  value={newAdminPassword}
                  onChange={(e) => {
                    setNewAdminPassword(e.target.value);
                    setAddAdminError("");
                  }}
                  placeholder="Heslo (min. 6 znaků)"
                  required
                  minLength={6}
                  className={inputClass}
                  disabled={addAdminLoading}
                  aria-invalid={!!addAdminError}
                />
                {addAdminError && (
                  <p id="add-admin-error" className="text-red-400 text-sm" role="alert">
                    {addAdminError}
                  </p>
                )}
                {addAdminSuccess && (
                  <p id="add-admin-success" className="text-emerald-400 text-sm" role="status">
                    Účet vytvořen. Nový správce se může přihlásit na e-mail a heslo.
                  </p>
                )}
                <button type="submit" disabled={addAdminLoading} className={btnClass} aria-busy={addAdminLoading}>
                  {addAdminLoading ? "Vytvářím…" : "Vytvořit účet"}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {(openDropdown || openActionMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setOpenDropdown(null); setOpenActionMenu(null); }}
          aria-hidden="true"
        />
      )}

      {showDetail && selectedOrder && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={handleCloseDetail} aria-hidden />
          <div
            ref={detailPanelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-panel-title"
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white border-l border-gray-200 shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0 bg-white">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[#c9a84c] text-xs font-mono">{selectedOrder.id.slice(0, 8)}…</span>
                  <StatusBadge status={selectedOrder.status} />
                </div>
                <h3 id="detail-panel-title" className="mt-1 font-medium text-gray-900">
                  {selectedOrder.name} {selectedOrder.surname || ""}
                </h3>
              </div>
              <button
                onClick={handleCloseDetail}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                aria-label="Zavřít detail"
              >
                <XIcon size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {[
                { label: "Datum", value: formatDate(selectedOrder.created_at) },
                { label: "Č. voucheru", value: selectedOrder.voucher_number || "–" },
                { label: "E-mail", value: selectedOrder.email },
                { label: "Telefon", value: selectedOrder.phone || "–" },
                { label: "Služba", value: selectedOrder.service },
                { label: "Pobočka", value: selectedOrder.branch },
                { label: "Částka", value: `${parseAmount(selectedOrder.service).toLocaleString("cs-CZ")} Kč` },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-start gap-4">
                  <span className="text-xs text-gray-500 uppercase tracking-wider flex-shrink-0">{row.label}</span>
                  <span className="text-sm text-gray-800 text-right break-all">{row.value}</span>
                </div>
              ))}
              {selectedOrder.note && (
                <div className="pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Poznámka zákazníka</span>
                  <p className="text-sm text-gray-600">{selectedOrder.note}</p>
                </div>
              )}
              {isMajitel && (
                <div className="pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500 uppercase tracking-wider block mb-2">Admin poznámka</span>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    onBlur={saveAdminNote}
                    placeholder="Interní poznámka..."
                    rows={3}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#c9a84c]/50 resize-none"
                  />
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={saveAdminNote}
                      disabled={savingNote || adminNote === (selectedOrder.admin_note || "")}
                      className="px-3 py-1.5 text-xs bg-gray-100 border border-gray-300 rounded-lg text-gray-600 hover:text-[#c9a84c] hover:border-[#c9a84c]/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {savingNote ? "Ukládám…" : "Uložit"}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="px-5 py-4 border-t border-gray-200 flex flex-col gap-2 flex-shrink-0 bg-white">
              {isMajitel && selectedOrder.status !== "done" && selectedOrder.status !== "storno" && (
                <button
                  onClick={() => { updateStatus(selectedOrder.id, "done"); handleCloseDetail(); }}
                  className="w-full py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded-lg text-sm font-medium transition-colors"
                >
                  Označit jako vyřízené
                </button>
              )}
              <a
                href={`mailto:${selectedOrder.email}`}
                className="w-full py-2.5 bg-[#c9a84c] hover:bg-[#d4b85a] text-[#0a0a0a] rounded-lg text-sm font-medium text-center transition-colors"
              >
                Odeslat e-mail
              </a>
              {selectedOrder.phone ? (
                <a
                  href={`tel:${selectedOrder.phone}`}
                  className="w-full py-2.5 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 rounded-lg text-sm text-center transition-colors"
                >
                  Zavolat
                </a>
              ) : (
                <span className="w-full py-2.5 bg-gray-100 border border-gray-200 text-gray-500 rounded-lg text-sm text-center">
                  Bez telefonu
                </span>
              )}
              <button
                onClick={() => generateVoucherPdf(selectedOrder).catch((err) => alert(err?.message ?? "Chyba při generování PDF"))}
                className="w-full py-2.5 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <PrinterIcon size={16} />
                Vygenerovat voucher
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
