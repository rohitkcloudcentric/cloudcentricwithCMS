import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft, Save } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { FieldLabel, ImageField, TextAreaField, TextField } from "@/components/admin/EditorFields";
import CreatableCombobox from "@/components/admin/CreatableCombobox";

interface Option {
  id: string;
  name: string;
}

interface FormState {
  name: string;
  logoUrl: string;
  logoAlt: string;
  categoryId: string;
  websiteUrl: string;
  description: string;
  displayOrder: string; // kept as string so the field can be empty while typing
  isActive: boolean;
  isFeatured: boolean;
}

const EMPTY: FormState = {
  name: "", logoUrl: "", logoAlt: "", categoryId: "", websiteUrl: "", description: "",
  displayOrder: "", isActive: true, isFeatured: false,
};

const CARD = "bg-[#0B0F17] border border-gray-800/80 rounded-2xl p-5 space-y-4 font-intel";
const CARD_TITLE = "text-sm font-bold text-white font-manrope";
const INPUT = "w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-[#a855f7]";

/** Mirrors server-side validation so admins get instant feedback. */
function validate(f: FormState): string | null {
  if (!f.name.trim()) return "Client name is required.";
  if (f.name.trim().length > 120) return "Client name must be 120 characters or less.";
  if (!f.logoUrl.trim()) return "Please upload a client logo.";
  if (f.websiteUrl.trim()) {
    try {
      const u = new URL(/^https?:\/\//i.test(f.websiteUrl.trim()) ? f.websiteUrl.trim() : `https://${f.websiteUrl.trim()}`);
      if (!u.hostname.includes(".")) throw new Error();
    } catch {
      return "Website URL must be a valid address, e.g. https://example.com";
    }
  }
  if (f.description.length > 500) return "Short description must be 500 characters or less.";
  if (f.logoAlt.length > 200) return "Alt text must be 200 characters or less.";
  if (f.displayOrder !== "" && (!/^\d+$/.test(f.displayOrder) || Number(f.displayOrder) > 9999)) {
    return "Display order must be a whole number between 0 and 9999.";
  }
  return null;
}

export default function ClientEditor() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";

  const [form, setForm] = useState<FormState>(EMPTY);
  const [categories, setCategories] = useState<Option[]>([]);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const loading = Boolean(id) && loadedId !== id;
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (!router.isReady) return;
    let alive = true;

    fetch("/api/v1/client-categories")
      .then((r) => r.json())
      .then((d) => alive && d.success && setCategories(d.data.map((c: Option) => ({ id: c.id, name: c.name }))))
      .catch(() => {});

    if (id) {
      fetch(`/api/v1/clients/${id}`)
        .then((r) => r.json())
        .then((d) => {
          if (!alive) return;
          if (!d.success) {
            setMessage({ type: "error", text: d.error || "Failed to load client" });
            return;
          }
          const c = d.data;
          setForm({
            name: c.name || "",
            logoUrl: c.logoUrl || "",
            logoAlt: c.logoAlt || "",
            categoryId: c.categoryId || "",
            websiteUrl: c.websiteUrl || "",
            description: c.description || "",
            displayOrder: String(c.displayOrder ?? ""),
            isActive: Boolean(c.isActive),
            isFeatured: Boolean(c.isFeatured),
          });
        })
        .catch(() => alive && setMessage({ type: "error", text: "Failed to load client" }))
        .finally(() => alive && setLoadedId(id));
    }
    return () => {
      alive = false;
    };
  }, [router.isReady, id]);

  /**
   * Creates a category from the combobox. The combobox only offers this when no category
   * matches case-insensitively; the server also rejects duplicates (409), in which case we
   * reload the list and return the existing one instead of creating a copy.
   */
  const createCategory = async (name: string): Promise<Option> => {
    const res = await fetch("/api/v1/client-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const d = await res.json().catch(() => ({}));
    if (d.success) {
      const created = { id: d.data.id, name: d.data.name };
      setCategories((prev) => [...prev, created]);
      return created;
    }
    if (res.status === 409) {
      const list = await fetch("/api/v1/client-categories").then((r) => r.json()).catch(() => ({}));
      if (list.success) {
        const fresh: Option[] = list.data.map((c: Option) => ({ id: c.id, name: c.name }));
        setCategories(fresh);
        const match = fresh.find((c) => c.name.trim().toLowerCase() === name.trim().toLowerCase());
        if (match) return match;
      }
    }
    throw new Error(d.error || "Could not add this category. Please try again.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const problem = validate(form);
    if (problem) return setMessage({ type: "error", text: problem });

    const payload = {
      name: form.name.trim(),
      logoUrl: form.logoUrl.trim(),
      logoAlt: form.logoAlt.trim() || `${form.name.trim()} logo`,
      categoryId: form.categoryId || null,
      websiteUrl: form.websiteUrl.trim(),
      description: form.description.trim(),
      ...(form.displayOrder !== "" ? { displayOrder: Number(form.displayOrder) } : {}),
      isActive: form.isActive,
      isFeatured: form.isFeatured,
    };

    setSaving(true);
    try {
      const res = await fetch(id ? `/api/v1/clients/${id}` : "/api/v1/clients", {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await res.json().catch(() => ({}));
      if (d.success) {
        setMessage({ type: "success", text: id ? "Client updated." : "Client added." });
        if (!id) router.replace(`/admin/clients/editor?id=${d.data.id}`);
        else set("displayOrder", String(d.data.displayOrder));
      } else {
        setMessage({ type: "error", text: d.error || "Failed to save client." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error while saving." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Client">
        <div className="p-12 text-center text-xs text-gray-500 font-intel">Loading client...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={id ? "Edit Client" : "Add New Client"}>
      <form onSubmit={handleSubmit} className="space-y-8 w-full" noValidate>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800/80 pb-4 font-intel">
          <Link href="/admin/clients" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back to Our Clients
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-linear-to-r from-[#7c3aed] to-[#4f8bff] text-white text-xs font-bold disabled:opacity-60 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : id ? "Update Client" : "Add Client"}
          </button>
        </div>

        {message && (
          <div
            role={message.type === "error" ? "alert" : "status"}
            className={`px-4 py-3 rounded-xl text-xs font-intel border ${
              message.type === "error" ? "bg-red-500/10 border-red-500/30 text-red-300" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            <section className={CARD} aria-labelledby="sec-details">
              <h3 id="sec-details" className={CARD_TITLE}>Client Details</h3>
              <TextField label="Client Name" required value={form.name} onChange={(v) => set("name", v)} maxLength={120} placeholder="e.g. GTC Marketing" />
              <TextField
                label="Website URL"
                value={form.websiteUrl}
                onChange={(v) => set("websiteUrl", v)}
                maxLength={500}
                placeholder="https://example.com"
                hint="Optional"
              />
              <TextAreaField
                label="Short Description"
                value={form.description}
                onChange={(v) => set("description", v)}
                rows={3}
                maxLength={500}
                placeholder="Optional. Shown when a visitor opens the client's logo."
              />
            </section>

            <section className={CARD} aria-labelledby="sec-logo">
              <h3 id="sec-logo" className={CARD_TITLE}>Client Logo <span className="text-red-400">*</span></h3>
              <ImageField
                label="Logo"
                value={form.logoUrl}
                onChange={(v) => set("logoUrl", v)}
                hint="PNG/WEBP with transparent or white background, ~400×200"
                previewClassName="h-32 object-contain! bg-white p-4"
              />
              <TextField
                label="Alt Text"
                value={form.logoAlt}
                onChange={(v) => set("logoAlt", v)}
                maxLength={200}
                placeholder="e.g. GTC Marketing logo"
                hint="Defaults to “{Client Name} logo”"
              />
            </section>
          </div>

          <div className="space-y-6">
            <section className={CARD} aria-labelledby="sec-visibility">
              <h3 id="sec-visibility" className={CARD_TITLE}>Visibility</h3>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="cl-status">Status</FieldLabel>
                <select
                  id="cl-status"
                  value={form.isActive ? "active" : "inactive"}
                  onChange={(e) => set("isActive", e.target.value === "active")}
                  className={INPUT}
                >
                  <option value="active">Active (shown on website)</option>
                  <option value="inactive">Inactive (hidden)</option>
                </select>
              </div>
              <label className="flex items-start gap-2.5 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => set("isFeatured", e.target.checked)}
                  className="mt-0.5 accent-[#a855f7]"
                />
                <span>
                  Featured client
                  <span className="block text-[11px] text-gray-500">Featured clients are shown first.</span>
                </span>
              </label>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="cl-order" hint="Lower numbers show first">Display Order</FieldLabel>
                <input
                  id="cl-order"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={9999}
                  step={1}
                  value={form.displayOrder}
                  onChange={(e) => set("displayOrder", e.target.value)}
                  placeholder={id ? "" : "Auto (end of list)"}
                  className={INPUT}
                />
              </div>
            </section>

            <section className={CARD} aria-labelledby="sec-category">
              <h3 id="sec-category" className={CARD_TITLE}>Category / Industry</h3>
              <CreatableCombobox
                label="Category"
                options={categories}
                value={form.categoryId}
                onChange={(categoryId) => set("categoryId", categoryId)}
                onCreate={createCategory}
                placeholder="Search categories…"
                emptyLabel="Uncategorized"
                maxLength={60}
              />
            </section>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
