import React, { useState } from "react";
import { Shield, ShieldCheck, Plus, Edit3, Trash2, X, Check, Minus } from "lucide-react";
import { ACTION_LABELS, PERMISSION_CATALOG, permissionKey, type ActionName, type ModuleName } from "@/lib/permission-catalog";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";

export interface RoleRow {
  id: string;
  name: string;
  description?: string | null;
  fullAccess: boolean;
  permissionKeys: string[];
  userCount: number;
  assignable?: boolean;
}

const ALL_ACTIONS: ActionName[] = ["read", "create", "update", "delete", "publish", "manage"];
const FIELD = "w-full p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white text-xs";

interface Props {
  roles: RoleRow[];
  onChanged: () => void;
  notify: (type: "success" | "error", text: string) => void;
}

/** Role cards + permission matrix editor (create / edit / delete roles). */
export default function RolePermissionsManager({ roles, onChanged, notify }: Props) {
  const { can, user } = useAdminAuth();
  const canManage = can("users", "manage");
  const [editing, setEditing] = useState<RoleRow | "new" | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const open = (role: RoleRow | "new") => {
    setEditing(role);
    setName(role === "new" ? "" : role.name);
    setDescription(role === "new" ? "" : role.description || "");
    setKeys(new Set(role === "new" ? [] : role.permissionKeys));
  };

  const isFull = editing !== null && editing !== "new" && editing.fullAccess;
  // Non-full-access admins can only grant/revoke permissions they hold themselves (API enforces this too)
  const mayToggle = (module: string, action: ActionName) => !isFull && (user?.fullAccess || can(module as ModuleName, action));

  const toggle = (module: string, action: ActionName) => {
    if (!mayToggle(module, action)) return;
    setKeys((prev) => {
      const next = new Set(prev);
      const k = permissionKey(module, action);
      const def = PERMISSION_CATALOG.find((m) => m.module === module)!;
      if (next.has(k)) {
        next.delete(k);
        // No "view" means the module is hidden: drop the other actions too
        if (action === "read") def.actions.forEach((a) => next.delete(permissionKey(module, a)));
      } else {
        next.add(k);
        // Every action implies being able to view the module
        if (action !== "read") next.add(permissionKey(module, "read"));
      }
      return next;
    });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const trimmed = name.trim();
    if (trimmed.length < 2) return notify("error", "Role name must be at least 2 characters.");
    setSaving(true);
    try {
      const isNew = editing === "new";
      const res = await fetch(isNew ? "/api/v1/roles" : `/api/v1/roles/${editing.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, description, ...(isFull ? {} : { permissionKeys: Array.from(keys) }) }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        notify("success", isNew ? "Role created." : "Role updated. Changes apply to its users immediately.");
        setEditing(null);
        onChanged();
      } else notify("error", data.error || "Failed to save role");
    } catch {
      notify("error", "Network error while saving the role.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (role: RoleRow) => {
    if (!confirm(`Delete the role "${role.name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/v1/roles/${role.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        notify("success", "Role deleted.");
        onChanged();
      } else notify("error", data.error || "Failed to delete role");
    } catch {
      notify("error", "Network error.");
    }
  };

  const summary = (r: RoleRow) => {
    if (r.fullAccess) return "Full access to every module and record";
    const mods = PERMISSION_CATALOG.filter((m) => r.permissionKeys.includes(permissionKey(m.module, "read"))).map((m) => m.label);
    return mods.length ? mods.join(", ") : "No module access";
  };

  return (
    <section className="space-y-3" aria-labelledby="roles-heading">
      <div className="flex items-center justify-between gap-3">
        <h3 id="roles-heading" className="text-sm font-bold text-white">Roles &amp; Permissions</h3>
        {canManage && (
          <button
            type="button"
            onClick={() => open("new")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" /> New Role
          </button>
        )}
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {roles.map((r) => (
          <li key={r.id} className="p-4 rounded-xl bg-[#0B0F17] border border-gray-800 space-y-2 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm min-w-0">
                {r.fullAccess ? <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" /> : <Shield className="w-4 h-4 shrink-0" aria-hidden="true" />}
                <span className="truncate">{r.name}</span>
              </div>
              {canManage && (!r.fullAccess || user?.fullAccess) && (
                <div className="flex items-center shrink-0">
                  <button type="button" onClick={() => open(r)} aria-label={`Edit role ${r.name}`} title="Edit permissions" className="p-1.5 text-gray-400 hover:text-blue-400 cursor-pointer">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {!r.fullAccess && (
                    <button
                      type="button"
                      onClick={() => remove(r)}
                      disabled={r.userCount > 0}
                      aria-label={`Delete role ${r.name}`}
                      title={r.userCount > 0 ? "Move its users to another role first" : "Delete role"}
                      className="p-1.5 text-gray-400 hover:text-red-400 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
            {r.description && <p className="text-xs text-gray-400">{r.description}</p>}
            <p className="text-[11px] text-gray-500 mt-auto pt-1">{summary(r)}</p>
            <p className="text-[11px] text-gray-500">{r.userCount} user{r.userCount === 1 ? "" : "s"}</p>
          </li>
        ))}
      </ul>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="role-editor-title">
          <div className="bg-[#0B0F17] border border-gray-800 rounded-2xl p-6 w-full max-w-3xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 id="role-editor-title" className="text-base font-bold text-white">{editing === "new" ? "Create Role" : `Edit Role: ${editing.name}`}</h3>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close" className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={save} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="role-name" className="font-semibold text-gray-300">Role Name</label>
                  <input id="role-name" type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={50} className={FIELD} />
                </div>
                <div className="space-y-1">
                  <label htmlFor="role-desc" className="font-semibold text-gray-300">Description</label>
                  <input id="role-desc" type="text" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={300} className={FIELD} />
                </div>
              </div>

              {isFull ? (
                <p className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300">
                  This role has full access to every module and record. Its permissions cannot be restricted.
                </p>
              ) : (
                <div className="overflow-x-auto border border-gray-800 rounded-xl">
                  <table className="w-full text-left text-xs text-gray-300">
                    <caption className="sr-only">Permissions for this role</caption>
                    <thead className="bg-gray-900/60 text-[11px] uppercase tracking-wider text-gray-400">
                      <tr>
                        <th scope="col" className="px-4 py-3">Module</th>
                        {ALL_ACTIONS.map((a) => (
                          <th key={a} scope="col" className="px-3 py-3 text-center">{ACTION_LABELS[a]}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60">
                      {PERMISSION_CATALOG.map((m) => (
                        <tr key={m.module}>
                          <th scope="row" className="px-4 py-3 font-semibold text-white">
                            {m.label}
                            {m.manageHint && <span className="block text-[10px] font-normal text-gray-500">Manage: {m.manageHint}</span>}
                          </th>
                          {ALL_ACTIONS.map((a) => {
                            if (!m.actions.includes(a)) {
                              return (
                                <td key={a} className="px-3 py-3 text-center text-gray-700">
                                  <Minus className="w-3 h-3 inline" aria-label="Not applicable" />
                                </td>
                              );
                            }
                            const k = permissionKey(m.module, a);
                            const allowed = mayToggle(m.module, a);
                            return (
                              <td key={a} className="px-3 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={keys.has(k)}
                                  onChange={() => toggle(m.module, a)}
                                  disabled={!allowed}
                                  aria-label={`${ACTION_LABELS[a]} ${m.label}`}
                                  title={allowed ? undefined : "You can only grant permissions you have"}
                                  className="w-4 h-4 accent-[#a855f7] cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <p className="text-[11px] text-gray-500">
                View shows the module in the sidebar. Without Manage, users only see and change the records they created.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:opacity-60 cursor-pointer">
                  <Check className="w-3.5 h-3.5" aria-hidden="true" /> {saving ? "Saving..." : "Save Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
