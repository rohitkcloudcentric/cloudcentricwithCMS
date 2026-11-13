import React, { useEffect, useMemo, useState } from "react";
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
  TitleDescListField,
  type TitleDesc,
} from "@/components/admin/EditorFields";

interface Option {
  id: string;
  name: string;
}

interface CaseStudyOption {
  id: string;
  title: string;
  status: string;
}

interface FormState {
  title: string;
  slug: string;
  clientName: string;
  industry: string;
  excerpt: string;
  overview: string;
  challengeSummary: string;
  solutionSummary: string;
  impacts: string[];
  technologies: string[];
  thumbnailImage: string;
  featuredImage: string;
  featuredImageAlt: string;
  galleryImages: string[];
  challengeTitle: string;
  challengeHtml: string;
  keyChallenges: string[];
  approachTitle: string;
  approachHtml: string;
  approachSteps: TitleDesc[];
  solutionTitle: string;
  solutionHtml: string;
  solutionHighlights: TitleDesc[];
  impactTitle: string;
  impactHtml: string;
  impactHighlights: TitleDesc[];
  seoTitle: string;
  seoDescription: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: string; // yyyy-mm-dd
  displayOrder: number;
  categoryId: string;
  tagIds: string[];
  relatedIds: string[];
}

const EMPTY: FormState = {
  title: "", slug: "", clientName: "", industry: "", excerpt: "", overview: "",
  challengeSummary: "", solutionSummary: "", impacts: [], technologies: [],
  thumbnailImage: "", featuredImage: "", featuredImageAlt: "", galleryImages: [],
  challengeTitle: "", challengeHtml: "", keyChallenges: [],
  approachTitle: "", approachHtml: "", approachSteps: [],
  solutionTitle: "", solutionHtml: "", solutionHighlights: [],
  impactTitle: "", impactHtml: "", impactHighlights: [],
  seoTitle: "", seoDescription: "", status: "DRAFT", publishedAt: "", displayOrder: 0,
  categoryId: "", tagIds: [], relatedIds: [],
};

const toSlug = (v: string) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

const strArr = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
const tdArr = (v: unknown): TitleDesc[] =>
  Array.isArray(v)
    ? v.map((x) => ({ title: typeof x?.title === "string" ? x.title : "", desc: typeof x?.desc === "string" ? x.desc : "" }))
    : [];

const CARD = "bg-[#0B0F17] border border-gray-800/80 rounded-2xl p-5 space-y-4 font-intel";
const CARD_TITLE = "text-sm font-bold text-white font-manrope";
const SELECT = "w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-[#a855f7]";

