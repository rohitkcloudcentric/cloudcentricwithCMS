import React, { useState, useEffect, useCallback, useRef } from "react";
import type { GetServerSideProps } from "next";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Bot,
  Headphones,
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  Send,
  CheckCircle2,
  Clock,
  Trash2,
  Upload,
  FileText,
  Download,
  X,
  Eye,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  Building,
  Mail,
  Phone,
  User,
  Plus,
  FileCheck,
} from "lucide-react";
import { extractClientIp } from "@/lib/ip-utils";
import { checkAdminIpAccess } from "@/lib/admin-ip-guard";
import { getAuthenticatedUser } from "@/lib/auth";

interface CustomerRecord {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  purpose: string;
  companyName: string | null;
  additionalInfo: string | null;
  ipAddress: string | null;
  createdAt: string;
}

interface MessageRecord {
  id: string;
  sessionId: string;
  sender: "user" | "bot" | "agent" | "system";
  text: string;
  sources: any;
  isLiveAgent: boolean;
  createdAt: string;
}

interface SessionRecord {
  id: string;
  customerId: string;
  customer: CustomerRecord;
  mode: "ai" | "live_agent";
  status: "active" | "transferred" | "closed";
  agentName: string | null;
  initialMessage: string | null;
  messages: MessageRecord[];
  createdAt: string;
  updatedAt: string;
}

interface KnowledgeDocRecord {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  pageCount: number;
  isActive: boolean;
  createdAt: string;
  _count?: {
    chunks: number;
  };
}

interface PageProps {
  accessDenied: boolean;
  clientIp: string;
}

