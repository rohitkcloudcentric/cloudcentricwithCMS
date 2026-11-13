import React, { useEffect, useMemo, useState } from "react";
import { Search, Download, ArrowUpDown, X, Mail, CheckCircle2, XCircle, Eye } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";

type Status = "ACTIVE" | "UNSUBSCRIBED";
type Source = "BLOG" | "CASE_STUDY" | "OTHER";

interface Subscriber {
  id: string;
  email: string;
  status: Status;
  sourceType: Source;
  sourceTitle: string | null;
  sourceSlug: string | null;
  ipAddress: string | null;
  subscribedAt: string;
  unsubscribedAt: string | null;
  emailSentAt: string | null;
  emailError: string | null;
  userAgent?: string | null;
}

interface SourceOption {
  sourceType: Source;
  sourceSlug: string;
  sourceTitle: string | null;
  count: number;
}

const SOURCE_LABEL: Record<Source, string> = { BLOG: "Blog", CASE_STUDY: "Case Studies", OTHER: "Website" };
const SELECT = "bg-[#0e0e12] border border-white/10 text-xs text-gray-300 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:border-[#a855f7]";

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—";

const postHref = (s: { sourceType: Source; sourceSlug: string | null }) =>
  s.sourceSlug ? (s.sourceType === "CASE_STUDY" ? `/case-studies/${s.sourceSlug}` : `/blogs/${s.sourceSlug}`) : null;

function StatusBadge({ status }: { status: Status }) {
  return status === "ACTIVE" ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
      <CheckCircle2 className="w-3 h-3" aria-hidden="true" /> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-gray-500/10 border-gray-500/30 text-gray-400">
      <XCircle className="w-3 h-3" aria-hidden="true" /> Unsubscribed
    </span>
  );
}

