import AdminLayout from "@/components/admin/AdminLayout";
import ClientAdminTabs from "@/components/admin/ClientAdminTabs";
import TaxonomyManager from "@/components/admin/TaxonomyManager";

export default function ClientCategoriesAdmin() {
  return (
    <AdminLayout title="Client Categories">
      <div className="space-y-6 w-full mx-auto">
        <ClientAdminTabs />
        <TaxonomyManager module="clients" label="Category" endpoint="/api/v1/client-categories" maxLength={60} itemNoun="client" />
      </div>
    </AdminLayout>
  );
}
