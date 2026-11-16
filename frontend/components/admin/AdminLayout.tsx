import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Layers,
  Users,
  ShieldCheck,
  LogOut,
  RefreshCw,
  ExternalLink,
  Menu,
  X,
  CheckCircle2,
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
  permissions?: Array<{ module: string; action: string }>;
}

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminLayout({ children, title = "Dashboard" }: AdminLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [revalidating, setRevalidating] = useState(false);
  const [revalidateMsg, setRevalidateMsg] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoginToast, setShowLoginToast] = useState(false);

  useEffect(() => {
    fetch("/api/v1/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/admin/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.success) {
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [router]);

  // Handle Login Success Toast banner
  useEffect(() => {
    if (!router.isReady) return;
    const isLoginParam = router.query.loginSuccess === "true";
    const isSessionStorage = typeof window !== "undefined" && window.sessionStorage.getItem("loginSuccess") === "true";

    if (isLoginParam || isSessionStorage) {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("loginSuccess");
      }
      if (isLoginParam) {
        const url = new URL(window.location.href);
        url.searchParams.delete("loginSuccess");
        window.history.replaceState({}, "", url.pathname + url.search);
      }
      const showTimer = setTimeout(() => {
        setShowLoginToast(true);
      }, 0);
      const hideTimer = setTimeout(() => {
        setShowLoginToast(false);
      }, 5000);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [router.isReady, router.query.loginSuccess]);

  // Close mobile menu asynchronously when route changes
  useEffect(() => {
    const handleRouteChange = () => setMobileMenuOpen(false);
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await fetch("/api/v1/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const handleTriggerRevalidation = async () => {
    setRevalidating(true);
    setRevalidateMsg("");
    try {
      const res = await fetch("/api/v1/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "/blogs",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRevalidateMsg("Revalidated live pages successfully!");
      } else {
        setRevalidateMsg(data.error || "Revalidation failed");
      }
    } catch {
      setRevalidateMsg("Failed to revalidate site cache.");
    } finally {
      setRevalidating(false);
      setTimeout(() => setRevalidateMsg(""), 4000);
    }
  };

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/admin" },
    { label: "Blog Articles", icon: FileText, href: "/admin/blogs" },
    { label: "Case Studies", icon: Briefcase, href: "/admin/case-studies" },
    { label: "Products", icon: Layers, href: "/admin/products" },
    { label: "User Roles & RBAC", icon: Users, href: "/admin/users" },
    { label: "Audit Logs", icon: ShieldCheck, href: "/admin/audit-logs" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-intel text-[#a1a1aa]">Loading CloudCentric Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 flex font-sans selection:bg-[#7c3aed] selection:text-white">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#0b0b10] border-r border-white/10 hidden md:flex flex-col justify-between shrink-0 z-30">
        <div>
          {/* Logo Header */}
          <div className="p-6 border-b border-white/10 flex flex-col space-y-2">
            <Link href="/" target="_blank" className="block cursor-pointer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt="CloudCentric Logo"
                className="h-9 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(124,58,237,0.3)]"
              />
            </Link>
            <p className="text-[10px] text-[#a855f7] font-intel font-semibold tracking-wider uppercase">Headless CMS Engine</p>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = router.pathname === item.href || (item.href !== "/admin" && router.pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-xs font-intel font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-linear-to-r from-[#7c3aed]/20 to-[#4f8bff]/10 text-white border border-[#a855f7]/40 shadow-[0_0_20px_rgba(124,58,237,0.15)]"
                      : "text-[#a1a1aa] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#a855f7]" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#121218] border border-white/5">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-linear-to-tr from-[#7c3aed] to-[#4f8bff] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user?.name || "Admin"}</p>
                <p className="text-[10px] text-[#a855f7] font-intel truncate">{user?.role || "Super Admin"}</p>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              title="Logout"
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-xs text-[#a1a1aa] hover:text-white px-2 py-1.5 transition-colors font-intel"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#a855f7]" />
          </a>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden flex">
          <div className="w-72 bg-[#0b0b10] border-r border-white/10 flex flex-col justify-between h-full p-6">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex flex-col space-y-1">
                  <Link href="/" target="_blank" className="block cursor-pointer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logo.svg"
                      alt="CloudCentric Logo"
                      className="h-8 w-auto object-contain"
                    />
                  </Link>
                  <p className="text-[9px] text-[#a855f7] font-intel uppercase tracking-wider">Headless CMS Engine</p>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = router.pathname === item.href || (item.href !== "/admin" && router.pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-intel font-semibold ${
                        isActive
                          ? "bg-linear-to-r from-[#7c3aed]/20 to-[#4f8bff]/10 text-white border border-[#a855f7]/40"
                          : "text-[#a1a1aa] hover:text-white"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-[#a855f7]" : "text-gray-400"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLogoutModal(true);
                }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-semibold cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#050505]">
        {/* Top Bar */}
        <header className="h-20 border-b border-white/10 bg-[#0b0b10]/90 backdrop-blur-2xl px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-3 md:space-x-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-gray-400 hover:text-white md:hidden rounded-xl bg-white/5"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight font-manrope">{title}</h2>
            {revalidateMsg && (
              <span className="hidden sm:inline-block text-xs px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-intel font-medium">
                {revalidateMsg}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleTriggerRevalidation}
              disabled={revalidating}
              className="flex items-center space-x-2 px-3.5 md:px-4 py-2 rounded-2xl bg-linear-to-r from-[#7c3aed] to-[#2563eb] text-white text-xs font-intel font-bold hover:opacity-90 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${revalidating ? "animate-spin" : ""}`} />
              <span>{revalidating ? "Syncing..." : "Sync Live Site"}</span>
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>

      {/* Login Success Notification Toast */}
      {showLoginToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center space-x-3.5 px-5 py-4 rounded-2xl bg-[#0e0e12]/95 border border-emerald-500/40 text-white shadow-[0_0_30px_rgba(16,185,129,0.25)] backdrop-blur-xl font-intel">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide font-manrope">Login Successful</h4>
            <p className="text-[11px] text-emerald-300/80">Welcome back to CloudCentric Admin!</p>
          </div>
          <button
            onClick={() => setShowLoginToast(false)}
            className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors ml-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Logout Confirmation Dialog Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0e0e12] border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6 relative z-10 font-sans">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                <LogOut className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-manrope">Confirm Logout</h3>
                <p className="text-xs text-[#a1a1aa] font-intel mt-0.5">
                  Are you sure you want to end your administrative session?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2 border-t border-white/5 font-intel">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-5 py-2.5 rounded-2xl bg-[#14141a] border border-white/10 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="px-5 py-2.5 rounded-2xl bg-linear-to-r from-red-600 to-rose-600 text-white text-xs font-bold hover:opacity-90 transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)] cursor-pointer"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
