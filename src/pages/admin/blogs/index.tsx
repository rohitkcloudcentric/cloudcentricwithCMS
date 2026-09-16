import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  FileText,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";

interface BlogArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  status: string;
  createdAt: string;
  category?: { name: string } | null;
  author?: { name: string } | null;
}

export default function BlogAdminIndex() {
  const [articles, setArticles] = useState<BlogArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let url = `/api/v1/articles?limit=50`;
    if (statusFilter !== "ALL") url += `&status=${statusFilter}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success) {
          setArticles(data.data || []);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [statusFilter, search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let url = `/api/v1/articles?limit=50`;
    if (statusFilter !== "ALL") url += `&status=${statusFilter}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setArticles(data.data || []);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/v1/articles/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      } else {
        alert(data.error || "Failed to delete article");
      }
    } catch {
      alert("Error deleting article");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout title="Blog Article Manager">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-intel">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#0e0e12] border border-white/10 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a855f7] transition-all"
            />
          </form>

          <div className="flex items-center space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0e0e12] border border-white/10 text-xs text-gray-300 rounded-2xl px-3.5 py-2.5 focus:outline-none focus:border-[#a855f7]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Drafts</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            <Link
              href="/admin/blogs/editor"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-linear-to-r from-[#7c3aed] to-[#4f8bff] hover:opacity-90 text-white text-xs font-bold shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Article</span>
            </Link>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-[#0e0e12] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-xs font-intel text-gray-500">Loading articles...</div>
          ) : articles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#14141a] border-b border-white/10 text-[11px] font-intel font-semibold text-[#a1a1aa] uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Article</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Author</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3.5 max-w-md">
                          {article.featuredImage ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={article.featuredImage}
                              alt={article.title}
                              className="w-10 h-10 rounded-xl object-cover bg-gray-800 shrink-0 border border-white/10"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-white/5 text-gray-500 flex items-center justify-center shrink-0 border border-white/10">
                              <FileText className="w-5 h-5 text-[#a855f7]" />
                            </div>
                          )}
                          <div className="truncate">
                            <p className="font-semibold text-white truncate font-manrope">{article.title}</p>
                            <p className="text-xs text-gray-500 font-intel truncate">/{article.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-xl bg-[#7c3aed]/15 border border-[#a855f7]/30 text-[#a855f7] text-xs font-intel font-medium">
                          {article.category?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-intel font-medium border ${
                            article.status === "PUBLISHED"
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : article.status === "DRAFT"
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                              : "bg-gray-500/10 border-gray-500/30 text-gray-400"
                          }`}
                        >
                          {article.status === "PUBLISHED" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          <span>{article.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-intel text-gray-400">
                        {article.author?.name || "Admin"}
                      </td>
                      <td className="px-6 py-4 text-xs font-intel text-gray-400">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link
                          href={`/blogs/${article.slug}`}
                          target="_blank"
                          title="Preview Live"
                          className="p-2 text-gray-400 hover:text-white inline-block transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-4 h-4 text-[#a855f7]" />
                        </Link>
                        <Link
                          href={`/admin/blogs/editor?id=${article.id}`}
                          title="Edit Article"
                          className="p-2 text-gray-400 hover:text-[#4f8bff] inline-block transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
                          disabled={deletingId === article.id}
                          title="Delete Article"
                          className="p-2 text-gray-400 hover:text-red-400 inline-block transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center space-y-3 font-intel">
              <p className="text-gray-400 text-xs">No articles found matching your criteria.</p>
              <Link
                href="/admin/blogs/editor"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-linear-to-r from-[#7c3aed] to-[#4f8bff] text-white text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create First Article</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
