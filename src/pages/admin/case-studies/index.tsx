import React, { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Edit3, Trash2, X } from "lucide-react";

interface CaseStudyItem {
  id: string;
  title: string;
  slug: string;
  clientName: string;
  industry: string;
  summary: string;
  challenge?: string | null;
  solution?: string | null;
  results?: string | null;
  featuredImage?: string | null;
  status: string;
}

export default function CaseStudiesAdmin() {
  const [caseStudies, setCaseStudies] = useState<CaseStudyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CaseStudyItem | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [clientName, setClientName] = useState("");
  const [industry, setIndustry] = useState("");
  const [summary, setSummary] = useState("");
  const [challenge, setChallenge] = useState("");
  const [solution, setSolution] = useState("");
  const [results, setResults] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchCaseStudies = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/case-studies");
      const data = await res.json();
      if (data.success) {
        setCaseStudies(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/v1/case-studies");
        const data = await res.json();
        if (active && data.success) {
          setCaseStudies(data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const openModal = (item?: CaseStudyItem) => {
    setFormError("");
    if (item) {
      setEditingItem(item);
      setTitle(item.title || "");
      setSlug(item.slug || "");
      setClientName(item.clientName || "");
      setIndustry(item.industry || "");
      setSummary(item.summary || "");
      setChallenge(item.challenge || "");
      setSolution(item.solution || "");
      setResults(item.results || "");
      setFeaturedImage(item.featuredImage || "");
      setStatus(item.status || "DRAFT");
    } else {
      setEditingItem(null);
      setTitle("");
      setSlug("");
      setClientName("");
      setIndustry("");
      setSummary("");
      setChallenge("");
      setSolution("");
      setResults("");
      setFeaturedImage("");
      setStatus("DRAFT");
    }
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingItem) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const trimmedTitle = title.trim();
    const trimmedSlug = slug.trim();
    const trimmedClient = clientName.trim();
    const trimmedIndustry = industry.trim();
    const trimmedSummary = summary.trim();

    if (!trimmedTitle) {
      setFormError("Case Study Title is required.");
      return;
    }
    if (!trimmedSlug) {
      setFormError("URL Slug is required.");
      return;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmedSlug)) {
      setFormError("URL Slug must contain only lowercase letters, numbers, and hyphens.");
      return;
    }
    if (!trimmedClient) {
      setFormError("Client Name is required.");
      return;
    }
    if (!trimmedIndustry) {
      setFormError("Industry is required.");
      return;
    }
    if (!trimmedSummary) {
      setFormError("Summary is required.");
      return;
    }

    setSubmitting(true);

    const payload = {
      title: trimmedTitle,
      slug: trimmedSlug,
      clientName: trimmedClient,
      industry: trimmedIndustry,
      summary: trimmedSummary,
      challenge: challenge.trim(),
      solution: solution.trim(),
      results: results.trim(),
      featuredImage: featuredImage.trim(),
      status,
    };

    try {
      const url = editingItem ? `/api/v1/case-studies/${editingItem.id}` : "/api/v1/case-studies";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchCaseStudies();
      } else {
        setFormError(data.error || "Operation failed. Please check inputs.");
      }
    } catch {
      setFormError("An unexpected server error occurred while saving.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    if (!confirm(`Delete case study "${itemTitle}"?`)) return;

    try {
      const res = await fetch(`/api/v1/case-studies/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCaseStudies(caseStudies.filter((c) => c.id !== id));
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch {
      alert("Error deleting item");
    }
  };

  return (
    <AdminLayout title="Case Studies Manager">
      <div className="space-y-6">
        {/* Header Action */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">Manage client success stories and enterprise transformation impact.</p>
          <button
            onClick={() => openModal()}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Case Study</span>
          </button>
        </div>

        {/* Case Studies Table */}
        <div className="bg-[#0B0F17] border border-gray-800/80 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-sm text-gray-500">Loading case studies...</div>
          ) : caseStudies.length > 0 ? (
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-gray-900/60 border-b border-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Title & Client</th>
                  <th className="px-6 py-4">Industry</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Impact / Results</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {caseStudies.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-900/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="text-xs text-emerald-400 font-medium">{item.clientName}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">{item.industry}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          item.status === "PUBLISHED"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400 max-w-xs truncate">{item.results}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openModal(item)}
                        className="p-1.5 text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-sm text-gray-500">No case studies found.</div>
          )}
        </div>

        {/* Create / Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0B0F17] border border-gray-800 rounded-2xl p-6 w-full max-w-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <h3 className="text-lg font-bold text-white">
                  {editingItem ? "Edit Case Study" : "Add Case Study"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {formError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center space-x-2">
                    <X className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300">Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300">URL Slug</label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300">Client Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ABC PVT LTD"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300">Industry</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MANUFACTURING"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Summary</label>
                  <textarea
                    rows={2}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white"
                  ></textarea>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Challenge</label>
                  <textarea
                    rows={2}
                    value={challenge}
                    onChange={(e) => setChallenge(e.target.value)}
                    className="w-full p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white"
                  ></textarea>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Solution</label>
                  <textarea
                    rows={2}
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    className="w-full p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white"
                  ></textarea>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Results / Impact Summary</label>
                  <input
                    type="text"
                    placeholder="e.g. 64% DEFLECTION, SUB-MINUTE RESOLUTION"
                    value={results}
                    onChange={(e) => setResults(e.target.value)}
                    className="w-full p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300">Featured Image URL</label>
                    <input
                      type="text"
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      className="w-full p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white"
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="PUBLISHED">PUBLISHED</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                  >
                    {submitting ? "Saving..." : "Save Case Study"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