export default function NewsletterAdmin() {
  const [rows, setRows] = useState<Subscriber[]>([]);
  const [sources, setSources] = useState<SourceOption[]>([]);
  const [stats, setStats] = useState({ active: 0, unsubscribed: 0 });
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    sourceType: "",
    sourceSlug: "",
    sort: "desc" as "asc" | "desc",
    page: 1,
    pageSize: 25,
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [selected, setSelected] = useState<Subscriber | null>(null);
  // Status changes / resends need newsletter:edit (enforced by the API too)
  const canEdit = useAdminAuth().can("newsletter", "update");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [resendMsg, setResendMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== "" && v !== undefined) p.set(k, String(v));
    });
    return p.toString();
  }, [filters]);

  useEffect(() => {
    let alive = true;
    fetch(`/api/v1/newsletter/subscribers?${queryString}`)
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        if (!data.success) {
          setError(data.error || "Failed to load subscribers");
          return;
        }
        setError("");
        setRows(data.data);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
        setSources(data.filters.sources);
        setStats(data.stats);
      })
      .catch(() => alive && setError("Failed to load subscribers"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [queryString, refreshKey]);

  const update = (patch: Partial<typeof filters>) => {
    setLoading(true);
    setFilters((f) => ({ ...f, page: 1, ...patch }));
  };

  // Post filter options narrowed by the selected section
  const postOptions = sources.filter((s) => !filters.sourceType || s.sourceType === filters.sourceType);

  const setStatus = async (sub: Subscriber, status: Status) => {
    setBusyId(sub.id);
    setError("");
    try {
      const res = await fetch(`/api/v1/newsletter/subscribers/${sub.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to update status");
        return;
      }
      setRows((prev) => prev.map((r) => (r.id === sub.id ? { ...r, ...data.data } : r)));
      setSelected((s) => (s && s.id === sub.id ? { ...s, ...data.data } : s));
      setRefreshKey((k) => k + 1); // refresh counts
    } catch {
      setError("Failed to update status");
    } finally {
      setBusyId(null);
    }
  };

  const resend = async (sub: Subscriber) => {
    setResendingId(sub.id);
    setResendMsg(null);
    try {
      const res = await fetch(`/api/v1/newsletter/subscribers/${sub.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resend" }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.data) {
        setSelected((s) => (s && s.id === sub.id ? { ...s, ...data.data } : s));
        setRows((prev) => prev.map((r) => (r.id === sub.id ? { ...r, ...data.data } : r)));
      }
      setResendMsg(data.success ? { ok: true, text: "Confirmation email sent." } : { ok: false, text: data.error || "Failed to send email." });
    } catch {
      setResendMsg({ ok: false, text: "Network error while sending." });
    } finally {
      setResendingId(null);
    }
  };

  const openDetails = async (sub: Subscriber) => {
    setResendMsg(null);
    setSelected(sub);
    try {
      const res = await fetch(`/api/v1/newsletter/subscribers/${sub.id}`);
      const data = await res.json();
      if (data.success) setSelected(data.data);
    } catch {
      /* keep the row data */
    }
  };

  // Export uses the current filters (all pages)
  const exportHref = useMemo(() => {
    const p = new URLSearchParams(queryString);
    p.delete("page");
    p.delete("pageSize");
    return `/api/v1/newsletter/subscribers/export?${p.toString()}`;
  }, [queryString]);

  return (
    <AdminLayout title="Newsletter Subscribers">
      <div className="space-y-6 w-full mx-auto font-intel">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Subscribers", value: stats.active + stats.unsubscribed },
            { label: "Active", value: stats.active },
            { label: "Unsubscribed", value: stats.unsubscribed },
          ].map((s) => (
            <div key={s.label} className="bg-[#0e0e12] border border-white/10 rounded-2xl p-5">
              <p className="text-[11px] uppercase tracking-wider text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update({ search: searchInput.trim() });
            }}
            className="relative flex-1 max-w-md"
            role="search"
          >
            <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <label htmlFor="nl-search" className="sr-only">Search by email</label>
            <input
              id="nl-search"
              type="search"
              placeholder="Search by email address..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#0e0e12] border border-white/10 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a855f7]"
            />
          </form>

          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="nl-section" className="sr-only">Filter by section</label>
            <select
              id="nl-section"
              value={filters.sourceType}
              onChange={(e) => update({ sourceType: e.target.value, sourceSlug: "" })}
              className={SELECT}
            >
              <option value="">All Sections</option>
              <option value="BLOG">Blog Posts</option>
              <option value="CASE_STUDY">Case Studies</option>
              <option value="OTHER">Other</option>
            </select>

            <label htmlFor="nl-post" className="sr-only">Filter by post or case study</label>
            <select
              id="nl-post"
              value={filters.sourceSlug}
              onChange={(e) => update({ sourceSlug: e.target.value })}
              className={`${SELECT} max-w-[240px]`}
            >
              <option value="">All Posts / Case Studies</option>
              {postOptions.map((s) => (
                <option key={`${s.sourceType}-${s.sourceSlug}`} value={s.sourceSlug}>
                  {(s.sourceTitle || s.sourceSlug)} ({s.count})
                </option>
              ))}
            </select>

            <label htmlFor="nl-status" className="sr-only">Filter by status</label>
            <select id="nl-status" value={filters.status} onChange={(e) => update({ status: e.target.value })} className={SELECT}>
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="UNSUBSCRIBED">Unsubscribed</option>
            </select>

            <a
              href={exportHref}
              download
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-linear-to-r from-[#7c3aed] to-[#4f8bff] hover:opacity-90 text-white text-xs font-bold"
            >
              <Download className="w-4 h-4" aria-hidden="true" /> Export CSV / Excel
            </a>
          </div>
        </div>

        {error && <p className="text-xs text-red-400" role="alert">{error}</p>}

        {/* Table */}
        <div className="bg-[#0e0e12] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-xs text-gray-500">Loading subscribers...</div>
          ) : rows.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Mail className="w-8 h-8 text-gray-600 mx-auto" aria-hidden="true" />
              <p className="text-xs text-gray-400">No subscribers match these filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#14141a] border-b border-white/10 text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4">Email Address</th>
                    <th scope="col" className="px-6 py-4">Subscribed Post / Case Study</th>
                    <th scope="col" className="px-6 py-4">Blog Name</th>
                    <th scope="col" className="px-6 py-4">IP Address</th>
                    <th scope="col" className="px-6 py-4" aria-sort={filters.sort === "asc" ? "ascending" : "descending"}>
                      <button
                        type="button"
                        onClick={() => update({ sort: filters.sort === "desc" ? "asc" : "desc" })}
                        className="inline-flex items-center gap-1.5 uppercase hover:text-white cursor-pointer"
                      >
                        Subscription Date <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
                        <span className="sr-only">(sorted {filters.sort === "asc" ? "oldest first" : "newest first"})</span>
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {rows.map((r) => {
                    const href = postHref(r);
                    return (
                      <tr key={r.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-white text-xs font-semibold break-all">{r.email}</td>
                        <td className="px-6 py-4 text-xs max-w-xs">
                          {href ? (
                            <a href={href} target="_blank" rel="noreferrer" className="text-gray-200 hover:text-[#a855f7] line-clamp-2">
                              {r.sourceTitle || r.sourceSlug}
                            </a>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-xl bg-[#7c3aed]/15 border border-[#a855f7]/30 text-[#a855f7] text-xs font-medium whitespace-nowrap">
                            {SOURCE_LABEL[r.sourceType]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400 font-mono">{r.ipAddress || "—"}</td>
                        <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">{fmtDate(r.subscribedAt)}</td>
                        <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => openDetails(r)}
                            title="View details"
                            aria-label={`View details for ${r.email}`}
                            className="p-2 text-gray-400 hover:text-white cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {canEdit && (
                          <button
                            type="button"
                            onClick={() => setStatus(r, r.status === "ACTIVE" ? "UNSUBSCRIBED" : "ACTIVE")}
                            disabled={busyId === r.id}
                            className={`ml-1 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50 ${
                              r.status === "ACTIVE"
                                ? "bg-gray-800 text-gray-300 hover:text-white"
                                : "bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30"
                            }`}
                          >
                            {busyId === r.id ? "Saving..." : r.status === "ACTIVE" ? "Unsubscribe" : "Reactivate"}
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
        {total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span>
                Showing {(filters.page - 1) * filters.pageSize + 1}–{Math.min(filters.page * filters.pageSize, total)} of {total}
              </span>
              <label htmlFor="nl-page-size" className="sr-only">Rows per page</label>
              <select
                id="nl-page-size"
                value={filters.pageSize}
                onChange={(e) => update({ pageSize: Number(e.target.value) })}
                className="bg-[#0e0e12] border border-white/10 rounded-lg px-2 py-1 text-xs"
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>{n} / page</option>
                ))}
              </select>
            </div>
            <nav aria-label="Subscriber pages" className="flex items-center gap-2">
              <button
                type="button"
                disabled={filters.page <= 1}
                onClick={() => {
                  setLoading(true);
                  setFilters((f) => ({ ...f, page: f.page - 1 }));
                }}
                className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 disabled:opacity-30 cursor-pointer"
              >
                Previous
              </button>
              <span>Page {filters.page} of {totalPages}</span>
              <button
                type="button"
                disabled={filters.page >= totalPages}
                onClick={() => {
                  setLoading(true);
                  setFilters((f) => ({ ...f, page: f.page + 1 }));
                }}
                className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 disabled:opacity-30 cursor-pointer"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Details modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelected(null)}
          onKeyDown={(e) => e.key === "Escape" && setSelected(null)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="nl-detail-title"
            className="w-full max-w-lg bg-[#0e0e12] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 font-intel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 id="nl-detail-title" className="text-lg font-bold text-white font-manrope">Subscriber Details</h2>
                <p className="text-xs text-gray-400 break-all mt-1">{selected.email}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} aria-label="Close" autoFocus className="p-1.5 text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <dl className="grid grid-cols-3 gap-x-4 gap-y-3 text-xs">
              {[
                ["Subscriber ID", <span key="id" className="font-mono break-all">{selected.id}</span>],
                ["Status", <StatusBadge key="st" status={selected.status} />],
                ["Blog Name", SOURCE_LABEL[selected.sourceType]],
                [
                  "Post / Case Study",
                  postHref(selected) ? (
                    <a key="p" href={postHref(selected)!} target="_blank" rel="noreferrer" className="text-[#a855f7] hover:underline">
                      {selected.sourceTitle || selected.sourceSlug}
                    </a>
                  ) : (
                    "—"
                  ),
                ],
                ["IP Address", <span key="ip" className="font-mono">{selected.ipAddress || "—"}</span>],
                ["Subscribed", fmtDate(selected.subscribedAt)],
                ["Unsubscribed", fmtDate(selected.unsubscribedAt)],
                [
                  "Confirmation Email",
                  selected.emailSentAt ? (
                    <span key="e" className="text-emerald-400">Sent {fmtDate(selected.emailSentAt)}</span>
                  ) : selected.emailError ? (
                    <span key="e" className="text-red-400 break-words">Failed: {selected.emailError}</span>
                  ) : (
                    "Pending"
                  ),
                ],
                ["Browser", <span key="ua" className="break-words text-gray-400">{selected.userAgent || "—"}</span>],
              ].map(([label, value]) => (
                <React.Fragment key={String(label)}>
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="col-span-2 text-gray-200">{value}</dd>
                </React.Fragment>
              ))}
            </dl>

            {resendMsg && (
              <p
                role={resendMsg.ok ? "status" : "alert"}
                className={`text-xs break-words ${resendMsg.ok ? "text-emerald-400" : "text-red-400"}`}
              >
                {resendMsg.text}
              </p>
            )}

            {canEdit && (
            <div className="flex flex-wrap justify-end gap-3 pt-2 border-t border-white/10">
              {selected.status === "ACTIVE" && (
                <button
                  type="button"
                  onClick={() => resend(selected)}
                  disabled={resendingId === selected.id}
                  className="mt-4 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold disabled:opacity-60 cursor-pointer"
                >
                  {resendingId === selected.id ? "Sending..." : "Resend Confirmation Email"}
                </button>
              )}
              <button
                type="button"
                onClick={() => setStatus(selected, selected.status === "ACTIVE" ? "UNSUBSCRIBED" : "ACTIVE")}
                disabled={busyId === selected.id}
                className="mt-4 px-4 py-2 rounded-xl bg-linear-to-r from-[#7c3aed] to-[#4f8bff] text-white text-xs font-bold disabled:opacity-60 cursor-pointer"
              >
                {busyId === selected.id ? "Saving..." : selected.status === "ACTIVE" ? "Mark as Unsubscribed" : "Reactivate Subscription"}
              </button>
            </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
