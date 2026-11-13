import { useMemo, useSyncExternalStore } from "react";
import type { ActionName, ModuleName } from "@/lib/permission-catalog";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  roleId?: string;
  fullAccess?: boolean;
  avatarUrl?: string | null;
  username?: string | null;
  phone?: string | null;
  permissionKeys?: string[];
}

export interface AdminAuth {
  user: AdminUser | null;
  /** UI convenience only; every rule is enforced again by the API. */
  can: (module: ModuleName, action: ActionName) => boolean;
  /** At least one of the actions */
  canAny: (module: ModuleName, actions: ActionName[]) => boolean;
}

export function buildAdminAuth(user: AdminUser | null): AdminAuth {
  const keys = new Set(user?.permissionKeys ?? []);
  const can = (module: ModuleName, action: ActionName) => Boolean(user?.fullAccess) || keys.has(`${module}:${action}`);
  return { user, can, canAny: (module, actions) => actions.some((a) => can(module, a)) };
}

// ── Tiny shared store: AdminLayout writes the signed-in user, any admin page can read it ──
let currentUser: AdminUser | null = null;
const listeners = new Set<() => void>();

export function setAdminUser(user: AdminUser | null) {
  currentUser = user;
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Logged-in admin + permission helpers. `user` is null until AdminLayout has loaded it. */
export function useAdminAuth(): AdminAuth {
  const user = useSyncExternalStore(subscribe, () => currentUser, () => null);
  return useMemo(() => buildAdminAuth(user), [user]);
}
