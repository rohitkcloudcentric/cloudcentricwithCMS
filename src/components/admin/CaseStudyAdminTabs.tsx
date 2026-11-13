import { Briefcase, FolderOpen, Tag } from "lucide-react";
import AdminSubTabs from "./AdminSubTabs";

const TABS = [
  { label: "All Case Studies", href: "/admin/case-studies", icon: Briefcase },
  { label: "Categories", href: "/admin/case-studies/categories", icon: FolderOpen },
  { label: "Tags", href: "/admin/case-studies/tags", icon: Tag },
];

/** Sub-navigation shown at the top of every Case Studies admin screen. */
export default function CaseStudyAdminTabs() {
  return <AdminSubTabs tabs={TABS} label="Case study sections" />;
}
