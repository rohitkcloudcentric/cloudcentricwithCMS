import type { GetServerSideProps } from "next";
import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema, generateProductSchemas } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import OurExcellence from "@/components/common/OurExcellence";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";
import ProductCard from "@/components/products/ProductCard";
import ProductsHero from "@/components/products/ProductsHero";
import type { ProductPost } from "@/components/products/product-types";
import { getPublishedProducts } from "@/lib/product-data";

interface ProductsPageProps {
  products: ProductPost[];
}

export const getServerSideProps: GetServerSideProps<ProductsPageProps> = async () => {
  return { props: { products: await getPublishedProducts() } };
};

export default function ProductsPage({ products = [] }: ProductsPageProps) {
  const jsonLd = [
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Products", url: "/products" }
    ]),
    ...generateProductSchemas(products)
  ];

  return (
    <>
      <SEOHead
        title="Our Products - CloudCentric | Custom Salesforce Apps & SaaS Tools"
        description="Explore our suite of next-generation Salesforce-powered applications, cloud automation tools, and custom-built enterprise SaaS platforms."
        canonical={`${SITE_URL}/products`}
        jsonLd={jsonLd}
      />

      <main className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-clip selection:bg-[#7C3AED] selection:text-white relative">
        <div className="relative z-10 flex flex-col w-full">
          <AnnouncementBar />
          <Navbar />

          <ProductsHero />

          {/* ── Product List Cards Section (Matching Case Study Card UI) ── */}
          <section className="w-full bg-[#050505] text-white py-16 sm:py-24 px-6 sm:px-10  z-10 relative">
            <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))
              ) : (
                <p className="text-center text-white/60 text-sm py-16" style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}>
                  Our products are coming soon. Please check back shortly.
                </p>
              )}
            </div>
          </section>

          {/* <RankedSection /> */}
          <OurExcellence />
          <Footer />
          <FloatingButtons />
        </div>
      </main>
    </>
  );
}
