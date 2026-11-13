import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import type { ModuleName } from "@/lib/permission-catalog";
import React, { useEffect, useState } from "react";
import { Plus, Search, Edit3, Trash2, Check, X } from "lucide-react";

const PAGE_SIZE = 10;

export interface TaxonomyItem {
  id: string;
  name: string;
  slug?: string;
  _count?: { articles: number };
}

interface TaxonomyManagerProps {
  /** Singular label, e.g. "Category" or "Tag" */
  label: string;
  /** API base path, e.g. "/api/v1/categories" */
  endpoint: string;
  maxLength: number;
  /** What the taxonomy is attached to, singular (default "article") */
  itemNoun?: string;
  /** Module whose add / edit / delete permissions control this list */
  module: ModuleName;
}

/**
 * Admin table for creating, renaming, and deleting a blog taxonomy (categories or tags).
 * Expects: GET/POST {endpoint}, PUT/DELETE {endpoint}/{id}.
 */
export default function TaxonomyManager({ label, endpoint, maxLength, itemNoun = "article", module }: TaxonomyManagerProps) {
  // Actions follow the role permissions (the API enforces the same rules)
  const { can } = useAdminAuth();
  const canCreate = can(module, "create");
  const canEdit = can(module, "update");
  const canDelete = can(module, "delete");
  const lower = label.toLowerCase();
  const plural = itemNoun.endsWith("y") ? `${itemNoun.slice(0, -1)}ies` : `${itemNoun}s`;
  const nounFor = (n: number) => (n === 1 ? itemNoun : plural);
  const NounTitle = plural.replace(/\b\w/g, (c) => c.toUpperCase());
  const [items, setItems] = useState<TaxonomyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pageState, setPageState] = useState({ query: "", page: 1 });

  useEffect(() => {
    let isMounted = true;
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.data)) setItems(data.data);
      })
      .catch(() => {
        if (isMounted) setError(`Failed to load ${lower} list`);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [endpoint, lower]);

  const sortByName = (list: TaxonomyItem[]) => [...list].sort((a, b) => a.name.localeCompare(b.name));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) {
      setError(`Enter a ${lower} name`);
      return;
    }
    setCreating(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => sortByName([...prev, { _count: { articles: 0 }, ...data.data }]));
        setNewName("");
        setNotice(`${label} "${data.data.name}" added.`);
      } else {
        setError(data.error || `Failed to add ${lower}`);
      }
    } catch {
      setError(`Failed to add ${lower}`);
    } finally {
      setCreating(false);
    }
  };

  const handleRename = async (id: string) => {
    const name = editName.trim();
    if (!name) {
      setError(`Enter a ${lower} name`);
      return;
    }
    setBusyId(id);
    setError("");
    setNotice("");
    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => sortByName(prev.map((i) => (i.id === id ? { ...i, ...data.data, _count: i._count } : i))));
        setEditingId(null);
        setNotice(`${label} renamed to "${data.data.name}".`);
      } else {
        setError(data.error || `Failed to rename ${lower}`);
      }
    } catch {
      setError(`Failed to rename ${lower}`);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (item: TaxonomyItem) => {
    setBusyId(item.id);
    setError("");
    setNotice("");
    try {
      const res = await fetch(`${endpoint}/${item.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.filter((i) => i.id !== item.id));
        setConfirmDeleteId(null);
        setNotice(`${label} "${item.name}" deleted.`);
      } else {
        setError(data.error || `Failed to delete ${lower}`);
      }
    } catch {
      setError(`Failed to delete ${lower}`);
    } finally {
      setBusyId(null);
    }
  };

  const query = search.trim().toLowerCase();
  const visible = query ? items.filter((i) => i.name.toLowerCase().includes(query)) : items;

  // Pagination: tied to the search text so a new search starts at page 1;
  // clamped so deleting the last row of a page falls back to the previous page.
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const page = pageState.query === query ? Math.min(pageState.page, totalPages) : 1;
  const goTo = (p: number) => setPageState({ query, page: Math.min(Math.max(1, p), totalPages) });
  const pageItems = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6 font-intel">
      {/* Add + search bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {canCreate ? (
        <form onSubmit={handleCreate} className="flex items-center gap-2 flex-1 max-w-xl">
          <label htmlFor={`new-${lower}`} className="sr-only">New {lower} name</label>
          <input
            id={`new-${lower}`}
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={`New ${lower} name`}
            maxLength={maxLength}
            className="flex-1 min-w-0 px-4 py-2.5 bg-[#0e0e12] border border-white/10 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a855f7]"
          />
          <button
            type="submit"
            disabled={creating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-linear-to-r from-[#7c3aed] to-[#4f8bff] hover:opacity-90 text-white text-xs font-bold disabled:opacity-60 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {creating ? "Adding..." : `Add ${label}`}
          </button>
        </form>
        ) : (
          <div className="flex-1" />
        )}

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <label htmlFor={`search-${lower}`} className="sr-only">Search {lower} list</label>
          <input
            id={`search-${lower}`}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${lower} list...`}
            className="w-full pl-11 pr-4 py-2.5 bg-[#0e0e12] border border-white/10 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a855f7]"
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-400" role="alert">{error}</p>}
      {notice && <p className="text-xs text-emerald-400" role="status">{notice}</p>}

      {/* Table */}
      <div className="bg-[#0e0e12] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500">Loading...</div>
        ) : visible.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400">
            {items.length === 0 ? `No ${lower} entries yet.${canCreate ? " Add your first one above." : ""}` : `No ${lower} matches "${search}".`}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#14141a] border-b border-white/10 text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-4">{label}</th>
                  <th scope="col" className="px-6 py-4">{NounTitle}</th>
                  {(canEdit || canDelete) && <th scope="col" className="px-6 py-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pageItems.map((item) => {
                  const count = item._count?.articles ?? 0;
                  const isBusy = busyId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleRename(item.id);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            aria-label={`Rename ${lower} ${item.name}`}
                            maxLength={maxLength}
                            autoFocus
                            className="w-full max-w-sm px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#a855f7]"
                          />
                        ) : (
                          <div>
                            <p className="font-semibold text-white text-sm">{item.name}</p>
                            {item.slug && <p className="text-xs text-gray-500">/{item.slug}</p>}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {count} {nounFor(count)}
                      </td>
                      {(canEdit || canDelete) && (
                      <td className="px-6 py-4 text-right">
                        {editingId === item.id ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleRename(item.id)}
                              disabled={isBusy}
                              aria-label="Save name"
                              className="p-2 text-emerald-400 hover:text-emerald-300 disabled:opacity-50 cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              aria-label="Cancel rename"
                              className="p-2 text-gray-400 hover:text-white cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : confirmDeleteId === item.id ? (
                          <div className="inline-flex items-center gap-2">
                            <span className="text-xs text-gray-300">
                              {count > 0 ? `Remove from ${count} ${nounFor(count)}?` : "Delete?"}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              disabled={isBusy}
                              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold disabled:opacity-60 cursor-pointer"
                            >
                              {isBusy ? "Deleting..." : "Delete"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:text-white text-xs cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1">
                            {canEdit && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(item.id);
                                setEditName(item.name);
                                setConfirmDeleteId(null);
                                setError("");
                              }}
                              aria-label={`Edit ${lower} ${item.name}`}
                              title={`Edit ${label}`}
                              className="p-2 text-gray-400 hover:text-[#4f8bff] cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            )}
                            {canDelete && (
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmDeleteId(item.id);
                                setEditingId(null);
                                setError("");
                              }}
                              aria-label={`Delete ${lower} ${item.name}`}
                              title={`Delete ${label}`}
                              className="p-2 text-gray-400 hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            )}
                          </div>
                        )}
                      </td>
                      )}
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
            <nav aria-label={`${label} pages`} className="flex items-center gap-1.5">
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

      <p className="text-[11px] text-gray-500">
        Deleting a {lower} never deletes {plural}.{" "}
        {label === "Category" ? `Its ${plural} become uncategorized.` : `It is only removed from those ${plural}.`}
      </p>
    </div>
  );
}
