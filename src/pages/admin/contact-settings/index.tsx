import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Plus, Search, Edit3, Trash2, Eye, X, CheckCircle2, AlertCircle, MapPin, Phone, Mail, Share2, ExternalLink } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import { PlatformIcon } from "@/components/common/SocialIcons";
import { ImageField } from "@/components/admin/EditorFields";
import {
  EMAIL_TYPE_SUGGESTIONS,
  KNOWN_PLATFORMS,
  parseContactBody,
  phoneLabel,
  slugifyPlatform,
  type ContactType,
  type FieldErrors,
} from "@/lib/contact-settings";

type Row = Record<string, unknown> & { id: string; displayOrder: number; isActive: boolean };
type Form = Record<string, string | boolean>;

const TABS: { type: ContactType; label: string; singular: string; icon: typeof MapPin }[] = [
  { type: "offices", label: "Office Addresses", singular: "Office Address", icon: MapPin },
  { type: "phones", label: "Contact Numbers", singular: "Contact Number", icon: Phone },
  { type: "emails", label: "Email Addresses", singular: "Email Address", icon: Mail },
  { type: "social", label: "Social Media Links", singular: "Social Media Link", icon: Share2 },
];

const EMPTY: Record<ContactType, Form> = {
  offices: { location: "", address: "", displayOrder: "", isActive: true },
  phones: { countryCode: "+91", number: "", displayOrder: "", isActive: true },
  emails: { email: "", type: "Sales", displayOrder: "", isActive: true },
  social: { platform: "facebook", name: "Facebook", url: "", iconUrl: "", displayOrder: "", isActive: true },
};

const FIELD = "w-full bg-gray-900 border rounded-xl px-3 py-2.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#a855f7]";
const LABEL = "text-xs font-semibold text-gray-300";
const str = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));

/** Main text shown for a row (also used for search and confirmations). */
function rowTitle(type: ContactType, r: Row): string {
  if (type === "offices") return str(r.location);
  if (type === "phones") return phoneLabel({ countryCode: str(r.countryCode), number: str(r.number) });
  if (type === "emails") return str(r.email);
  return str(r.name);
}
function rowDetail(type: ContactType, r: Row): string {
  if (type === "offices") return str(r.address);
  if (type === "emails") return str(r.type);
  if (type === "social") return str(r.url);
  return "";
}

