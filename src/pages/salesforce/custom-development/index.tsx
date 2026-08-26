import dynamic from "next/dynamic";
import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import CustomDevHero from "@/components/services/CustomDevHero";
import Footer from "@/components/common/Footer";

// Below-the-fold components loaded dynamically for Performance optimization (LCP/TBT)
const CustomTechForBusinessNeed = dynamic(() => import("@/components/services/CustomTechForBusinessNeed"));
const IdeaToProductionProduct = dynamic(() => import("@/components/services/IdeaToProductionProduct"));
const FromIdeaToImpactProcess = dynamic(() => import("@/components/services/FromIdeaToImpactProcess"));
const BuiltWithTechThatScale = dynamic(() => import("@/components/services/BuiltWithTechThatScale"));
const AISolutionsFAQSection = dynamic(() => import("@/components/services/AISolutionsFAQSection"));
const RankedSection = dynamic(() => import("@/components/common/RankedSection"));
const ContactUs = dynamic(() => import("@/components/contact/ContactUs"));

export default function CustomDevelopmentPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Custom Development & AI Engineering Services",
      "provider": {
        "@type": "Organization",
        "name": "CloudCentric",
        "url": SITE_URL
      },
      "areaServed": "Worldwide",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Custom Enterprise Software & AI Development",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Software Development" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom AI & LLM Engineering" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Enterprise API & Systems Integration" } }
        ]
      },
      "description": "Tailored enterprise software development, custom AI solutions, cloud architecture, and API integration engineered around your business goals."
    },
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Salesforce", url: "/salesforce/services" },
      { name: "Custom Development", url: "/salesforce/custom-development" }
    ])
  ];

  return (
    <>
      <SEOHead
        title="Custom Development & AI Solutions - CloudCentric"
        description="Build scalable custom enterprise software, intelligent AI applications, and connected cloud ecosystems designed specifically around your operational workflows."
        canonical={`${SITE_URL}/salesforce/custom-development`}
        jsonLd={jsonLd}
      />
      <main className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-clip relative">
        <div className="relative z-10 flex flex-col w-full">
          <AnnouncementBar />
          <Navbar />

          {/* Custom Development Hero Section */}
          <CustomDevHero />

          {/* Custom Technology for Every Business Need Section */}
          <CustomTechForBusinessNeed />

          {/* From Idea to Production-Ready Product Section */}
          <IdeaToProductionProduct />

          {/* From Idea to Impact Process Section */}
          <FromIdeaToImpactProcess />

          {/* Built With Technologies That Scale Section */}
          <BuiltWithTechThatScale />

          {/* FAQ Section */}
          <AISolutionsFAQSection />

          {/* Ranked Section */}
          <RankedSection />

          {/* Contact Section */}
          <ContactUs />
        </div>
        <Footer />
      </main>
    </>
  );
}
