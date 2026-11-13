import AdminLayout from "@/components/admin/AdminLayout";
import BlogAdminTabs from "@/components/admin/BlogAdminTabs";
import TaxonomyManager from "@/components/admin/TaxonomyManager";

export default function BlogCategoriesAdmin() {
  return (
    <AdminLayout title="Blog Categories">
      <div className="space-y-6 w-full mx-auto">
        <BlogAdminTabs />
        <TaxonomyManager module="blogs" label="Category" endpoint="/api/v1/categories" maxLength={60} />
      </div>
    </AdminLayout>
  );
}