export default function ContactSettingsAdmin() {
  const router = useRouter();
  const { can } = useAdminAuth();
  const canCreate = can("contact_settings", "create");
  const canEdit = can("contact_settings", "update");
  const canDelete = can("contact_settings", "delete");

  const tab: ContactType = TABS.some((t) => t.type === router.query.tab) ? (router.query.tab as ContactType) : "offices";
  const meta = TABS.find((t) => t.type === tab)!;

  const [rows, setRows] = useState<Row[]>([]);
  const [loadedTab, setLoadedTab] = useState<ContactType | null>(null);
  const loading = loadedTab !== tab;
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Modal state
  const [mode, setMode] = useState<"add" | "edit" | "view" | null>(null);
  const [current, setCurrent] = useState<Row | null>(null);
  const [form, setForm] = useState<Form>(EMPTY.offices);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  const notify = useCallback((type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4500);
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    let alive = true;
    fetch(`/api/v1/contact-settings/${tab}`)
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        if (d.success) {
          setRows(d.data || []);
          setError("");
        } else setError(d.error || "Failed to load");
      })
      .catch(() => alive && setError("Failed to load"))
      .finally(() => alive && setLoadedTab(tab));
    return () => {
      alive = false;
    };
  }, [router.isReady, tab, reloadKey]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => `${rowTitle(tab, r)} ${rowDetail(tab, r)}`.toLowerCase().includes(q));
  }, [rows, search, tab]);

  const switchTab = (t: ContactType) => {
    setSearch("");
    router.replace({ pathname: router.pathname, query: { tab: t } }, undefined, { shallow: true });
  };

  const openModal = (m: "add" | "edit" | "view", row?: Row) => {
    setMode(m);
    setCurrent(row ?? null);
    setFieldErrors({});
    if (!row) return setForm({ ...EMPTY[tab] });
    const f: Form = {};
    Object.keys(EMPTY[tab]).forEach((k) => (f[k] = typeof row[k] === "boolean" ? (row[k] as boolean) : str(row[k])));
    setForm(f);
  };

  const setF = (k: string, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
    setFieldErrors((e) => ({ ...e, [k]: "" }));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, platform: tab === "social" && form.platform === "other" ? slugifyPlatform(str(form.name)) : form.platform };
    // Same validation as the API, for instant feedback
    const { errors } = parseContactBody(tab, body, false);
    if (Object.keys(errors).length) return setFieldErrors(errors);

    setSaving(true);
    try {
      const res = await fetch(mode === "edit" && current ? `/api/v1/contact-settings/${tab}/${current.id}` : `/api/v1/contact-settings/${tab}`, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await res.json().catch(() => ({}));
      if (d.success) {
        notify("success", d.message || "Saved.");
        setMode(null);
        setReloadKey((k) => k + 1);
      } else {
        if (d.fields) setFieldErrors(d.fields);
        notify("error", d.error || "Failed to save");
      }
    } catch {
      notify("error", "Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (row: Row) => {
    setBusyId(row.id);
    try {
      const res = await fetch(`/api/v1/contact-settings/${tab}/${row.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !row.isActive }),
      });
      const d = await res.json().catch(() => ({}));
      if (d.success) {
        setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, isActive: !row.isActive } : r)));
        notify("success", `${rowTitle(tab, row)} is now ${row.isActive ? "inactive (hidden on the website)" : "active"}.`);
      } else notify("error", d.error || "Failed to change status");
    } catch {
      notify("error", "Network error.");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (row: Row) => {
    if (!confirm(`Delete "${rowTitle(tab, row)}"? It will disappear from the website.`)) return;
    setBusyId(row.id);
    try {
      const res = await fetch(`/api/v1/contact-settings/${tab}/${row.id}`, { method: "DELETE" });
      const d = await res.json().catch(() => ({}));
      if (d.success) {
        setRows((prev) => prev.filter((r) => r.id !== row.id));
        notify("success", d.message || "Deleted.");
      } else notify("error", d.error || "Failed to delete");
    } catch {
      notify("error", "Network error.");
    } finally {
      setBusyId(null);
    }
  };

  const err = (k: string) => (fieldErrors[k] ? <p className="text-[11px] text-red-400 pt-0.5" role="alert">{fieldErrors[k]}</p> : null);
  const fieldClass = (k: string) => `${FIELD} ${fieldErrors[k] ? "border-red-500/60" : "border-gray-800"}`;
  const readOnly = mode === "view";
  const isOtherPlatform = tab === "social" && !KNOWN_PLATFORMS.some((p) => p.key === form.platform);

  return (
    <AdminLayout title="Contact Settings">
      <div className="space-y-6 w-full mx-auto font-intel">
        <p className="text-xs text-gray-400">
          Manage the office addresses, phone numbers, emails and social links shown in the website footer, Contact Us page and contact sections.
          Only active entries are shown, in display order.
        </p>

        {/* Inner tabs */}
        <div role="tablist" aria-label="Contact settings sections" className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {TABS.map((t) => {
            const active = t.type === tab;
            const Icon = t.icon;
            return (
              <button
                key={t.type}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => switchTab(t.type)}
                className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
                  active
                    ? "bg-linear-to-r from-[#7c3aed]/20 to-[#4f8bff]/10 text-white border-[#a855f7]/40 shadow-[0_0_20px_rgba(124,58,237,0.15)]"
                    : "bg-[#0e0e12] text-[#a1a1aa] border-white/10 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-[#a855f7]" : "text-gray-500"}`} aria-hidden="true" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <label htmlFor="cs-search" className="sr-only">Search {meta.label.toLowerCase()}</label>
            <input
              id="cs-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${meta.label.toLowerCase()}...`}
              className="w-full pl-11 pr-4 py-2.5 bg-[#0e0e12] border border-white/10 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a855f7]"
            />
          </div>
          {canCreate && (
            <button
              type="button"
              onClick={() => openModal("add")}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-linear-to-r from-[#7c3aed] to-[#4f8bff] hover:opacity-90 text-white text-xs font-bold shadow-[0_0_20px_rgba(124,58,237,0.3)] cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden="true" /> Add {meta.singular}
            </button>
          )}
        </div>

        {error && <p className="text-xs text-red-400" role="alert">{error}</p>}

        <div className="bg-[#0e0e12] border border-white/10 rounded-3xl overflow-hidden shadow-xl" role="tabpanel" aria-label={meta.label}>
          {loading ? (
            <div className="p-12 text-center text-xs text-gray-500">Loading {meta.label.toLowerCase()}...</div>
          ) : visible.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-400">
              {rows.length === 0 ? `No ${meta.label.toLowerCase()} yet.` : `Nothing matches "${search}".`}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#14141a] border-b border-white/10 text-[11px] font-semibold text-[#a1a1aa] uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      {tab === "offices" ? "Location / Address" : tab === "phones" ? "Number" : tab === "emails" ? "Email / Type" : "Platform / URL"}
                    </th>
                    <th scope="col" className="px-6 py-4">Order</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {visible.map((r) => {
                    const busy = busyId === r.id;
                    return (
                      <tr key={r.id} className={`hover:bg-white/5 transition-colors ${r.isActive ? "" : "opacity-60"}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3 min-w-0">
                            {tab === "social" && (
                              <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-white/80">
                                <PlatformIcon platform={str(r.platform)} iconUrl={str(r.iconUrl) || null} className="w-4 h-4" />
                              </span>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-white font-manrope">{rowTitle(tab, r)}</p>
                              {rowDetail(tab, r) && (
                                <p className="text-xs text-gray-500 break-words max-w-xl whitespace-pre-line">{rowDetail(tab, r)}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400">{r.displayOrder}</td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={r.isActive}
                            aria-label={`${rowTitle(tab, r)} is ${r.isActive ? "active" : "inactive"}`}
                            onClick={() => toggleActive(r)}
                            disabled={busy || !canEdit}
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${
                              r.isActive ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-gray-500/10 border-gray-500/30 text-gray-400"
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${r.isActive ? "bg-emerald-400" : "bg-gray-500"}`} aria-hidden="true" />
                            {r.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button type="button" onClick={() => openModal("view", r)} title="View" aria-label={`View ${rowTitle(tab, r)}`} className="p-2 text-gray-400 hover:text-white cursor-pointer">
                            <Eye className="w-4 h-4" />
                          </button>
                          {canEdit && (
                            <button type="button" onClick={() => openModal("edit", r)} title="Edit" aria-label={`Edit ${rowTitle(tab, r)}`} className="p-2 text-gray-400 hover:text-[#4f8bff] cursor-pointer">
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button type="button" onClick={() => remove(r)} disabled={busy} title="Delete" aria-label={`Delete ${rowTitle(tab, r)}`} className="p-2 text-gray-400 hover:text-red-400 disabled:opacity-50 cursor-pointer">
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
      </div>

      {/* Add / Edit / View modal */}
      {mode && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="cs-modal-title">
          <div className="bg-[#0B0F17] border border-gray-800 rounded-2xl p-6 w-full max-w-lg space-y-5 max-h-[90vh] overflow-y-auto font-intel">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 id="cs-modal-title" className="text-base font-bold text-white">
                {mode === "add" ? `Add ${meta.singular}` : mode === "edit" ? `Edit ${meta.singular}` : meta.singular}
              </h3>
              <button type="button" onClick={() => setMode(null)} aria-label="Close" className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={save} noValidate className="space-y-4">
              <fieldset disabled={readOnly} className="space-y-4">
                {tab === "offices" && (
                  <>
                    <div className="space-y-1.5">
                      <label htmlFor="f-location" className={LABEL}>Office Location / Country <span className="text-red-400">*</span></label>
                      <input id="f-location" value={str(form.location)} onChange={(e) => setF("location", e.target.value)} maxLength={60} placeholder="e.g. India" className={fieldClass("location")} />
                      {err("location")}
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="f-address" className={LABEL}>Complete Office Address <span className="text-red-400">*</span></label>
                      <textarea id="f-address" value={str(form.address)} onChange={(e) => setF("address", e.target.value)} maxLength={400} rows={3} placeholder="Street, city, state, postal code, country" className={`${fieldClass("address")} resize-y`} />
                      {err("address")}
                    </div>
                  </>
                )}

                {tab === "phones" && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="f-cc" className={LABEL}>Country Code <span className="text-red-400">*</span></label>
                      <input id="f-cc" value={str(form.countryCode)} onChange={(e) => setF("countryCode", e.target.value)} maxLength={5} placeholder="+91" className={fieldClass("countryCode")} />
                      {err("countryCode")}
                    </div>
                    <div className="space-y-1.5 col-span-2">
                      <label htmlFor="f-number" className={LABEL}>Contact Number <span className="text-red-400">*</span></label>
                      <input id="f-number" type="tel" value={str(form.number)} onChange={(e) => setF("number", e.target.value)} maxLength={20} placeholder="9971126721" className={fieldClass("number")} />
                      {err("number")}
                    </div>
                  </div>
                )}

                {tab === "emails" && (
                  <>
                    <div className="space-y-1.5">
                      <label htmlFor="f-email" className={LABEL}>Email Address <span className="text-red-400">*</span></label>
                      <input id="f-email" type="email" value={str(form.email)} onChange={(e) => setF("email", e.target.value)} maxLength={200} placeholder="sales@example.com" className={fieldClass("email")} />
                      {err("email")}
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="f-type" className={LABEL}>Email Type <span className="text-red-400">*</span></label>
                      <input id="f-type" list="email-types" value={str(form.type)} onChange={(e) => setF("type", e.target.value)} maxLength={40} placeholder="Sales, Support, General Enquiry..." className={fieldClass("type")} />
                      <datalist id="email-types">
                        {EMAIL_TYPE_SUGGESTIONS.map((t) => <option key={t} value={t} />)}
                      </datalist>
                      {err("type")}
                    </div>
                  </>
                )}

                {tab === "social" && (
                  <>
                    <div className="space-y-1.5">
                      <label htmlFor="f-platform" className={LABEL}>Social Media Platform <span className="text-red-400">*</span></label>
                      <select
                        id="f-platform"
                        value={isOtherPlatform ? "other" : str(form.platform)}
                        onChange={(e) => {
                          const known = KNOWN_PLATFORMS.find((p) => p.key === e.target.value);
                          setForm((f) => ({ ...f, platform: e.target.value, name: known ? known.name : "" }));
                          setFieldErrors({});
                        }}
                        className={fieldClass("platform")}
                      >
                        {KNOWN_PLATFORMS.map((p) => <option key={p.key} value={p.key}>{p.name}</option>)}
                        <option value="other">Other platform...</option>
                      </select>
                      {err("platform")}
                    </div>
                    {isOtherPlatform && (
                      <div className="space-y-1.5">
                        <label htmlFor="f-name" className={LABEL}>Platform Name <span className="text-red-400">*</span></label>
                        <input id="f-name" value={str(form.name)} onChange={(e) => setF("name", e.target.value)} maxLength={40} placeholder="e.g. GitHub" className={fieldClass("name")} />
                        <p className="text-[10px] text-gray-500">Platforms without a dedicated icon are shown with a globe icon.</p>
                        {err("name")}
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <label htmlFor="f-url" className={LABEL}>Social Media URL <span className="text-red-400">*</span></label>
                      <input id="f-url" type="url" value={str(form.url)} onChange={(e) => setF("url", e.target.value)} maxLength={500} placeholder="https://www.linkedin.com/company/..." className={fieldClass("url")} />
                      {err("url")}
                      {readOnly && str(form.url) && (
                        <a href={str(form.url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-[#a855f7] hover:underline">
                          Open link <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      {readOnly ? (
                        <>
                          <p className={LABEL}>Icon</p>
                          <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
                              <PlatformIcon platform={str(form.platform)} iconUrl={str(form.iconUrl) || null} className="w-5 h-5" />
                            </span>
                            <span className="text-[11px] text-gray-500">{str(form.iconUrl) ? "Custom uploaded icon" : "Built-in platform icon"}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <ImageField
                            label="Custom Icon (optional)"
                            value={str(form.iconUrl)}
                            onChange={(v) => setF("iconUrl", v)}
                            hint="Square PNG/WEBP, e.g. 64×64"
                            previewClassName="h-20 bg-gray-900 object-contain! p-3"
                            uploadOptions={{ optimize: true, maxWidth: 256 }}
                          />
                          <p className="text-[10px] text-gray-500">
                            Leave empty to use the built-in icon for this platform{isOtherPlatform ? " (a globe for other platforms)" : ""}. SVG files are not accepted for security reasons.
                          </p>
                        </>
                      )}
                      {err("iconUrl")}
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="f-order" className={LABEL}>Display Order</label>
                    <input id="f-order" type="number" min={0} max={9999} value={str(form.displayOrder)} onChange={(e) => setF("displayOrder", e.target.value)} placeholder="Auto (last)" className={fieldClass("displayOrder")} />
                    {err("displayOrder")}
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="f-status" className={LABEL}>Status</label>
                    <select id="f-status" value={form.isActive ? "active" : "inactive"} onChange={(e) => setF("isActive", e.target.value === "active")} className={fieldClass("isActive")}>
                      <option value="active">Active (shown on website)</option>
                      <option value="inactive">Inactive (hidden)</option>
                    </select>
                  </div>
                </div>
              </fieldset>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                <button type="button" onClick={() => setMode(null)} className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white text-xs cursor-pointer">
                  {readOnly ? "Close" : "Cancel"}
                </button>
                {readOnly && canEdit && current && (
                  <button type="button" onClick={() => openModal("edit", current)} className="px-5 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold cursor-pointer">
                    Edit
                  </button>
                )}
                {!readOnly && (
                  <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-linear-to-r from-[#7c3aed] to-[#4f8bff] text-white text-xs font-bold disabled:opacity-60 cursor-pointer">
                    {saving ? "Saving..." : mode === "add" ? `Add ${meta.singular}` : "Save Changes"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div
          role={toast.type === "error" ? "alert" : "status"}
          className={`fixed top-6 right-4 sm:right-6 z-[60] max-w-[calc(100vw-2rem)] flex items-center gap-3 px-5 py-4 rounded-2xl bg-[#0e0e12]/95 border backdrop-blur-xl text-white font-intel ${
            toast.type === "success" ? "border-emerald-500/40" : "border-red-500/40"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
          <p className="text-xs">{toast.text}</p>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss" className="p-1 text-gray-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </AdminLayout>
  );
}
