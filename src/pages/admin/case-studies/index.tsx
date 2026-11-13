import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit3, Trash2, Briefcase, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import CaseStudyAdminTabs from "@/components/admin/CaseStudyAdminTabs";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";

interface CaseStudyItem {
  id: string;
  title: string;
  slug: string;
  clientName: string;
  industry: string;
  thumbnailImage?: string | null;
  featuredImage?: string | null;
  status: string;
  displayOrder: number;
  publishedAt?: string | null;
  createdAt: string;
  category?: { name: string } | null;
}

export default function CaseStudiesAdmin() {
  const [items, setItems] = useState<CaseStudyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  // Actions follow the role permissions (the API enforces the same rules)
  const { can } = useAdminAuth();
  const canCreate = can("case_studies", "create");
  const canEdit = can("case_studies", "update");
  const canDelete = can("case_studies", "delete");

  useEffect(() => {
    let alive = true;
    const params = new URLSearchParams();
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (query) params.set("search", query);

    fetch(`/api/v1/case-studies?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!alive) return;
        if (data.success) setItems(data.data || []);
        else setError(data.error || "Failed to load case studies");
      })
      .catch(() => alive && setError("Failed to load case studies"))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [statusFilter, query]);

  const handleDelete = async (item: CaseStudyItem) => {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    setDeletingId(item.id);
    setError("");
    try {
      const res = await fetch(`/api/v1/case-studies/${item.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setItems((prev) => prev.filter((i) => i.id !== item.id));
      else setError(data.error || "Failed to delete case study");
    } catch {
      setError("Failed to delete case study");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout title="Case Study Manager">
      <div className="space-y-6 w-full mx-auto">
        <CaseStudyAdminTabs />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-intel">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              setQuery(search.trim());
            }}
            className="relative flex-1 max-w-md"
          >
            <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <label htmlFor="cs-search" className="sr-only">Search case studies</label>
            <input
              id="cs-search"
              type="text"
              placeholder="Search by title, client, or industry..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#0e0e12] border border-white/10 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a855f7]"
            />
          </form>

          <div className="flex items-center gap-3">
            <label htmlFor="cs-status-filter" className="sr-only">Filter by status</label>
            <select
              id="cs-status-filter"
              value={statusFilter}
              onChange={(e) => {
                setLoading(true);
                setStatusFilter(e.target.value);
              }}
              className="bg-[#0e0e12] border border-white/10 text-xs text-gray-300 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:border-[#a855f7]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Drafts</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            {canCreate && (
              <Link
                href="/admin/case-studies/editor"
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-linear-to-r from-[#7c3aed] to-[#4f8bff] hover:opacity-90 text-white text-xs font-bold shadow-[0_0_20px_rgba(124,58,237,0.3)]"
              >
                <Plus className="w-4 h-4" />
                <span>Create Case Study</span>
              </Link>
            )}
          </div>
        </div>

        {error && <p className="text-xs text-red-400 font-intel" role="alert">{error}</p>}

        <div className="bg-[#0e0e12] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-xs font-intel text-gray-500">Loading case studies...</div>
          ) : items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#14141a] border-b border-white/10 text-[11px] font-intel font-semibold text-[#a1a1aa] uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4">Case Study</th>
                    <th scope="col" className="px-6 py-4">Client / Industry</th>
                    <th scope="col" className="px-6 py-4">Category</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    <th scope="col" className="px-6 py-4">Order</th>
                    <th scope="col" className="px-6 py-4">Published</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.map((item) => {
                    const thumb = item.thumbnailImage || item.featuredImage;
                    return (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3.5 max-w-md">
                            {thumb ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={thumb} alt="" className="w-10 h-10 rounded-xl object-cover bg-gray-800 shrink-0 border border-white/10" />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                                <Briefcase className="w-5 h-5 text-[#a855f7]" aria-hidden="true" />
                              </div>
                            )}
                            <div className="truncate">
                              <p className="font-semibold text-white truncate font-manrope">{item.title}</p>
                              <p className="text-xs text-gray-500 font-intel truncate">/{item.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-intel">
                          <p className="text-gray-200">{item.clientName}</p>
                          <p className="text-gray-500">{item.industry}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-xl bg-[#7c3aed]/15 border border-[#a855f7]/30 text-[#a855f7] text-xs font-intel font-medium">
                            {item.category?.name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-intel font-medium border ${
                              item.status === "PUBLISHED"
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                : item.status === "DRAFT"
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                : "bg-gray-500/10 border-gray-500/30 text-gray-400"
                            }`}
                          >
                            {item.status === "PUBLISHED" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            <span>{item.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-intel text-gray-400">{item.displayOrder}</td>
                        <td className="px-6 py-4 text-xs font-intel text-gray-400">
                          {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          {item.status === "PUBLISHED" && (
                            <Link
                              href={`/case-studies/${item.slug}`}
                              target="_blank"
                              title="View live"
                              aria-label={`View ${item.title} live`}
                              className="p-2 inline-block"
                            >
                              <ExternalLink className="w-4 h-4 text-[#a855f7]" />
                            </Link>
                          )}
                          {canEdit && (
                          <Link
                            href={`/admin/case-studies/editor?id=${item.id}`}
                            title="Edit"
                            aria-label={`Edit ${item.title}`}
                            className="p-2 text-gray-400 hover:text-[#4f8bff] inline-block"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          )}
                          {canDelete && (
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            disabled={deletingId === item.id}
                            title="Delete"
                            aria-label={`Delete ${item.title}`}
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
          ) : (
            <div className="p-12 text-center space-y-3 font-intel">
              <p className="text-gray-400 text-xs">No case studies found.</p>
              {canCreate && (
                <Link
                  href="/admin/case-studies/editor"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-linear-to-r from-[#7c3aed] to-[#4f8bff] text-white text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create First Case Study</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
