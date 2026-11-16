import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import { useRouter } from "next/router";
import { GalleryField, RichTextField } from "@/components/admin/EditorFields";
import {
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Upload,
} from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  _count?: { articles: number };
}

interface TagItem {
  id: string;
  name: string;
}

export default function BlogEditor() {
  const router = useRouter();
  // Publishing needs the module's publish permission (also enforced by the API)
  const canPublish = useAdminAuth().can("blogs", "publish");
  const { id } = router.query;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [contentImages, setContentImages] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [readTime, setReadTime] = useState("5 MIN READ");
  const [status, setStatus] = useState("DRAFT");
  const [categoryId, setCategoryId] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  const handleAddCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) {
      setCategoryError("Enter a category name");
      return;
    }
    setAddingCategory(true);
    setCategoryError("");
    try {
      const res = await fetch("/api/v1/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.success || (res.status === 409 && data.data)) {
        const cat: CategoryItem = data.data;
        setCategories((prev) => (prev.some((c) => c.id === cat.id) ? prev : [...prev, cat]));
        setCategoryId(cat.id);
        setNewCategoryName("");
        setShowNewCategory(false);
      } else {
        setCategoryError(data.error || "Failed to add category");
      }
    } catch {
      setCategoryError("Failed to add category");
    } finally {
      setAddingCategory(false);
    }
  };
  // ── Tags ──
  const [allTags, setAllTags] = useState<TagItem[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [addingTag, setAddingTag] = useState(false);
  const [tagError, setTagError] = useState("");

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) => (prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]));
  };

  /** Selects an existing tag with this name, or creates it first. */
  const handleAddTag = async () => {
    const name = tagInput.trim().replace(/\s+/g, " ");
    if (!name) {
      setTagError("Enter a tag name");
      return;
    }
    const match = allTags.find((t) => t.name.toLowerCase() === name.toLowerCase());
    if (match) {
      setSelectedTagIds((prev) => (prev.includes(match.id) ? prev : [...prev, match.id]));
      setTagInput("");
      setTagError("");
      return;
    }

    setAddingTag(true);
    setTagError("");
    try {
      const res = await fetch("/api/v1/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.success || (res.status === 409 && data.data)) {
        const tag: TagItem = { id: data.data.id, name: data.data.name };
        setAllTags((prev) =>
          (prev.some((t) => t.id === tag.id) ? prev : [...prev, tag]).sort((a, b) => a.name.localeCompare(b.name))
        );
        setSelectedTagIds((prev) => (prev.includes(tag.id) ? prev : [...prev, tag.id]));
        setTagInput("");
      } else {
        setTagError(data.error || "Failed to add tag");
      }
    } catch {
      setTagError("Failed to add tag");
    } finally {
      setAddingTag(false);
    }
  };

  // ── Manage (edit / delete) categories ──
  const [showManageCategories, setShowManageCategories] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [confirmDeleteCategoryId, setConfirmDeleteCategoryId] = useState<string | null>(null);
  const [busyCategoryId, setBusyCategoryId] = useState<string | null>(null);
  const [manageCategoryError, setManageCategoryError] = useState("");

  const startEditCategory = (cat: CategoryItem) => {
    setEditingCategoryId(cat.id);
    setEditCategoryName(cat.name);
    setConfirmDeleteCategoryId(null);
    setManageCategoryError("");
  };

  const handleRenameCategory = async (catId: string) => {
    const name = editCategoryName.trim();
    if (!name) {
      setManageCategoryError("Enter a category name");
      return;
    }
    setBusyCategoryId(catId);
    setManageCategoryError("");
    try {
      const res = await fetch(`/api/v1/categories/${catId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) =>
          prev
            .map((c) => (c.id === catId ? { ...c, name: data.data.name } : c))
            .sort((a, b) => a.name.localeCompare(b.name))
        );
        setEditingCategoryId(null);
        setEditCategoryName("");
      } else {
        setManageCategoryError(data.error || "Failed to rename category");
      }
    } catch {
      setManageCategoryError("Failed to rename category");
    } finally {
      setBusyCategoryId(null);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    setBusyCategoryId(catId);
    setManageCategoryError("");
    try {
      const res = await fetch(`/api/v1/categories/${catId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => prev.filter((c) => c.id !== catId));
        if (categoryId === catId) setCategoryId("");
        setConfirmDeleteCategoryId(null);
      } else {
        setManageCategoryError(data.error || "Failed to delete category");
      }
    } catch {
      setManageCategoryError("Failed to delete category");
    } finally {
      setBusyCategoryId(null);
    }
  };

  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    // Fetch categories
    fetch("/api/v1/categories")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.data)) {
          setCategories(data.data);
        }
      })
      .catch(() => {});

    // Fetch tags
    fetch("/api/v1/tags")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.data)) {
          setAllTags(data.data.map((t: TagItem) => ({ id: t.id, name: t.name })));
        }
      })
      .catch(() => {});

    if (id) {
      fetch(`/api/v1/articles/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (isMounted && data.success && data.data) {
            const art = data.data;
            setTitle(art.title || "");
            setSlug(art.slug || "");
            setExcerpt(art.excerpt || "");
            setContentHtml(art.contentHtml || "");
          setContentImages(
            Array.from(
              new Set(Array.from((art.contentHtml || "").matchAll(/<img[^>]+src=["']([^"']+)["']/gi), (m) => (m as RegExpMatchArray)[1]))
            )
          );
            setFeaturedImage(art.featuredImage || "");
            setThumbnailImage(art.thumbnailImage || "");
            setReadTime(art.readTime || "5 MIN READ");
            setStatus(art.status || "DRAFT");
            setCategoryId(art.categoryId || "");
            setSelectedTagIds(
              Array.isArray(art.tags) ? art.tags.map((t: { tagId: string }) => t.tagId) : []
            );
            setSeoTitle(art.seoTitle || "");
            setSeoDescription(art.seoDescription || "");
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!id) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(autoSlug);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setTarget: (url: string) => void = setFeaturedImage
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        const res = await fetch("/api/v1/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileData: base64Data,
          }),
        });

        const data = await res.json();
        if (data.success) {
          setTarget(data.url);
        } else {
          alert(data.error || "Upload failed");
        }
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingImage(false);
      alert("Failed to read image file");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const trimmedTitle = title.trim();
    const trimmedSlug = slug.trim();
    const trimmedExcerpt = excerpt.trim();
    const trimmedContent = contentHtml.trim();

    if (!trimmedTitle) {
      setMessage({ type: "error", text: "Article Title is required." });
      return;
    }
    if (!trimmedSlug) {
      setMessage({ type: "error", text: "URL Slug is required." });
      return;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmedSlug)) {
      setMessage({
        type: "error",
        text: "URL Slug must contain only lowercase letters, numbers, and hyphens (e.g. my-article-slug).",
      });
      return;
    }
    if (!trimmedExcerpt) {
      setMessage({ type: "error", text: "Short Excerpt is required." });
      return;
    }
    if (!trimmedContent) {
      setMessage({ type: "error", text: "Article Body Content cannot be empty." });
      return;
    }

    setSaving(true);

    const payload = {
      title: trimmedTitle,
      slug: trimmedSlug,
      excerpt: trimmedExcerpt,
      contentHtml: trimmedContent,
      featuredImage,
      thumbnailImage,
      readTime,
      status,
      categoryId: categoryId || undefined,
      tagIds: selectedTagIds,
      seoTitle: seoTitle || trimmedTitle,
      seoDescription: seoDescription || trimmedExcerpt,
    };

    try {
      const url = id ? `/api/v1/articles/${id}` : "/api/v1/articles";
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: id ? "Article updated successfully!" : "Article created successfully!" });

        fetch("/api/v1/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: `/blogs/${slug}` }),
        });

        if (!id && data.data?.id) {
          router.push(`/admin/blogs/editor?id=${data.data.id}`);
        }
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save article" });
      }
    } catch {
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Blog Editor">
        <div className="p-12 text-center text-sm font-intel text-gray-400">Loading article editor...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={id ? "Edit Blog Article" : "Create New Blog Article"}>
      <form onSubmit={handleSubmit} className="space-y-8 w-full">
        {/* Top Header Actions */}
        <div className="flex items-center justify-between border-b border-gray-800/80 pb-4 font-intel">
          <button
            type="button"
            onClick={() => router.push("/admin/blogs")}
            className="flex items-center space-x-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Articles</span>
          </button>

          <div className="flex items-center space-x-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-[#0B0F17] border border-gray-800 text-xs font-semibold text-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="DRAFT">Status: Draft</option>
              <option value="PUBLISHED" disabled={!canPublish}>Status: Published{canPublish ? "" : " (no permission)"}</option>
              <option value="ARCHIVED">Status: Archived</option>
            </select>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-linear-to-r from-[#7c3aed] to-[#4f8bff] hover:opacity-90 text-white text-xs font-semibold shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : id ? "Update Article" : "Publish Article"}</span>
            </button>
          </div>
        </div>

        {/* System Notification */}
        {message && (
          <div
            className={`p-4 rounded-xl flex items-center space-x-3 text-sm font-intel ${
              message.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border border-red-500/30 text-red-400"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold font-intel text-gray-300">Article Title</label>
              <input
                type="text"
                required
                placeholder="e.g. How AI Agents Are Changing Enterprise Automation"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0F17] border border-gray-800 rounded-xl text-lg font-bold text-white placeholder-gray-600 focus:outline-none focus:border-[#a855f7] transition-all font-manrope"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold font-intel text-gray-300">URL Slug</label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 bg-gray-900 px-3 py-2.5 rounded-xl border border-gray-800 font-mono">
                  /blogs/
                </span>
                <input
                  type="text"
                  required
                  placeholder="article-url-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0B0F17] border border-gray-800 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-[#a855f7] transition-all font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold font-intel text-gray-300">Short Excerpt</label>
              <textarea
                rows={3}
                placeholder="Brief summary displayed on blog card listing..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0B0F17] border border-gray-800 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#a855f7] transition-all"
              ></textarea>
            </div>

            {/* Rich HTML Content Editor (same component as the case study content editors) */}
            <div className="font-intel">
              <RichTextField
                label="Article Content"
                value={contentHtml}
                onChange={setContentHtml}
                galleryImages={contentImages}
                minRows={14}
                placeholder="<p>Write the article body here...</p>"
              />
            </div>
          </div>

          {/* Sidebar Metadata Settings */}
          <div className="space-y-6">
            {/* Category & Read Time */}
            <div className="bg-[#0B0F17] border border-gray-800/80 rounded-2xl p-5 space-y-4 font-intel">
              <h3 className="text-sm font-bold text-white font-manrope">Publishing Meta</h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-[#a855f7]"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {showNewCategory ? (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCategory();
                          }
                        }}
                        placeholder="New category name"
                        maxLength={60}
                        className="flex-1 min-w-0 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#a855f7]"
                      />
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        disabled={addingCategory}
                        className="px-3 py-2 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-semibold disabled:opacity-60"
                      >
                        {addingCategory ? "Adding..." : "Add"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewCategory(false);
                          setNewCategoryName("");
                          setCategoryError("");
                        }}
                        className="px-3 py-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                    {categoryError && <p className="text-xs text-red-400">{categoryError}</p>}
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowNewCategory(true)}
                      className="text-xs font-semibold text-[#a855f7] hover:text-[#c084fc]"
                    >
                      + Add new category
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowManageCategories((v) => !v);
                        setEditingCategoryId(null);
                        setConfirmDeleteCategoryId(null);
                        setManageCategoryError("");
                      }}
                      aria-expanded={showManageCategories}
                      className="text-xs font-semibold text-gray-400 hover:text-white"
                    >
                      {showManageCategories ? "Done" : "Manage categories"}
                    </button>
                  </div>
                )}

                {showManageCategories && (
                  <div className="mt-2 rounded-xl border border-gray-800 bg-[#050505] divide-y divide-gray-800/80">
                    {categories.length === 0 && (
                      <p className="px-3 py-3 text-xs text-gray-500">No categories yet.</p>
                    )}
                    {categories.map((cat) => {
                      const articleCount = cat._count?.articles ?? 0;
                      const isBusy = busyCategoryId === cat.id;

                      if (editingCategoryId === cat.id) {
                        return (
                          <div key={cat.id} className="flex items-center gap-2 px-3 py-2">
                            <input
                              type="text"
                              value={editCategoryName}
                              onChange={(e) => setEditCategoryName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleRenameCategory(cat.id);
                                }
                                if (e.key === "Escape") setEditingCategoryId(null);
                              }}
                              aria-label={`Rename category ${cat.name}`}
                              maxLength={60}
                              autoFocus
                              className="flex-1 min-w-0 bg-gray-900 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-[#a855f7]"
                            />
                            <button
                              type="button"
                              onClick={() => handleRenameCategory(cat.id)}
                              disabled={isBusy}
                              className="px-2.5 py-1.5 rounded-lg bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-semibold disabled:opacity-60"
                            >
                              {isBusy ? "Saving..." : "Save"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCategoryId(null)}
                              className="px-2.5 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:text-white text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        );
                      }

                      if (confirmDeleteCategoryId === cat.id) {
                        return (
                          <div key={cat.id} className="px-3 py-2 space-y-2">
                            <p className="text-xs text-gray-300">
                              Delete <strong className="text-white">{cat.name}</strong>?
                              {articleCount > 0
                                ? ` ${articleCount} article${articleCount === 1 ? "" : "s"} will become uncategorized.`
                                : " No articles use it."}
                            </p>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(cat.id)}
                                disabled={isBusy}
                                className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold disabled:opacity-60"
                              >
                                {isBusy ? "Deleting..." : "Delete"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteCategoryId(null)}
                                className="px-2.5 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:text-white text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={cat.id} className="flex items-center justify-between gap-2 px-3 py-2">
                          <div className="min-w-0">
                            <p className="text-xs text-gray-200 truncate">{cat.name}</p>
                            <p className="text-[10px] text-gray-500">
                              {articleCount} article{articleCount === 1 ? "" : "s"}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => startEditCategory(cat)}
                              aria-label={`Edit category ${cat.name}`}
                              className="px-2 py-1 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-gray-800"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmDeleteCategoryId(cat.id);
                                setEditingCategoryId(null);
                                setManageCategoryError("");
                              }}
                              aria-label={`Delete category ${cat.name}`}
                              className="px-2 py-1 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {manageCategoryError && (
                      <p className="px-3 py-2 text-xs text-red-400" role="alert">{manageCategoryError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label htmlFor="tag-input" className="text-xs font-semibold text-gray-300">Tags</label>

                {selectedTagIds.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTagIds.map((tagId) => {
                      const tag = allTags.find((t) => t.id === tagId);
                      if (!tag) return null;
                      return (
                        <span
                          key={tagId}
                          className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-lg bg-[#7c3aed]/15 border border-[#a855f7]/30 text-[#c084fc] text-[11px]"
                        >
                          {tag.name}
                          <button
                            type="button"
                            onClick={() => toggleTag(tagId)}
                            aria-label={`Remove tag ${tag.name}`}
                            className="px-1 rounded hover:bg-white/10 hover:text-white"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    id="tag-input"
                    type="text"
                    list="tag-suggestions"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Type a tag and press Enter"
                    maxLength={40}
                    className="flex-1 min-w-0 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#a855f7]"
                  />
                  <datalist id="tag-suggestions">
                    {allTags
                      .filter((t) => !selectedTagIds.includes(t.id))
                      .map((t) => (
                        <option key={t.id} value={t.name} />
                      ))}
                  </datalist>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={addingTag}
                    className="px-3 py-2 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs font-semibold disabled:opacity-60"
                  >
                    {addingTag ? "Adding..." : "Add"}
                  </button>
                </div>
                {tagError && <p className="text-xs text-red-400" role="alert">{tagError}</p>}

                {allTags.some((t) => !selectedTagIds.includes(t.id)) && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {allTags
                      .filter((t) => !selectedTagIds.includes(t.id))
                      .map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => toggleTag(t.id)}
                          className="px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-[#a855f7]/50 text-[11px]"
                        >
                          + {t.name}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Read Time Badge</label>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="5 MIN READ"
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#a855f7]"
                />
              </div>
            </div>

            {/* Content Images: uploads insertable into Article Content via the image button */}
            <div className="bg-[#0B0F17] border border-gray-800/80 rounded-2xl p-5 space-y-4 font-intel">
              <GalleryField
                label="Content Images"
                images={contentImages}
                onChange={setContentImages}
                hint="Insert into Article Content with the image button"
              />
            </div>
            {/* Cover Image Upload */}
            <div className="bg-[#0B0F17] border border-gray-800/80 rounded-2xl p-5 space-y-4 font-intel">
              <h3 className="text-sm font-bold text-white font-manrope">Featured Cover Image</h3>

              {featuredImage ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-800 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={featuredImage} alt="Cover" className="w-full h-36 object-cover" />
                  <button
                    type="button"
                    onClick={() => setFeaturedImage("")}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-800 rounded-xl p-6 text-center space-y-2 hover:border-[#a855f7]/50 transition-colors">
                  <Upload className="w-6 h-6 text-gray-500 mx-auto" />
                  <p className="text-xs text-gray-400">Upload cover image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="cover-upload"
                  />
                  <label
                    htmlFor="cover-upload"
                    className="inline-block px-3 py-1.5 rounded-lg bg-gray-900 text-xs font-semibold text-[#a855f7] cursor-pointer hover:bg-gray-800 transition-colors"
                  >
                    {uploadingImage ? "Uploading..." : "Browse File"}
                  </label>
                </div>
              )}

              <input
                type="text"
                placeholder="Or paste image URL"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#a855f7]"
              />
            </div>

            {/* Thumbnail Image Upload */}
            <div className="bg-[#0B0F17] border border-gray-800/80 rounded-2xl p-5 space-y-4 font-intel">
              <div>
                <h3 className="text-sm font-bold text-white font-manrope">Thumbnail Image</h3>
                <p className="text-[11px] text-gray-500 mt-1">
                  Shown on blog cards. Falls back to the cover image if empty.
                </p>
              </div>

              {thumbnailImage ? (
                <div className="relative w-40 rounded-xl overflow-hidden border border-gray-800 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbnailImage} alt="Thumbnail" className="w-40 h-28 object-cover" />
                  <button
                    type="button"
                    onClick={() => setThumbnailImage("")}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 text-white text-xs opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-800 rounded-xl p-6 text-center space-y-2 hover:border-[#a855f7]/50 transition-colors">
                  <Upload className="w-6 h-6 text-gray-500 mx-auto" />
                  <p className="text-xs text-gray-400">Upload thumbnail</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setThumbnailImage)}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="inline-block px-3 py-1.5 rounded-lg bg-gray-900 text-xs font-semibold text-[#a855f7] cursor-pointer hover:bg-gray-800 transition-colors"
                  >
                    {uploadingImage ? "Uploading..." : "Browse File"}
                  </label>
                </div>
              )}

              <input
                type="text"
                placeholder="Or paste thumbnail URL"
                value={thumbnailImage}
                onChange={(e) => setThumbnailImage(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#a855f7]"
              />
            </div>

            {/* SEO Settings */}
            <div className="bg-[#0B0F17] border border-gray-800/80 rounded-2xl p-5 space-y-4 font-intel">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2 font-manrope">
                <Sparkles className="w-4 h-4 text-[#a855f7]" />
                <span>SEO Controls</span>
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">SEO Meta Title</label>
                <input
                  type="text"
                  placeholder="Custom search title tag"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#a855f7]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">SEO Meta Description</label>
                <textarea
                  rows={3}
                  placeholder="Search engine snippet description..."
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#a855f7]"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
