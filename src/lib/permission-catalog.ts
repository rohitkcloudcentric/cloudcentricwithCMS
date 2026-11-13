/**
 * The modules and actions the admin dashboard understands.
 * This is the list of *capabilities* the code can enforce; which role holds which
 * permission lives in the database (Role / Permission / RolePermission) and is
 * edited from User Roles & RBAC. Pure data: safe to import on client and server.
 */
export type ModuleName =
  | "blogs"
  | "case_studies"
  | "products"
  | "clients"
  | "newsletter"
  | "users"
  | "audit_logs"
  | "contact_settings"
  | "settings";

export type ActionName = "read" | "create" | "update" | "delete" | "publish" | "manage";

export interface ModuleDefinition {
  module: ModuleName;
  label: string;
  /** Admin URL prefix guarded by `read` */
  path: string;
  actions: ActionName[];
  /** What "manage" means for this module (shown in the matrix) */
  manageHint?: string;
}

export const ACTION_LABELS: Record<ActionName, string> = {
  read: "View",
  create: "Add",
  update: "Edit",
  delete: "Delete",
  publish: "Publish",
  manage: "Manage",
};

export const PERMISSION_CATALOG: ModuleDefinition[] = [
  { module: "blogs", label: "Blog Articles", path: "/admin/blogs", actions: ["read", "create", "update", "delete", "publish", "manage"], manageHint: "Access every article, not only own" },
  { module: "case_studies", label: "Case Studies", path: "/admin/case-studies", actions: ["read", "create", "update", "delete", "publish", "manage"], manageHint: "Access every case study, not only own" },
  { module: "products", label: "Products", path: "/admin/products", actions: ["read", "create", "update", "delete", "publish", "manage"], manageHint: "Access every product, not only own" },
  { module: "clients", label: "Our Clients", path: "/admin/clients", actions: ["read", "create", "update", "delete", "manage"], manageHint: "Access every client, not only own" },
  { module: "newsletter", label: "Newsletter", path: "/admin/newsletter", actions: ["read", "update"] },
  { module: "contact_settings", label: "Contact Settings", path: "/admin/contact-settings", actions: ["read", "create", "update", "delete"] },
  { module: "users", label: "User Roles & RBAC", path: "/admin/users", actions: ["read", "create", "update", "delete", "manage"], manageHint: "Assign roles and edit role permissions" },
  { module: "audit_logs", label: "Audit Logs", path: "/admin/audit-logs", actions: ["read", "manage"], manageHint: "See everyone's activity, not only own" },
];

/** Modules where records have an owner and "manage" unlocks everyone's records. */
export const OWNED_MODULES: ModuleName[] = ["blogs", "case_studies", "products", "clients"];

export const permissionKey = (module: string, action: string) => `${module}:${action}`;

export function isCatalogPermission(module: string, action: string): boolean {
  return PERMISSION_CATALOG.some((m) => m.module === module && (m.actions as string[]).includes(action));
}

/** Module that guards an admin URL (longest prefix wins). */
export function moduleForPath(pathname: string): ModuleDefinition | undefined {
  return PERMISSION_CATALOG.filter((m) => pathname === m.path || pathname.startsWith(`${m.path}/`)).sort(
    (a, b) => b.path.length - a.path.length
  )[0];
}
