import React, { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import {
  Server,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Send,
  Save,
  RefreshCw,
  Lock,
  Info,
  KeyRound,
  AlertTriangle,
  Trash2,
  Search,
  Filter,
  X,
  FileText,
  Clock,
  ExternalLink,
} from "lucide-react";
import type { EncryptionType, MaskedSmtpConfig } from "@/lib/smtp-config";

const ENCRYPTION_OPTIONS: { value: EncryptionType; label: string; desc: string }[] = [
  { value: "TLS", label: "TLS (STARTTLS)", desc: "Port 587 (Recommended for Microsoft 365, Google Workspace, SendGrid)" },
  { value: "SSL", label: "SSL (Implicit TLS)", desc: "Port 465 (Implicit SSL)" },
  { value: "NONE", label: "None (Unencrypted)", desc: "Port 25 or local development (Mailpit / Mailhog)" },
];

interface SmtpFailureLogItem {
  id: string;
  recipient: string;
  subject: string;
  error: string;
  host: string | null;
  port: number | null;
  fromEmail: string | null;
  source: string | null;
  createdAt: string;
}

export default function SmtpSettingsPage() {
  const { user } = useAdminAuth();

  // Active top-level subtab
  const [activeTab, setActiveTab] = useState<"config" | "logs">("config");

  // Form states
  const [host, setHost] = useState("");
  const [port, setPort] = useState<number>(587);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState<EncryptionType>("TLS");
  const [fromEmail, setFromEmail] = useState("");
  const [fromName, setFromName] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Metadata
  const [hasStoredPassword, setHasStoredPassword] = useState(false);
  const [source, setSource] = useState<"database" | "env" | "none">("none");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [revealingPassword, setRevealingPassword] = useState(false);
  const [revealedPassword, setRevealedPassword] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Toast / Status
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Test Email states
  const [testEmail, setTestEmail] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Logs state
  const [logs, setLogs] = useState<SmtpFailureLogItem[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logPage, setLogPage] = useState(1);
  const [logTotalPages, setLogTotalPages] = useState(1);
  const [logTotalCount, setLogTotalCount] = useState(0);
  const [logSearch, setLogSearch] = useState("");
  const [logSourceFilter, setLogSourceFilter] = useState("all");
  const [availableSources, setAvailableSources] = useState<string[]>([]);
  const [selectedLog, setSelectedLog] = useState<SmtpFailureLogItem | null>(null);
  const [deletingLogId, setDeletingLogId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const notify = useCallback((type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 6000);
  }, []);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setFieldErrors({});
    setShowPassword(false);
    setRevealedPassword(null);
    try {
      const res = await fetch("/api/v1/admin/smtp");
      const json = await res.json();
      if (json.success && json.data) {
        const d: MaskedSmtpConfig = json.data;
        setHost(d.host || "");
        setPort(d.port || 587);
        setUsername(d.username || "");
        setPassword(d.passwordMasked || "");
        setEncryption(d.encryption || "TLS");
        setFromEmail(d.fromEmail || "");
        setFromName(d.fromName || "");
        setIsActive(d.isActive ?? true);
        setHasStoredPassword(d.hasPassword);
        setSource(d.source);
        setUpdatedAt(d.updatedAt || null);
      } else {
        notify("error", json.error || "Failed to load SMTP configuration.");
      }
    } catch {
      notify("error", "Network error while loading SMTP configuration.");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  const fetchLogs = useCallback(
    async (page = 1, search = "", sourceVal = "all") => {
      setLogsLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "20",
        });
        if (search) params.set("search", search);
        if (sourceVal && sourceVal !== "all") params.set("source", sourceVal);

        const res = await fetch(`/api/v1/admin/smtp/logs?${params.toString()}`);
        const json = await res.json();
        if (json.success) {
          setLogs(json.data || []);
          setLogTotalPages(json.pagination?.totalPages || 1);
          setLogTotalCount(json.pagination?.total || 0);
          setLogPage(json.pagination?.page || 1);
          if (json.sources && Array.isArray(json.sources)) {
            setAvailableSources(json.sources);
          }
        }
      } catch (err) {
        console.error("Failed to load logs:", err);
      } finally {
        setLogsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchConfig();
    fetchLogs(1, "", "all");
  }, [fetchConfig, fetchLogs]);

  // Set default recipient to admin's email once user info is loaded
  useEffect(() => {
    if (user?.email && !testEmail) {
      setTestEmail(user.email);
    }
  }, [user, testEmail]);

  const handleQuickPort = (selectedPort: number, enc: EncryptionType) => {
    setPort(selectedPort);
    setEncryption(enc);
  };

  const isMaskedVal = (str: string) =>
    !str || str === "••••••••••••" || /^[\u2022*•\s]+$/.test(str.trim());

  const handleTogglePassword = async () => {
    if (showPassword) {
      setShowPassword(false);
      return;
    }

    // If the admin has already entered a new unmasked password, simply reveal it
    if (password && !isMaskedVal(password)) {
      setShowPassword(true);
      return;
    }

    // If already decrypted in this session
    if (revealedPassword) {
      setPassword(revealedPassword);
      setShowPassword(true);
      return;
    }

    // Fetch and decrypt securely from the server
    if (hasStoredPassword) {
      setRevealingPassword(true);
      try {
        const res = await fetch("/api/v1/admin/smtp/reveal");
        const json = await res.json();
        if (json.success && typeof json.password === "string") {
          setRevealedPassword(json.password);
          setPassword(json.password);
          setShowPassword(true);
        } else {
          notify("error", json.error || "Failed to reveal stored password.");
        }
      } catch {
        notify("error", "Network error retrieving decrypted password.");
      } finally {
        setRevealingPassword(false);
      }
    } else {
      setShowPassword(true);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFieldErrors({});
    setToast(null);

    try {
      const res = await fetch("/api/v1/admin/smtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host,
          port: Number(port),
          username,
          password,
          encryption,
          fromEmail,
          fromName,
          isActive,
        }),
      });

      const json = await res.json();
      if (json.success) {
        notify("success", json.message || "SMTP configuration saved successfully!");
        if (json.data) {
          const d: MaskedSmtpConfig = json.data;
          setPassword(d.passwordMasked || "");
          setHasStoredPassword(d.hasPassword);
          setSource(d.source);
          setUpdatedAt(d.updatedAt || null);
        }
      } else {
        if (json.fieldErrors) {
          setFieldErrors(json.fieldErrors);
        }
        notify("error", json.error || "Please correct the form errors and try again.");
      }
    } catch {
      notify("error", "Network error while saving SMTP settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
      setTestResult({
        success: false,
        message: "Please enter a valid recipient email address to receive the test message.",
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/v1/admin/smtp/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail: testEmail,
          host,
          port: Number(port),
          username,
          password,
          encryption,
          fromEmail,
          fromName,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setTestResult({
          success: true,
          message: json.message || `Test email sent successfully to ${testEmail}!`,
        });
      } else {
        setTestResult({
          success: false,
          message: json.error || "Failed to send test email. Please verify connection credentials.",
        });
        // Refresh failure logs since a failure was recorded
        fetchLogs(logPage, logSearch, logSourceFilter);
      }
    } catch {
      setTestResult({
        success: false,
        message: "Network request failed while testing SMTP connection. Please check server logs.",
      });
      fetchLogs(logPage, logSearch, logSourceFilter);
    } finally {
      setTesting(false);
    }
  };

  const handleDeleteLog = async (id: string) => {
    setDeletingLogId(id);
    try {
      const res = await fetch(`/api/v1/admin/smtp/logs?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setLogs((prev) => prev.filter((l) => l.id !== id));
        setLogTotalCount((prev) => Math.max(0, prev - 1));
        if (selectedLog?.id === id) setSelectedLog(null);
        notify("success", "Failed log entry removed.");
      } else {
        notify("error", json.error || "Failed to delete log entry.");
      }
    } catch {
      notify("error", "Failed to delete log entry.");
    } finally {
      setDeletingLogId(null);
    }
  };

  const handleClearAllLogs = async () => {
    setShowClearConfirm(false);
    try {
      const res = await fetch("/api/v1/admin/smtp/logs?all=true", {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setLogs([]);
        setLogTotalCount(0);
        setSelectedLog(null);
        notify("success", json.message || "All SMTP failed logs cleared.");
      } else {
        notify("error", json.error || "Failed to clear logs.");
      }
    } catch {
      notify("error", "Error clearing logs.");
    }
  };

  return (
    <AdminLayout title="SMTP Settings">
      <div className="p-4 md:p-8 w-full max-w-none space-y-6">
        {/* Toast Notification Banner */}
        {toast && (
          <div
            className={`flex items-center justify-between p-4 rounded-2xl border text-sm font-intel shadow-lg transition-all animate-fadeIn ${
              toast.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            <div className="flex items-center space-x-3">
              {toast.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <span>{toast.text}</span>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-gray-400 hover:text-white text-xs px-2 py-1 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Full-Width Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0b0b10] border border-white/10 p-6 md:p-8 rounded-3xl">
          <div className="space-y-1">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-[#7c3aed]/20 to-[#4f8bff]/20 border border-[#a855f7]/30 flex items-center justify-center text-[#a855f7] shrink-0">
                <Server className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white font-manrope">
                  SMTP Configuration &amp; Delivery Management
                </h1>
                <p className="text-xs md:text-sm text-[#a1a1aa] font-intel">
                  Manage outgoing email credentials, conduct live verification tests, and monitor delivery failure logs.
                </p>
              </div>
            </div>
          </div>

          {/* Status Badges & Refresh */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-intel">
            {source === "database" ? (
              <span className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active in Database (Encrypted)</span>
              </span>
            ) : source === "env" ? (
              <span className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Fallback: Environment Variables</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                <span>Not Configured</span>
              </span>
            )}

            {updatedAt && (
              <span className="text-[11px] text-gray-500 hidden sm:inline">
                Updated: {new Date(updatedAt).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}
              </span>
            )}

            <button
              onClick={() => {
                fetchConfig();
                fetchLogs(logPage, logSearch, logSourceFilter);
              }}
              disabled={loading || logsLoading}
              title="Refresh configuration and failure records"
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading || logsLoading ? "animate-spin text-[#a855f7]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("config")}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-intel font-semibold transition-all cursor-pointer ${
              activeTab === "config"
                ? "bg-linear-to-r from-[#7c3aed]/25 to-[#4f8bff]/15 text-white border border-[#a855f7]/50 shadow-[0_0_20px_rgba(124,58,237,0.2)]"
                : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <KeyRound className="w-4 h-4 text-[#a855f7]" />
            <span>SMTP Configuration &amp; Testing</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("logs");
              fetchLogs(1, logSearch, logSourceFilter);
            }}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-intel font-semibold transition-all cursor-pointer ${
              activeTab === "logs"
                ? "bg-linear-to-r from-[#7c3aed]/25 to-[#4f8bff]/15 text-white border border-[#a855f7]/50 shadow-[0_0_20px_rgba(124,58,237,0.2)]"
                : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <AlertTriangle className={`w-4 h-4 ${logTotalCount > 0 ? "text-amber-400" : "text-gray-400"}`} />
            <span>SMTP Failed Logs</span>
            {logTotalCount > 0 && (
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                {logTotalCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Configuration Form & Live Delivery Test */}
        {activeTab === "config" && (
          <div className="space-y-6">
            {/* Security Notice Card */}
            <div className="bg-linear-to-r from-[#7c3aed]/10 via-[#4f8bff]/5 to-transparent border border-[#7c3aed]/20 p-4 md:p-5 rounded-2xl flex items-start space-x-3.5 text-xs text-gray-300 font-intel">
              <ShieldCheck className="w-5 h-5 text-[#a855f7] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-white">Full-Width Super Admin Security &amp; AES-256-GCM Encryption</span>
                <p className="text-gray-400 leading-relaxed">
                  Only authorized Super Administrators have permission to manage SMTP settings. Passwords are encrypted at rest with AES-256-GCM.
                  All application transactional mail (such as Admin Forgot Password links and Newsletter confirmations) routes through this configuration.
                </p>
              </div>
            </div>

            {/* Form + Side Utility Full Width Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Configuration Form (2 Cols on xl) */}
              <div className="xl:col-span-2">
                <div className="bg-[#0b0b10] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
                  <div className="border-b border-white/10 pb-4">
                    <h2 className="text-base md:text-lg font-bold text-white font-manrope flex items-center space-x-2">
                      <KeyRound className="w-4 h-4 text-[#a855f7]" />
                      <span>Mail Server Parameters</span>
                    </h2>
                    <p className="text-xs text-[#a1a1aa] font-intel mt-0.5">
                      Configure your SMTP host, port, credentials, and transport security settings.
                    </p>
                  </div>

                  {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center space-y-3">
                      <div className="w-8 h-8 border-3 border-[#7c3aed] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs text-gray-400 font-intel">Loading SMTP parameters...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSave} className="space-y-6">
                      {/* Host & Port Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="md:col-span-2 space-y-1.5">
                          <label className="text-xs font-semibold text-gray-300 font-intel">
                            SMTP Host <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={host}
                            onChange={(e) => setHost(e.target.value)}
                            placeholder="e.g. smtp.office365.com, smtp.gmail.com"
                            className={`w-full bg-[#121218] border rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none transition-all ${
                              fieldErrors.host ? "border-red-500 focus:border-red-400" : "border-white/10 focus:border-[#a855f7]"
                            }`}
                            required
                          />
                          {fieldErrors.host && <p className="text-[11px] text-red-400 font-intel">{fieldErrors.host}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-300 font-intel">
                            Port <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="number"
                            value={port}
                            onChange={(e) => setPort(Number(e.target.value))}
                            min={1}
                            max={65535}
                            placeholder="587"
                            className={`w-full bg-[#121218] border rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none transition-all ${
                              fieldErrors.port ? "border-red-500 focus:border-red-400" : "border-white/10 focus:border-[#a855f7]"
                            }`}
                            required
                          />
                          {fieldErrors.port && <p className="text-[11px] text-red-400 font-intel">{fieldErrors.port}</p>}
                        </div>
                      </div>

                      {/* Quick Port Selector Pills */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-intel text-gray-400">
                        <span>Common presets:</span>
                        <button
                          type="button"
                          onClick={() => handleQuickPort(587, "TLS")}
                          className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                            port === 587 && encryption === "TLS"
                              ? "bg-[#7c3aed]/20 border-[#a855f7] text-white"
                              : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
                          }`}
                        >
                          587 (TLS / STARTTLS)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickPort(465, "SSL")}
                          className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                            port === 465 && encryption === "SSL"
                              ? "bg-[#7c3aed]/20 border-[#a855f7] text-white"
                              : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
                          }`}
                        >
                          465 (SSL / SMTPS)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickPort(25, "NONE")}
                          className={`px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                            port === 25 && encryption === "NONE"
                              ? "bg-[#7c3aed]/20 border-[#a855f7] text-white"
                              : "bg-white/5 border-white/10 hover:bg-white/10 text-gray-300"
                          }`}
                        >
                          25 (Plain / Local Dev)
                        </button>
                      </div>

                      {/* Encryption Type Selector Cards */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-300 font-intel">
                          Encryption Type (SSL/TLS) <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                          {ENCRYPTION_OPTIONS.map((opt) => (
                            <div
                              key={opt.value}
                              onClick={() => setEncryption(opt.value)}
                              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                                encryption === opt.value
                                  ? "bg-[#7c3aed]/15 border-[#a855f7] text-white shadow-[0_0_15px_rgba(124,58,237,0.15)]"
                                  : "bg-[#121218] border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold font-manrope">{opt.label}</span>
                                {encryption === opt.value && <CheckCircle2 className="w-4 h-4 text-[#a855f7]" />}
                              </div>
                              <p className="text-[11px] text-gray-400 font-intel mt-1 leading-snug">{opt.desc}</p>
                            </div>
                          ))}
                        </div>
                        {fieldErrors.encryption && <p className="text-[11px] text-red-400 font-intel">{fieldErrors.encryption}</p>}
                      </div>

                      {/* Username & Password */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-300 font-intel">
                            SMTP Username / Email <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="e.g. notifications@cloudcentric.in"
                            className={`w-full bg-[#121218] border rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none transition-all ${
                              fieldErrors.username ? "border-red-500 focus:border-red-400" : "border-white/10 focus:border-[#a855f7]"
                            }`}
                            required
                          />
                          {fieldErrors.username && <p className="text-[11px] text-red-400 font-intel">{fieldErrors.username}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-gray-300 font-intel">
                              SMTP Password {!hasStoredPassword && <span className="text-red-400">*</span>}
                            </label>
                            {hasStoredPassword && (
                              <span className="text-[10px] text-emerald-400 font-intel flex items-center space-x-1">
                                <Lock className="w-3 h-3" />
                                <span>Saved &amp; Encrypted</span>
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder={hasStoredPassword ? "•••••••••••• (Leave blank to keep existing)" : "Enter SMTP password or App Password"}
                              className={`w-full bg-[#121218] border rounded-2xl pl-4 pr-10 py-3 text-xs text-white placeholder-gray-500 focus:outline-none transition-all ${
                                fieldErrors.password ? "border-red-500 focus:border-red-400" : "border-white/10 focus:border-[#a855f7]"
                              }`}
                            />
                            <button
                              type="button"
                              onClick={handleTogglePassword}
                              disabled={revealingPassword}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                              title={showPassword ? "Hide password" : "View password"}
                            >
                              {revealingPassword ? (
                                <RefreshCw className="w-4 h-4 animate-spin text-[#a855f7]" />
                              ) : showPassword ? (
                                <EyeOff className="w-4 h-4 text-[#a855f7]" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          <p className="text-[11px] text-gray-500 font-intel">
                            {hasStoredPassword
                              ? "Leave blank to keep your current encrypted password, or enter a new one to update."
                              : "For Microsoft 365 or Gmail, generate and enter a dedicated App Password."}
                          </p>
                          {fieldErrors.password && <p className="text-[11px] text-red-400 font-intel">{fieldErrors.password}</p>}
                        </div>
                      </div>

                      {/* Sender Email & Name */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-white/5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-300 font-intel">
                            Sender Email Address (From) <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="email"
                            value={fromEmail}
                            onChange={(e) => setFromEmail(e.target.value)}
                            placeholder="e.g. noreply@cloudcentric.in"
                            className={`w-full bg-[#121218] border rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none transition-all ${
                              fieldErrors.fromEmail ? "border-red-500 focus:border-red-400" : "border-white/10 focus:border-[#a855f7]"
                            }`}
                            required
                          />
                          {fieldErrors.fromEmail && <p className="text-[11px] text-red-400 font-intel">{fieldErrors.fromEmail}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-300 font-intel">
                            Sender Display Name <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            value={fromName}
                            onChange={(e) => setFromName(e.target.value)}
                            placeholder="e.g. CloudCentric Support"
                            className={`w-full bg-[#121218] border rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none transition-all ${
                              fieldErrors.fromName ? "border-red-500 focus:border-red-400" : "border-white/10 focus:border-[#a855f7]"
                            }`}
                            required
                          />
                          {fieldErrors.fromName && <p className="text-[11px] text-red-400 font-intel">{fieldErrors.fromName}</p>}
                        </div>
                      </div>

                      {/* Active Status Switch */}
                      <div className="flex items-center justify-between p-4.5 rounded-2xl bg-[#121218] border border-white/5">
                        <div className="space-y-0.5">
                          <span className="text-xs font-semibold text-white font-intel">Enable SMTP Configuration</span>
                          <p className="text-[11px] text-gray-400 font-intel">
                            When enabled, password reset links and transactional notifications route through these credentials.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c3aed]"></div>
                        </label>
                      </div>

                      {/* Save Actions */}
                      <div className="flex items-center justify-end space-x-3.5 pt-4 border-t border-white/10">
                        <button
                          type="button"
                          onClick={fetchConfig}
                          disabled={saving}
                          className="px-5 py-2.5 rounded-2xl border border-white/10 text-xs font-intel font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer disabled:opacity-50"
                        >
                          Discard Changes
                        </button>
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-linear-to-r from-[#7c3aed] to-[#4f8bff] text-white text-xs font-intel font-semibold shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {saving ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Saving Settings...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>Save Configuration</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* Right Column: Live Delivery Tester & Guide */}
              <div className="space-y-6">
                {/* Live Delivery Test Card */}
                <div className="bg-[#0b0b10] border border-white/10 rounded-3xl p-6 md:p-7 space-y-5">
                  <div className="border-b border-white/10 pb-4">
                    <div className="flex items-center space-x-2 text-[#a855f7]">
                      <Send className="w-4 h-4" />
                      <h3 className="text-sm font-bold text-white font-manrope">Test SMTP Delivery</h3>
                    </div>
                    <p className="text-xs text-[#a1a1aa] font-intel mt-1">
                      Send a diagnostic test message to verify authentication, DNS resolution, and SSL handshakes.
                    </p>
                  </div>

                  <form onSubmit={handleSendTestEmail} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300 font-intel">
                        Recipient Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={testEmail}
                          onChange={(e) => setTestEmail(e.target.value)}
                          placeholder="admin@example.com"
                          className="w-full bg-[#121218] border border-white/10 rounded-2xl pl-4 pr-10 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#a855f7] transition-all"
                          required
                        />
                        <Mail className="w-4 h-4 text-gray-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                      <p className="text-[10px] text-gray-500 font-intel">
                        Test message will be delivered from <strong>{fromEmail || "Sender Email"}</strong> to this inbox.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={testing || loading}
                      className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl bg-white/5 border border-white/15 text-white hover:bg-white/10 text-xs font-intel font-semibold transition-all cursor-pointer disabled:opacity-50"
                    >
                      {testing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-[#a855f7]" />
                          <span>Sending Diagnostic Email...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-[#a855f7]" />
                          <span>Send Test Email</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Diagnostic Test Results Box */}
                  {testResult && (
                    <div
                      className={`p-4 rounded-2xl border text-xs font-intel space-y-2 animate-fadeIn ${
                        testResult.success
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                          : "bg-red-500/10 border-red-500/30 text-red-300"
                      }`}
                    >
                      <div className="flex items-center space-x-2 font-bold font-manrope">
                        {testResult.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                        <span>{testResult.success ? "Connection Verified" : "Delivery Failed"}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed break-words">{testResult.message}</p>
                    </div>
                  )}
                </div>

                {/* Common Provider Setup Instructions */}
                <div className="bg-[#0b0b10] border border-white/10 rounded-3xl p-6 space-y-3.5 font-intel">
                  <div className="flex items-center space-x-2 text-gray-200 text-xs font-bold font-manrope">
                    <Info className="w-4 h-4 text-[#a855f7]" />
                    <span>Mail Provider Configurations</span>
                  </div>
                  <div className="space-y-3 text-[11px] text-gray-400 leading-relaxed">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <strong className="text-gray-200 font-semibold">Microsoft 365 / Office 365</strong>
                      <p>Host: <code className="text-purple-300">smtp.office365.com</code> | Port: <code className="text-purple-300">587</code> (TLS)</p>
                      <p className="text-[10px] text-gray-500">Requires SMTP AUTH enabled in Admin Center or a dedicated App Password.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <strong className="text-gray-200 font-semibold">Google Workspace / Gmail</strong>
                      <p>Host: <code className="text-purple-300">smtp.gmail.com</code> | Port: <code className="text-purple-300">587</code> (TLS) or <code className="text-purple-300">465</code> (SSL)</p>
                      <p className="text-[10px] text-gray-500">Requires 2-Step Verification and a 16-character App Password.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <strong className="text-gray-200 font-semibold">SendGrid / AWS SES</strong>
                      <p>SendGrid Host: <code className="text-purple-300">smtp.sendgrid.net</code> | Username: <code className="text-purple-300">apikey</code></p>
                      <p className="text-[10px] text-gray-500">Port: 587 with STARTTLS encryption.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: SMTP Failed Logs */}
        {activeTab === "logs" && (
          <div className="space-y-6">
            {/* Quick Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#0b0b10] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 font-intel">Total Delivery Failures</p>
                  <p className="text-2xl font-bold text-white font-manrope">{logTotalCount}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-[#0b0b10] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 font-intel">Current Target Host</p>
                  <p className="text-sm font-semibold text-white font-manrope truncate max-w-[200px]">
                    {host ? `${host}:${port}` : "Not Configured"}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/10 border border-[#a855f7]/20 text-[#a855f7] flex items-center justify-center">
                  <Server className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-[#0b0b10] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 font-intel">Last Failed Attempt</p>
                  <p className="text-xs font-semibold text-gray-300 font-intel">
                    {logs[0]?.createdAt
                      ? new Date(logs[0].createdAt).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })
                      : "None recorded"}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-gray-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Filter & Action Toolbar */}
            <div className="bg-[#0b0b10] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 font-intel">
              <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[220px]">
                  <input
                    type="text"
                    value={logSearch}
                    onChange={(e) => {
                      setLogSearch(e.target.value);
                      fetchLogs(1, e.target.value, logSourceFilter);
                    }}
                    placeholder="Search by recipient, subject, error..."
                    className="w-full bg-[#121218] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#a855f7]"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                {/* Source Filter Dropdown */}
                {availableSources.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Filter className="w-3.5 h-3.5 text-gray-400" />
                    <select
                      value={logSourceFilter}
                      onChange={(e) => {
                        setLogSourceFilter(e.target.value);
                        fetchLogs(1, logSearch, e.target.value);
                      }}
                      className="bg-[#121218] border border-white/10 text-xs text-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#a855f7]"
                    >
                      <option value="all">All Sources</option>
                      {availableSources.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Actions: Refresh & Clear All */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fetchLogs(logPage, logSearch, logSourceFilter)}
                  disabled={logsLoading}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${logsLoading ? "animate-spin text-[#a855f7]" : ""}`} />
                  <span>Refresh</span>
                </button>

                {logs.length > 0 && (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Logs</span>
                  </button>
                )}
              </div>
            </div>

            {/* Table of Failed Logs */}
            <div className="bg-[#0b0b10] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              {logsLoading ? (
                <div className="p-16 text-center text-xs text-gray-400 font-intel flex flex-col items-center space-y-3">
                  <div className="w-7 h-7 border-3 border-[#7c3aed] border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading SMTP failure records...</span>
                </div>
              ) : logs.length === 0 ? (
                <div className="p-16 text-center space-y-3 font-intel">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white font-manrope">No Delivery Failures Recorded</h4>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    There are no recorded email delivery failures. All transactional messages and tests have executed successfully.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse font-intel text-xs">
                    <thead>
                      <tr className="border-b border-white/10 bg-[#121218] text-[#a1a1aa] uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">Recipient</th>
                        <th className="py-3 px-4">Subject</th>
                        <th className="py-3 px-4">Source</th>
                        <th className="py-3 px-4">Host : Port</th>
                        <th className="py-3 px-4">Failure Reason</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 px-4 text-gray-400 whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString(undefined, {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </td>
                          <td className="py-3.5 px-4 text-white font-medium whitespace-nowrap">
                            {log.recipient}
                          </td>
                          <td className="py-3.5 px-4 text-gray-300 max-w-[200px] truncate" title={log.subject}>
                            {log.subject}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 border border-white/10 text-purple-300">
                              {log.source || "general"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-gray-400 font-mono text-[11px] whitespace-nowrap">
                            {log.host ? `${log.host}:${log.port || 587}` : "N/A"}
                          </td>
                          <td className="py-3.5 px-4 text-red-400 max-w-[240px] truncate" title={log.error}>
                            {log.error}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => setSelectedLog(log)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                title="View full diagnostic error details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteLog(log.id)}
                                disabled={deletingLogId === log.id}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
                                title="Delete log entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {logTotalPages > 1 && (
              <div className="flex items-center justify-between text-xs text-gray-400 font-intel px-2">
                <span>
                  Showing page {logPage} of {logTotalPages} ({logTotalCount} total failures)
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fetchLogs(logPage - 1, logSearch, logSourceFilter)}
                    disabled={logPage <= 1 || logsLoading}
                    className="px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 disabled:opacity-40 cursor-pointer"
                  >
                    Previous
                  </button>
                  <span className="text-white font-semibold px-2">{logPage}</span>
                  <button
                    onClick={() => fetchLogs(logPage + 1, logSearch, logSourceFilter)}
                    disabled={logPage >= logTotalPages || logsLoading}
                    className="px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 disabled:opacity-40 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal: View Full Error Diagnostic Trace */}
        {selectedLog && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0b0b10] border border-white/15 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-2 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="text-base font-bold text-white font-manrope">SMTP Delivery Failure Details</h3>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-intel">
                <div className="grid grid-cols-2 gap-3 bg-[#121218] p-4 rounded-2xl border border-white/5">
                  <div>
                    <span className="text-gray-500 block text-[11px]">Recipient</span>
                    <span className="text-white font-medium">{selectedLog.recipient}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">Subject</span>
                    <span className="text-white font-medium">{selectedLog.subject}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">Server / Port</span>
                    <span className="text-gray-300 font-mono">
                      {selectedLog.host ? `${selectedLog.host}:${selectedLog.port}` : "Not Configured"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">Source Context</span>
                    <span className="text-purple-300">{selectedLog.source || "general"}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 block text-[11px]">Failure Timestamp</span>
                    <span className="text-gray-300">
                      {new Date(selectedLog.createdAt).toLocaleString(undefined, {
                        dateStyle: "full",
                        timeStyle: "long",
                      })}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Diagnostic Error Output</label>
                  <pre className="w-full bg-[#050507] border border-red-500/20 text-red-300 rounded-2xl p-4 text-[11px] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap break-words max-h-60 overflow-y-auto">
                    {selectedLog.error}
                  </pre>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <button
                  onClick={() => handleDeleteLog(selectedLog.id)}
                  disabled={deletingLogId === selectedLog.id}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-intel font-semibold cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Log</span>
                </button>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-intel font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Confirm Clear All Logs */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0b0b10] border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fadeIn font-intel text-xs">
              <div className="flex items-center space-x-3 text-red-400">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="text-base font-bold text-white font-manrope">Clear All SMTP Failure Logs?</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                This action will permanently delete all {logTotalCount} recorded failure logs from the database. This action cannot be undone.
              </p>
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAllLogs}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold cursor-pointer"
                >
                  Yes, Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
