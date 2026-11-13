import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit3, Trash2, Star, ExternalLink, Building2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import ClientAdminTabs from "@/components/admin/ClientAdminTabs";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import CreatableCombobox from "@/components/admin/CreatableCombobox";

interface ClientItem {
  id: string;
  name: string;
  logoUrl: string;
  logoAlt: string | null;
  websiteUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string | null;
  category: { id: string; name: string } | null;
}

interface Option {
  id: string;
  name: string;
}

const SELECT = "bg-[#0e0e12] border border-white/10 text-xs text-gray-300 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:border-[#a855f7]";
const PAGE_SIZE = 10;

export default function ClientsAdmin() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  // Actions follow the role permissions (the API enforces the same rules)
  const { can } = useAdminAuth();
  const canCreate = can("clients", "create");
  const canEdit = can("clients", "update");
  const canDelete = can("clients", "delete");
  const [orderDrafts, setOrderDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch("/api/v1/clients").then((r) => r.json()),
      fetch("/api/v1/client-categories").then((r) => r.json()),
    ])
      .then(([c, cats]) => {
        if (!alive) return;
        if (c.success) setClients(c.data);
        else setError(c.error || "Failed to load clients");
        if (cats.success) setCategories(cats.data.map((x: Option) => ({ id: x.id, name: x.name })));
      })
      .catch(() => alive && setError("Failed to load clients"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  // Category filter choices: every category plus "Uncategorized" ("" = All Categories)
  const categoryFilterOptions = useMemo(() => [...categories, { id: "none", name: "Uncategorized" }], [categories]);

  // Client-side filtering (the full list is small enough)
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clients.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q)) return false;
      if (categoryFilter === "none" && c.categoryId) return false;
      if (categoryFilter && categoryFilter !== "none" && c.categoryId !== categoryFilter) return false;
      if (statusFilter === "active" && !c.isActive) return false;
      if (statusFilter === "inactive" && c.isActive) return false;
      if (statusFilter === "featured" && !c.isFeatured) return false;
      return true;
    });
  }, [clients, search, categoryFilter, statusFilter]);

  const patch = async (client: ClientItem, data: Partial<Pick<ClientItem, "isActive" | "isFeatured" | "displayOrder">>) => {
    setBusyId(client.id);
    setError("");
    try {
      const res = await fetch(`/api/v1/clients/${client.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const d = await res.json();
      if (!d.success) {
        setError(d.error || "Failed to update client");
        return;
      }
      setClients((prev) =>
        prev
          .map((c) => (c.id === client.id ? d.data : c))
          .sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name))
      );
    } catch {
      setError("Failed to update client");
    } finally {
      setBusyId(null);
    }
  };

  const saveOrder = (client: ClientItem) => {
    const raw = orderDrafts[client.id];
    if (raw === undefined) return;
    setOrderDrafts(({ [client.id]: _drop, ...rest }) => {
      void _drop;
      return rest;
    });
    const n = Number(raw);
    if (!/^\d+$/.test(raw) || n > 9999) {
      setError("Display order must be a whole number between 0 and 9999");
      return;
    }
    if (n !== client.displayOrder) patch(client, { displayOrder: n });
  };

  const handleDelete = async (client: ClientItem) => {
    if (!confirm(`Delete "${client.name}"? This cannot be undone.`)) return;
    setBusyId(client.id);
    setError("");
    try {
      const res = await fetch(`/api/v1/clients/${client.id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.success) setClients((prev) => prev.filter((c) => c.id !== client.id));
      else setError(d.error || "Failed to delete client");
    } catch {
      setError("Failed to delete client");
    } finally {
      setBusyId(null);
    }
  };

  const activeCount = clients.filter((c) => c.isActive).length;

  // Pagination (10 per page). Page is tied to the current filters so changing a filter returns to page 1.
  const filterKey = `${search}|${categoryFilter}|${statusFilter}`;
  const [pageState, setPageState] = useState({ key: filterKey, page: 1 });
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const page = pageState.key === filterKey ? Math.min(pageState.page, totalPages) : 1;
  const goTo = (p: number) => setPageState({ key: filterKey, page: Math.min(Math.max(1, p), totalPages) });
  const pageRows = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AdminLayout title="Our Clients">
      <div className="space-y-6 w-full mx-auto font-intel">
        <ClientAdminTabs />

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <label htmlFor="cl-search" className="sr-only">Search clients</label>
            <input
              id="cl-search"
              type="search"
              placeholder="Search clients by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#0e0e12] border border-white/10 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a855f7]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <CreatableCombobox
              variant="filter"
              label="Filter by category"
              options={categoryFilterOptions}
              value={categoryFilter}
              onChange={setCategoryFilter}
              placeholder="Search categories…"
              emptyLabel="All Categories"
              noMatchText="No matching categories"
              className="w-56"
            />
            <label htmlFor="cl-filter-status" className="sr-only">Filter by status</label>
            <select id="cl-filter-status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={SELECT}>
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="featured">Featured</option>
            </select>
            {canCreate && (
              <Link
                href="/admin/clients/editor"
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-linear-to-r from-[#7c3aed] to-[#4f8bff] hover:opacity-90 text-white text-xs font-bold"
              >
                <Plus className="w-4 h-4" /> Add Client
              </Link>
            )}
          </div>
        </div>

        <p className="text-[11px] text-gray-500">
          {clients.length} clients · {activeCount} active (shown on the website). Featured clients appear first, then by display order.
        </p>

        {error && <p className="text-xs text-red-400" role="alert">{error}</p>}

        <div className="bg-[#0e0e12] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-xs text-gray-500">Loading clients...</div>
          ) : visible.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Building2 className="w-8 h-8 text-gray-600 mx-auto" aria-hidden="true" />
              <p className="text-xs text-gray-400">{clients.length === 0 ? "No clients yet." : "No clients match these filters."}</p>
              {clients.length === 0 && canCreate && (
                <Link href="/admin/clients/editor" className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-linear-to-r from-[#7c3aed] to-[#4f8bff] text-white text-xs font-bold">
                  <Plus className="w-3.5 h-3.5" /> Add First Client
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#14141a] border-b border-white/10 text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4">Client</th>
                    <th scope="col" className="px-6 py-4">Category</th>
                    <th scope="col" className="px-6 py-4">Order</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    <th scope="col" className="px-6 py-4">Featured</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pageRows.map((c) => {
                    const busy = busyId === c.id;
                    return (
                      <tr key={c.id} className={`hover:bg-white/5 transition-colors ${c.isActive ? "" : "opacity-60"}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-24 h-12 bg-white rounded-md p-1.5 shrink-0 flex items-center justify-center">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={c.logoUrl} alt={c.logoAlt || c.name} className="max-w-full max-h-full object-contain" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-white truncate font-manrope">{c.name}</p>
                              {c.websiteUrl && (
                                <a href={c.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-[#a855f7] truncate max-w-[220px]">
                                  {c.websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                                  <ExternalLink className="w-3 h-3 shrink-0" aria-hidden="true" />
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-xl bg-[#7c3aed]/15 border border-[#a855f7]/30 text-[#a855f7] text-xs font-medium whitespace-nowrap">
                            {c.category?.name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <label htmlFor={`order-${c.id}`} className="sr-only">Display order for {c.name}</label>
                          <input
                            id={`order-${c.id}`}
                            type="number"
                            min={0}
                            max={9999}
                            value={orderDrafts[c.id] ?? String(c.displayOrder)}
                            onChange={(e) => setOrderDrafts((d) => ({ ...d, [c.id]: e.target.value }))}
                            onBlur={() => saveOrder(c)}
                            onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
                            disabled={busy || !canEdit}
                            className="w-20 bg-gray-900 border border-gray-800 rounded-lg px-2 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-[#a855f7]"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={c.isActive}
                            aria-label={`${c.name} is ${c.isActive ? "active" : "inactive"}`}
                            onClick={() => patch(c, { isActive: !c.isActive })}
                            disabled={busy || !canEdit}
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border cursor-pointer disabled:opacity-50 ${
                              c.isActive
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                : "bg-gray-500/10 border-gray-500/30 text-gray-400"
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${c.isActive ? "bg-emerald-400" : "bg-gray-500"}`} aria-hidden="true" />
                            {c.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={c.isFeatured}
                            aria-label={`Featured: ${c.name}`}
                            title={c.isFeatured ? "Remove from featured" : "Mark as featured"}
                            onClick={() => patch(c, { isFeatured: !c.isFeatured })}
                            disabled={busy || !canEdit}
                            className="p-1.5 rounded-lg hover:bg-white/5 cursor-pointer disabled:opacity-50"
                          >
                            <Star className={`w-4 h-4 ${c.isFeatured ? "fill-amber-400 text-amber-400" : "text-gray-500"}`} />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          {canEdit && (
                          <Link href={`/admin/clients/editor?id=${c.id}`} title="Edit" aria-label={`Edit ${c.name}`} className="p-2 text-gray-400 hover:text-[#4f8bff] inline-block">
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          )}
                          {canDelete && (
                          <button
                            type="button"
                            onClick={() => handleDelete(c)}
                            disabled={busy}
                            title="Delete"
                            aria-label={`Delete ${c.name}`}
                            className="p-2 text-gray-400 hover:text-red-400 inline-block disabled:opacity-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && visible.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
            <span>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, visible.length)} of {visible.length}
            </span>
            {totalPages > 1 && (
              <nav aria-label="Client pages" className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => goTo(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 disabled:opacity-30 cursor-pointer"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => goTo(n)}
                    aria-current={n === page ? "page" : undefined}
                    className={`w-8 h-8 rounded-lg border cursor-pointer ${
                      n === page ? "border-[#a855f7] bg-[#7c3aed]/20 text-white font-semibold" : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => goTo(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 disabled:opacity-30 cursor-pointer"
                >
                  Next
                </button>
              </nav>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
