import React, { useId, useRef, useState } from "react";
import { Bold, Italic, Heading3, List, ListOrdered, Link2, Quote, ImagePlus, Upload, ArrowUp, ArrowDown, X, Plus } from "lucide-react";
import { ACCEPTED_IMAGE_TYPES, uploadImageFile, type UploadOptions } from "@/lib/admin-upload";
import { sanitizeArticleHtml } from "@/lib/sanitize-content";

const INPUT =
  "w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#a855f7]";
const LABEL = "text-xs font-semibold text-gray-300";

export function FieldLabel({ htmlFor, children, hint }: { htmlFor?: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <label htmlFor={htmlFor} className={LABEL}>{children}</label>
      {hint && <span className="text-[10px] text-gray-500">{hint}</span>}
    </div>
  );
}

export function TextField({
  label, value, onChange, placeholder, maxLength = 200, hint, required,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number; hint?: string; required?: boolean;
}) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <FieldLabel htmlFor={id} hint={hint}>{label}{required && <span className="text-red-400"> *</span>}</FieldLabel>
      <input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} className={INPUT} />
    </div>
  );
}

export function TextAreaField({
  label, value, onChange, placeholder, rows = 3, maxLength = 2000, hint,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; maxLength?: number; hint?: string;
}) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <FieldLabel htmlFor={id} hint={hint ?? `${value.length}/${maxLength}`}>{label}</FieldLabel>
      <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} maxLength={maxLength} className={`${INPUT} resize-y`} />
    </div>
  );
}

// ─────────────────────────── Rich text (HTML) ───────────────────────────

type ToolAction = "bold" | "italic" | "h3" | "ul" | "ol" | "quote" | "link";

const TOOLS: { icon: typeof Bold; label: string; action: ToolAction }[] = [
  { icon: Bold, label: "Bold", action: "bold" },
  { icon: Italic, label: "Italic", action: "italic" },
  { icon: Heading3, label: "Subheading", action: "h3" },
  { icon: List, label: "Bullet list", action: "ul" },
  { icon: ListOrdered, label: "Numbered list", action: "ol" },
  { icon: Quote, label: "Quote", action: "quote" },
  { icon: Link2, label: "Link", action: "link" },
];

/**
 * Lightweight HTML editor matching the Blog editor (write HTML + preview),
 * plus a formatting toolbar and "insert uploaded image".
 */
