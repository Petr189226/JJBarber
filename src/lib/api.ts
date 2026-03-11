/**
 * API klient pro PHP backend (auth, objednávky, správce).
 * Používá session cookie – všechny requesty s credentials: 'include'.
 */

const BASE = (import.meta.env.VITE_API_BASE_URL as string)?.trim() || "";

function apiUrl(path: string): string {
  return `${BASE}/api/${path}`;
}

async function fetchApi(path: string, options: RequestInit = {}): Promise<Response> {
  const url = apiUrl(path);
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  return res;
}

export type ApiUser = { id: string; email: string; role?: "majitel" | "barber" };

export const auth = {
  async login(email: string, password: string): Promise<{ user: ApiUser } | { error: string }> {
    const res = await fetchApi("auth.php", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { error: (data as { error?: string }).error || "Přihlášení se nezdařilo." };
    return data as { user: ApiUser };
  },

  async getSession(): Promise<ApiUser | null> {
    const res = await fetchApi("auth.php");
    if (res.status === 401) return null;
    const data = await res.json().catch(() => ({}));
    return (data as { user?: ApiUser }).user ?? null;
  },

  async logout(): Promise<void> {
    await fetchApi("auth.php?logout=1", { method: "POST" });
  },
};

export type VoucherOrder = {
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
  status: string;
  created_at: string;
};

export const orders = {
  async list(): Promise<{ data: VoucherOrder[] | null; error: string | null }> {
    const res = await fetchApi("orders.php");
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return { data: null, error: (data as { error?: string })?.error || "Načtení objednávek selhalo." };
    }
    return { data: (data as VoucherOrder[]) ?? [], error: null };
  },

  async create(payload: {
    name: string;
    surname?: string | null;
    email: string;
    phone?: string | null;
    service: string;
    branch: string;
    note?: string | null;
  }): Promise<{ id?: string; voucher_number?: string; error?: string }> {
    const res = await fetchApi("orders.php", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { error: (data as { error?: string }).error || "Odeslání selhalo." };
    return data as { id: string; voucher_number: string };
  },

  async update(id: string, updates: { admin_note?: string | null; status?: string }): Promise<{ error: string | null }> {
    const res = await fetchApi("orders.php", {
      method: "PATCH",
      body: JSON.stringify({ id, ...updates }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: (data as { error?: string }).error || "Uložení selhalo." };
    }
    return { error: null };
  },
};

export type AdminAccount = { user_id: string; role: string; email: string; last_sign_in_at?: string | null };

export const admins = {
  async list(): Promise<{ admins: AdminAccount[]; error?: string }> {
    const res = await fetchApi("admins.php", {
      method: "POST",
      body: JSON.stringify({ action: "list" }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { admins: [], error: (data as { error?: string }).error };
    return data as { admins: AdminAccount[] };
  },

  async create(email: string, password: string, role: "majitel" | "barber"): Promise<{ success?: boolean; userId?: string; error?: string }> {
    const res = await fetchApi("admins.php", {
      method: "POST",
      body: JSON.stringify({ action: "create", email, password, role }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { error: (data as { error?: string }).error };
    return data as { success: true; userId: string };
  },

  async updatePassword(userId: string, newPassword: string): Promise<{ success?: boolean; error?: string }> {
    const res = await fetchApi("admins.php", {
      method: "POST",
      body: JSON.stringify({ action: "update-password", user_id: userId, new_password: newPassword }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { error: (data as { error?: string }).error };
    return data as { success: true };
  },

  async updateRole(userId: string, newRole: string): Promise<{ success?: boolean; error?: string }> {
    const res = await fetchApi("admins.php", {
      method: "POST",
      body: JSON.stringify({ action: "update-role", user_id: userId, new_role: newRole }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { error: (data as { error?: string }).error };
    return data as { success: true };
  },

  async delete(userId: string): Promise<{ success?: boolean; error?: string }> {
    const res = await fetchApi("admins.php", {
      method: "POST",
      body: JSON.stringify({ action: "delete", user_id: userId }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { error: (data as { error?: string }).error };
    return data as { success: true };
  },
};

export function isApiConfigured(): boolean {
  return true;
}
