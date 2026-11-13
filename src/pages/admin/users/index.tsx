import React, { useCallback, useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { CheckCircle2, UserPlus, X, Edit3, Trash2, Ban, AlertCircle } from "lucide-react";
import { validateProfile } from "@/lib/profile-input";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import RolePermissionsManager, { type RoleRow } from "@/components/admin/RolePermissionsManager";

interface UserRow {
  id: string;
  name: string;
  email: string;
  username?: string | null;
  phone?: string | null;
  isActive: boolean;
  role: string;
  roleId: string;
  fullAccess?: boolean;
  createdAt: string;
}

interface EditForm {
  name: string;
  email: string;
  username: string;
  phone: string;
  roleId: string;
  isActive: boolean;
  password: string;
}

const FIELD = "w-full p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white";

export default function UsersAdmin() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Create form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit form
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [form, setForm] = useState<EditForm | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  // Every action follows the users:* permissions from the database (enforced again by the API)
  const { user: currentUser, can } = useAdminAuth();
  const canCreate = can("users", "create");
  const canEdit = can("users", "update");
  const canDelete = can("users", "delete");
  const canAssignRoles = can("users", "manage");
  const actorFull = Boolean(currentUser?.fullAccess);
  /** Full-access accounts can only be changed by full-access users */
  const mayChange = (u: UserRow) => actorFull || !u.fullAccess;
  const assignableRoles = roles.filter((r) => r.assignable);

  const notify = useCallback((type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 5000);
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/users");
      const data = await res.json();
      if (data.success && data.data) {
        setUsers(data.data.users || []);
        setRoles(data.data.roles || []);
        setRoleId((current) => current || data.data.roles?.find((r: RoleRow) => r.assignable && !r.fullAccess)?.id || data.data.roles?.find((r: RoleRow) => r.assignable)?.id || "");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(fetchUsers, 0);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, roleId }),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setName("");
        setEmail("");
        setPassword("");
        notify("success", "User created.");
        fetchUsers();
      } else {
        notify("error", data.error || "Failed to create user");
      }
    } catch {
      notify("error", "Error creating user");
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (u: UserRow) => {
    setEditing(u);
    setFieldErrors({});
    setForm({
      name: u.name,
      email: u.email,
      username: u.username || "",
      phone: u.phone || "",
      roleId: u.roleId,
      isActive: u.isActive,
      password: "",
    });
  };

  const setF = <K extends keyof EditForm>(key: K, value: EditForm[K]) => {
    setForm((f) => (f ? { ...f, [key]: value } : f));
    setFieldErrors((e) => ({ ...e, [key]: "" }));
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || !form) return;

    const errs: Record<string, string> = { ...validateProfile({ name: form.name, username: form.username, phone: form.phone, avatarUrl: "" }) };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errs.email = "Enter a valid email address.";
    if (form.password && form.password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/v1/users/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, password: form.password || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        setUsers((prev) => prev.map((u) => (u.id === editing.id ? { ...u, ...data.data } : u)));
        setEditing(null);
        notify("success", "User updated.");
      } else {
        if (data.fields) setFieldErrors(data.fields);
        notify("error", data.error || "Failed to update user");
      }
    } catch {
      notify("error", "Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (u: UserRow) => {
    const next = !u.isActive;
    if (!confirm(`${next ? "Activate" : "Deactivate"} ${u.name}?${next ? "" : " They will be signed out of the admin panel."}`)) return;
    setBusyId(u.id);
    try {
      const res = await fetch(`/api/v1/users/${u.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, isActive: next } : x)));
        notify("success", `${u.name} is now ${next ? "active" : "inactive"}.`);
      } else notify("error", data.error || "Failed to change status");
    } catch {
      notify("error", "Network error.");
    } finally {
      setBusyId(null);
    }
  };

  const deleteUser = async (u: UserRow) => {
    if (!confirm(`Permanently delete ${u.name} (${u.email})? This cannot be undone.`)) return;
    setBusyId(u.id);
    try {
      const res = await fetch(`/api/v1/users/${u.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        setUsers((prev) => prev.filter((x) => x.id !== u.id));
        notify("success", "User deleted.");
      } else notify("error", data.error || "Failed to delete user");
    } catch {
      notify("error", "Network error.");
    } finally {
      setBusyId(null);
    }
  };

  const err = (key: string) =>
    fieldErrors[key] ? <p className="text-[11px] text-red-400 pt-0.5" role="alert">{fieldErrors[key]}</p> : null;

  return (
    <AdminLayout title="User Management & RBAC Roles">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-400">
              Manage system administrators, editors, authors, and permission matrices.
            </p>
            {currentUser && !canCreate && !canEdit && !canDelete && (
              <p className="text-[11px] text-amber-400 mt-1">View only: your role cannot add, edit, activate or delete users.</p>
            )}
          </div>
          {canCreate && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Admin User</span>
            </button>
          )}
        </div>

        {/* Roles & permission matrix (loaded from the database) */}
        <RolePermissionsManager roles={roles} onChanged={fetchUsers} notify={notify} />

        {/* Users Table */}
        <div className="bg-[#0B0F17] border border-gray-800/80 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-sm text-gray-500">Loading admin users...</div>
          ) : users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-gray-900/60 border-b border-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Assigned Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined Date</th>
                    {(canEdit || canDelete) && <th className="px-6 py-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {users.map((u) => {
                    const isSelf = u.id === currentUser?.id;
                    return (
                      <tr key={u.id} className="hover:bg-gray-900/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                              {u.name[0]?.toUpperCase()}
                            </div>
                            <div>
                              <span className="font-semibold text-white">{u.name}</span>
                              {isSelf && <span className="ml-2 text-[10px] text-gray-500">(you)</span>}
                              {u.username && <p className="text-[11px] text-gray-500">@{u.username}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {u.isActive ? (
                            <span className="inline-flex items-center space-x-1 text-xs text-emerald-400 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Active</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 text-xs text-gray-400 font-medium">
                              <Ban className="w-3.5 h-3.5" />
                              <span>Inactive</span>
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                        {(canEdit || canDelete) && (
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            {mayChange(u) ? (
                            <>
                            {canEdit && (
                            <>
                            <button
                              type="button"
                              onClick={() => toggleActive(u)}
                              disabled={busyId === u.id || isSelf}
                              title={isSelf ? "You cannot deactivate yourself" : u.isActive ? "Deactivate" : "Activate"}
                              className={`px-2.5 py-1 mr-1 rounded-lg border text-[11px] font-medium disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed ${
                                u.isActive
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                  : "bg-gray-500/10 border-gray-500/30 text-gray-400"
                              }`}
                            >
                              {u.isActive ? "Set Inactive" : "Set Active"}
                            </button>
                            <button
                              type="button"
                              onClick={() => openEdit(u)}
                              title="Edit"
                              aria-label={`Edit ${u.name}`}
                              className="p-2 text-gray-400 hover:text-blue-400 cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            </>
                            )}
                            {canDelete && (
                            <button
                              type="button"
                              onClick={() => deleteUser(u)}
                              disabled={busyId === u.id || isSelf}
                              title={isSelf ? "You cannot delete yourself" : "Delete"}
                              aria-label={`Delete ${u.name}`}
                              className="p-2 text-gray-400 hover:text-red-400 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            )}
                            </>
                            ) : (
                              <span className="text-[11px] text-gray-600">Protected</span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-sm text-gray-500">No users found.</div>
          )}
        </div>

        {/* Create User Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0B0F17] border border-gray-800 rounded-2xl p-6 w-full max-w-md space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <h3 className="text-base font-bold text-white">Create Admin User</h3>
                <button onClick={() => setIsModalOpen(false)} aria-label="Close" className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Full Name</label>
                  <input type="text" required placeholder="e.g. John Doe" value={name} onChange={(e) => setName(e.target.value)} className={FIELD} />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Email Address</label>
                  <input type="email" required placeholder="user@cloudcentric.in" value={email} onChange={(e) => setEmail(e.target.value)} className={FIELD} />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Temporary Password</label>
                  <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={FIELD} />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-300">Assign Role</label>
                  <select value={roleId} onChange={(e) => setRoleId(e.target.value)} className={FIELD}>
                    {assignableRoles.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                  {roles.find((r) => r.id === roleId)?.description && (
                    <p className="text-xs text-gray-500 pt-1 leading-relaxed">{roles.find((r) => r.id === roleId)?.description}</p>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-800">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold">
                    {submitting ? "Creating..." : "Create User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {editing && form && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`Edit ${editing.name}`}>
            <div className="bg-[#0B0F17] border border-gray-800 rounded-2xl p-6 w-full max-w-lg space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <h3 className="text-base font-bold text-white">Edit User</h3>
                <button onClick={() => setEditing(null)} aria-label="Close" className="text-gray-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSave} noValidate className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label htmlFor="eu-name" className="font-semibold text-gray-300">Full Name</label>
                    <input id="eu-name" type="text" value={form.name} onChange={(e) => setF("name", e.target.value)} maxLength={100} className={FIELD} />
                    {err("name")}
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label htmlFor="eu-email" className="font-semibold text-gray-300">Email Address</label>
                    <input id="eu-email" type="email" value={form.email} onChange={(e) => setF("email", e.target.value)} className={FIELD} />
                    {err("email")}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="eu-username" className="font-semibold text-gray-300">Username</label>
                    <input id="eu-username" type="text" value={form.username} onChange={(e) => setF("username", e.target.value)} maxLength={30} className={FIELD} />
                    {err("username")}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="eu-phone" className="font-semibold text-gray-300">Mobile Number</label>
                    <input id="eu-phone" type="tel" value={form.phone} onChange={(e) => setF("phone", e.target.value)} maxLength={20} className={FIELD} />
                    {err("phone")}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="eu-role" className="font-semibold text-gray-300">Role</label>
                    <select
                      id="eu-role"
                      value={form.roleId}
                      onChange={(e) => setF("roleId", e.target.value)}
                      disabled={!canAssignRoles}
                      title={canAssignRoles ? undefined : "Your role cannot change user roles"}
                      className={`${FIELD} disabled:opacity-50`}
                    >
                      {roles
                        .filter((r) => r.assignable || r.id === form.roleId)
                        .map((r) => (
                          <option key={r.id} value={r.id} disabled={!r.assignable}>{r.name}</option>
                        ))}
                    </select>
                    {err("roleId")}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="eu-status" className="font-semibold text-gray-300">Status</label>
                    <select
                      id="eu-status"
                      value={form.isActive ? "active" : "inactive"}
                      onChange={(e) => setF("isActive", e.target.value === "active")}
                      disabled={editing.id === currentUser?.id}
                      className={`${FIELD} disabled:opacity-50`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    {err("isActive")}
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label htmlFor="eu-password" className="font-semibold text-gray-300">Reset Password <span className="text-gray-500 font-normal">(optional)</span></label>
                    <input id="eu-password" type="password" autoComplete="new-password" value={form.password} onChange={(e) => setF("password", e.target.value)} placeholder="Leave blank to keep current password" className={FIELD} />
                    {err("password")}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-800">
                  <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:opacity-60 cursor-pointer">
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div
          role={toast.type === "error" ? "alert" : "status"}
          className={`fixed top-6 right-4 sm:right-6 z-[60] max-w-[calc(100vw-2rem)] flex items-center gap-3 px-5 py-4 rounded-2xl bg-[#0e0e12]/95 border backdrop-blur-xl text-white ${
            toast.type === "success" ? "border-emerald-500/40" : "border-red-500/40"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
          <p className="text-xs">{toast.text}</p>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss" className="p-1 text-gray-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </AdminLayout>
  );
}
