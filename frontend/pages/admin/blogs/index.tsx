import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function BlogAdminIndex() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      let url = `/api/v1/articles?limit=50`;
      if (statusFilter !== "ALL") url += `&status=${statusFilter}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setArticles(data.data || []);
      }
    } catch (e) {
      console.error("Failed to fetch articles:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/v1/articles/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setArticles(articles.filter((a) => a.id !== id));
      } else {
        alert(data.error || "Failed to delete article");
      }
    } catch (e) {
      alert("Error deleting article");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout title="Blog Article Manager">
      <div className="space-y-6">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles by title or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0B0F17] border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
            />
          </form>

          <div className="flex items-center space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0B0F17] border border-gray-800 text-sm text-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Drafts</option>
              <option value="ARCHIVED">Archived</option>
            </select>

            <Link
              href="/admin/blogs/editor"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Article</span>
            </Link>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-[#0B0F17] border border-gray-800/80 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-sm text-gray-500">Loading articles...</div>
          ) : articles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-gray-900/60 border-b border-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Article</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Author</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3 max-w-md">
                          {article.featuredImage ? (
                            <img
                              src={article.featuredImage}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover bg-gray-800 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-800 text-gray-500 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                          )}
                          <div className="truncate">
                            <p className="font-semibold text-white truncate">{article.title}</p>
                            <p className="text-xs text-gray-500 truncate">/{article.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-md bg-gray-800 text-gray-300 text-xs font-medium">
                          {article.category?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
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
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {article.author?.name || "Admin"}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link
                          href={`/blogs/${article.slug}`}
                          target="_blank"
                          title="Preview Live"
                          className="p-1.5 text-gray-400 hover:text-white inline-block transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/blogs/editor?id=${article.id}`}
                          title="Edit Article"
                          className="p-1.5 text-gray-400 hover:text-blue-400 inline-block transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
                          disabled={deletingId === article.id}
                          title="Delete Article"
                          className="p-1.5 text-gray-400 hover:text-red-400 inline-block transition-colors disabled:opacity-50"
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
            <div className="p-12 text-center space-y-3">
              <p className="text-gray-400 text-sm">No articles found matching your criteria.</p>
              <Link
                href="/admin/blogs/editor"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
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
