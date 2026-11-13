import { Building2, FolderOpen } from "lucide-react";
import AdminSubTabs from "./AdminSubTabs";

const TABS = [
  { label: "All Clients", href: "/admin/clients", icon: Building2 },
  { label: "Categories", href: "/admin/clients/categories", icon: FolderOpen },
];

/** Sub-navigation shown at the top of every Our Clients admin screen. */
export default function ClientAdminTabs() {
  return <AdminSubTabs tabs={TABS} label="Our Clients sections" />;
}
