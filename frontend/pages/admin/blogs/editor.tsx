import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useRouter } from "next/router";
import {
  Save,
  ArrowLeft,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  Code,
  Sparkles,
  Upload,
} from "lucide-react";

export default function BlogEditor() {
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [readTime, setReadTime] = useState("5 MIN READ");
  const [status, setStatus] = useState("DRAFT");
  const [categoryId, setCategoryId] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    // Fetch categories
    fetch("/api/v1/categories")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setCategories(data.data);
        } else if (isMounted) {
          setCategories([
            { id: "ai-automation", name: "AI & Automation" },
            { id: "digital-transformation", name: "Digital Transformation" },
            { id: "technology", name: "Technology" },
            { id: "salesforce", name: "Salesforce" },
          ]);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCategories([
            { id: "ai-automation", name: "AI & Automation" },
            { id: "digital-transformation", name: "Digital Transformation" },
            { id: "technology", name: "Technology" },
            { id: "salesforce", name: "Salesforce" },
          ]);
        }
      });

    if (id) {
      setLoading(true);
      fetch(`/api/v1/articles/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            const art = data.data;
            setTitle(art.title || "");
            setSlug(art.slug || "");
            setExcerpt(art.excerpt || "");
            setContentHtml(art.contentHtml || "");
            setFeaturedImage(art.featuredImage || "");
            setReadTime(art.readTime || "5 MIN READ");
            setStatus(art.status || "DRAFT");
            setCategoryId(art.categoryId || "");
            setSeoTitle(art.seoTitle || "");
            setSeoDescription(art.seoDescription || "");
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!id) {
      // Auto-generate slug for new articles
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(autoSlug);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
          setFeaturedImage(data.url);
        } else {
          alert(data.error || "Upload failed");
        }
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setUploadingImage(false);
      alert("Failed to read image file");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = {
      title,
      slug,
      excerpt,
      contentHtml,
      featuredImage,
      readTime,
      status,
      categoryId: categoryId || undefined,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
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

        // Trigger ISR revalidation in background
        fetch("/api/v1/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secret: "cloudcentric_revalidate_secret_key", path: `/blogs/${slug}` }),
        });

        if (!id && data.data?.id) {
          router.push(`/admin/blogs/editor?id=${data.data.id}`);
        }
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save article" });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Blog Editor">
        <div className="p-12 text-center text-sm text-gray-400">Loading article editor...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={id ? "Edit Blog Article" : "Create New Blog Article"}>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
        {/* Top Header Actions */}
        <div className="flex items-center justify-between border-b border-gray-800/80 pb-4">
          <button
            type="button"
            onClick={() => router.push("/admin/blogs")}
            className="flex items-center space-x-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
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
              <option value="PUBLISHED">Status: Published</option>
              <option value="ARCHIVED">Status: Archived</option>
            </select>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : id ? "Update Article" : "Publish Article"}</span>
            </button>
          </div>
        </div>

        {/* System Notification */}
        {message && (
          <div
            className={`p-4 rounded-xl flex items-center space-x-3 text-sm ${
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
              <label className="text-xs font-semibold text-gray-300">Article Title</label>
              <input
                type="text"
                required
                placeholder="e.g. How AI Agents Are Changing Enterprise Automation"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0F17] border border-gray-800 rounded-xl text-lg font-bold text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300">URL Slug</label>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 bg-gray-900 px-3 py-2.5 rounded-xl border border-gray-800">
                  /blogs/
                </span>
                <input
                  type="text"
                  required
                  placeholder="article-url-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0B0F17] border border-gray-800 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300">Short Excerpt</label>
              <textarea
                rows={3}
                placeholder="Brief summary displayed on blog card listing..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0B0F17] border border-gray-800 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all"
              ></textarea>
            </div>

            {/* Rich HTML Content Editor with Live Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-300">Article Content (HTML/Markdown)</label>
                <div className="flex bg-gray-900 p-1 rounded-lg border border-gray-800 space-x-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("write")}
                    className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
                      activeTab === "write" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Code className="w-3.5 h-3.5 inline mr-1" />
                    Write HTML
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
                      activeTab === "preview" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 inline mr-1" />
                    Preview Render
                  </button>
                </div>
              </div>

              {activeTab === "write" ? (
                <textarea
                  rows={14}
                  required
                  placeholder="<p>Write article body HTML here...</p><h2>Subheading</h2><p>Detail paragraph...</p>"
                  value={contentHtml}
                  onChange={(e) => setContentHtml(e.target.value)}
                  className="w-full p-4 bg-[#0B0F17] border border-gray-800 rounded-xl font-mono text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all leading-relaxed"
                ></textarea>
              ) : (
                <div className="w-full min-h-[350px] p-6 bg-[#050505] border border-gray-800 rounded-xl text-gray-200 prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: contentHtml || "<p className='text-gray-500 italic'>Nothing to preview yet.</p>" }} />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Metadata Settings */}
          <div className="space-y-6">
            {/* Category & Read Time */}
            <div className="bg-[#0B0F17] border border-gray-800/80 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white">Publishing Meta</h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Read Time Badge</label>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="5 MIN READ"
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="bg-[#0B0F17] border border-gray-800/80 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white">Featured Cover Image</h3>

              {featuredImage ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-800 group">
                  <img src={featuredImage} alt="Cover" className="w-full h-36 object-cover" />
                  <button
                    type="button"
                    onClick={() => setFeaturedImage("")}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-800 rounded-xl p-6 text-center space-y-2 hover:border-blue-500/50 transition-colors">
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
                    className="inline-block px-3 py-1.5 rounded-lg bg-gray-900 text-xs font-semibold text-blue-400 cursor-pointer hover:bg-gray-800 transition-colors"
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
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* SEO Settings */}
            <div className="bg-[#0B0F17] border border-gray-800/80 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>SEO Controls</span>
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">SEO Meta Title</label>
                <input
                  type="text"
                  placeholder="Custom search title tag"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">SEO Meta Description</label>
                <textarea
                  rows={3}
                  placeholder="Search engine snippet description..."
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
