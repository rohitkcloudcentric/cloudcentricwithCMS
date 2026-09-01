import dynamic from "next/dynamic";
import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import CloudIntegrationHero from "@/components/services/CloudIntegrationHero";
import Footer from "@/components/common/Footer";

// Below-the-fold components loaded dynamically for Performance optimization (LCP/TBT)
const CloudTechForBusinessNeed = dynamic(() => import("@/components/services/CloudTechForBusinessNeed"));
const CloudFoundationSection = dynamic(() => import("@/components/services/CloudFoundationSection"));
const MoveBeyondLegacySection = dynamic(() => import("@/components/services/MoveBeyondLegacySection"));
const TechEcosystemSection = dynamic(() => import("@/components/services/TechEcosystemSection"));
const IdeaToProductionProduct = dynamic(() => import("@/components/services/IdeaToProductionProduct"));
const FromIdeaToImpactProcess = dynamic(() => import("@/components/services/FromIdeaToImpactProcess"));
const BuiltWithTechThatScale = dynamic(() => import("@/components/services/BuiltWithTechThatScale"));
const AISolutionsFAQSection = dynamic(() => import("@/components/services/AISolutionsFAQSection"));
const RankedSection = dynamic(() => import("@/components/common/RankedSection"));
const ContactUs = dynamic(() => import("@/components/contact/ContactUs"));

export default function CloudIntegrationPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Cloud & Integration Services",
      "provider": {
        "@type": "Organization",
        "name": "CloudCentric",
        "url": SITE_URL
      },
      "areaServed": "Worldwide",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Cloud Architecture & Integration Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Cloud Migration & Architecture" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Enterprise API & Middleware Integration" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Multi-Cloud & Hybrid Cloud Solutions" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "DevOps & CI/CD Infrastructure Automation" } }
        ]
      },
      "description": "Architect resilient cloud platforms, integrate enterprise systems via APIs & middleware, and automate DevOps infrastructure across AWS, Azure, and Salesforce ecosystems."
    },
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Salesforce", url: "/salesforce/services" },
      { name: "Cloud & Integration", url: "/salesforce/cloud-integration" }
    ])
  ];

  return (
    <>
      <SEOHead
        title="Cloud & Integration Services - CloudCentric"
        description="Architect secure cloud infrastructure, build high-performance enterprise API integrations, and unify complex data ecosystems with AWS, Azure, and Salesforce."
        canonical={`${SITE_URL}/salesforce/cloud-integration`}
        jsonLd={jsonLd}
      />
      <main className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-clip relative">
        <div className="relative z-10 flex flex-col w-full">
          <AnnouncementBar />
          <Navbar />

          {/* Cloud & Integration Hero Section */}
          <CloudIntegrationHero />

          {/* Cloud & Integration Solutions Grid Section */}
          <CloudTechForBusinessNeed
            eyebrow="/ WHAT WE DO"
            title={
              <>
                Build a Connected, Cloud-<br className="hidden sm:inline" />Ready Business
              </>
            }
            subtitle="From cloud migration to API integration and DevOps automation, we create the technology foundation your business needs to operate and scale."
          />

          {/* Cloud Foundation Section */}
          <CloudFoundationSection />

          {/* Move Beyond Legacy Infrastructure Section */}
          <MoveBeyondLegacySection />

          {/* Powered by Modern Cloud & Integration Technologies Ecosystem Section */}
          <TechEcosystemSection />
          
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
