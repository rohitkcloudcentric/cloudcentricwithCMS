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
      { name: "Salesforce", url: "/services" },
      { name: "Custom Development", url: "/service/custom-development" }
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
          <AISolutionsFAQSection
            title={
              <>
                Questions Before You Start Your <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#2563EB] to-[#A855F7] bg-clip-text text-transparent">
                  Software Journey?
                </span>
              </>
            }
            description="Get clear answers about our custom software expertise, implementation approach, integrations, support, and how we help businesses build scalable solutions."
            faqs={[
              {
                id: 1,
                question: "Where should our business start with AI?",
                answer:
                  "We recommend starting with an AI readiness assessment and a high-impact proof of concept. We help identify manual bottlenecks, high-value data opportunities, and quick wins to build momentum and prove ROI.",
              },
              {
                id: 2,
                question: "Can you integrate AI with our existing systems?",
                answer:
                  "Yes. We can connect AI with Salesforce, CRM platforms, databases, cloud applications, APIs, communication platforms, and other enterprise systems.",
              },
              {
                id: 3,
                question: "Do you build custom AI agents?",
                answer:
                  "Yes. We build autonomous AI agents tailored to your business workflows. These agents can understand context, reason through multi-step decisions, connect to your APIs, and execute tasks automatically.",
              },
              {
                id: 4,
                question: "Can we start with a small AI proof of concept?",
                answer:
                  "Absolutely. We frequently build small-scale, rapid AI proofs of concept (POCs) so you can validate value, test accuracy, and demonstrate feasibility before rolling out enterprise-wide solutions.",
              },
              {
                id: 5,
                question: "How do you keep enterprise AI secure?",
                answer:
                  "We follow strict enterprise security standards including data encryption, role-based access control, secure API gateways, and private cloud deployment to ensure your proprietary business data remains safe and confidential.",
              },
            ]}
          />


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
