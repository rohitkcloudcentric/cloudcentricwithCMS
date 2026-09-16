import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { ShieldCheck, Activity, Terminal } from "lucide-react";

export default function AuditLogsAdmin() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <AdminLayout title="System Audit Trail & Security Logs">
      <div className="space-y-6">
        <p className="text-xs text-gray-400">
          Real-time record of administrative actions, content updates, authentication events, and IP addresses.
        </p>

        <div className="bg-[#0B0F17] border border-gray-800/80 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-sm text-gray-500">Loading audit logs...</div>
          ) : logs.length > 0 ? (
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
                  {logs.map((log) => (
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
          ) : (
            <div className="p-12 text-center text-sm text-gray-500">No audit logs recorded yet.</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