export function RichTextField({
  label, value, onChange, placeholder, galleryImages = [], minRows = 8,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; galleryImages?: string[]; minRows?: number;
}) {
  const id = useId();
  const ref = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [showImages, setShowImages] = useState(false);

  /** Wraps the current selection (or inserts a snippet) and restores focus. */
  const apply = (before: string, after = "", fallback = "") => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || fallback;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const cursor = start + before.length + selected.length;
      el.setSelectionRange(start + before.length, cursor);
    });
  };

  const applyList = (tag: "ul" | "ol") => {
    const el = ref.current;
    if (!el) return;
    const selected = value.slice(el.selectionStart, el.selectionEnd);
    const items = (selected || "List item").split(/\r?\n/).filter((l) => l.trim());
    apply(`<${tag}>\n${items.map((i) => `  <li>${i.trim()}</li>`).join("\n")}\n</${tag}>`, "", "");
  };

  const applyLink = () => {
    const url = window.prompt("Link URL (https://...)");
    if (!url) return;
    if (!/^(https?:\/\/|\/|mailto:)/i.test(url)) {
      window.alert("Use a full https:// URL, a site path starting with /, or mailto:");
      return;
    }
    apply(`<a href="${url.replace(/"/g, "&quot;")}">`, "</a>", "link text");
  };

  const insertImage = (src: string) => {
    apply(`<img src="${src}" alt="" />`, "", "");
    setShowImages(false);
  };

  const runTool = (action: ToolAction) => {
    switch (action) {
      case "bold": return apply("<strong>", "</strong>", "bold text");
      case "italic": return apply("<em>", "</em>", "italic text");
      case "h3": return apply("<h3>", "</h3>", "Subheading");
      case "ul": return applyList("ul");
      case "ol": return applyList("ol");
      case "quote": return apply("<blockquote>", "</blockquote>", "Quote");
      case "link": return applyLink();
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className={LABEL}>{label}</label>
        <div className="flex items-center bg-gray-900 border border-gray-800 rounded-lg p-0.5 text-[11px]" role="tablist" aria-label={`${label} mode`}>
          {(["write", "preview"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`px-2.5 py-1 rounded-md capitalize ${mode === m ? "bg-[#7c3aed] text-white" : "text-gray-400 hover:text-white"}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {mode === "write" ? (
        <div className="border border-gray-800 rounded-xl overflow-hidden focus-within:border-[#a855f7]">
          <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-900 border-b border-gray-800 relative">
            {TOOLS.map(({ icon: Icon, label: toolLabel, action }) => (
              <button
                key={action}
                type="button"
                onClick={() => runTool(action)}
                title={toolLabel}
                aria-label={toolLabel}
                className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10"
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowImages((v) => !v)}
              title="Insert uploaded image"
              aria-label="Insert uploaded image"
              aria-expanded={showImages}
              className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10"
            >
              <ImagePlus className="w-3.5 h-3.5" />
            </button>
            {showImages && (
              <div className="absolute left-2 top-full mt-1 z-20 w-72 p-2 rounded-xl bg-[#0B0F17] border border-gray-800 shadow-2xl">
                {galleryImages.length === 0 ? (
                  <p className="text-[11px] text-gray-500 p-2">Upload images in the &quot;Content Images&quot; panel first.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-1.5">
                    {galleryImages.map((src) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => insertImage(src)}
                        className="aspect-square rounded-lg overflow-hidden border border-gray-800 hover:border-[#a855f7]"
                        aria-label="Insert this image"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <textarea
            id={id}
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={minRows}
            className="w-full bg-[#050505] px-3 py-2.5 text-xs text-gray-200 font-mono placeholder-gray-600 focus:outline-none resize-y"
          />
        </div>
      ) : (
        <div
          className="min-h-32 p-4 bg-[#050505] border border-gray-800 rounded-xl text-sm text-gray-300 leading-relaxed space-y-3 [&_strong]:text-white [&_h3]:text-white [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-[#a855f7] [&_a]:underline [&_blockquote]:italic [&_blockquote]:border-l-2 [&_blockquote]:border-[#7c3aed] [&_blockquote]:pl-3 [&_img]:rounded-lg [&_img]:max-w-full"
          // Sanitized with the same rules as the public site (content may come from another admin)
          dangerouslySetInnerHTML={{ __html: value ? sanitizeArticleHtml(value) : "<p>Nothing to preview yet.</p>" }}
        />
      )}
    </div>
  );
}

// ─────────────────────────── Lists ───────────────────────────

function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/** Editable list of short strings (e.g. Key Challenges, Technologies). */
export function StringListField({
  label, items, onChange, placeholder, addLabel = "Add item", maxLength = 200, hint,
}: {
  label: string; items: string[]; onChange: (v: string[]) => void; placeholder?: string; addLabel?: string; maxLength?: number; hint?: string;
}) {
  const [draft, setDraft] = useState("");
  const inputId = useId();

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    if (!items.some((i) => i.toLowerCase() === v.toLowerCase())) onChange([...items, v]);
    setDraft("");
  };

  return (
    <div className="space-y-2">
      <FieldLabel htmlFor={inputId} hint={hint}>{label}</FieldLabel>
      {items.length > 0 && (
        <ul className="space-y-1.5">
          {items.map((item, idx) => (
            <li key={`${item}-${idx}`} className="flex items-center gap-1.5">
              <input
                type="text"
                value={item}
                onChange={(e) => onChange(items.map((it, i) => (i === idx ? e.target.value : it)))}
                maxLength={maxLength}
                aria-label={`${label} item ${idx + 1}`}
                className={INPUT}
              />
              <button type="button" onClick={() => onChange(moveItem(items, idx, idx - 1))} disabled={idx === 0} aria-label="Move up" className="p-1.5 text-gray-500 hover:text-white disabled:opacity-30">
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={() => onChange(moveItem(items, idx, idx + 1))} disabled={idx === items.length - 1} aria-label="Move down" className="p-1.5 text-gray-500 hover:text-white disabled:opacity-30">
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={() => onChange(items.filter((_, i) => i !== idx))} aria-label={`Remove ${item || "item"}`} className="p-1.5 text-gray-500 hover:text-red-400">
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center gap-2">
        <input
          id={inputId}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          maxLength={maxLength}
          className={INPUT}
        />
        <button type="button" onClick={add} className="shrink-0 flex items-center gap-1 px-3 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold">
          <Plus className="w-3.5 h-3.5" /> {addLabel}
        </button>
      </div>
    </div>
  );
}

export interface TitleDesc {
  title: string;
  desc: string;
}

/** Editable list of title + description rows (approach steps, highlights, outcomes). */
export function TitleDescListField({
  label, items, onChange, titlePlaceholder = "Title", descPlaceholder = "Description", addLabel = "Add row", numbered = false, hint,
}: {
  label: string; items: TitleDesc[]; onChange: (v: TitleDesc[]) => void; titlePlaceholder?: string; descPlaceholder?: string; addLabel?: string; numbered?: boolean; hint?: string;
}) {
  const update = (idx: number, patch: Partial<TitleDesc>) =>
    onChange(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  return (
    <div className="space-y-2">
      <FieldLabel hint={hint}>{label}</FieldLabel>
      {items.length > 0 && (
        <ol className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-gray-900/60 border border-gray-800">
              {numbered && (
                <span className="mt-2 text-[11px] font-mono font-bold text-[#a855f7] w-6 shrink-0">{String(idx + 1).padStart(2, "0")}</span>
              )}
              <div className="flex-1 space-y-1.5 min-w-0">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => update(idx, { title: e.target.value })}
                  placeholder={titlePlaceholder}
                  maxLength={200}
                  aria-label={`${label} ${idx + 1} title`}
                  className={INPUT}
                />
                <textarea
                  value={item.desc}
                  onChange={(e) => update(idx, { desc: e.target.value })}
                  placeholder={descPlaceholder}
                  rows={2}
                  maxLength={2000}
                  aria-label={`${label} ${idx + 1} description`}
                  className={`${INPUT} resize-y`}
                />
              </div>
              <div className="flex flex-col">
                <button type="button" onClick={() => onChange(moveItem(items, idx, idx - 1))} disabled={idx === 0} aria-label="Move up" className="p-1.5 text-gray-500 hover:text-white disabled:opacity-30">
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => onChange(moveItem(items, idx, idx + 1))} disabled={idx === items.length - 1} aria-label="Move down" className="p-1.5 text-gray-500 hover:text-white disabled:opacity-30">
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => onChange(items.filter((_, i) => i !== idx))} aria-label="Remove row" className="p-1.5 text-gray-500 hover:text-red-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
      <button
        type="button"
        onClick={() => onChange([...items, { title: "", desc: "" }])}
        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold"
      >
        <Plus className="w-3.5 h-3.5" /> {addLabel}
      </button>
    </div>
  );
}

// ─────────────────────────── Images ───────────────────────────

/** Single image: upload, paste URL, preview, remove. */
export function ImageField({
  label, value, onChange, hint, previewClassName = "h-36", uploadOptions,
}: {
  label: string; value: string; onChange: (v: string) => void; hint?: string; previewClassName?: string; uploadOptions?: UploadOptions;
}) {
  const fileId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      onChange(await uploadImageFile(file, uploadOptions));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <FieldLabel hint={hint}>{label}</FieldLabel>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-800 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className={`w-full ${previewClassName} object-cover`} />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-red-600 text-white text-[11px] opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-800 rounded-xl p-5 text-center space-y-2 hover:border-[#a855f7]/50 transition-colors">
          <Upload className="w-5 h-5 text-gray-500 mx-auto" aria-hidden="true" />
          <input id={fileId} type="file" accept={ACCEPTED_IMAGE_TYPES} onChange={handleFile} className="sr-only" />
          <label htmlFor={fileId} className="inline-block px-3 py-1.5 rounded-lg bg-gray-900 text-xs font-semibold text-[#a855f7] cursor-pointer hover:bg-gray-800">
            {uploading ? "Uploading..." : "Browse File"}
          </label>
        </div>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL"
        aria-label={`${label} URL`}
        className={INPUT}
      />
      {error && <p className="text-[11px] text-red-400" role="alert">{error}</p>}
    </div>
  );
}

/** Multiple images used inside the content (and shown as a gallery). */
export function GalleryField({
  label, images, onChange, hint = "Shown as a gallery after The Solution, and insertable via the image button in any content editor", uploadOptions,
}: {
  label: string; images: string[]; onChange: (v: string[]) => void; hint?: string; uploadOptions?: UploadOptions;
}) {
  const fileId = useId();
  const [uploading, setUploading] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    setErrors([]);
    setUploading(files.length);
    const urls: string[] = [];
    const errs: string[] = [];
    for (const file of files) {
      try {
        urls.push(await uploadImageFile(file, uploadOptions));
      } catch (err) {
        errs.push(err instanceof Error ? err.message : `${file.name}: upload failed`);
      }
      setUploading((n) => n - 1);
    }
    if (urls.length) onChange([...images, ...urls]);
    setErrors(errs);
  };

  const copy = async (src: string) => {
    try {
      await navigator.clipboard.writeText(`<img src="${src}" alt="" />`);
      setCopied(src);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard blocked; ignore */
    }
  };

  return (
    <div className="space-y-3">
      <FieldLabel hint={hint}>
        {label}
      </FieldLabel>

      {images.length > 0 && (
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {images.map((src, idx) => (
            <li key={`${src}-${idx}`} className="relative rounded-xl overflow-hidden border border-gray-800 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-24 object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 p-1 bg-black/70 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                <button type="button" onClick={() => onChange(moveItem(images, idx, idx - 1))} disabled={idx === 0} aria-label="Move left" className="p-1 text-gray-300 hover:text-white disabled:opacity-30">
                  <ArrowUp className="w-3 h-3 -rotate-90" />
                </button>
                <button type="button" onClick={() => copy(src)} className="px-1.5 py-0.5 rounded text-[10px] text-gray-200 hover:text-white">
                  {copied === src ? "Copied" : "Copy tag"}
                </button>
                <button type="button" onClick={() => onChange(moveItem(images, idx, idx + 1))} disabled={idx === images.length - 1} aria-label="Move right" className="p-1 text-gray-300 hover:text-white disabled:opacity-30">
                  <ArrowDown className="w-3 h-3 -rotate-90" />
                </button>
                <button type="button" onClick={() => onChange(images.filter((_, i) => i !== idx))} aria-label="Remove image" className="p-1 text-red-400 hover:text-red-300">
                  <X className="w-3 h-3" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="border-2 border-dashed border-gray-800 rounded-xl p-4 text-center hover:border-[#a855f7]/50 transition-colors">
        <input id={fileId} type="file" accept={ACCEPTED_IMAGE_TYPES} multiple onChange={handleFiles} className="sr-only" />
        <label htmlFor={fileId} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900 text-xs font-semibold text-[#a855f7] cursor-pointer hover:bg-gray-800">
          <Upload className="w-3.5 h-3.5" aria-hidden="true" />
          {uploading > 0 ? `Uploading ${uploading}...` : "Upload images (multiple)"}
        </label>
      </div>
      {errors.map((e) => (
        <p key={e} className="text-[11px] text-red-400" role="alert">{e}</p>
      ))}
    </div>
  );
}
