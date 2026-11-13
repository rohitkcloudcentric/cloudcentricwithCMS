import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import { ShieldCheck, Activity, Terminal, ChevronLeft, ChevronRight } from "lucide-react";

export default function AuditLogsAdmin() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // Without audit_logs:manage the API returns only the user's own actions
  const seesAll = useAdminAuth().can("audit_logs", "manage");

  useEffect(() => {
    fetch("/api/v1/audit-logs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLogs(data.data || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(logs.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = logs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <AdminLayout title="System Audit Trail & Security Logs">
      <div className="space-y-6">
        <p className="text-xs text-gray-400">
          {seesAll
            ? "Real-time record of administrative actions, content updates, authentication events, and IP addresses."
            : "Showing your own activity. Your role does not include access to other users' audit logs."}
        </p>

        <div className="bg-[#0B0F17] border border-gray-800/80 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-sm text-gray-500">Loading audit logs...</div>
          ) : logs.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300 font-mono">
                  <thead className="bg-gray-900/60 border-b border-gray-800 text-[11px] font-semibold text-gray-400 uppercase tracking-wider font-sans">
                    <tr>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Module</th>
                      <th className="px-6 py-4">IP Address</th>
                      <th className="px-6 py-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {currentLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-900/30 transition-colors">
                        <td className="px-6 py-3.5 text-gray-400 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-3.5 text-white font-sans font-semibold">
                          {log.user?.name || "System/Guest"}
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-gray-300">{log.module}</td>
                        <td className="px-6 py-3.5 text-gray-400">{log.ipAddress || "127.0.0.1"}</td>
                        <td className="px-6 py-3.5 text-gray-400 max-w-xs truncate">
                          {log.details ? JSON.stringify(log.details) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              <div className="px-6 py-4 bg-gray-900/40 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs">
                <div className="text-gray-400">
                  Showing <span className="font-semibold text-white">{logs.length > 0 ? startIndex + 1 : 0}</span> to{" "}
                  <span className="font-semibold text-white">{Math.min(endIndex, logs.length)}</span> of{" "}
                  <span className="font-semibold text-white">{logs.length}</span> entries
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-lg border border-gray-800 bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Prev</span>
                    </button>

                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                          totalPages > 7 &&
                          page !== 1 &&
                          page !== totalPages &&
                          Math.abs(page - currentPage) > 1
                        ) {
                          if (page === 2 && currentPage > 3) {
                            return <span key={page} className="px-1 text-gray-500">...</span>;
                          }
                          if (page === totalPages - 1 && currentPage < totalPages - 2) {
                            return <span key={page} className="px-1 text-gray-500">...</span>;
                          }
                          return null;
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 rounded-lg border text-xs transition-colors ${
                              currentPage === page
                                ? "border-purple-500 bg-purple-600/20 text-purple-300 font-semibold"
                                : "border-gray-800 bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-lg border border-gray-800 bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-sm text-gray-500">No audit logs recorded yet.</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

