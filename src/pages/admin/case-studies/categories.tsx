import AdminLayout from "@/components/admin/AdminLayout";
import CaseStudyAdminTabs from "@/components/admin/CaseStudyAdminTabs";
import TaxonomyManager from "@/components/admin/TaxonomyManager";

export default function CaseStudyCategoriesAdmin() {
  return (
    <AdminLayout title="Case Study Categories">
      <div className="space-y-6 w-full mx-auto">
        <CaseStudyAdminTabs />
        <TaxonomyManager module="case_studies" label="Category" endpoint="/api/v1/case-study-categories" maxLength={60} itemNoun="case study" />
      </div>
    </AdminLayout>
  );
}
