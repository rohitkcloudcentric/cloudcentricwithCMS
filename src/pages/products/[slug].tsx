import type { GetServerSideProps } from "next";
import { getProductBySlug } from "@/lib/product-data";
import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";
import { ProductDetailsContent, ProductDetailsHero } from "@/components/products/ProductDetails";
import type { ProductPost } from "@/components/products/product-types";

interface ProductDetailsPageProps {
  product: ProductPost;
  others: ProductPost[];
}

export const getServerSideProps: GetServerSideProps<ProductDetailsPageProps> = async ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const detail = await getProductBySlug(slug);
  if (!detail) return { notFound: true };
  return { props: { product: detail.product, others: detail.others } };
};

export default function ProductDetailsPage({ product, others = [] }: ProductDetailsPageProps) {
  const image = product.featuredImage || product.image;
  const absImage = image ? (image.startsWith("http") ? image : `${SITE_URL}${image}`) : undefined;
  const description = product.seoDescription || product.shortDescription;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": description,
      ...(absImage ? { "image": absImage } : {}),
      "url": `${SITE_URL}/products/${product.slug}`,
      "brand": { "@type": "Brand", "name": "CloudCentric Infotech" },
    },
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Products", url: "/products" },
      { name: product.name, url: `/products/${product.slug}` },
    ]),
  ];

  return (
    <>
      <SEOHead
        title={product.seoTitle || `${product.name} - CloudCentric Products`}
        description={description}
        canonical={`${SITE_URL}/products/${product.slug}`}
        ogImage={image || undefined}
        jsonLd={jsonLd}
      />

      <main className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-clip selection:bg-[#7C3AED] selection:text-white relative">
        <div className="relative z-10 flex flex-col w-full">
          <AnnouncementBar />
          <Navbar />
          <ProductDetailsHero product={product} />
          <ProductDetailsContent product={product} others={others} />
          <Footer />
          <FloatingButtons />
        </div>
      </main>
    </>
  );
}
