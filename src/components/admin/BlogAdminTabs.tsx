import { FileText, FolderOpen, Tag } from "lucide-react";
import AdminSubTabs from "./AdminSubTabs";

const TABS = [
  { label: "All Articles", href: "/admin/blogs", icon: FileText },
  { label: "Categories", href: "/admin/blogs/categories", icon: FolderOpen },
  { label: "Tags", href: "/admin/blogs/tags", icon: Tag },
];

/** Sub-navigation shown at the top of every Blog Articles admin screen. */
export default function BlogAdminTabs() {
  return <AdminSubTabs tabs={TABS} label="Blog sections" />;
}
