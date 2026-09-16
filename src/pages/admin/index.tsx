import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";
import {
  FileText,
  Briefcase,
  Layers,
  Users,
  Plus,
  ArrowUpRight,
  Clock,
  Sparkles,
} from "lucide-react";

interface AuditLogEntry {
  id: string;
  action: string;
  module: string;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
  createdAt: string;
  user?: { name: string } | null;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    articlesCount: 0,
    caseStudiesCount: 0,
    productsCount: 0,
    usersCount: 0,
  });
  const [recentLogs, setRecentLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadDashboardData() {
      try {
        const [artRes, csRes, prodRes, userRes, logsRes] = await Promise.all([
          fetch("/api/v1/articles"),
          fetch("/api/v1/case-studies"),
          fetch("/api/v1/products"),
          fetch("/api/v1/users"),
          fetch("/api/v1/audit-logs"),
        ]);

        const articles = await artRes.json();
        const caseStudies = await csRes.json();
        const products = await prodRes.json();
        const usersData = await userRes.json();
        const logs = await logsRes.json();

        if (isMounted) {
          setStats({
            articlesCount: articles?.pagination?.total || articles?.data?.length || 0,
            caseStudiesCount: caseStudies?.data?.length || 0,
            productsCount: products?.data?.length || 0,
            usersCount: usersData?.data?.users?.length || 0,
          });

          if (logs?.success) {
            setRecentLogs(logs.data.slice(0, 6));
          }
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  const statCards = [
    {
      title: "Blog Articles",
      count: stats.articlesCount,
      icon: FileText,
      href: "/admin/blogs",
      color: "from-[#7c3aed]/25 via-[#2563eb]/15 to-transparent",
      borderColor: "border-[#7c3aed]/30",
      iconColor: "text-[#a855f7]",
    },
    {
      title: "Case Studies",
      count: stats.caseStudiesCount,
      icon: Briefcase,
      href: "/admin/case-studies",
      color: "from-emerald-600/25 via-teal-600/15 to-transparent",
      borderColor: "border-emerald-500/30",
      iconColor: "text-emerald-400",
    },
    {
      title: "Products Portfolio",
      count: stats.productsCount,
      icon: Layers,
      href: "/admin/products",
      color: "from-purple-600/25 via-pink-600/15 to-transparent",
      borderColor: "border-purple-500/30",
      iconColor: "text-purple-400",
    },
    {
      title: "Admin Users & RBAC",
      count: stats.usersCount,
      icon: Users,
      href: "/admin/users",
      color: "from-blue-600/25 via-cyan-600/15 to-transparent",
      borderColor: "border-blue-500/30",
      iconColor: "text-[#4f8bff]",
    },
  ];

  return (
    <AdminLayout title="System Overview">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Welcome Banner matching Frontend Hero Style */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#7c3aed]/20 via-[#2563eb]/15 to-[#0e0e12] border border-white/10 p-8 md:p-10 shadow-[0_0_50px_rgba(124,58,237,0.1)]">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#a855f7]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#7c3aed]/20 border border-[#a855f7]/30 text-[#a855f7] text-xs font-intel font-bold tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Headless CMS Control Engine</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-manrope">
              Welcome to CloudCentric Admin
            </h1>
            <p className="text-sm text-[#b6b6c2] max-w-2xl leading-relaxed">
              Manage your blog insights, enterprise case studies, product portfolios, and RBAC user permissions with real-time Next.js ISR revalidation.
            </p>
          </div>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className={`p-6 rounded-3xl bg-linear-to-br ${card.color} bg-[#0e0e12] border ${card.borderColor} hover:border-[#a855f7]/60 transition-all duration-300 group flex flex-col justify-between shadow-lg cursor-pointer hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl bg-[#14141a] ${card.iconColor} border border-white/5`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <div className="mt-6">
                  <p className="text-3xl font-extrabold text-white font-manrope">{loading ? "-" : card.count}</p>
                  <p className="text-xs text-[#a1a1aa] font-intel font-medium mt-1 uppercase tracking-wider">{card.title}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-[#0e0e12] border border-white/10 rounded-3xl p-6 md:p-8 space-y-5">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2 font-manrope">
              <Plus className="w-4 h-4 text-[#a855f7]" />
              <span>Quick Actions</span>
            </h3>
            <div className="space-y-3 font-intel">
              <Link
                href="/admin/blogs/editor"
                className="flex items-center justify-between p-4 rounded-2xl bg-[#14141a] border border-white/5 hover:border-[#7c3aed]/50 text-xs text-gray-200 hover:text-white transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 text-[#a855f7]" />
                  <span>Create Blog Article</span>
                </div>
                <Plus className="w-4 h-4 text-gray-500 group-hover:text-[#a855f7]" />
              </Link>

              <Link
                href="/admin/case-studies"
                className="flex items-center justify-between p-4 rounded-2xl bg-[#14141a] border border-white/5 hover:border-emerald-500/50 text-xs text-gray-200 hover:text-white transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  <span>Add Case Study</span>
                </div>
                <Plus className="w-4 h-4 text-gray-500 group-hover:text-emerald-400" />
              </Link>

              <Link
                href="/admin/products"
                className="flex items-center justify-between p-4 rounded-2xl bg-[#14141a] border border-white/5 hover:border-purple-500/50 text-xs text-gray-200 hover:text-white transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>Add Product Portfolio</span>
                </div>
                <Plus className="w-4 h-4 text-gray-500 group-hover:text-purple-400" />
              </Link>
            </div>
          </div>

          {/* Audit Trail Feed */}
          <div className="lg:col-span-2 bg-[#0e0e12] border border-white/10 rounded-3xl p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2 font-manrope">
                <Clock className="w-4 h-4 text-[#4f8bff]" />
                <span>Recent System Activity</span>
              </h3>
              <Link href="/admin/audit-logs" className="text-xs text-[#a855f7] hover:underline font-intel font-semibold">
                View All Logs
              </Link>
            </div>

            {loading ? (
              <p className="text-xs font-intel text-gray-500 py-8 text-center">Loading audit activity...</p>
            ) : recentLogs.length > 0 ? (
              <div className="space-y-3 font-intel">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#14141a] border border-white/5 text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-linear-to-tr from-[#7c3aed] to-[#4f8bff] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {log.user?.name?.[0] || "S"}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {log.user?.name || "System"}{" "}
                          <span className="text-[#a855f7] font-normal">({log.action})</span>
                        </p>
                        <p className="text-[10px] text-[#a1a1aa] mt-0.5">
                          Module: <code className="text-gray-300 font-mono">{log.module}</code> | IP: {log.ipAddress || "127.0.0.1"}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-intel text-gray-500 py-8 text-center">No recent audit logs recorded.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
