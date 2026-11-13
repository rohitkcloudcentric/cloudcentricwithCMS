import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit3, Trash2, ExternalLink, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";

interface ProductItem {
  id: string;
  title: string;
  slug: string;
  badge?: string | null;
  description: string;
  logoUrl?: string | null;
  featuredImage?: string | null;
  websiteUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

interface Meta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const PAGE_SIZE = 6;

/** UI filter value -> API query params */
const FILTERS: Record<string, { label: string; params: Record<string, string> }> = {
  ALL: { label: "All Products", params: {} },
  ACTIVE: { label: "Active", params: { active: "true" } },
  INACTIVE: { label: "Inactive", params: { active: "false" } },
  PUBLISHED: { label: "Published", params: { status: "PUBLISHED" } },
  DRAFT: { label: "Drafts", params: { status: "DRAFT" } },
  ARCHIVED: { label: "Archived", params: { status: "ARCHIVED" } },
};

export default function ProductsAdmin() {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);
  // Actions follow the role permissions (the API enforces the same rules)
  const { can } = useAdminAuth();
  const canCreate = can("products", "create");
  const canEdit = can("products", "update");
  const canDelete = can("products", "delete");
  const canPublish = can("products", "publish");

  useEffect(() => {
    let alive = true;
    const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE), ...FILTERS[filter].params });
    if (query) params.set("search", query);

    fetch(`/api/v1/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!alive) return;
        if (data.success) {
          setItems(data.data || []);
          setMeta(data.meta);
          setError("");
          // The last item of a page was removed: step back
          if (data.meta && data.meta.page !== page) setPage(data.meta.page);
        } else {
          setError(data.error || "Failed to load products");
        }
      })
      .catch(() => alive && setError("Failed to load products"))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [page, query, filter, reloadKey]);

  const handleDelete = async (item: ProductItem) => {
    if (!confirm(`Delete "${item.title}"? Its uploaded images will be removed too. This cannot be undone.`)) return;
    setBusyId(item.id);
    setError("");
    try {
      const res = await fetch(`/api/v1/products/${item.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) reload();
      else setError(data.error || "Failed to delete product");
    } catch {
      setError("Failed to delete product");
    } finally {
      setBusyId(null);
    }
  };

  /** Quick toggle of status / active without opening the editor. */
  const patch = async (item: ProductItem, body: Partial<Pick<ProductItem, "status" | "isActive">>) => {
    setBusyId(item.id);
    setError("");
    try {
      const res = await fetch(`/api/v1/products/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, ...body } : p)));
      else setError(data.error || "Failed to update product");
    } catch {
      setError("Failed to update product");
    } finally {
      setBusyId(null);
    }
  };

  const addButton = (
    <Link
      href="/admin/products/editor"
      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all"
    >
      <Plus className="w-4 h-4" aria-hidden="true" />
      <span>Add Product</span>
    </Link>
  );

  return (
    <AdminLayout title="Product Portfolio Manager">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-gray-400">Manage CloudCentric SaaS platforms and Salesforce products.</p>
          {canCreate && addButton}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-intel">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              setPage(1);
              setQuery(search.trim());
            }}
            className="relative flex-1 max-w-md"
            role="search"
          >
            <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <label htmlFor="product-search" className="sr-only">Search products by name</label>
            <input
              id="product-search"
              type="text"
              placeholder="Search products by name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (!e.target.value && query) {
                  setLoading(true);
                  setPage(1);
                  setQuery("");
                }
              }}
              className="w-full pl-11 pr-4 py-2.5 bg-[#0e0e12] border border-white/10 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a855f7]"
            />
          </form>

          <div>
            <label htmlFor="product-filter" className="sr-only">Filter by status</label>
            <select
              id="product-filter"
              value={filter}
              onChange={(e) => {
                setLoading(true);
                setPage(1);
                setFilter(e.target.value);
              }}
              className="w-full sm:w-auto bg-[#0e0e12] border border-white/10 text-xs text-gray-300 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:border-[#a855f7]"
            >
              {Object.entries(FILTERS).map(([value, f]) => (
                <option key={value} value={value}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-xs text-red-400" role="alert">{error}</p>}

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">Loading products...</div>
        ) : items.length > 0 ? (
          <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {items.map((item) => {
              const thumb = item.logoUrl || item.featuredImage;
              const busy = busyId === item.id;
              return (
                <li key={item.id} className={`bg-[#0B0F17] border border-gray-800 rounded-2xl p-5 space-y-3 flex flex-col ${item.isActive ? "" : "opacity-70"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      {thumb ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={thumb} alt="" className="w-10 h-10 object-contain bg-gray-900 rounded-xl p-1 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold shrink-0" aria-hidden="true">
                          {item.title.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-bold text-white text-base leading-tight truncate">{item.title}</h4>
                        <p className="text-xs text-purple-400 font-medium truncate">{item.badge || "SaaS Product"}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 shrink-0">
                      {canEdit && (
                      <Link
                        href={`/admin/products/editor?id=${item.id}`}
                        title="Edit"
                        aria-label={`Edit ${item.title}`}
                        className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      )}
                      {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        disabled={busy}
                        title="Delete"
                        aria-label={`Delete ${item.title}`}
                        className="p-1.5 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed line-clamp-2 min-h-8">{item.description || "No short description yet."}</p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 mt-auto">
                    {item.websiteUrl ? (
                      <a
                        href={item.websiteUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center space-x-1.5 text-xs text-blue-400 hover:underline"
                      >
                        <span>Visit Website</span>
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    ) : (
                      <span className="text-xs text-gray-600">No website</span>
                    )}

                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-intel">
                      <span className="px-2 py-1 rounded-lg bg-white/5 text-gray-400" title="Display order">#{item.displayOrder}</span>
                      <button
                        type="button"
                        disabled={busy || !canEdit}
                        onClick={() => patch(item, { isActive: !item.isActive })}
                        aria-pressed={item.isActive}
                        title={item.isActive ? "Click to deactivate" : "Click to activate"}
                        className={`px-2 py-1 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                          item.isActive
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-gray-500/10 border-gray-500/30 text-gray-400"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </button>
                      <button
                        type="button"
                        disabled={busy || !canEdit || (item.status !== "PUBLISHED" && !canPublish)}
                        onClick={() => patch(item, { status: item.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" })}
                        title={item.status === "PUBLISHED" ? "Click to unpublish" : "Click to publish"}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                          item.status === "PUBLISHED"
                            ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                            : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        }`}
                      >
                        {item.status === "PUBLISHED" ? <Eye className="w-3 h-3" aria-hidden="true" /> : <EyeOff className="w-3 h-3" aria-hidden="true" />}
                        {item.status === "PUBLISHED" ? "Published" : item.status === "DRAFT" ? "Draft" : "Archived"}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-12 text-center space-y-3 text-sm text-gray-500">
            <p>No products found.</p>
            {canCreate && addButton}
          </div>
        )}

        {meta.totalPages > 1 && (
          <nav className="flex items-center justify-between gap-3 font-intel text-xs text-gray-400" aria-label="Product pages">
            <span>
              Page {meta.page} of {meta.totalPages} · {meta.total} products
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={meta.page <= 1 || loading}
                onClick={() => {
                  setLoading(true);
                  setPage(meta.page - 1);
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#0e0e12] border border-white/10 hover:border-[#a855f7] disabled:opacity-40 disabled:hover:border-white/10 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" /> Prev
              </button>
              <button
                type="button"
                disabled={meta.page >= meta.totalPages || loading}
                onClick={() => {
                  setLoading(true);
                  setPage(meta.page + 1);
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#0e0e12] border border-white/10 hover:border-[#a855f7] disabled:opacity-40 disabled:hover:border-white/10 cursor-pointer"
              >
                Next <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </nav>
        )}
      </div>
    </AdminLayout>
  );
}
