import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
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
  AlertTriangleIcon,
  PhoneOffIcon,
  DownloadIcon,
  MoreVerticalIcon,
  FileTextIcon,
  Banknote,
  TrendingUp,
  Receipt,
  CheckCircle2,
  BarChart3,
  KeyRound,
  Trash2,
  UserCog,
  Settings,
  ClipboardList,
  Loader2Icon,
  Columns3,
} from "lucide-react";
import * as api from "@/lib/api";
import type { ApiUser } from "@/lib/api";
import {
  getPresetRange,
  getStartOfDayLocal,
  getEndOfDayLocal,
  detectPresetFromRange,
  isDateRangeValid,
  type DatePresetId,
} from "./utils/dateFilter";
import { VoucherPreviewModal } from "../components/VoucherPreviewModal";
import type { VoucherData } from "../components/VoucherTemplate";
import { formatServiceDisplay } from "../utils/formatService";

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

type AdminAccount = {
  user_id: string;
  role: string;
  email: string;
  last_sign_in_at?: string | null;
};

type ColumnId = "id" | "created_at" | "name" | "email" | "phone" | "service" | "branch" | "status";

const allColumns: { id: ColumnId; label: string }[] = [
  { id: "id", label: "ID" },
  { id: "created_at", label: "Datum" },
  { id: "name", label: "Jméno" },
  { id: "email", label: "E-mail" },
  { id: "phone", label: "Telefon" },
  { id: "service", label: "Služba" },
  { id: "branch", label: "Pobočka" },
  { id: "status", label: "Stav" },
];

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

