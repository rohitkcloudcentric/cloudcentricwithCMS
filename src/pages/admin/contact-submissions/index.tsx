import React, { useEffect, useMemo, useState } from "react";
import { Search, ArrowUpDown, X, Inbox, Eye } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string | null;
  message: string;
  referralSource: string | null;
  pageName: string;
  submittedAt: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

const SELECT = "bg-[#0e0e12] border border-white/10 text-xs text-gray-300 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:border-[#a855f7]";
const REFERRAL_LABEL: Record<string, string> = {
  google: "Google Search",
  linkedin: "LinkedIn",
  referral: "Client Referral",
  other: "Other",
};
const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "-";
const fmtPhone = (p: string) => (p && !p.startsWith("+") ? `+${p}` : p);
const referral = (v: string | null) => (v ? REFERRAL_LABEL[v] || v : "-");

export default function ContactSubmissionsAdmin() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [pages, setPages] = useState<{ pageName: string; count: number }[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({ search: "", pageName: "", sort: "desc" as "asc" | "desc", page: 1, pageSize: 25 });
  const [selected, setSelected] = useState<Submission | null>(null);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== "" && v !== undefined) p.set(k, String(v));
    });
    return p.toString();
  }, [filters]);

  useEffect(() => {
    let alive = true;
    fetch(`/api/v1/contact-submissions?${queryString}`)
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        if (!data.success) {
          setError(data.error || "Failed to load contact form submissions");
          return;
        }
        setError("");
        setRows(data.data);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
        setPages(data.filters.pages);
      })
      .catch(() => alive && setError("Failed to load contact form submissions"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [queryString]);

  const update = (patch: Partial<typeof filters>) => {
    setLoading(true);
    setFilters((f) => ({ ...f, page: 1, ...patch }));
  };

  const openDetails = async (row: Submission) => {
    setSelected(row);
    try {
      const res = await fetch(`/api/v1/contact-submissions/${row.id}`);
      const data = await res.json();
      if (data.success) setSelected(data.data);
    } catch {
      /* keep the row data */
    }
  };

  const details: [string, string][] = selected
    ? [
        ["Name", selected.name],
        ["Email Address", selected.email],
        ["Phone Number", fmtPhone(selected.phone)],
        ["Location", selected.location || "-"],
        ["How Did You Hear About Us?", referral(selected.referralSource)],
        ["Page Name", selected.pageName],
        ["Submitted On", fmtDate(selected.submittedAt)],
        ["IP Address", selected.ipAddress || "-"],
      ]
    : [];

  return (
    <AdminLayout title="Contact Form Submissions">
      <div className="space-y-6 w-full mx-auto font-intel">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0e0e12] border border-white/10 rounded-2xl p-5">
            <p className="text-[11px] uppercase tracking-wider text-gray-500">Total Submissions</p>
            <p className="text-2xl font-bold text-white mt-1">{total}</p>
          </div>
        </div>

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
            <label htmlFor="cs-search" className="sr-only">Search submissions</label>
            <input
              id="cs-search"
              type="search"
              placeholder="Search by name, email, phone or location..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#0e0e12] border border-white/10 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a855f7]"
            />
          </form>
          <div>
            <label htmlFor="cs-page" className="sr-only">Filter by page</label>
            <select id="cs-page" value={filters.pageName} onChange={(e) => update({ pageName: e.target.value })} className={`${SELECT} max-w-[260px]`}>
              <option value="">All Pages</option>
              {pages.map((p) => (
                <option key={p.pageName} value={p.pageName}>
                  {p.pageName} ({p.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-xs text-red-400" role="alert">{error}</p>}

        <div className="bg-[#0e0e12] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-xs text-gray-500">Loading submissions...</div>
          ) : rows.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Inbox className="w-8 h-8 text-gray-600 mx-auto" aria-hidden="true" />
              <p className="text-xs text-gray-400">No contact form submissions found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#14141a] border-b border-white/10 text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4">Name</th>
                    <th scope="col" className="px-6 py-4">Email</th>
                    <th scope="col" className="px-6 py-4">Phone</th>
                    <th scope="col" className="px-6 py-4">Location</th>
                    <th scope="col" className="px-6 py-4">Heard About Us</th>
                    <th scope="col" className="px-6 py-4">Page Name</th>
                    <th scope="col" className="px-6 py-4" aria-sort={filters.sort === "asc" ? "ascending" : "descending"}>
                      <button
                        type="button"
                        onClick={() => update({ sort: filters.sort === "desc" ? "asc" : "desc" })}
                        className="inline-flex items-center gap-1.5 uppercase hover:text-white cursor-pointer"
                      >
                        Submitted On <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
                        <span className="sr-only">(sorted {filters.sort === "asc" ? "oldest first" : "newest first"})</span>
                      </button>
                    </th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {rows.map((r) => (
                    <tr key={r.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white text-xs font-semibold">{r.name}</td>
                      <td className="px-6 py-4 text-xs break-all">{r.email}</td>
                      <td className="px-6 py-4 text-xs whitespace-nowrap">{fmtPhone(r.phone)}</td>
                      <td className="px-6 py-4 text-xs">{r.location || "-"}</td>
                      <td className="px-6 py-4 text-xs whitespace-nowrap">{referral(r.referralSource)}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-xl bg-[#7c3aed]/15 border border-[#a855f7]/30 text-[#a855f7] text-xs font-medium whitespace-nowrap">
                          {r.pageName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">{fmtDate(r.submittedAt)}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => openDetails(r)}
                          title="View details"
                          aria-label={`View details for ${r.name}`}
                          className="p-2 text-gray-400 hover:text-white cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span>
                Showing {(filters.page - 1) * filters.pageSize + 1}-{Math.min(filters.page * filters.pageSize, total)} of {total}
              </span>
              <label htmlFor="cs-page-size" className="sr-only">Rows per page</label>
              <select
                id="cs-page-size"
                value={filters.pageSize}
                onChange={(e) => update({ pageSize: Number(e.target.value) })}
                className="bg-[#0e0e12] border border-white/10 rounded-lg px-2 py-1 text-xs"
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>{n} / page</option>
                ))}
              </select>
            </div>
            <nav aria-label="Submission pages" className="flex items-center gap-2">
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

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cs-details-title"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0e0e12] border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6 font-intel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 id="cs-details-title" className="text-lg font-bold text-white font-manrope">Submission Details</h3>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="p-1.5 text-gray-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {details.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[11px] uppercase tracking-wider text-gray-500">{label}</dt>
                  <dd className="text-sm text-white mt-1 break-words">{value}</dd>
                </div>
              ))}
            </dl>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-gray-500">Describe Your Idea</p>
              <p className="text-sm text-gray-200 mt-1 whitespace-pre-wrap break-words bg-[#14141a] border border-white/5 rounded-2xl p-4">
                {selected.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
