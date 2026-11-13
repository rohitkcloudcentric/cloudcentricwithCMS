import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft, Save, ExternalLink, Sparkles } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import {
  FieldLabel,
  GalleryField,
  ImageField,
  RichTextField,
  StringListField,
  TextAreaField,
  TextField,
} from "@/components/admin/EditorFields";

interface FormState {
  title: string;
  slug: string;
  badge: string; // subtitle / tagline
  description: string; // short description
  contentHtml: string;
  logoUrl: string;
  featuredImage: string;
  featuredImageAlt: string;
  galleryImages: string[];
  features: string[];
  technologies: string[];
  websiteUrl: string;
  seoTitle: string;
  seoDescription: string;
  displayOrder: number;
  isActive: boolean;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

const EMPTY: FormState = {
  title: "", slug: "", badge: "", description: "", contentHtml: "",
  logoUrl: "", featuredImage: "", featuredImageAlt: "", galleryImages: [],
  features: [], technologies: [], websiteUrl: "",
  seoTitle: "", seoDescription: "", displayOrder: 0, isActive: true, status: "DRAFT",
};

const toSlug = (v: string) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
const strArr = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

const CARD = "bg-[#0B0F17] border border-gray-800/80 rounded-2xl p-5 space-y-4 font-intel";
const CARD_TITLE = "text-sm font-bold text-white font-manrope";
const INPUT = "w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-[#a855f7]";

// Optimized server-side (resized + WebP)
const LOGO_UPLOAD = { optimize: true, maxWidth: 800 };
const IMAGE_UPLOAD = { optimize: true, maxWidth: 1920 };

export default function ProductEditor() {
  const router = useRouter();
  // Publishing needs the module's publish permission (also enforced by the API)
  const canPublish = useAdminAuth().can("products", "publish");
  const id = typeof router.query.id === "string" ? router.query.id : "";

  const [form, setForm] = useState<FormState>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  // Which id has finished loading; while it differs from the URL id we show the loader
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const loading = Boolean(id) && loadedId !== id;
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (!router.isReady || !id) return;
    let alive = true;

    fetch(`/api/v1/products/${id}`)
      .then((r) => r.json())
      .then((res) => {
        if (!alive) return;
        if (!res.success) {
          setMessage({ type: "error", text: res.error || "Failed to load product" });
          return;
        }
        const d = res.data;
        setSlugTouched(true);
        setForm({
          title: d.title || "",
          slug: d.slug || "",
          badge: d.badge || "",
          description: d.description || "",
          contentHtml: d.contentHtml || "",
          logoUrl: d.logoUrl || "",
          featuredImage: d.featuredImage || "",
          featuredImageAlt: d.featuredImageAlt || "",
          galleryImages: Array.isArray(d.images) ? d.images.map((i: { url: string }) => i.url) : [],
          features: strArr(d.features),
          technologies: strArr(d.technologies),
          websiteUrl: d.websiteUrl || "",
          seoTitle: d.seoTitle || "",
          seoDescription: d.seoDescription || "",
          displayOrder: typeof d.displayOrder === "number" ? d.displayOrder : 0,
          isActive: d.isActive !== false,
          status: d.status || "DRAFT",
        });
      })
      .catch(() => alive && setMessage({ type: "error", text: "Failed to load product" }))
      .finally(() => alive && setLoadedId(id));

    return () => {
      alive = false;
    };
  }, [router.isReady, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const slug = toSlug(form.slug || form.title);
    if (!form.title.trim()) return setMessage({ type: "error", text: "Product name is required." });
    if (!slug) return setMessage({ type: "error", text: "URL slug is required." });
    if (!form.description.trim() && form.status === "PUBLISHED") {
      return setMessage({ type: "error", text: "Add a short description before publishing." });
    }
    if (form.status === "PUBLISHED" && !form.logoUrl && !form.featuredImage) {
      return setMessage({ type: "error", text: "Add a logo or featured image before publishing." });
    }
    if (form.websiteUrl.trim()) {
      try {
        const u = new URL(/^[a-z][a-z0-9+.-]*:/i.test(form.websiteUrl.trim()) ? form.websiteUrl.trim() : `https://${form.websiteUrl.trim()}`);
        if (!/^https?:$/.test(u.protocol)) throw new Error();
      } catch {
        return setMessage({ type: "error", text: "Product website URL must be a valid http(s) link." });
      }
    }

    const payload = {
      ...form,
      slug,
      features: form.features.map((s) => s.trim()).filter(Boolean),
      technologies: form.technologies.map((s) => s.trim()).filter(Boolean),
      seoTitle: form.seoTitle || form.title,
      seoDescription: form.seoDescription || form.description,
    };

    setSaving(true);
    try {
      const res = await fetch(id ? `/api/v1/products/${id}` : "/api/v1/products", {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        setMessage({ type: "success", text: id ? "Product updated." : "Product created." });
        if (!id) {
          router.replace(`/admin/products/editor?id=${data.data.id}`);
        } else {
          // Reflect server-normalised values (slug, website URL)
          setForm((f) => ({ ...f, slug: data.data.slug, websiteUrl: data.data.websiteUrl || "" }));
        }
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save product." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error while saving." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Product">
        <div className="p-12 text-center text-xs text-gray-500 font-intel">Loading product...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={id ? "Edit Product" : "Add Product"}>
      <form onSubmit={handleSubmit} className="space-y-8 w-full">
        {/* Header actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800/80 pb-4 font-intel">
          <Link href="/admin/products" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Products
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            {id && form.status === "PUBLISHED" && form.isActive && (
              <Link href={`/products/${form.slug}`} target="_blank" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white">
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> View live
              </Link>
            )}
            <label htmlFor="product-status" className="sr-only">Publication status</label>
            <select
              id="product-status"
              value={form.status}
              onChange={(e) => set("status", e.target.value as FormState["status"])}
              className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#a855f7]"
            >
              <option value="DRAFT">Status: Draft (unpublished)</option>
              <option value="PUBLISHED" disabled={!canPublish}>Status: Published{canPublish ? "" : " (no permission)"}</option>
              <option value="ARCHIVED">Status: Archived</option>
            </select>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-linear-to-r from-[#7c3aed] to-[#4f8bff] text-white text-xs font-bold disabled:opacity-60 cursor-pointer"
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              {saving ? "Saving..." : id ? "Update Product" : form.status === "PUBLISHED" ? "Publish Product" : "Save Draft"}
            </button>
          </div>
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
          {/* ── Main column ── */}
          <div className="xl:col-span-2 space-y-6">
            <section className={CARD} aria-labelledby="sec-basics">
              <h3 id="sec-basics" className={CARD_TITLE}>Basics</h3>
              <TextField
                label="Product Name"
                required
                maxLength={150}
                value={form.title}
                onChange={(v) => setForm((f) => ({ ...f, title: v, slug: slugTouched ? f.slug : toSlug(v) }))}
                placeholder="e.g. FieldBlaze"
              />
              <div className="space-y-1.5">
                <FieldLabel htmlFor="product-slug" hint="Generated from the name; edit if needed">
                  Product Slug <span className="text-red-400">*</span>
                </FieldLabel>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-xs text-gray-500">/products/</span>
                  <input
                    id="product-slug"
                    type="text"
                    value={form.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                    }}
                    onBlur={() => set("slug", toSlug(form.slug))}
                    placeholder="product-url-slug"
                    maxLength={150}
                    className={INPUT}
                  />
                </div>
              </div>
              <TextField
                label="Product Subtitle"
                value={form.badge}
                onChange={(v) => set("badge", v)}
                placeholder="e.g. Field Force Management Software Built on Salesforce"
              />
              <TextAreaField
                label="Short Description"
                value={form.description}
                onChange={(v) => set("description", v)}
                placeholder="One or two sentences shown on the product cards."
                rows={3}
                maxLength={600}
              />
              <TextField
                label="Product Website URL"
                value={form.websiteUrl}
                onChange={(v) => set("websiteUrl", v)}
                placeholder="https://www.example.com"
                maxLength={1000}
              />
            </section>

            <section className={CARD} aria-labelledby="sec-details">
              <h3 id="sec-details" className={CARD_TITLE}>Detailed Description</h3>
              <RichTextField
                label="Product Information"
                value={form.contentHtml}
                onChange={(v) => set("contentHtml", v)}
                galleryImages={form.galleryImages}
                minRows={12}
                placeholder="<p>Describe the product, who it is for and how it works...</p>"
              />
            </section>

            <section className={CARD} aria-labelledby="sec-features">
              <h3 id="sec-features" className={CARD_TITLE}>Features &amp; Technologies</h3>
              <StringListField
                label="Key Features"
                items={form.features}
                onChange={(v) => set("features", v)}
                placeholder="e.g. Real-Time Location Tracking"
                addLabel="Add feature"
                hint="Up to 30"
              />
              <StringListField
                label="Technologies Used"
                items={form.technologies}
                onChange={(v) => set("technologies", v)}
                placeholder="e.g. Salesforce"
                addLabel="Add tag"
                maxLength={60}
                hint="Up to 30"
              />
            </section>

            <section className={CARD} aria-labelledby="sec-gallery">
              <h3 id="sec-gallery" className={CARD_TITLE}>Product Gallery</h3>
              <GalleryField
                label="Gallery Images"
                images={form.galleryImages}
                onChange={(v) => set("galleryImages", v)}
                uploadOptions={IMAGE_UPLOAD}
                hint="Upload several images (up to 20). Shown on the product page and insertable in the description"
              />
            </section>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">
            <section className={CARD} aria-labelledby="sec-publish">
              <h3 id="sec-publish" className={CARD_TITLE}>Visibility</h3>
              <label className="flex items-start gap-3 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => set("isActive", e.target.checked)}
                  className="mt-0.5 accent-[#a855f7] w-4 h-4"
                />
                <span>
                  <span className="font-semibold text-white">Active</span>
                  <span className="block text-[11px] text-gray-500 mt-0.5">
                    Inactive products are hidden from the website, even when published.
                  </span>
                </span>
              </label>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="product-order" hint="Lower numbers show first">Display Order</FieldLabel>
                <input
                  id="product-order"
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) => set("displayOrder", Number(e.target.value) || 0)}
                  min={-9999}
                  max={9999}
                  className={INPUT}
                />
              </div>
              <p className="text-[11px] text-gray-500">
                Shown on the website when the status is <span className="text-gray-300">Published</span> and the product is <span className="text-gray-300">Active</span>.
              </p>
            </section>

            <section className={CARD} aria-labelledby="sec-images">
              <h3 id="sec-images" className={CARD_TITLE}>Images</h3>
              <ImageField
                label="Product Logo / Thumbnail"
                value={form.logoUrl}
                onChange={(v) => set("logoUrl", v)}
                hint="Square, e.g. 400×400"
                previewClassName="h-28 bg-gray-900 object-contain!"
                uploadOptions={LOGO_UPLOAD}
              />
              <ImageField
                label="Featured Image (banner)"
                value={form.featuredImage}
                onChange={(v) => set("featuredImage", v)}
                hint="Recommended 1160×800"
                uploadOptions={IMAGE_UPLOAD}
              />
              <p className="text-[11px] text-gray-500">Uploads are resized and converted to WebP automatically. Removed or replaced images are deleted from the server on save.</p>
            </section>

            <section className={CARD} aria-labelledby="sec-seo">
              <h3 id="sec-seo" className={`${CARD_TITLE} flex items-center gap-2`}>
                <Sparkles className="w-4 h-4 text-[#a855f7]" aria-hidden="true" /> SEO Details
              </h3>
              <TextField label="SEO Title" value={form.seoTitle} onChange={(v) => set("seoTitle", v)} placeholder="Defaults to the product name" hint={`${form.seoTitle.length}/60 recommended`} />
              <TextAreaField label="Meta Description" value={form.seoDescription} onChange={(v) => set("seoDescription", v)} placeholder="Defaults to the short description" rows={3} maxLength={500} hint={`${form.seoDescription.length}/160 recommended`} />
              <TextField label="Image Alt Text" value={form.featuredImageAlt} onChange={(v) => set("featuredImageAlt", v)} placeholder="Describe the featured image for screen readers" />
            </section>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