export default function CaseStudyEditor() {
  const router = useRouter();
  // Publishing needs the module's publish permission (also enforced by the API)
  const canPublish = useAdminAuth().can("case_studies", "publish");
  const id = typeof router.query.id === "string" ? router.query.id : "";

  const [form, setForm] = useState<FormState>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [categories, setCategories] = useState<Option[]>([]);
  const [tags, setTags] = useState<Option[]>([]);
  const [allCaseStudies, setAllCaseStudies] = useState<CaseStudyOption[]>([]);
  // Which id has finished loading; while it differs from the URL id we show the loader
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const loading = Boolean(id) && loadedId !== id;
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [taxonomyError, setTaxonomyError] = useState("");

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  // Load lookups + the case study being edited
  useEffect(() => {
    if (!router.isReady) return;
    let alive = true;

    const getJson = (url: string) => fetch(url).then((r) => r.json()).catch(() => ({}));

    Promise.all([
      getJson("/api/v1/case-study-categories"),
      getJson("/api/v1/case-study-tags"),
      getJson("/api/v1/case-studies"),
    ]).then(([cats, tgs, list]) => {
      if (!alive) return;
      if (cats.success) setCategories(cats.data.map((c: Option) => ({ id: c.id, name: c.name })));
      if (tgs.success) setTags(tgs.data.map((t: Option) => ({ id: t.id, name: t.name })));
      if (list.success) {
        setAllCaseStudies(list.data.map((c: CaseStudyOption) => ({ id: c.id, title: c.title, status: c.status })));
      }
    });

    if (id) {
      getJson(`/api/v1/case-studies/${id}`)
        .then((res) => {
          if (!alive) return;
          if (!res.success) {
            setMessage({ type: "error", text: res.error || "Failed to load case study" });
            return;
          }
          const d = res.data;
          setSlugTouched(true);
          setForm({
            title: d.title || "",
            slug: d.slug || "",
            clientName: d.clientName || "",
            industry: d.industry === "GENERAL" ? "" : d.industry || "",
            excerpt: d.excerpt || "",
            overview: d.summary || "",
            challengeSummary: d.challenge || "",
            solutionSummary: d.solution || "",
            impacts: strArr(d.impacts),
            technologies: strArr(d.technologies),
            thumbnailImage: d.thumbnailImage || "",
            featuredImage: d.featuredImage || "",
            featuredImageAlt: d.featuredImageAlt || "",
            galleryImages: strArr(d.galleryImages),
            challengeTitle: d.challengeTitle || "",
            challengeHtml: d.challengeHtml || "",
            keyChallenges: strArr(d.keyChallenges),
            approachTitle: d.approachTitle || "",
            approachHtml: d.approachHtml || "",
            approachSteps: tdArr(d.approachSteps),
            solutionTitle: d.solutionTitle || "",
            solutionHtml: d.solutionHtml || "",
            solutionHighlights: tdArr(d.solutionHighlights),
            impactTitle: d.impactTitle || "",
            impactHtml: d.impactHtml || "",
            impactHighlights: tdArr(d.impactHighlights),
            seoTitle: d.seoTitle || "",
            seoDescription: d.seoDescription || "",
            status: d.status || "DRAFT",
            publishedAt: d.publishedAt ? String(d.publishedAt).slice(0, 10) : "",
            displayOrder: typeof d.displayOrder === "number" ? d.displayOrder : 0,
            categoryId: d.categoryId || "",
            tagIds: Array.isArray(d.tags) ? d.tags.map((t: { tagId: string }) => t.tagId) : [],
            relatedIds: strArr(d.relatedIds),
          });
        })
        .finally(() => alive && setLoadedId(id));
    }

    return () => {
      alive = false;
    };
  }, [router.isReady, id]);

  const relatedOptions = useMemo(() => allCaseStudies.filter((c) => c.id !== id), [allCaseStudies, id]);

  // ── Quick-add taxonomy ──
  /** Creates a category/tag; if it already exists (409), returns the existing one instead. */
  const createTaxonomy = async (endpoint: string, name: string): Promise<Option | null> => {
    setTaxonomyError("");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) return { id: data.data.id, name: data.data.name };

      if (res.status === 409) {
        // Already exists (our local list may be stale): reload and pick it
        const list = await fetch(endpoint).then((r) => r.json()).catch(() => ({}));
        const match: Option | undefined = list.success
          ? list.data.find((o: Option) => o.name.toLowerCase() === name.toLowerCase())
          : undefined;
        if (match) return { id: match.id, name: match.name };
      }

      setTaxonomyError(
        res.status === 500
          ? `${data.error || "Failed to add"}. If you just updated the app, restart the dev server.`
          : data.error || "Failed to add"
      );
      return null;
    } catch {
      setTaxonomyError("Network error. Please try again.");
      return null;
    }
  };

  const addCategory = async () => {
    const name = newCategory.trim();
    if (!name) return;
    const existing = categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      set("categoryId", existing.id);
      setNewCategory("");
      return;
    }
    const created = await createTaxonomy("/api/v1/case-study-categories", name);
    if (created) {
      setCategories((prev) =>
        (prev.some((c) => c.id === created.id) ? prev : [...prev, created]).sort((a, b) => a.name.localeCompare(b.name))
      );
      set("categoryId", created.id);
      setNewCategory("");
    }
  };

  const addTag = async () => {
    const name = tagInput.trim().replace(/\s+/g, " ");
    if (!name) return;
    const existing = tags.find((t) => t.name.toLowerCase() === name.toLowerCase());
    const tag = existing ?? (await createTaxonomy("/api/v1/case-study-tags", name));
    if (!tag) return;
    if (!existing) {
      setTags((prev) => (prev.some((t) => t.id === tag.id) ? prev : [...prev, tag]).sort((a, b) => a.name.localeCompare(b.name)));
    }
    setForm((f) => (f.tagIds.includes(tag.id) ? f : { ...f, tagIds: [...f.tagIds, tag.id] }));
    setTagInput("");
  };

  const toggleId = (key: "tagIds" | "relatedIds", value: string) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));

  // ── Save ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const slug = toSlug(form.slug || form.title);
    if (!form.title.trim()) return setMessage({ type: "error", text: "Case study title is required." });
    if (!slug) return setMessage({ type: "error", text: "URL slug is required." });
    if (!form.clientName.trim()) return setMessage({ type: "error", text: "Client name is required." });
    if (form.status === "PUBLISHED" && !form.thumbnailImage && !form.featuredImage) {
      return setMessage({ type: "error", text: "Add a thumbnail or featured image before publishing." });
    }

    const clean = (list: TitleDesc[]) => list.filter((i) => i.title.trim() || i.desc.trim());

    const payload = {
      ...form,
      slug,
      approachSteps: clean(form.approachSteps),
      solutionHighlights: clean(form.solutionHighlights),
      impactHighlights: clean(form.impactHighlights),
      keyChallenges: form.keyChallenges.map((s) => s.trim()).filter(Boolean),
      publishedAt: form.publishedAt ? new Date(`${form.publishedAt}T00:00:00`).toISOString() : "",
      categoryId: form.categoryId || null,
      seoTitle: form.seoTitle || form.title,
      seoDescription: form.seoDescription || form.excerpt,
    };

    setSaving(true);
    try {
      const res = await fetch(id ? `/api/v1/case-studies/${id}` : "/api/v1/case-studies", {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        setMessage({ type: "success", text: id ? "Case study updated." : "Case study created." });
        if (!id) {
          router.replace(`/admin/case-studies/editor?id=${data.data.id}`);
        } else {
          set("slug", data.data.slug);
        }
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save case study." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error while saving." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Case Study">
        <div className="p-12 text-center text-xs text-gray-500 font-intel">Loading case study...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={id ? "Edit Case Study" : "Create New Case Study"}>
      <form onSubmit={handleSubmit} className="space-y-8 w-full">
        {/* Header actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800/80 pb-4 font-intel">
          <Link href="/admin/case-studies" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back to Case Studies
          </Link>
          <div className="flex items-center gap-3">
            {id && form.status === "PUBLISHED" && (
              <Link
                href={`/case-studies/${form.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View live
              </Link>
            )}
            <label htmlFor="cs-status" className="sr-only">Status</label>
            <select
              id="cs-status"
              value={form.status}
              onChange={(e) => set("status", e.target.value as FormState["status"])}
              className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#a855f7]"
            >
              <option value="DRAFT">Status: Draft</option>
              <option value="PUBLISHED" disabled={!canPublish}>Status: Published{canPublish ? "" : " (no permission)"}</option>
              <option value="ARCHIVED">Status: Archived</option>
            </select>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-linear-to-r from-[#7c3aed] to-[#4f8bff] text-white text-xs font-bold disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : id ? "Update Case Study" : form.status === "PUBLISHED" ? "Publish Case Study" : "Save Draft"}
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
                label="Case Study Title"
                required
                value={form.title}
                onChange={(v) => setForm((f) => ({ ...f, title: v, slug: slugTouched ? f.slug : toSlug(v) }))}
                placeholder="e.g. AI-Powered Automation for Faster, Smarter Business Operations"
              />
              <div className="space-y-1.5">
                <FieldLabel htmlFor="cs-slug">URL Slug <span className="text-red-400">*</span></FieldLabel>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-xs text-gray-500">/case-studies/</span>
                  <input
                    id="cs-slug"
                    type="text"
                    value={form.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                    }}
                    onBlur={() => set("slug", toSlug(form.slug))}
                    placeholder="case-study-url-slug"
                    maxLength={200}
                    className={SELECT}
                  />
                </div>
              </div>
              <TextAreaField
                label="Short Description / Excerpt"
                value={form.excerpt}
                onChange={(v) => set("excerpt", v)}
                placeholder="One or two sentences shown on the listing card and in search results."
                rows={2}
              />
              <TextAreaField
                label="Overview"
                value={form.overview}
                onChange={(v) => set("overview", v)}
                placeholder="Paragraph shown under the title in the detail page hero."
                rows={3}
              />
            </section>

            <section className={CARD} aria-labelledby="sec-card">
              <div>
                <h3 id="sec-card" className={CARD_TITLE}>Listing Card Summary</h3>
                <p className="text-[11px] text-gray-500 mt-1">Short texts shown on the Case Studies listing card.</p>
              </div>
              <TextAreaField label="Challenge (card)" value={form.challengeSummary} onChange={(v) => set("challengeSummary", v)} rows={2} />
              <TextAreaField label="Solution (card)" value={form.solutionSummary} onChange={(v) => set("solutionSummary", v)} rows={2} />
              <StringListField
                label="Key Impact / Results (pills)"
                items={form.impacts}
                onChange={(v) => set("impacts", v)}
                placeholder="e.g. Faster Operations"
                addLabel="Add impact"
                maxLength={60}
                hint="Up to 8"
              />
            </section>

            <section className={CARD} aria-labelledby="sec-challenge">
              <h3 id="sec-challenge" className={CARD_TITLE}>The Challenge</h3>
              <TextField label="Challenge Subtitle" value={form.challengeTitle} onChange={(v) => set("challengeTitle", v)} placeholder="e.g. Too Much Manual Work. Too Little Time." />
              <RichTextField label="Challenge Content" value={form.challengeHtml} onChange={(v) => set("challengeHtml", v)} galleryImages={form.galleryImages} placeholder="<p>Describe the client's situation...</p>" />
              <StringListField label="Key Challenges" items={form.keyChallenges} onChange={(v) => set("keyChallenges", v)} placeholder="e.g. Repetitive manual processes" addLabel="Add challenge" />
            </section>

            <section className={CARD} aria-labelledby="sec-approach">
              <h3 id="sec-approach" className={CARD_TITLE}>Our Approach</h3>
              <TextField label="Approach Subtitle" value={form.approachTitle} onChange={(v) => set("approachTitle", v)} placeholder="e.g. Turning Manual Processes Into Intelligent Workflows" />
              <RichTextField label="Approach Content" value={form.approachHtml} onChange={(v) => set("approachHtml", v)} galleryImages={form.galleryImages} />
              <TitleDescListField
                label="Approach Steps (We focused on)"
                items={form.approachSteps}
                onChange={(v) => set("approachSteps", v)}
                titlePlaceholder="e.g. Identify"
                descPlaceholder="e.g. Find repetitive, high-impact processes suitable for automation."
                addLabel="Add step"
                numbered
              />
            </section>

            <section className={CARD} aria-labelledby="sec-solution">
              <h3 id="sec-solution" className={CARD_TITLE}>The Solution</h3>
              <TextField label="Solution Subtitle" value={form.solutionTitle} onChange={(v) => set("solutionTitle", v)} placeholder="e.g. AI That Works Across the Business" />
              <RichTextField label="Solution Content" value={form.solutionHtml} onChange={(v) => set("solutionHtml", v)} galleryImages={form.galleryImages} />
              <TitleDescListField
                label="Solution Highlights"
                items={form.solutionHighlights}
                onChange={(v) => set("solutionHighlights", v)}
                titlePlaceholder="e.g. Intelligent Workflow Automation"
                descPlaceholder="e.g. Automated repetitive processes..."
                addLabel="Add highlight"
              />
            </section>

            <section className={CARD} aria-labelledby="sec-impact">
              <h3 id="sec-impact" className={CARD_TITLE}>Business Impact / Results</h3>
              <TextField label="Impact Subtitle" value={form.impactTitle} onChange={(v) => set("impactTitle", v)} placeholder="e.g. From Manual Operations to Intelligent Automation" />
              <RichTextField label="Impact Content" value={form.impactHtml} onChange={(v) => set("impactHtml", v)} galleryImages={form.galleryImages} />
              <TitleDescListField
                label="Key Outcomes"
                items={form.impactHighlights}
                onChange={(v) => set("impactHighlights", v)}
                titlePlaceholder="e.g. Reduced Manual Effort"
                descPlaceholder="e.g. More routine processes handled automatically."
                addLabel="Add outcome"
              />
            </section>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">
            <section className={CARD} aria-labelledby="sec-publish">
              <h3 id="sec-publish" className={CARD_TITLE}>Publishing</h3>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="cs-date" hint="Defaults to the first publish date">Publication Date</FieldLabel>
                <input id="cs-date" type="date" value={form.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} className={SELECT} />
              </div>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="cs-order" hint="Lower numbers show first">Display Order</FieldLabel>
                <input
                  id="cs-order"
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) => set("displayOrder", Number(e.target.value) || 0)}
                  min={-9999}
                  max={9999}
                  className={SELECT}
                />
              </div>
            </section>

            <section className={CARD} aria-labelledby="sec-client">
              <h3 id="sec-client" className={CARD_TITLE}>Client Overview</h3>
              <TextField label="Client Name" required value={form.clientName} onChange={(v) => set("clientName", v)} placeholder="e.g. ABC Pvt Ltd" />
              <TextField label="Industry" value={form.industry} onChange={(v) => set("industry", v)} placeholder="e.g. Manufacturing" />
              <StringListField
                label="Technologies Used"
                items={form.technologies}
                onChange={(v) => set("technologies", v)}
                placeholder="e.g. Generative AI"
                addLabel="Add"
                maxLength={60}
              />
            </section>

            <section className={CARD} aria-labelledby="sec-taxonomy">
              <h3 id="sec-taxonomy" className={CARD_TITLE}>Category &amp; Tags</h3>
              <div className="space-y-1.5">
                <FieldLabel htmlFor="cs-category">Category</FieldLabel>
                <select id="cs-category" value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} className={SELECT}>
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCategory();
                      }
                    }}
                    placeholder="New category"
                    aria-label="New category name"
                    maxLength={60}
                    className={SELECT}
                  />
                  <button type="button" onClick={addCategory} className="shrink-0 px-3 py-2.5 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-semibold">
                    Add
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <FieldLabel htmlFor="cs-tag">Tags</FieldLabel>
                {form.tagIds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {form.tagIds.map((tagId) => {
                      const tag = tags.find((t) => t.id === tagId);
                      if (!tag) return null;
                      return (
                        <span key={tagId} className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-lg bg-[#7c3aed]/15 border border-[#a855f7]/30 text-[#c084fc] text-[11px]">
                          {tag.name}
                          <button type="button" onClick={() => toggleId("tagIds", tagId)} aria-label={`Remove tag ${tag.name}`} className="px-1 rounded hover:bg-white/10 hover:text-white">
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    id="cs-tag"
                    type="text"
                    list="cs-tag-suggestions"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Type a tag and press Enter"
                    maxLength={40}
                    className={SELECT}
                  />
                  <datalist id="cs-tag-suggestions">
                    {tags.filter((t) => !form.tagIds.includes(t.id)).map((t) => (
                      <option key={t.id} value={t.name} />
                    ))}
                  </datalist>
                  <button type="button" onClick={addTag} className="shrink-0 px-3 py-2.5 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-semibold">
                    Add
                  </button>
                </div>
              </div>
              {taxonomyError && <p className="text-[11px] text-red-400" role="alert">{taxonomyError}</p>}
            </section>

            <section className={CARD} aria-labelledby="sec-images">
              <h3 id="sec-images" className={CARD_TITLE}>Images</h3>
              <ImageField label="Thumbnail (listing card)" value={form.thumbnailImage} onChange={(v) => set("thumbnailImage", v)} hint="Recommended 1060×740" />
              <ImageField label="Featured / Banner (detail page)" value={form.featuredImage} onChange={(v) => set("featuredImage", v)} hint="Recommended 1160×800" />
              <TextField
                label="Featured Image Alt Text"
                value={form.featuredImageAlt}
                onChange={(v) => set("featuredImageAlt", v)}
                placeholder="Describe the image for screen readers"
              />
              <GalleryField label="Content Images" images={form.galleryImages} onChange={(v) => set("galleryImages", v)} />
            </section>

            <section className={CARD} aria-labelledby="sec-related">
              <div>
                <h3 id="sec-related" className={CARD_TITLE}>Related Case Studies</h3>
                <p className="text-[11px] text-gray-500 mt-1">Pick up to 3. Only the selected case studies are shown. Leave all unchecked to show related ones from the same category automatically.</p>
              </div>
              {relatedOptions.length === 0 ? (
                <p className="text-xs text-gray-500">No other case studies yet.</p>
              ) : (
                <ul className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {relatedOptions.map((c) => {
                    const checked = form.relatedIds.includes(c.id);
                    const disabled = !checked && form.relatedIds.length >= 3;
                    return (
                      <li key={c.id}>
                        <label className={`flex items-start gap-2 text-xs ${disabled ? "text-gray-600" : "text-gray-300"} cursor-pointer`}>
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={disabled}
                            onChange={() => toggleId("relatedIds", c.id)}
                            className="mt-0.5 accent-[#a855f7]"
                          />
                          <span>
                            {c.title}
                            {c.status !== "PUBLISHED" && <span className="ml-1 text-[10px] text-amber-400">({c.status.toLowerCase()})</span>}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            <section className={CARD} aria-labelledby="sec-seo">
              <h3 id="sec-seo" className={`${CARD_TITLE} flex items-center gap-2`}>
                <Sparkles className="w-4 h-4 text-[#a855f7]" aria-hidden="true" /> SEO Controls
              </h3>
              <TextField label="SEO Meta Title" value={form.seoTitle} onChange={(v) => set("seoTitle", v)} placeholder="Defaults to the case study title" maxLength={200} hint={`${form.seoTitle.length}/60 recommended`} />
              <TextAreaField label="SEO Meta Description" value={form.seoDescription} onChange={(v) => set("seoDescription", v)} placeholder="Defaults to the excerpt" rows={3} hint={`${form.seoDescription.length}/160 recommended`} />
            </section>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
