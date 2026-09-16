import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Search, Edit3, Trash2, Layers, ExternalLink, X } from "lucide-react";

export default function ProductsAdmin() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [badge, setBadge] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [featuresStr, setFeaturesStr] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setTitle(item.title || "");
      setSlug(item.slug || "");
      setBadge(item.badge || "");
      setDescription(item.description || "");
      setLogoUrl(item.logoUrl || "");
      setFeaturesStr(Array.isArray(item.features) ? item.features.join("\n") : "");
      setWebsiteUrl(item.websiteUrl || "");
    } else {
      setEditingItem(null);
      setTitle("");
      setSlug("");
      setBadge("");
      setDescription("");
      setLogoUrl("");
      setFeaturesStr("");
      setWebsiteUrl("");
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
    setSubmitting(true);

    const features = featuresStr
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug,
      badge,
      description,
      logoUrl,
      features,
      websiteUrl,
    };

    try {
      const url = editingItem ? `/api/v1/products/${editingItem.id}` : "/api/v1/products";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        alert(data.error || "Operation failed");
      }
    } catch (e) {
      alert("Error saving product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    if (!confirm(`Delete product "${itemTitle}"?`)) return;

    try {
      const res = await fetch(`/api/v1/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert(data.error || "Failed to delete product");
      }
    } catch (e) {
      alert("Error deleting product");
    }
  };

  return (
    <AdminLayout title="Product Portfolio Manager">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">Manage CloudCentric SaaS platforms and Salesforce products.</p>
          <button
            onClick={() => openModal()}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">Loading products...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((item) => (
              <div key={item.id} className="bg-[#0B0F17] border border-gray-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {item.logoUrl ? (
                      <img src={item.logoUrl} alt="" className="w-10 h-10 object-contain bg-gray-900 rounded-xl p-1" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">
                        {item.title[0]}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-white text-base leading-tight">{item.title}</h4>
                      <p className="text-xs text-purple-400 font-medium">{item.badge || "SaaS Product"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
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
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">{item.description}</p>

                {item.websiteUrl && (
                  <a
                    href={item.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs text-blue-400 hover:underline pt-1"
                  >
                    <span>Visit Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-sm text-gray-500">No products found.</div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0B0F17] border border-gray-800 rounded-2xl p-6 w-full max-w-xl space-y-5">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <h3 className="text-base font-bold text-white">{editingItem ? "Edit Product" : "Add Product"}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300">Product Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300">Slug</label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Badge / Subtitle</label>
                  <input
                    type="text"
                    placeholder="e.g. Field Force Management Software Built on Salesforce"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white"
                  ></textarea>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Features List (1 feature per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Real-Time Location Tracking&#10;Visit Management&#10;Task Assignment"
                    value={featuresStr}
                    onChange={(e) => setFeaturesStr(e.target.value)}
                    className="w-full p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white font-mono"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300">Logo Image URL</label>
                    <input
                      type="text"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className="w-full p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300">External Website URL</label>
                    <input
                      type="text"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="w-full p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-800">
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
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                  >
                    {submitting ? "Saving..." : "Save Product"}
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
