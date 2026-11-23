import React, { useState, useEffect, useCallback } from "react";
import type { GetServerSideProps } from "next";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import {
  Globe,
  ShieldCheck,
  ShieldAlert,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  History,
  Info,
} from "lucide-react";
import { ACCESS_DENIED_MESSAGE } from "@/lib/ip-constants";
import { extractClientIp } from "@/lib/ip-utils";
import { checkAdminIpAccess } from "@/lib/admin-ip-guard";
import { getAuthenticatedUser } from "@/lib/auth";
import { hasFullAccess } from "@/lib/rbac";
import { getPublicIp } from "@/lib/public-ip-client";

interface IpRecord {
  id: string;
  ipAddress: string;
  status: "allowed" | "blocked";
  description: string | null;
  createdById: string | null;
  createdBy: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface IpStats {
  totalIps: number;
  totalAllowed: number;
  totalBlocked: number;
  currentClientIp: string;
}

interface AuditLogRow {
  id: string;
  action: string;
  module: string;
  details: {
    ipAddress?: string;
    previousStatus?: string | null;
    newStatus?: string | null;
    description?: string | null;
  } | null;
  ipAddress: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
}

interface PageProps {
  accessDenied: boolean;
  notSuperAdmin: boolean;
  clientIp: string;
}

export default function IpManagementAdmin({ accessDenied, notSuperAdmin, clientIp }: PageProps) {
  const { user } = useAdminAuth();

  // Tab: "records" | "audit"
  const [activeTab, setActiveTab] = useState<"records" | "audit">("records");

  // State for IP list
  const [records, setRecords] = useState<IpRecord[]>([]);
  const [stats, setStats] = useState<IpStats>({
    totalIps: 0,
    totalAllowed: 0,
    totalBlocked: 0,
    currentClientIp: clientIp || "127.0.0.1",
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "allowed" | "blocked">("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "ipAddress">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Notifications
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Add Form state
  const [newIp, setNewIp] = useState("");
  const [newStatus, setNewStatus] = useState<"allowed" | "blocked">("allowed");
  const [newDescription, setNewDescription] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  // Edit Form state
  const [selectedRecord, setSelectedRecord] = useState<IpRecord | null>(null);
  const [editStatus, setEditStatus] = useState<"allowed" | "blocked">("allowed");
  const [editDescription, setEditDescription] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete state
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Toggle status loading per record
  const [busyActionId, setBusyActionId] = useState<string | null>(null);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<AuditLogRow[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditPage, setAuditPage] = useState(1);
  const [auditTotalPages, setAuditTotalPages] = useState(1);
  const [auditTotalRecords, setAuditTotalRecords] = useState(0);

  const showNotification = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 6000);
  };

  // Fetch IP addresses
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search,
        status: statusFilter,
        sortBy,
        sortOrder,
        page: page.toString(),
        limit: "10",
      });

