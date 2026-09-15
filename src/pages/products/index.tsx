import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema, PRODUCT_SCHEMAS } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import OurExcellence from "@/components/common/OurExcellence";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";
import ProductCard, { ProductSection, PRODUCTS } from "@/components/products/ProductCard";
import ProductsHero from "@/components/products/ProductsHero";

// Reusable ProductCard is imported from "@/components/products/ProductCard"

export default function ProductsPage() {
  const jsonLd = [
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Products", url: "/products" }
    ]),
    ...PRODUCT_SCHEMAS
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
              {PRODUCTS.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
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
