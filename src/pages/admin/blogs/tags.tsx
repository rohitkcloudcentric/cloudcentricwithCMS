import AdminLayout from "@/components/admin/AdminLayout";
import BlogAdminTabs from "@/components/admin/BlogAdminTabs";
import TaxonomyManager from "@/components/admin/TaxonomyManager";

export default function BlogTagsAdmin() {
  return (
    <AdminLayout title="Blog Tags">
      <div className="space-y-6 w-full mx-auto">
        <BlogAdminTabs />
        <TaxonomyManager module="blogs" label="Tag" endpoint="/api/v1/tags" maxLength={40} />
      </div>
    </AdminLayout>
  );
}
