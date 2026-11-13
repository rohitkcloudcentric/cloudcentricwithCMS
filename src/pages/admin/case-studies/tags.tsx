import AdminLayout from "@/components/admin/AdminLayout";
import CaseStudyAdminTabs from "@/components/admin/CaseStudyAdminTabs";
import TaxonomyManager from "@/components/admin/TaxonomyManager";

export default function CaseStudyTagsAdmin() {
  return (
    <AdminLayout title="Case Study Tags">
      <div className="space-y-6 w-full mx-auto">
        <CaseStudyAdminTabs />
        <TaxonomyManager module="case_studies" label="Tag" endpoint="/api/v1/case-study-tags" maxLength={40} itemNoun="case study" />
      </div>
    </AdminLayout>
  );
}