export default function ChatInquiriesAdmin({ accessDenied, clientIp }: PageProps) {
  // Tabs: "sessions" | "knowledge"
  const [activeTab, setActiveTab] = useState<"sessions" | "knowledge">("sessions");

  // Sessions list state
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState<"all" | "ai" | "live_agent">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "transferred" | "closed">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalAi: 0,
    totalLive: 0,
    totalActive: 0,
    totalClosed: 0,
  });

  // Selected session for live drawer/modal
  const [selectedSession, setSelectedSession] = useState<SessionRecord | null>(null);
  const [adminReply, setAdminReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Knowledge base state
  const [documents, setDocuments] = useState<KnowledgeDocRecord[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [syncLoading, setSyncLoading] = useState(false);

  // Notification Toast
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 5000);
  };

  // Fetch Sessions
  const fetchSessions = useCallback(async () => {
    setLoadingSessions(true);
    try {
      const q = new URLSearchParams({
        search,
        mode: modeFilter,
        status: statusFilter,
        page: page.toString(),
        limit: "10",
      });
      const res = await fetch(`/api/v1/chat/admin/sessions?${q}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setSessions(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalRecords(data.pagination?.totalRecords || 0);
        if (data.stats) setStats(data.stats);

        // Update selectedSession if currently open
        if (selectedSession) {
          const fresh = (data.data as SessionRecord[]).find((s) => s.id === selectedSession.id);
          if (fresh) setSelectedSession(fresh);
        }
      } else {
        showToast("error", data.error || "Failed to load chat inquiries.");
      }
    } catch {
      showToast("error", "Network error loading chat sessions.");
    } finally {
      setLoadingSessions(false);
    }
  }, [search, modeFilter, statusFilter, page, selectedSession?.id]);

  // Fetch Knowledge Documents
  const fetchDocuments = useCallback(async () => {
    setLoadingDocs(true);
    try {
      const res = await fetch("/api/v1/chat/admin/documents");
      const data = await res.json();
      if (res.ok && data.success) {
        setDocuments(data.data || []);
      } else {
        showToast("error", data.error || "Failed to load documents.");
      }
    } catch {
      showToast("error", "Network error loading knowledge base documents.");
    } finally {
      setLoadingDocs(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [search, modeFilter, statusFilter, page]);

  useEffect(() => {
    if (activeTab === "knowledge") {
      fetchDocuments();
    }
  }, [activeTab, fetchDocuments]);

  // Auto-scroll chat drawer
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedSession?.messages]);

  // Admin Reply Submission
  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession || !adminReply.trim()) return;

    setSendingReply(true);
    try {
      const res = await fetch("/api/v1/chat/admin/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: selectedSession.id,
          message: adminReply.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAdminReply("");
        fetchSessions();
        showToast("success", "Reply sent to customer.");
      } else {
        showToast("error", data.error || "Failed to send live reply.");
      }
    } catch {
      showToast("error", "Network error sending live reply.");
    } finally {
      setSendingReply(false);
    }
  };

  // Close or Update Session Status
  const handleUpdateStatus = async (sessionId: string, newStatus: "active" | "transferred" | "closed") => {
    try {
      const res = await fetch("/api/v1/chat/admin/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchSessions();
        showToast("success", `Session marked as ${newStatus}.`);
      } else {
        showToast("error", data.error || "Failed to update status.");
      }
    } catch {
      showToast("error", "Network error updating status.");
    }
  };

  // Upload New Document
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadFile) {
      setUploadError("Please provide a title and select a PDF file.");
      return;
    }

    setUploadLoading(true);
    setUploadError("");

    try {
      // Read file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const res = await fetch("/api/v1/chat/admin/documents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: uploadTitle.trim(),
              fileName: uploadFile.name,
              fileBase64: base64,
            }),
          });

          const data = await res.json();
          if (res.ok && data.success) {
            setIsUploadModalOpen(false);
            setUploadTitle("");
            setUploadFile(null);
            fetchDocuments();
            showToast("success", data.message || "Document uploaded and indexed successfully!");
          } else {
            setUploadError(data.error || "Upload failed.");
          }
        } catch {
          setUploadError("Error processing file upload.");
        } finally {
          setUploadLoading(false);
        }
      };
      reader.readAsDataURL(uploadFile);
    } catch {
      setUploadLoading(false);
      setUploadError("Failed to read local file.");
    }
  };

  // Delete Document
  const handleDeleteDoc = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}" from the knowledge base?`)) return;

    try {
      const res = await fetch(`/api/v1/chat/admin/documents/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchDocuments();
        showToast("success", data.message || "Document removed.");
      } else {
        showToast("error", data.error || "Failed to delete document.");
      }
    } catch {
      showToast("error", "Network error deleting document.");
    }
  };

  // Re-seed / Sync Default Documents
  const handleReseed = async () => {
    setSyncLoading(true);
    try {
      const res = await fetch("/api/v1/chat/admin/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reseed_default" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchDocuments();
        showToast("success", data.message || "Official knowledge documents synced successfully!");
      } else {
        showToast("error", data.error || "Failed to sync documents.");
      }
    } catch {
      showToast("error", "Error syncing default documents.");
    } finally {
      setSyncLoading(false);
    }
  };

  if (accessDenied) {
    return (
      <AdminLayout title="Access Denied">
        <div className="p-8 text-center text-red-400">
          Access Denied: Your IP address ({clientIp}) is not authorized.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Chat Inquiries & Live Agent">
      <div className="space-y-6">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in border ${
              toast.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-manrope flex items-center gap-2.5">
              <Bot className="w-7 h-7 text-[#7C3AED]" />
              <span>AI Chatbot & Live Agent Inquiries</span>
            </h1>
            <p className="text-xs text-[#A1A1AA] font-intel mt-1">
              View customer inquiries, respond as a live human agent, and manage company knowledge base PDF documents.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0E0E14] border border-white/10 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("sessions")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "sessions"
                  ? "bg-gradient-to-r from-[#7C3AED] to-[#6366F1] text-white shadow-md"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Customer Inquiries ({stats.totalSessions})</span>
            </button>
            <button
              onClick={() => setActiveTab("knowledge")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "knowledge"
                  ? "bg-gradient-to-r from-[#7C3AED] to-[#6366F1] text-white shadow-md"
                  : "text-[#A1A1AA] hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Knowledge Base PDFs</span>
            </button>
          </div>
        </div>

        {/* TAB 1: SESSIONS & INQUIRIES */}
        {activeTab === "sessions" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#0E0E14] border border-white/10 space-y-1">
                <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase font-intel">Total Inquiries</span>
                <div className="text-2xl font-bold text-white font-mono">{stats.totalSessions}</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0E0E14] border border-purple-500/20 space-y-1">
                <span className="text-[11px] font-semibold text-purple-400 uppercase font-intel flex items-center gap-1">
                  <Bot className="w-3 h-3" /> AI Handled
                </span>
                <div className="text-2xl font-bold text-purple-300 font-mono">{stats.totalAi}</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0E0E14] border border-emerald-500/20 space-y-1">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase font-intel flex items-center gap-1">
                  <Headphones className="w-3 h-3" /> Live Agent Requests
                </span>
                <div className="text-2xl font-bold text-emerald-300 font-mono">{stats.totalLive}</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0E0E14] border border-blue-500/20 space-y-1">
                <span className="text-[11px] font-semibold text-blue-400 uppercase font-intel flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Active Today
                </span>
                <div className="text-2xl font-bold text-blue-300 font-mono">{stats.totalActive}</div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-[#0E0E14] border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by customer name, email, phone, purpose..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-[#14141E] border border-white/10 rounded-xl text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Mode Filter */}
                <select
                  value={modeFilter}
                  onChange={(e) => {
                    setModeFilter(e.target.value as any);
                    setPage(1);
                  }}
                  className="px-3 py-2 bg-[#14141E] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#7C3AED] cursor-pointer"
                >
                  <option value="all">All Modes (AI & Live)</option>
                  <option value="ai">AI Bot Only</option>
                  <option value="live_agent">Live Agent Only</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as any);
                    setPage(1);
                  }}
                  className="px-3 py-2 bg-[#14141E] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#7C3AED] cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="transferred">Transferred</option>
                  <option value="closed">Closed</option>
                </select>

                <button
                  onClick={fetchSessions}
                  disabled={loadingSessions}
                  title="Refresh inquiries"
                  className="p-2 rounded-xl bg-[#14141E] border border-white/10 text-[#A1A1AA] hover:text-white hover:border-white/20 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingSessions ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* Sessions Table */}
            <div className="bg-[#0E0E14] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#C6C6D1]">
                  <thead className="bg-[#14141E]/80 border-b border-white/10 text-[11px] font-semibold uppercase text-[#A1A1AA] tracking-wider font-intel">
                    <tr>
                      <th className="py-3.5 px-4">Customer Details</th>
                      <th className="py-3.5 px-4">Inquiry Purpose</th>
                      <th className="py-3.5 px-4">Channel Mode</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Date & Time</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {loadingSessions && sessions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-[#71717A]">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#7C3AED]" />
                          <span>Loading customer inquiries...</span>
                        </td>
                      </tr>
                    ) : sessions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-[#71717A]">
                          No customer inquiries found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      sessions.map((s) => (
                        <tr
                          key={s.id}
                          className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                          onClick={() => setSelectedSession(s)}
                        >
                          {/* Customer */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <div className="font-semibold text-white flex items-center gap-1.5 font-manrope">
                                <span>{s.customer.fullName}</span>
                                {s.customer.companyName && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.05] text-[#A1A1AA]">
                                    {s.customer.companyName}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-[#A1A1AA] flex items-center gap-3 font-mono">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" /> {s.customer.email}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" /> {s.customer.contactNumber}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Purpose */}
                          <td className="py-3.5 px-4 max-w-[220px]">
                            <div className="truncate text-white font-medium" title={s.customer.purpose}>
                              {s.customer.purpose}
                            </div>
                            {s.initialMessage && (
                              <div className="text-[10px] text-[#A78BFA] truncate italic" title={s.initialMessage}>
                                Initial: &ldquo;{s.initialMessage}&rdquo;
                              </div>
                            )}
                          </td>

                          {/* Channel Mode */}
                          <td className="py-3.5 px-4">
                            {s.mode === "live_agent" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                                <Headphones className="w-3 h-3" /> Live Agent
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase bg-purple-500/10 border border-purple-500/30 text-purple-400">
                                <Bot className="w-3 h-3" /> AI Chatbot
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                s.status === "closed"
                                  ? "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                                  : s.status === "transferred"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              }`}
                            >
                              {s.status}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-4 text-[#71717A] font-mono text-[11px]">
                            {new Date(s.createdAt).toLocaleString(undefined, {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedSession(s)}
                                className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View & Reply</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-3 bg-[#14141E] border-t border-white/10 flex items-center justify-between text-xs text-[#A1A1AA]">
                  <span>
                    Showing page {page} of {totalPages} ({totalRecords} records)
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: KNOWLEDGE BASE DOCUMENTS */}
        {activeTab === "knowledge" && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="p-4 rounded-2xl bg-[#0E0E14] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white font-manrope">Company Knowledge Base Documents</h3>
                <p className="text-xs text-[#A1A1AA] font-intel">
                  PDF documents parsed and chunked for Retrieval-Augmented Generation (RAG). The chatbot references these documents to formulate factual answers.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReseed}
                  disabled={syncLoading}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#C6C6D1] text-xs font-semibold border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncLoading ? "animate-spin" : ""}`} />
                  <span>Sync / Re-seed Official PDFs</span>
                </button>

                <button
                  onClick={() => {
                    setUploadError("");
                    setIsUploadModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:opacity-95 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload New PDF</span>
                </button>
              </div>
            </div>

            {/* Documents Table */}
            <div className="bg-[#0E0E14] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#C6C6D1]">
                  <thead className="bg-[#14141E]/80 border-b border-white/10 text-[11px] font-semibold uppercase text-[#A1A1AA] tracking-wider font-intel">
                    <tr>
                      <th className="py-3.5 px-4">Document Title</th>
                      <th className="py-3.5 px-4">File Name</th>
                      <th className="py-3.5 px-4">Pages</th>
                      <th className="py-3.5 px-4">Chunks Indexed</th>
                      <th className="py-3.5 px-4">File Size</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {loadingDocs ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-[#71717A]">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#7C3AED]" />
                          <span>Loading knowledge base documents...</span>
                        </td>
                      </tr>
                    ) : documents.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-[#71717A]">
                          No documents currently in knowledge base. Click &ldquo;Sync / Re-seed Official PDFs&rdquo; to load the default company documents.
                        </td>
                      </tr>
                    ) : (
                      documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#7C3AED] shrink-0" />
                            <span>{doc.title}</span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#A1A1AA]">{doc.fileName}</td>
                          <td className="py-3.5 px-4 font-mono">{doc.pageCount}</td>
                          <td className="py-3.5 px-4 font-mono">
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-semibold border border-purple-500/20">
                              {doc._count?.chunks ?? 0} Chunks
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#71717A]">
                            {(doc.fileSize / 1024).toFixed(1)} KB
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                doc.isActive
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                              }`}
                            >
                              {doc.isActive ? "Active RAG" : "Inactive"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {doc.fileUrl && (
                                <a
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-[#C6C6D1] hover:text-white transition-all cursor-pointer"
                                  title="Download PDF"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button
                                onClick={() => handleDeleteDoc(doc.id, doc.title)}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer"
                                title="Remove document"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* LIVE CHAT DRAWER / MODAL */}
        {selectedSession && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end animate-fade-in">
            <div className="w-full max-w-2xl bg-[#0E0E14] border-l border-white/15 h-full flex flex-col shadow-2xl text-white">
              {/* Drawer Header */}
              <div className="p-4 bg-[#14141E] border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white font-manrope">{selectedSession.customer.fullName}</h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        selectedSession.mode === "live_agent"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                      }`}
                    >
                      {selectedSession.mode === "live_agent" ? "Live Agent Mode" : "AI Mode"}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 uppercase font-mono">
                      {selectedSession.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#A1A1AA] flex items-center gap-2 font-mono">
                    <span>{selectedSession.customer.email}</span>
                    <span>•</span>
                    <span>{selectedSession.customer.contactNumber}</span>
                    {selectedSession.customer.companyName && (
                      <>
                        <span>•</span>
                        <span>{selectedSession.customer.companyName}</span>
                      </>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  {selectedSession.status !== "closed" ? (
                    <button
                      onClick={() => handleUpdateStatus(selectedSession.id, "closed")}
                      className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-medium transition-all cursor-pointer"
                    >
                      Close Session
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(selectedSession.id, "active")}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-medium transition-all cursor-pointer"
                    >
                      Re-open Session
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedSession(null)}
                    className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 text-[#A1A1AA] hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Inquiry Details Banner */}
              <div className="px-4 py-2.5 bg-[#181824] border-b border-white/[0.06] flex items-center justify-between text-xs text-[#C6C6D1]">
                <div>
                  <span className="text-[#A1A1AA] font-intel">Inquiry Purpose: </span>
                  <span className="font-semibold text-white">{selectedSession.customer.purpose}</span>
                </div>
                {selectedSession.customer.ipAddress && (
                  <span className="font-mono text-[11px] text-[#71717A]">
                    IP: {selectedSession.customer.ipAddress}
                  </span>
                )}
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-[#0A0A0E]">
                {selectedSession.messages.map((m, mIdx) => {
                  const isUser = m.sender === "user";
                  const isSystem = m.sender === "system";
                  const isAgent = m.sender === "agent";

                  if (isSystem) {
                    return (
                      <div key={m.id || mIdx} className="text-center my-2">
                        <span className="inline-block px-3 py-1 rounded-full bg-white/[0.06] text-[10px] text-[#A1A1AA]">
                          {m.text}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={m.id || mIdx}
                      className={`flex flex-col ${isUser ? "items-start" : "items-end"} space-y-1`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-[#71717A] px-1 font-mono">
                        <span>{isUser ? selectedSession.customer.fullName : isAgent ? "Live Specialist (Admin)" : "CloudCentric AI"}</span>
                        <span>•</span>
                        <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>

                      <div
                        className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed whitespace-pre-line ${
                          isUser
                            ? "bg-[#181824] border border-white/10 text-white rounded-tl-none"
                            : isAgent
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none shadow-md font-medium"
                            : "bg-[#7C3AED]/20 border border-[#7C3AED]/30 text-purple-100 rounded-tr-none"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={chatMessagesEndRef} />
              </div>

              {/* Live Agent Reply Box */}
              <form onSubmit={handleSendAdminReply} className="p-3 bg-[#14141E] border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  placeholder={`Reply live to ${selectedSession.customer.fullName} as a human agent...`}
                  value={adminReply}
                  onChange={(e) => setAdminReply(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-[#0E0E14] border border-white/10 rounded-xl text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-emerald-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={sendingReply || !adminReply.trim()}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* UPLOAD PDF MODAL */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0E0E14] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[#7C3AED]" />
                  <h3 className="text-base font-bold font-manrope">Upload Company PDF Document</h3>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-[#A1A1AA] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {uploadError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#A1A1AA] uppercase font-intel">
                    Document Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CloudCentric Product Architecture Guide"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#14141E] border border-white/10 rounded-xl text-white placeholder-[#71717A] focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#A1A1AA] uppercase font-intel">
                    PDF Document File (.pdf) <span className="text-red-400">*</span>
                  </label>
                  <div className="p-4 border-2 border-dashed border-white/15 hover:border-[#7C3AED]/60 rounded-2xl bg-[#14141E] text-center transition-all cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf"
                      required
                      id="pdf-file-input"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadFile(file);
                          if (!uploadTitle) {
                            setUploadTitle(file.name.replace(/\.pdf$/i, "").replace(/[_-]/g, " "));
                          }
                        }
                      }}
                    />
                    <label htmlFor="pdf-file-input" className="cursor-pointer block space-y-1.5">
                      <FileCheck className="w-8 h-8 text-[#A78BFA] mx-auto" />
                      <div className="text-xs text-white font-medium">
                        {uploadFile ? uploadFile.name : "Click to select or drag a PDF document"}
                      </div>
                      <div className="text-[10px] text-[#71717A]">
                        {uploadFile ? `${(uploadFile.size / 1024).toFixed(1)} KB` : "Max file size: 15MB"}
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploadLoading || !uploadFile}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:opacity-95 text-white font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    {uploadLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Extracting & Indexing...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload & Index</span>
                      </>
                    )}
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

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const clientIp = extractClientIp(context.req);
  const ipCheck = await checkAdminIpAccess(clientIp);

  if (!ipCheck.allowed) {
    context.res.statusCode = 403;
    return {
      props: {
        accessDenied: true,
        clientIp,
      },
    };
  }

  const user = await getAuthenticatedUser(context.req as any);
  if (!user) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      accessDenied: false,
      clientIp,
    },
  };
};