      const res = await fetch(`/api/v1/admin/ip-addresses?${queryParams}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setRecords(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalRecords(data.pagination?.totalRecords || 0);
        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        showNotification("error", data.error || "Failed to load IP address records.");
      }
    } catch {
      showNotification("error", "Network error while loading IP addresses.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sortBy, sortOrder, page]);

  // Fetch Audit Logs
  const fetchAuditLogs = useCallback(async () => {
    setAuditLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/ip-addresses/audit-logs?page=${auditPage}&limit=15`);
      const data = await res.json();
      if (res.ok && data.success) {
        setAuditLogs(data.data || []);
        setAuditTotalPages(data.pagination?.totalPages || 1);
        setAuditTotalRecords(data.pagination?.totalRecords || 0);
      }
    } catch {
      showNotification("error", "Failed to load IP management audit logs.");
    } finally {
      setAuditLoading(false);
    }
  }, [auditPage]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  useEffect(() => {
    let isMounted = true;
    getPublicIp(3000).then((pubIp) => {
      if (isMounted && pubIp) {
        document.cookie = `admin_client_ip=${encodeURIComponent(pubIp)}; path=/; max-age=86400; SameSite=Lax`;
        setStats((prev) => ({
          ...prev,
          currentClientIp: pubIp,
        }));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (activeTab === "audit") {
      fetchAuditLogs();
    }
  }, [activeTab, fetchAuditLogs]);

  // Handlers for Add IP
  const handleOpenAddModal = () => {
    setNewIp("");
    setNewStatus("allowed");
    setNewDescription("");
    setAddError("");
    setIsAddModalOpen(true);
  };

  const handleUseCurrentIp = () => {
    if (stats.currentClientIp) {
      setNewIp(stats.currentClientIp);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);

    try {
      const res = await fetch("/api/v1/admin/ip-addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ipAddress: newIp.trim(),
          status: newStatus,
          description: newDescription.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showNotification("success", data.message || `IP address ${newIp} added successfully.`);
        setIsAddModalOpen(false);
        fetchRecords();
      } else {
        setAddError(data.error || "Failed to add IP address.");
      }
    } catch {
      setAddError("Network error. Please try again.");
    } finally {
      setAddLoading(false);
    }
  };

  // Handlers for Edit IP
  const handleOpenEditModal = (rec: IpRecord) => {
    setSelectedRecord(rec);
    setEditStatus(rec.status);
    setEditDescription(rec.description || "");
    setEditError("");
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    setEditError("");
    setEditLoading(true);

    try {
      const res = await fetch(`/api/v1/admin/ip-addresses/${selectedRecord.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          description: editDescription.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showNotification("success", data.message || "IP address updated successfully.");
        setIsEditModalOpen(false);
        fetchRecords();
      } else {
        setEditError(data.error || "Failed to update IP address.");
      }
    } catch {
      setEditError("Network error. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

  // Quick Toggle Allow / Block
  const handleToggleStatus = async (rec: IpRecord) => {
    const targetStatus = rec.status === "allowed" ? "blocked" : "allowed";
    setBusyActionId(rec.id);

    try {
      const res = await fetch(`/api/v1/admin/ip-addresses/${rec.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: targetStatus,
          description: rec.description || "",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(
          "success",
          targetStatus === "allowed"
            ? `IP address ${rec.ipAddress} is now Allowed.`
            : `IP address ${rec.ipAddress} is now Blocked.`
        );
        fetchRecords();
      } else {
        showNotification("error", data.error || "Operation failed.");
      }
    } catch {
      showNotification("error", "Network error. Failed to change status.");
    } finally {
      setBusyActionId(null);
    }
  };

  // Handlers for Delete IP
  const handleOpenDeleteModal = (rec: IpRecord) => {
    setSelectedRecord(rec);
    setDeleteError("");
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRecord) return;
    setDeleteError("");
    setDeleteLoading(true);

    try {
      const res = await fetch(`/api/v1/admin/ip-addresses/${selectedRecord.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showNotification("success", data.message || "IP address deleted successfully.");
        setIsDeleteModalOpen(false);
        fetchRecords();
      } else {
        setDeleteError(data.error || "Failed to delete IP address.");
      }
    } catch {
      setDeleteError("Network error. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // If SSR detected not super admin or IP denied
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0e0e12] border border-red-500/30 rounded-2xl p-6 text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
          <h1 className="text-xl font-bold">{ACCESS_DENIED_MESSAGE}</h1>
          <p className="text-xs text-gray-400">Your IP address ({clientIp}) is not authorized.</p>
        </div>
      </div>
    );
  }

  if (notSuperAdmin || (user && !user.fullAccess)) {
    return (
      <AdminLayout title="IP Address Management">
        <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">403 - Forbidden Access</h1>
          <p className="text-sm text-gray-400">
            IP Address Management is strictly restricted to Super Admin accounts. Regular admin users cannot view or modify IP access records.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="IP Address Management">
      <div className="space-y-6">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-medium animate-fade-in ${
              toast.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            <div className="flex items-center space-x-2.5">
              {toast.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-gray-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white font-manrope flex items-center gap-2.5">
              <Globe className="w-6 h-6 text-[#7c3aed]" />
              IP Address Access Control
            </h1>
            <p className="text-xs text-gray-400 mt-1 font-intel">
              Manage authorized IP addresses for the admin panel. Only allowed IP addresses can access login, dashboard, and admin APIs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-linear-to-r from-[#7c3aed] to-[#2563eb] text-white text-xs font-semibold hover:opacity-90 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add IP Address</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0e0e12] border border-white/10 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Total IP Addresses</span>
              <Globe className="w-4 h-4 text-[#7c3aed]" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">{stats.totalIps}</div>
            <div className="text-[11px] text-gray-500">Configured in access list</div>
          </div>

          <div className="bg-[#0e0e12] border border-emerald-500/20 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-emerald-400">
              <span>Allowed IP Addresses</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">{stats.totalAllowed}</div>
            <div className="text-[11px] text-emerald-500/70">Granted admin portal access</div>
          </div>

          <div className="bg-[#0e0e12] border border-red-500/20 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-red-400">
              <span>Blocked IP Addresses</span>
              <ShieldAlert className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-red-400 font-mono">{stats.totalBlocked}</div>
            <div className="text-[11px] text-red-500/70">Explicitly denied access</div>
          </div>

          <div className="bg-[#0e0e12] border border-white/10 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-blue-400">
              <span>Your Current IP</span>
              <Info className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-base font-bold text-white font-mono truncate" title={stats.currentClientIp}>
              {stats.currentClientIp || clientIp}
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Active authorized session
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 gap-6 text-sm">
          <button
            onClick={() => setActiveTab("records")}
            className={`pb-3 font-medium transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "records"
                ? "text-white border-b-2 border-[#7c3aed]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>IP Access Rules</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
              {stats.totalIps}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`pb-3 font-medium transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "audit"
                ? "text-white border-b-2 border-[#7c3aed]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Security Audit Logs</span>
          </button>
        </div>

        {/* ── TAB 1: IP Access Records ── */}
        {activeTab === "records" && (
          <div className="space-y-4">
            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by IP address or description..."
                  className="w-full pl-10 pr-4 py-2 bg-[#14141a] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#7c3aed] transition-all font-sans"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Status Filter */}
                <div className="flex items-center rounded-xl bg-[#14141a] border border-white/10 p-1 text-xs">
                  <button
                    onClick={() => {
                      setStatusFilter("all");
                      setPage(1);
                    }}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      statusFilter === "all" ? "bg-[#7c3aed] text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    All ({stats.totalIps})
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("allowed");
                      setPage(1);
                    }}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      statusFilter === "allowed"
                        ? "bg-emerald-600 text-white"
                        : "text-gray-400 hover:text-emerald-400"
                    }`}
                  >
                    Allowed ({stats.totalAllowed})
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("blocked");
                      setPage(1);
                    }}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      statusFilter === "blocked"
                        ? "bg-red-600 text-white"
                        : "text-gray-400 hover:text-red-400"
                    }`}
                  >
                    Blocked ({stats.totalBlocked})
                  </button>
                </div>

                {/* Sort Toggle */}
                <button
                  onClick={() => {
                    if (sortBy === "createdAt") {
                      setSortBy("ipAddress");
                    } else {
                      setSortBy("createdAt");
                    }
                  }}
                  className="px-3 py-2 bg-[#14141a] border border-white/10 rounded-xl text-xs text-gray-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                  title="Toggle Sort Field"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Sort: {sortBy === "createdAt" ? "Date" : "IP"}</span>
                </button>

                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="px-2.5 py-2 bg-[#14141a] border border-white/10 rounded-xl text-xs text-gray-300 hover:text-white cursor-pointer"
                  title="Toggle Sort Order"
                >
                  {sortOrder === "asc" ? "ASC" : "DESC"}
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-[#0e0e12] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              {loading ? (
                <div className="p-12 text-center text-xs text-gray-400 flex flex-col items-center justify-center space-y-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#7c3aed]" />
                  <span>Loading IP access records...</span>
                </div>
              ) : records.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-300">
                      <thead className="bg-[#14141a] border-b border-white/10 text-[11px] font-semibold text-gray-400 uppercase tracking-wider font-sans">
                        <tr>
                          <th className="px-6 py-4">IP Address</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Description / Reason</th>
                          <th className="px-6 py-4">Created By</th>
                          <th className="px-6 py-4">Created Date</th>
                          <th className="px-6 py-4">Last Updated</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {records.map((rec) => {
                          const isAllowed = rec.status === "allowed";
                          const isInitialIp = rec.ipAddress === "122.176.158.93";
                          const isCurrentClient = rec.ipAddress === stats.currentClientIp;

                          return (
                            <tr key={rec.id} className="hover:bg-white/[0.02] transition-colors">
                              {/* IP Address */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono text-sm font-semibold text-white">
                                    {rec.ipAddress}
                                  </span>
                                  {isInitialIp && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-sans">
                                      Initial
                                    </span>
                                  )}
                                  {isCurrentClient && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-sans">
                                      Your IP
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Status */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                    isAllowed
                                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                      : "bg-red-500/15 text-red-400 border border-red-500/30"
                                  }`}
                                >
                                  {isAllowed ? (
                                    <>
                                      <ShieldCheck className="w-3.5 h-3.5" />
                                      Allowed
                                    </>
                                  ) : (
                                    <>
                                      <ShieldAlert className="w-3.5 h-3.5" />
                                      Blocked
                                    </>
                                  )}
                                </span>
                              </td>

                              {/* Description */}
                              <td className="px-6 py-4 max-w-xs truncate text-gray-300">
                                {rec.description || (
                                  <span className="text-gray-600 italic">No description</span>
                                )}
                              </td>

                              {/* Created By */}
                              <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                                <div>
                                  <div className="font-medium text-white">
                                    {rec.createdBy?.name || "System"}
                                  </div>
                                  {rec.createdBy?.email && (
                                    <div className="text-[11px] text-gray-500">
                                      {rec.createdBy.email}
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Created Date */}
                              <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                                {new Date(rec.createdAt).toLocaleDateString()}
                                <div className="text-[10px] text-gray-500">
                                  {new Date(rec.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </div>
                              </td>

                              {/* Updated Date */}
                              <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                                {new Date(rec.updatedAt).toLocaleDateString()}
                                <div className="text-[10px] text-gray-500">
                                  {new Date(rec.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </div>
                              </td>

                              {/* Action Buttons */}
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  {/* Quick Allow / Block Toggle */}
                                  <button
                                    onClick={() => handleToggleStatus(rec)}
                                    disabled={busyActionId === rec.id}
                                    title={isAllowed ? "Block this IP" : "Allow this IP"}
                                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                      isAllowed
                                        ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                                    } disabled:opacity-50`}
                                  >
                                    {busyActionId === rec.id ? (
                                      <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : isAllowed ? (
                                      <Lock className="w-4 h-4" />
                                    ) : (
                                      <Unlock className="w-4 h-4" />
                                    )}
                                  </button>

                                  {/* Edit */}
                                  <button
                                    onClick={() => handleOpenEditModal(rec)}
                                    title="Edit record"
                                    className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>

                                  {/* Delete */}
                                  <button
                                    onClick={() => handleOpenDeleteModal(rec)}
                                    title="Delete record"
                                    className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Bar */}
                  <div className="px-6 py-4 bg-[#14141a] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
                    <div className="text-gray-400">
                      Showing <span className="font-semibold text-white">{records.length > 0 ? (page - 1) * 10 + 1 : 0}</span> to{" "}
                      <span className="font-semibold text-white">
                        {Math.min(page * 10, totalRecords)}
                      </span>{" "}
                      of <span className="font-semibold text-white">{totalRecords}</span> entries
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="px-3 py-1.5 rounded-lg border border-white/10 bg-[#0e0e12] text-gray-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center space-x-1 cursor-pointer"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>Prev</span>
                        </button>
                        <span className="text-gray-400 font-mono px-2">
                          {page} / {totalPages}
                        </span>
                        <button
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          className="px-3 py-1.5 rounded-lg border border-white/10 bg-[#0e0e12] text-gray-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center space-x-1 cursor-pointer"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-xs text-gray-500 space-y-3">
                  <Globe className="w-8 h-8 mx-auto text-gray-600" />
                  <div>No IP address records found matching the criteria.</div>
                  <button
                    onClick={handleOpenAddModal}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-[#7c3aed] text-white text-xs font-medium cursor-pointer"
                  >
                    Add IP Address
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: Security Audit Logs ── */}
        {activeTab === "audit" && (
          <div className="space-y-4">
            <div className="bg-[#0e0e12] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              {auditLoading ? (
                <div className="p-12 text-center text-xs text-gray-400 flex flex-col items-center justify-center space-y-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#7c3aed]" />
                  <span>Loading IP security audit logs...</span>
                </div>
              ) : auditLogs.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-300 font-mono">
                      <thead className="bg-[#14141a] border-b border-white/10 text-[11px] font-semibold text-gray-400 uppercase tracking-wider font-sans">
                        <tr>
                          <th className="px-6 py-4">Timestamp</th>
                          <th className="px-6 py-4">Action</th>
                          <th className="px-6 py-4">IP Address Target</th>
                          <th className="px-6 py-4">Status Transition</th>
                          <th className="px-6 py-4">Admin User</th>
                          <th className="px-6 py-4">Admin Request IP</th>
                          <th className="px-6 py-4">Description / Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {auditLogs.map((log) => {
                          const action = log.action;
                          const actionBadgeClass =
                            action === "allow"
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              : action === "block"
                              ? "bg-red-500/15 text-red-400 border-red-500/30"
                              : action === "delete"
                              ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                              : "bg-blue-500/15 text-blue-400 border-blue-500/30";

                          return (
                            <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-3.5 whitespace-nowrap text-gray-400">
                                {new Date(log.createdAt).toLocaleString()}
                              </td>
                              <td className="px-6 py-3.5 whitespace-nowrap">
                                <span
                                  className={`px-2 py-0.5 rounded text-[11px] border font-sans font-semibold uppercase ${actionBadgeClass}`}
                                >
                                  {action}
                                </span>
                              </td>
                              <td className="px-6 py-3.5 whitespace-nowrap text-white font-semibold">
                                {log.details?.ipAddress || "-"}
                              </td>
                              <td className="px-6 py-3.5 whitespace-nowrap font-sans text-xs">
                                {log.details?.previousStatus || log.details?.newStatus ? (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-gray-500">{log.details.previousStatus || "none"}</span>
                                    <span className="text-gray-400">→</span>
                                    <span
                                      className={
                                        log.details.newStatus === "allowed"
                                          ? "text-emerald-400 font-semibold"
                                          : log.details.newStatus === "blocked"
                                          ? "text-red-400 font-semibold"
                                          : "text-gray-400"
                                      }
                                    >
                                      {log.details.newStatus || "deleted"}
                                    </span>
                                  </div>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td className="px-6 py-3.5 whitespace-nowrap font-sans text-white">
                                {log.user?.name || "System"}
                              </td>
                              <td className="px-6 py-3.5 whitespace-nowrap text-gray-400">
                                {log.ipAddress || "-"}
                              </td>
                              <td className="px-6 py-3.5 max-w-xs truncate text-gray-400 font-sans">
                                {log.details?.description || "-"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Bar */}
                  <div className="px-6 py-4 bg-[#14141a] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
                    <div className="text-gray-400">
                      Showing <span className="font-semibold text-white">{auditLogs.length > 0 ? (auditPage - 1) * 15 + 1 : 0}</span> to{" "}
                      <span className="font-semibold text-white">{Math.min(auditPage * 15, auditTotalRecords)}</span> of{" "}
                      <span className="font-semibold text-white">{auditTotalRecords}</span> log events
                    </div>

                    {auditTotalPages > 1 && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setAuditPage((p) => Math.max(1, p - 1))}
                          disabled={auditPage === 1}
                          className="px-3 py-1.5 rounded-lg border border-white/10 bg-[#0e0e12] text-gray-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center space-x-1 cursor-pointer"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>Prev</span>
                        </button>
                        <span className="text-gray-400 font-mono px-2">
                          {auditPage} / {auditTotalPages}
                        </span>
                        <button
                          onClick={() => setAuditPage((p) => Math.min(auditTotalPages, p + 1))}
                          disabled={auditPage === auditTotalPages}
                          className="px-3 py-1.5 rounded-lg border border-white/10 bg-[#0e0e12] text-gray-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center space-x-1 cursor-pointer"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-xs text-gray-500">
                  No IP management audit logs recorded yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MODAL: Add New IP Address ── */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0e0e12] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#7c3aed]/15 border border-[#7c3aed]/30 flex items-center justify-center text-[#a855f7]">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white font-manrope">Add IP Address</h2>
                    <p className="text-[11px] text-gray-400">Authorize or block an IP address</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {addError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{addError}</span>
                </div>
              )}

              <form onSubmit={handleAddSubmit} className="space-y-4">
                {/* IP Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-gray-300 font-intel">
                      IP Address (IPv4 / IPv6) *
                    </label>
                    <button
                      type="button"
                      onClick={handleUseCurrentIp}
                      className="text-[11px] text-[#a855f7] hover:underline cursor-pointer"
                    >
                      Use My IP ({stats.currentClientIp})
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                    placeholder="e.g. 122.176.158.93 or 2001:db8::1"
                    className="w-full px-4 py-2.5 bg-[#14141a] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#7c3aed] font-mono"
                  />
                </div>

                {/* Status Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 font-intel">
                    Access Status *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                        newStatus === "allowed"
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                          : "bg-[#14141a] border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="newStatus"
                        value="allowed"
                        checked={newStatus === "allowed"}
                        onChange={() => setNewStatus("allowed")}
                        className="sr-only"
                      />
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-xs font-semibold">Allowed</span>
                    </label>

                    <label
                      className={`flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                        newStatus === "blocked"
                          ? "bg-red-500/10 border-red-500/40 text-red-400"
                          : "bg-[#14141a] border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="newStatus"
                        value="blocked"
                        checked={newStatus === "blocked"}
                        onChange={() => setNewStatus("blocked")}
                        className="sr-only"
                      />
                      <ShieldAlert className="w-4 h-4" />
                      <span className="text-xs font-semibold">Blocked</span>
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 font-intel">
                    Description / Reason
                  </label>
                  <textarea
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="e.g. Office VPN, Headquarters static IP, Developer home IP..."
                    className="w-full px-4 py-2.5 bg-[#14141a] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#7c3aed] font-sans"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-xs text-gray-300 hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addLoading}
                    className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#7c3aed] to-[#2563eb] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 flex items-center space-x-2 cursor-pointer"
                  >
                    {addLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save IP Address</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── MODAL: Edit IP Address ── */}
        {isEditModalOpen && selectedRecord && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0e0e12] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Edit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white font-manrope">Edit IP Address</h2>
                    <p className="text-[11px] font-mono text-gray-400">{selectedRecord.ipAddress}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {editError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="space-y-4">
                {/* IP Display */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 font-intel">IP Address</label>
                  <input
                    type="text"
                    disabled
                    value={selectedRecord.ipAddress}
                    className="w-full px-4 py-2.5 bg-[#14141a]/60 border border-white/5 rounded-xl text-xs text-gray-400 font-mono cursor-not-allowed"
                  />
                </div>

                {/* Status Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 font-intel">
                    Access Status *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                        editStatus === "allowed"
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                          : "bg-[#14141a] border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="editStatus"
                        value="allowed"
                        checked={editStatus === "allowed"}
                        onChange={() => setEditStatus("allowed")}
                        className="sr-only"
                      />
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-xs font-semibold">Allowed</span>
                    </label>

                    <label
                      className={`flex items-center space-x-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                        editStatus === "blocked"
                          ? "bg-red-500/10 border-red-500/40 text-red-400"
                          : "bg-[#14141a] border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="editStatus"
                        value="blocked"
                        checked={editStatus === "blocked"}
                        onChange={() => setEditStatus("blocked")}
                        className="sr-only"
                      />
                      <ShieldAlert className="w-4 h-4" />
                      <span className="text-xs font-semibold">Blocked</span>
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 font-intel">
                    Description / Reason
                  </label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Update reason or description..."
                    className="w-full px-4 py-2.5 bg-[#14141a] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#7c3aed] font-sans"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-xs text-gray-300 hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#7c3aed] to-[#2563eb] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 flex items-center space-x-2 cursor-pointer"
                  >
                    {editLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── MODAL: Delete Confirmation ── */}
        {isDeleteModalOpen && selectedRecord && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0e0e12] border border-red-500/30 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl relative text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
                <Trash2 className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold text-white font-manrope">Delete IP Address Record?</h2>
                <p className="text-xs text-gray-400 font-intel leading-relaxed">
                  Are you sure you want to permanently delete record for{" "}
                  <span className="font-mono text-white font-bold">{selectedRecord.ipAddress}</span>?
                  {selectedRecord.status === "allowed" && (
                    <span className="block text-amber-400 mt-1">
                      Warning: Removing an authorized IP will prevent connections from this address.
                    </span>
                  )}
                </p>
              </div>

              {deleteError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-left flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{deleteError}</span>
                </div>
              )}

              <div className="flex justify-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-xs text-gray-300 hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold disabled:opacity-50 flex items-center space-x-2 cursor-pointer"
                >
                  {deleteLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Delete Record</span>
                </button>
              </div>
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
        notSuperAdmin: false,
        clientIp,
      },
    };
  }

  const user = await getAuthenticatedUser(context.req as any);
  if (!user || !hasFullAccess(user)) {
    context.res.statusCode = 403;
    return {
      props: {
        accessDenied: false,
        notSuperAdmin: true,
        clientIp,
      },
    };
  }

  return {
    props: {
      accessDenied: false,
      notSuperAdmin: false,
      clientIp,
    },
  };
};