function StatusBadge({ status }: { status: Status }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium ${cfg.color} ${cfg.bg}`}>
      {cfg.icon}
      {statusLabels[status]}
    </span>
  );
}

function DashboardStatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
}: {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: "default" | "primary" | "success" | "warning";
}) {
  const variantStyles = {
    default: "from-gray-50 to-gray-100/50",
    primary: "from-amber-50/80 to-[#fef9e7]",
    success: "from-green-50 to-green-100/50",
    warning: "from-amber-50 to-amber-100/50",
  };
  const iconColors = {
    default: "text-gray-600",
    primary: "text-[#b8860b]",
    success: "text-green-600",
    warning: "text-amber-600",
  };
  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${variantStyles[variant]} p-6 shadow-sm transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 tabular-nums">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 ${iconColors[variant]} shadow-sm backdrop-blur-sm transition-transform group-hover:scale-110`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

export function AdminApp() {
  const [user, setUser] = useState<ApiUser | null>(null);
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
  const [adminAccounts, setAdminAccounts] = useState<AdminAccount[]>([]);
  const [adminAccountsLoading, setAdminAccountsLoading] = useState(false);
  const [manageAdminsError, setManageAdminsError] = useState("");
  const [passwordModal, setPasswordModal] = useState<{ user_id: string; email: string } | null>(null);
  const [newPasswordForUser, setNewPasswordForUser] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{ user_id: string; email: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [roleEditUserId, setRoleEditUserId] = useState<string | null>(null);
  const [newRoleForUser, setNewRoleForUser] = useState<"majitel" | "barber">("barber");
  const [roleUpdateLoading, setRoleUpdateLoading] = useState(false);
  const [adminSection, setAdminSection] = useState<"orders" | "administration">("orders");
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
  const [voucherPreviewOrder, setVoucherPreviewOrder] = useState<VoucherOrder | null>(null);
  const detailPanelRef = useRef<HTMLDivElement>(null);
  const [visibleColumns, setVisibleColumns] = useState<ColumnId[]>(allColumns.map((c) => c.id));
  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);

  const orderToVoucherData = (o: VoucherOrder): VoucherData => ({
    firstName: o.name || "",
    lastName: o.surname || "",
    service: o.service || "",
    branch: o.branch || "",
    voucherNumber: o.voucher_number || o.id.slice(0, 8) || "—",
  });

  const ADMIN_LOGIN_DOMAIN = "@admin.local";

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  useEffect(() => {
    api.auth.getSession().then((u) => {
      setUser(u ?? null);
      setLoading(false);
    });
  }, []);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setOrdersLoading(true);
    setFetchError("");
    const { data, error } = await api.orders.list();
    setOrdersLoading(false);
    if (error) {
      setFetchError(error);
      return;
    }
    const list = (data ?? []) as VoucherOrder[];
    setOrders(list);
    setSelectedOrder((prev) => (prev ? list.find((o) => o.id === prev.id) ?? prev : null));
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(fetchOrders, 60000);
    return () => clearInterval(interval);
  }, [user, fetchOrders]);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setRoleLoading(false);
      return;
    }
    setRoleLoading(true);
    setRole((user.role as AdminRole) ?? null);
    setRoleLoading(false);
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

  const adminEmailFromEnv = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;
  const rawLogin = (adminEmailFromEnv?.trim() || email).trim();
  const loginEmail = rawLogin.includes("@") ? rawLogin : rawLogin ? rawLogin.trim().toLowerCase().replace(/\s+/g, ".") : "";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !password) return;
    setLoginLoading(true);
    setLoginError("");
    const result = await api.auth.login(loginEmail, password);
    setLoginLoading(false);
    if ("error" in result) {
      setLoginError(result.error);
      return;
    }
    setUser(result.user);
  };

  const handleLogout = async () => {
    await api.auth.logout();
    setUser(null);
  };

  const saveAdminNote = async () => {
    if (!selectedOrder || savingNote) return;
    setSavingNote(true);
    const { error } = await api.orders.update(selectedOrder.id, { admin_note: adminNote || null });
    if (!error) {
      setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? { ...o, admin_note: adminNote || null } : o)));
      setSelectedOrder((prev) => (prev?.id === selectedOrder.id ? { ...prev, admin_note: adminNote || null } : prev));
    }
    setSavingNote(false);
  };

  const saveAdminNoteFor = useCallback(
    (id: string, note: string) => {
      api.orders.update(id, { admin_note: note || null }).then(({ error }) => {
        if (!error) setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, admin_note: note || null } : o)));
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
    setUpdatingId(id);
    const { error } = await api.orders.update(id, { status });
    if (!error) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      setSelectedOrder((prev) => (prev?.id === id ? { ...prev, status } : prev));
    }
    setUpdatingId(null);
    setOpenDropdown(null);
  };

  const fetchAdminAccounts = useCallback(async () => {
    if (role !== "majitel") return;
    setAdminAccountsLoading(true);
    setManageAdminsError("");
    const { admins: list, error } = await api.admins.list();
    setAdminAccountsLoading(false);
    if (error) {
      setManageAdminsError(error);
      return;
    }
    setAdminAccounts(list ?? []);
  }, [role]);

  useEffect(() => {
    if (role === "majitel") fetchAdminAccounts();
  }, [role, fetchAdminAccounts]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModal || newPasswordForUser.length < 6) return;
    setPasswordLoading(true);
    setPasswordError("");
    const result = await api.admins.updatePassword(passwordModal.user_id, newPasswordForUser);
    setPasswordLoading(false);
    if (!result.error) {
      setPasswordModal(null);
      setNewPasswordForUser("");
      return;
    }
    setPasswordError(result.error);
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) return;
    setDeleteLoading(true);
    setManageAdminsError("");
    const result = await api.admins.delete(deleteConfirm.user_id);
    setDeleteLoading(false);
    if (!result.error) {
      setDeleteConfirm(null);
      setAdminAccounts((prev) => prev.filter((a) => a.user_id !== deleteConfirm.user_id));
      return;
    }
    setManageAdminsError(result.error);
  };

  const handleChangeRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleEditUserId) return;
    setRoleUpdateLoading(true);
    setManageAdminsError("");
    const result = await api.admins.updateRole(roleEditUserId, newRoleForUser);
    setRoleUpdateLoading(false);
    if (!result.error) {
      setRoleEditUserId(null);
      setAdminAccounts((prev) =>
        prev.map((a) => (a.user_id === roleEditUserId ? { ...a, role: newRoleForUser } : a))
      );
      return;
    }
    setManageAdminsError(result.error);
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginName = newAdminEmail.trim();
    if (!loginName || !newAdminPassword || role !== "majitel") return;
    setAddAdminLoading(true);
    setAddAdminError("");
    setAddAdminSuccess(false);
    const emailForApi = loginName.includes("@")
      ? loginName
      : `${loginName.toLowerCase().replace(/\s+/g, ".")}${ADMIN_LOGIN_DOMAIN}`;
    const result = await api.admins.create(emailForApi, newAdminPassword, newAdminRole);
    if (!result.error) {
      setAddAdminSuccess(true);
      setNewAdminEmail("");
      setNewAdminPassword("");
      setShowAddAdmin(false);
      fetchAdminAccounts();
    } else {
      setAddAdminError(result.error);
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

  const resetFilters = () => {
    setSearch("");
    setFilterStatus("Vše");
    setFilterPobocka("Všechny pobočky");
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterDatePreset("");
    setFilterJenNove(false);
  };

  const toggleColumn = (id: ColumnId) => {
    setVisibleColumns((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((c) => c !== id);
      }
      return [...prev, id];
    });
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
      formatServiceDisplay(o.service),
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

  const exportCsv = () => {
    const headers = ["ID", "Datum", "Č. voucheru", "Jméno", "E-mail", "Telefon", "Služba", "Pobočka", "Stav", "Částka", "Admin poznámka"];
    const rows = sortedFiltered.map((o) => [
      o.id,
      formatDate(o.created_at),
      o.voucher_number || "",
      `${o.name} ${o.surname || ""}`.trim(),
      o.email,
      o.phone || "",
      formatServiceDisplay(o.service),
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
        else if (columnsMenuOpen) setColumnsMenuOpen(false);
        else if (showDetail) handleCloseDetail();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openDropdown, openActionMenu, columnsMenuOpen, showDetail, handleCloseDetail]);

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
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#C9A84C]/60 focus:ring-2 focus:ring-[#C9A84C]/20";
  const btnClass =
    "rounded-xl px-6 py-3 font-bold text-[#08080c] transition-all shadow-sm hover:shadow-md";
  const btnPrimaryStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #C9A84C, #E8C96A)",
    boxShadow: "0 4px 14px rgba(201,168,76,0.25), 0 1px 0 rgba(255,255,255,0.15) inset",
  };

  if (!api.isApiConfigured()) {
    return (
      <div className={`${adminLayout} flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100/50`}>
        <div className="max-w-md text-center">
          <h1 className="text-gray-800 text-xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Admin není nakonfigurován
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            API není dostupné. Zkontrolujte, že složka api/ je na serveru a config.php je vyplněný.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={`${adminLayout} flex items-center justify-center bg-gradient-to-br from-gray-900 via-[#1A1410] to-black`}
        role="status"
        aria-live="polite"
      >
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" aria-hidden />
        <span className="sr-only">Načítám…</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={`${adminLayout} flex items-center justify-center p-4 relative overflow-hidden`}
        style={{ background: "linear-gradient(135deg, #0F0C09 0%, #1A1410 50%, #0F0C09 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, #BFA046 0%, transparent 70%)",
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-80"
            style={{
              background: "radial-gradient(circle, #BFA046 0%, transparent 70%)",
              transform: "translate(50%, 50%)",
            }}
          />
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.03]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="admin-diag" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <line x1="0" y1="40" x2="40" y2="0" stroke="#BFA046" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#admin-diag)" />
          </svg>
        </div>

        <div className="relative w-full max-w-[420px]">
          <div
            className="h-[2px] w-16 mx-auto mb-8"
            style={{ background: "linear-gradient(90deg, transparent, #BFA046, transparent)" }}
          />

          <div
            className="rounded-2xl p-8 shadow-2xl"
            style={{
              background: "linear-gradient(145deg, #1E1A14 0%, #181410 100%)",
              border: "1px solid rgba(191, 160, 70, 0.2)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <div className="flex flex-col items-center mb-8">
              <div
                className="rounded-2xl flex items-center justify-center mb-5 shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #D4B970 0%, #9A7F30 100%)",
                  width: "72px",
                  height: "72px",
                  boxShadow: "0 8px 32px rgba(191, 160, 70, 0.35)",
                }}
              >
                <span
                  className="text-[#1A1410] text-xl"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
                >
                  J&J
                </span>
              </div>

              <h1
                className="text-[#F5F0E8] text-center mb-1"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                  fontSize: "1.4rem",
                  lineHeight: 1.3,
                }}
              >
                J&J Barber Shop
              </h1>
              <p className="text-[#7A7468] text-sm tracking-wide">
                Admin — Správa voucherů
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {!adminEmailFromEnv?.trim() && (
                <div>
                  <label
                    className="block text-[#A09890] text-xs uppercase tracking-wider mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    E-mail
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="majitel nebo vas@email.cz"
                    className="w-full text-[#F5F0E8] rounded-xl px-4 py-3 focus:outline-none transition-all placeholder:text-[#3A3530]"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(191,160,70,0.15)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                    autoComplete="email"
                  />
                </div>
              )}

              <div>
                <label
                  className="block text-[#A09890] text-xs uppercase tracking-wider mb-2"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Heslo
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-[#F5F0E8] rounded-xl px-4 py-3 focus:outline-none transition-all placeholder:text-[#3A3530]"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(191,160,70,0.15)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                  autoComplete="current-password"
                />
              </div>

              {loginError && (
                <div
                  className="text-red-400 text-sm px-4 py-3 rounded-xl"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.25)",
                  }}
                >
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full rounded-xl py-3.5 text-[#1A1410] transition-all duration-200 disabled:opacity-60 mt-2"
                style={{
                  background: loginLoading
                    ? "#9A7F30"
                    : "linear-gradient(135deg, #D4B970 0%, #BFA046 50%, #9A7F30 100%)",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  boxShadow: "0 4px 24px rgba(191, 160, 70, 0.3)",
                }}
              >
                {loginLoading ? "Přihlašuji…" : "Přihlásit se"}
              </button>
            </form>

            <div
              className="mt-8 pt-6"
              style={{ borderTop: "1px solid rgba(191,160,70,0.1)" }}
            >
              <p className="text-center text-[#3A3530] text-xs tracking-wide">
                © 2026 J&J Barber Shop — Všechna práva vyhrazena
              </p>
            </div>
          </div>

          <div
            className="h-[2px] w-16 mx-auto mt-8"
            style={{ background: "linear-gradient(90deg, transparent, #BFA046, transparent)" }}
          />
        </div>
      </div>
    );
  }

  const isMajitel = role === "majitel";
  const isBarber = role === "barber";
  const noRole = role === null && !roleLoading;

  const goldAccent = "#C9A84C";
  const goldLight = "rgba(201,168,76,0.12)";
  const goldBorder = "rgba(201,168,76,0.25)";

  const tableColsCount = (isMajitel ? 1 : 0) + visibleColumns.length + 1;

  return (
    <>
    <div
      className={`${adminLayout} min-h-screen bg-[#F5F3EE] text-[#1A1611]`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <aside
        className="fixed left-0 top-0 z-40 hidden h-screen w-[230px] flex-col md:flex"
        style={{
          background: "#141210",
          borderRight: "1px solid rgba(191,160,70,0.12)",
          boxShadow: "2px 0 24px rgba(0,0,0,0.35)",
        }}
      >
        <div className="flex items-center gap-3 px-5 pt-7 pb-6">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg, #D4B970 0%, #9A7F30 100%)",
              boxShadow: "0 6px 18px rgba(191,160,70,0.45)",
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 700,
              fontSize: "1rem",
              color: "#1A1410",
            }}
          >
            J<span style={{ fontStyle: "italic" }}>&</span>J
          </div>
          <div className="min-w-0">
            <div
              className="text-sm font-bold truncate"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: "0.04em",
                color: "#F5F0E8",
              }}
            >
              J&J Barber Shop
            </div>
            <div
              className="text-[10px] font-medium uppercase tracking-widest"
              style={{ letterSpacing: "0.12em", color: "#5A5450" }}
            >
              Admin panel
            </div>
          </div>
        </div>
        <div className="mx-5 mb-4 h-px" style={{ background: "rgba(191,160,70,0.12)" }} />
        <div className="px-5 pb-2">
          <span
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ letterSpacing: "0.2em", color: "#3A3530" }}
          >
            Menu
          </span>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 overflow-y-auto">
          <button
            type="button"
            onClick={() => setAdminSection("orders")}
            className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
              adminSection === "orders"
                ? "font-semibold text-[#D4B970]"
                : "text-[#6A6460] hover:text-[#A09890]"
            }`}
            style={
              adminSection === "orders"
                ? { background: "rgba(191,160,70,0.12)" }
                : { background: "transparent" }
            }
          >
            {adminSection === "orders" && (
              <span
                className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full"
                style={{ background: "#BFA046" }}
              />
            )}
            <ClipboardList
              size={15}
              strokeWidth={adminSection === "orders" ? 2.3 : 1.7}
              className={adminSection === "orders" ? "text-[#D4B970]" : "group-hover:text-[#A09890]"}
            />
            Objednávky
          </button>
          {isMajitel && (
            <button
              type="button"
              onClick={() => setAdminSection("administration")}
              className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                adminSection === "administration"
                  ? "font-semibold text-[#D4B970]"
                  : "text-[#6A6460] hover:text-[#A09890]"
              }`}
              style={
                adminSection === "administration"
                  ? { background: "rgba(191,160,70,0.12)" }
                  : { background: "transparent" }
              }
            >
              {adminSection === "administration" && (
                <span
                  className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full"
                  style={{ background: "#BFA046" }}
                />
              )}
              <Settings
                size={15}
                strokeWidth={adminSection === "administration" ? 2.3 : 1.7}
                className={adminSection === "administration" ? "text-[#D4B970]" : "group-hover:text-[#A09890]"}
              />
              Administrace
            </button>
          )}
        </nav>
        <div
          className="space-y-0.5 px-3 pb-6 pt-4"
          style={{ borderTop: "1px solid rgba(191,160,70,0.08)" }}
        >
          <a
            href="/"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#6A6460] transition-colors hover:text-[#A09890]"
          >
            <span className="hidden sm:inline">← Web</span>
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-[#6A6460] transition-colors hover:text-red-400"
            aria-label="Odhlásit se"
          >
            <LogOutIcon size={15} strokeWidth={1.8} />
            Odhlásit
          </button>
        </div>
      </aside>

      <div className="min-h-screen flex flex-col md:ml-[230px]">
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 backdrop-blur-md"
          style={{
            background: "#FFFFFF",
            borderBottom: "1px solid #EAE5DC",
          }}
        >
          <div>
            <div className="mb-0.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest">
              <span className="text-[#9A9490]">Admin</span>
              <span className="text-[#C0BAB0]">/</span>
              <span className="text-[#1A1611]">
                {adminSection === "orders" ? "Objednávky" : "Administrace"}
              </span>
            </div>
            <h1 className="text-base font-extrabold tracking-tight text-[#1A1611]">
              {adminSection === "orders" ? "Dárkové vouchery" : "Správa účtů"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {role && (
              <span
                className="rounded-full px-2.5 py-1 text-xs font-semibold"
                style={
                  isMajitel
                    ? {
                        background: "rgba(191,160,70,0.16)",
                        border: "1px solid rgba(191,160,70,0.5)",
                        color: "#BFA046",
                      }
                    : {
                        background: "#F3F4F6",
                        border: "1px solid #E5E7EB",
                        color: "#6B7280",
                      }
                }
              >
                {isMajitel ? "Majitel" : "Barber"}
              </span>
            )}
          </div>
        </header>

        {isMajitel && (
          <div
            className="flex gap-1 border-b bg-white px-4 py-2 md:hidden"
            style={{ borderBottom: "1px solid #EAE5DC" }}
          >
            <button
              type="button"
              onClick={() => setAdminSection("orders")}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                adminSection === "orders" ? "bg-[#C9A84C]/15 text-[#b8860b]" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              Objednávky
            </button>
            <button
              type="button"
              onClick={() => setAdminSection("administration")}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                adminSection === "administration" ? "bg-[#C9A84C]/15 text-[#b8860b]" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              Administrace
            </button>
          </div>
        )}

      <main className="flex-1 px-6 py-7">
          {noRole && (
            <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-gray-700 text-sm">
                Účet nemá přiřazenou roli (majitel / barber). Kontaktujte majitele.
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

              {isMajitel && adminSection === "administration" ? (
                <section className="space-y-8" aria-labelledby="administration-heading">
                  <div>
                    <h2 id="administration-heading" className="text-2xl font-semibold text-gray-900">
                      Administrace
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Správa přístupů do adminu – přidat správce, seznam účtů, změna hesla a role.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="font-semibold text-gray-900">Přidat správce</h3>
                    <p className="mt-1 text-sm text-gray-600">Vytvoř účet pro kolegu. Majitel může měnit stavy voucherů, barber má jen náhled.</p>
                    <form onSubmit={handleAddAdmin} className="mt-4 grid max-w-md gap-3 sm:grid-cols-2" aria-describedby={addAdminError ? "add-admin-error" : addAdminSuccess ? "add-admin-success" : undefined}>
                      <select
                        value={newAdminRole}
                        onChange={(e) => setNewAdminRole(e.target.value as "majitel" | "barber")}
                        className={inputClass}
                        disabled={addAdminLoading}
                        aria-label="Role"
                      >
                        <option value="barber">Barber (jen náhled)</option>
                        <option value="majitel">Majitel (plný přístup)</option>
                      </select>
                      <div className="sm:col-span-2" />
                      <input
                        type="text"
                        value={newAdminEmail}
                        onChange={(e) => { setNewAdminEmail(e.target.value); setAddAdminError(""); }}
                        placeholder="jméno.příjmení"
                        required
                        className={inputClass}
                        disabled={addAdminLoading}
                        aria-invalid={!!addAdminError}
                        autoComplete="username"
                      />
                      <p className="text-xs text-gray-500 sm:col-span-2 -mt-1">
                        Přihlašovací jméno ve tvaru jméno.příjmení.
                      </p>
                      <input
                        type="password"
                        value={newAdminPassword}
                        onChange={(e) => { setNewAdminPassword(e.target.value); setAddAdminError(""); }}
                        placeholder="Heslo (min. 6 znaků)"
                        required
                        minLength={6}
                        className={inputClass}
                        disabled={addAdminLoading}
                      />
                      <div className="flex items-center gap-3 sm:col-span-2">
                        <button type="submit" disabled={addAdminLoading} className={btnClass} style={btnPrimaryStyle} aria-busy={addAdminLoading}>
                          {addAdminLoading ? "Vytvářím…" : "Přidat správce"}
                        </button>
                        {addAdminError && <p id="add-admin-error" className="text-sm text-red-500" role="alert">{addAdminError}</p>}
                        {addAdminSuccess && <p id="add-admin-success" className="text-sm text-emerald-600" role="status">Účet vytvořen.</p>}
                      </div>
                    </form>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">Seznam účtů</h3>
                        <p className="mt-0.5 text-sm text-gray-600">Kdo má přístup – změna hesla, role, odstranění</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => fetchAdminAccounts()}
                        disabled={adminAccountsLoading}
                        className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                      >
                        <RefreshCwIcon size={16} className={adminAccountsLoading ? "animate-spin" : ""} />
                        Obnovit
                      </button>
                    </div>
                    {manageAdminsError && (
                      <div className="mx-6 mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                        <AlertCircleIcon size={16} />
                        {manageAdminsError}
                      </div>
                    )}
                    <div className="overflow-x-auto">
                      {adminAccountsLoading && adminAccounts.length === 0 ? (
                        <div className="flex justify-center py-12">
                          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" aria-hidden />
                          <span className="sr-only">Načítám účty…</span>
                        </div>
                      ) : adminAccounts.length === 0 ? (
                        <p className="py-8 text-center text-sm text-gray-500">Zatím žádné účty. Přidejte správce výše.</p>
                      ) : (
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200 bg-gray-50/50">
                              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">E-mail</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Role</th>
                              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Poslední přihlášení</th>
                              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Akce</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {adminAccounts.map((acc) => (
                              <tr key={acc.user_id} className="transition-colors hover:bg-gray-50/50">
                                <td className="px-6 py-4 text-sm text-gray-900">
                                  {acc.email.endsWith(ADMIN_LOGIN_DOMAIN)
                                    ? acc.email.slice(0, -ADMIN_LOGIN_DOMAIN.length)
                                    : acc.email}
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${acc.role === "majitel" ? "border-blue-300 bg-blue-50 text-blue-700" : "border-gray-200 bg-gray-50 text-gray-600"}`}>
                                    {acc.role === "majitel" ? "Majitel" : "Barber"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                  {acc.last_sign_in_at
                                    ? new Date(acc.last_sign_in_at).toLocaleString("cs-CZ", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
                                    : "—"}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  {acc.user_id !== user?.id ? (
                                    <div className="flex items-center justify-end gap-1">
                                      <button type="button" onClick={() => { setPasswordModal({ user_id: acc.user_id, email: acc.email }); setNewPasswordForUser(""); setPasswordError(""); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#b8860b]" title="Změnit heslo">
                                        <KeyRound size={16} />
                                      </button>
                                      <button type="button" onClick={() => { setRoleEditUserId(acc.user_id); setNewRoleForUser(acc.role === "majitel" ? "majitel" : "barber"); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#b8860b]" title="Změnit roli">
                                        <UserCog size={16} />
                                      </button>
                                      <button type="button" onClick={() => setDeleteConfirm({ user_id: acc.user_id, email: acc.email })} className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-50" title="Odstranit účet">
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-gray-400">(vy)</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </section>
              ) : (
              <>
              {isMajitel && (
                <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                  <div className="sm:col-span-2 xl:col-span-2">
                    <DashboardStatsCard
                      title="Celkové tržby"
                      value={`${totalRevenue.toLocaleString("cs-CZ")} Kč`}
                      subtitle="bez čekajících a storno"
                      icon={Banknote}
                      variant="primary"
                    />
                  </div>
                  <div className="xl:col-span-1">
                    <DashboardStatsCard
                      title="Tržby dnes"
                      value={`${metrics.trzbyDnes.toLocaleString("cs-CZ")} Kč`}
                      subtitle="vyřízené dnes"
                      icon={TrendingUp}
                      variant="success"
                    />
                  </div>
                  <div className="xl:col-span-1">
                    <DashboardStatsCard
                      title="Nové"
                      value={counts.novy}
                      subtitle={metrics.novyDnes > 0 ? `${metrics.novyDnes} dnes` : "čekají"}
                      icon={Receipt}
                      variant="warning"
                    />
                  </div>
                  <div className="xl:col-span-1">
                    <DashboardStatsCard
                      title="Vyřízeno"
                      value={counts.vyrizeno}
                      subtitle="celkem"
                      icon={CheckCircle2}
                      variant="success"
                    />
                  </div>
                  <div className="xl:col-span-1">
                    <DashboardStatsCard
                      title="Čeká / rozpracováno"
                      value={counts.ceka + counts.pending}
                      subtitle="platba nebo v práci"
                      icon={ClockIcon}
                      variant="warning"
                    />
                  </div>
                  <div className="xl:col-span-1">
                    <DashboardStatsCard
                      title="Průměr voucheru"
                      value={`${metrics.prumer.toLocaleString("cs-CZ")} Kč`}
                      subtitle={metrics.topService ? metrics.topService.split("–")[0]?.trim() || "" : ""}
                      icon={BarChart3}
                      variant="default"
                    />
                  </div>
                </div>
              )}

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Objednávky voucherů</h2>
                  <p className="mt-1 text-sm text-gray-600">Přehled všech objednávek a jejich stavů</p>
                </div>
              </div>

              {ordersLoading ? (
                <div className="flex justify-center py-20" role="status" aria-live="polite">
                  <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" aria-hidden />
                  <span className="sr-only">Načítám objednávky…</span>
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex flex-col gap-3 border-b border-gray-200 bg-white px-6 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Seznam
                      </h3>
                      {selectedIds.size > 0 ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-gray-600 text-sm">{selectedIds.size} vybráno</span>
                          <button
                            onClick={bulkExportCsv}
                            className="rounded-lg border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
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
                            className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                    <div className="-mx-1 flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
                      <div className="relative max-w-md flex-1">
                        <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Hledat jméno, email, telefon..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 min-w-[140px] sm:w-52"
                          aria-label="Hledat v objednávkách"
                        />
                      </div>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as Status | "Vše")}
                        className="h-10 cursor-pointer rounded-lg border border-gray-200 bg-white pl-3 pr-10 text-sm font-medium text-gray-700 outline-none transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                        className="h-10 cursor-pointer rounded-lg border border-gray-200 bg-white px-3 pr-10 text-sm font-medium text-gray-700 outline-none transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                            className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                              filterDatePreset === p.id
                                ? "border-blue-300 bg-blue-50 text-blue-700"
                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-800"
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
                        <span className="text-xs text-gray-500">Od</span>
                        <input
                          type="date"
                          value={filterDateFrom}
                          onChange={(e) => handleDateFromChange(e.target.value)}
                          className={`h-10 rounded-lg border px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 ${
                            !dateRangeValid ? "border-red-500/50" : "border-gray-200 focus:border-blue-500"
                          }`}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Do</span>
                        <input
                          type="date"
                          value={filterDateTo}
                          onChange={(e) => handleDateToChange(e.target.value)}
                          className={`h-10 rounded-lg border px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 ${
                            !dateRangeValid ? "border-red-500/50" : "border-gray-200 focus:border-blue-500"
                          }`}
                          title={!dateRangeValid ? "Datum Do musí být po datu Od" : undefined}
                        />
                      </div>
                      {!dateRangeValid && (
                        <span className="text-red-400 text-xs">Od musí být před Do</span>
                      )}
                      <label className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 transition-colors hover:border-gray-300">
                        <input
                          type="checkbox"
                          checked={filterJenNove}
                          onChange={(e) => setFilterJenNove(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
                        />
                        <span className="text-sm text-gray-700">Jen nové</span>
                      </label>
                      <button
                        onClick={() => fetchOrders()}
                        className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        aria-label="Obnovit seznam"
                        title="Obnovit"
                      >
                        <RefreshCwIcon size={14} className={ordersLoading ? "animate-spin" : ""} aria-hidden />
                        <span className="hidden sm:inline">Obnovit</span>
                      </button>
                      <button
                        onClick={resetFilters}
                        className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        aria-label="Resetovat filtry"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => setColumnsMenuOpen((v) => !v)}
                        className={`flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors ${
                          columnsMenuOpen
                            ? "border-blue-300 bg-blue-50 text-blue-700"
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                        aria-expanded={columnsMenuOpen}
                      >
                        <Columns3 size={14} />
                        <span className="hidden sm:inline">Sloupce</span>
                      </button>
                      <button
                        onClick={exportCsv}
                        className="flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-bold text-[#08080c] transition-all hover:shadow-md"
                        style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96A)", boxShadow: "0 4px 14px rgba(201,168,76,0.25)" }}
                        aria-label="Exportovat CSV"
                      >
                        <DownloadIcon size={14} aria-hidden />
                        <span className="hidden sm:inline">Export CSV</span>
                      </button>
                    </div>
                  </div>

                  {columnsMenuOpen && (
                    <div className="border-t border-gray-100 px-1 pt-3 pb-2 flex flex-wrap items-center gap-2 bg-white">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mr-1">
                        Sloupce tabulky:
                      </span>
                      {allColumns.map((col) => (
                        <label
                          key={col.id}
                          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700 cursor-pointer hover:border-blue-300 hover:bg-blue-50"
                        >
                          <input
                            type="checkbox"
                            className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-0"
                            checked={visibleColumns.includes(col.id)}
                            onChange={() => toggleColumn(col.id)}
                          />
                          <span>{col.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  <div className="max-h-[calc(100vh-320px)] overflow-auto sm:max-h-[calc(100vh-360px)]">
                    <table className="w-full min-w-[720px]" role="grid" aria-label="Tabulka objednávek voucherů">
                      <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50/50">
                        <tr>
                          {isMajitel && (
                            <th className="w-10 px-2 py-3">
                              <input
                                type="checkbox"
                                checked={selectedIds.size === sortedFiltered.length && sortedFiltered.length > 0}
                                onChange={toggleSelectAll}
                                className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
                                aria-label="Vybrat vše"
                              />
                            </th>
                          )}
                          {visibleColumns.includes("id") && (
                            <th className="px-4 py-3 text-left text-[11px] text-gray-700 tracking-wider uppercase font-semibold first:pl-5">
                              ID
                            </th>
                          )}
                          {visibleColumns.includes("created_at") && (
                            <th
                              className="px-4 py-3 text-left text-[11px] text-gray-700 tracking-wider uppercase font-semibold cursor-pointer hover:text-gray-900 select-none"
                              onClick={() => {
                                setSortCol("created_at");
                                setSortAsc((v) => !v);
                              }}
                            >
                              <span className="inline-flex items-center gap-1">
                                DATUM
                                {sortCol === "created_at" ? (sortAsc ? <ChevronUpIcon size={12} /> : <ChevronDownIcon size={12} />) : null}
                              </span>
                            </th>
                          )}
                          {visibleColumns.includes("name") && (
                            <th
                              className="px-4 py-3 text-left text-[11px] text-gray-700 tracking-wider uppercase font-semibold cursor-pointer hover:text-gray-900 select-none"
                              onClick={() => {
                                setSortCol("name");
                                setSortAsc((v) => !v);
                              }}
                            >
                              <span className="inline-flex items-center gap-1">
                                JMÉNO
                                {sortCol === "name" ? (sortAsc ? <ChevronUpIcon size={12} /> : <ChevronDownIcon size={12} />) : null}
                              </span>
                            </th>
                          )}
                          {visibleColumns.includes("email") && (
                            <th className="px-4 py-3 text-left text-[11px] text-gray-700 tracking-wider uppercase font-semibold">E-MAIL</th>
                          )}
                          {visibleColumns.includes("phone") && (
                            <th className="px-4 py-3 text-left text-[11px] text-gray-700 tracking-wider uppercase font-semibold">TELEFON</th>
                          )}
                          {visibleColumns.includes("service") && (
                            <th className="px-4 py-3 text-left text-[11px] text-gray-700 tracking-wider uppercase font-semibold">SLUŽBA</th>
                          )}
                          {visibleColumns.includes("branch") && (
                            <th
                              className="px-4 py-3 text-left text-[11px] text-gray-700 tracking-wider uppercase font-semibold cursor-pointer hover:text-gray-900 select-none"
                              onClick={() => {
                                setSortCol("branch");
                                setSortAsc((v) => !v);
                              }}
                            >
                              <span className="inline-flex items-center gap-1">
                                POBOČKA
                                {sortCol === "branch" ? (sortAsc ? <ChevronUpIcon size={12} /> : <ChevronDownIcon size={12} />) : null}
                              </span>
                            </th>
                          )}
                          {visibleColumns.includes("status") && (
                            <th
                              className="px-4 py-3 text-left text-[11px] text-gray-700 tracking-wider uppercase font-semibold cursor-pointer hover:text-gray-900 select-none"
                              onClick={() => {
                                setSortCol("status");
                                setSortAsc((v) => !v);
                              }}
                            >
                              <span className="inline-flex items-center gap-1">
                                STAV
                                {sortCol === "status" ? (sortAsc ? <ChevronUpIcon size={12} /> : <ChevronDownIcon size={12} />) : null}
                              </span>
                            </th>
                          )}
                          <th className="px-2 py-3 text-left text-[11px] text-gray-700 tracking-wider uppercase font-semibold w-14"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedFiltered.length === 0 ? (
                          <tr>
                            <td colSpan={tableColsCount} className="py-20 text-center">
                              <div className="flex flex-col items-center gap-2">
                                <span className="text-gray-700 text-sm">
                                  {orders.length === 0 ? "Zatím žádné objednávky" : "Žádné výsledky podle filtrů"}
                                </span>
                                {orders.length > 0 && (
                                  <button
                                    onClick={resetFilters}
                                    className="text-xs text-blue-600 hover:underline"
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
                                  ? "bg-amber-50/80 ring-inset ring-1 ring-[#C9A84C]/30"
                                  : i % 2 === 0
                                    ? "bg-white hover:bg-gray-50/50"
                                    : "bg-gray-50/30 hover:bg-gray-50"
                              } ${o.status === "new" ? "border-l-2 border-l-blue-500/50" : ""}`}
                            >
                              {isMajitel && (
                                <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="checkbox"
                                    checked={selectedIds.has(o.id)}
                                    onChange={() => toggleSelect(o.id)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
                                    aria-label={`Vybrat ${o.name}`}
                                  />
                                </td>
                              )}
                              {visibleColumns.includes("id") && (
                                <td className="px-4 py-3 pl-5 font-mono text-xs text-blue-600">
                                  {o.id.slice(0, 8)}…
                                </td>
                              )}
                              {visibleColumns.includes("created_at") && (
                                <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">
                                  {formatDate(o.created_at)}
                                </td>
                              )}
                              {visibleColumns.includes("name") && (
                                <td className="px-4 py-3 text-sm text-gray-900 font-medium whitespace-nowrap">
                                  {o.name} {o.surname || ""}
                                </td>
                              )}
                              {visibleColumns.includes("email") && (
                                <td className="px-4 py-3 text-xs text-gray-700">
                                  <a href={`mailto:${o.email}`} className="transition-colors hover:text-[#b8860b]">
                                    {o.email}
                                  </a>
                                </td>
                              )}
                              {visibleColumns.includes("phone") && (
                                <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-700">
                                  {o.phone ? (
                                    <a href={`tel:${o.phone}`} className="transition-colors hover:text-[#b8860b]">
                                      {o.phone}
                                    </a>
                                  ) : (
                                    "–"
                                  )}
                                </td>
                              )}
                              {visibleColumns.includes("service") && (
                                <td
                                  className="px-4 py-3 text-xs text-gray-700 max-w-[220px] truncate"
                                  title={formatServiceDisplay(o.service)}
                                >
                                  {formatServiceDisplay(o.service)}
                                </td>
                              )}
                              {visibleColumns.includes("branch") && (
                                <td className="px-4 py-3 text-xs text-gray-700">{o.branch}</td>
                              )}
                              {visibleColumns.includes("status") && (
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
                                            className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-gray-50 ${
                                              o.status === s ? "text-blue-600 font-medium" : "text-gray-600"
                                            }`}
                                          >
                                            {o.status === s && <CheckIcon size={10} className="text-blue-600" />}
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
                              )}
                              <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center gap-0.5 relative">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenActionMenu(openActionMenu === o.id ? null : o.id);
                                    }}
                                    className="rounded p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#b8860b]"
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
                                        onClick={(e) => { e.stopPropagation(); setVoucherPreviewOrder(o); setOpenActionMenu(null); }}
                                        className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-gray-50 text-gray-700"
                                      >
                                        <Receipt size={14} />
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

                  <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
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
        </>
          )}
        </main>
      </div>
    </div>

      {passwordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" role="dialog" aria-modal="true" aria-labelledby="password-modal-title" onClick={() => { setPasswordModal(null); setNewPasswordForUser(""); setPasswordError(""); }}>
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 id="password-modal-title" className="font-semibold text-gray-900">Změnit heslo</h3>
            <p className="mt-1 text-sm text-gray-600">{passwordModal.email}</p>
            <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
              <input
                type="password"
                value={newPasswordForUser}
                onChange={(e) => { setNewPasswordForUser(e.target.value); setPasswordError(""); }}
                placeholder="Nové heslo (min. 6 znaků)"
                minLength={6}
                className={inputClass}
                autoFocus
              />
              {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
              <div className="flex gap-2">
                <button type="button" onClick={() => { setPasswordModal(null); setNewPasswordForUser(""); setPasswordError(""); }} className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Zrušit
                </button>
                <button type="submit" disabled={passwordLoading || newPasswordForUser.length < 6} className={btnClass + " flex-1"} style={btnPrimaryStyle}>
                  {passwordLoading ? "Ukládám…" : "Uložit heslo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" role="alertdialog" aria-modal="true" aria-labelledby="delete-modal-title">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <h3 id="delete-modal-title" className="font-semibold text-gray-900">Odstranit účet?</h3>
            <p className="mt-2 text-sm text-gray-600">Účet <strong>{deleteConfirm.email}</strong> bude trvale odstraněn a nebude se moci přihlásit.</p>
            <div className="mt-6 flex gap-2">
              <button type="button" onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Zrušit
              </button>
              <button type="button" onClick={handleDeleteAccount} disabled={deleteLoading} className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
                {deleteLoading ? "Odebírám…" : "Odstranit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {roleEditUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" role="dialog" aria-modal="true" aria-labelledby="role-modal-title" onClick={() => setRoleEditUserId(null)}>
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 id="role-modal-title" className="font-semibold text-gray-900">Změnit roli</h3>
            <p className="mt-1 text-sm text-gray-600">{adminAccounts.find((a) => a.user_id === roleEditUserId)?.email}</p>
            <form onSubmit={handleChangeRole} className="mt-4 space-y-3">
              <select value={newRoleForUser} onChange={(e) => setNewRoleForUser(e.target.value as "majitel" | "barber")} className={inputClass}>
                <option value="barber">Barber (jen náhled)</option>
                <option value="majitel">Majitel (plný přístup)</option>
              </select>
              <div className="flex gap-2">
                <button type="button" onClick={() => setRoleEditUserId(null)} className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Zrušit
                </button>
                <button type="submit" disabled={roleUpdateLoading} className={btnClass + " flex-1"} style={btnPrimaryStyle}>
                  {roleUpdateLoading ? "Ukládám…" : "Uložit roli"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {voucherPreviewOrder && (
        <VoucherPreviewModal
          open={true}
          data={orderToVoucherData(voucherPreviewOrder)}
          onClose={() => setVoucherPreviewOrder(null)}
        />
      )}

      {(openDropdown || openActionMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setOpenDropdown(null);
            setOpenActionMenu(null);
          }}
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
            <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-blue-600">{selectedOrder.id.slice(0, 8)}…</span>
                  <StatusBadge status={selectedOrder.status} />
                </div>
                <h3 id="detail-panel-title" className="mt-1 font-semibold text-gray-900">
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
                { label: "Služba", value: formatServiceDisplay(selectedOrder.service) },
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
                    className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={saveAdminNote}
                      disabled={savingNote || adminNote === (selectedOrder.admin_note || "")}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
              <button
                type="button"
                onClick={() => { setVoucherPreviewOrder(selectedOrder); }}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FileTextIcon size={18} />
                Vygenerovat voucher
              </button>
              <a
                href={`mailto:${selectedOrder.email}`}
                className="w-full rounded-xl py-2.5 text-center text-sm font-bold text-[#08080c] transition-all"
                style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96A)", boxShadow: "0 4px 14px rgba(201,168,76,0.25)" }}
              >
                Odeslat e-mail
              </a>
              {selectedOrder.phone ? (
                <a
                  href={`tel:${selectedOrder.phone}`}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 text-center text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Zavolat
                </a>
              ) : (
                <span className="w-full py-2.5 bg-gray-100 border border-gray-200 text-gray-500 rounded-lg text-sm text-center">
                  Bez telefonu
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
