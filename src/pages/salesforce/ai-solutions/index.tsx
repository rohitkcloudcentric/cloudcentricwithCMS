import dynamic from "next/dynamic";
import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import AISolutionsHero from "@/components/services/AISolutionsHero";
import Footer from "@/components/common/Footer";

// Below-the-fold components loaded dynamically for Performance optimization (LCP/TBT)
const AIBuiltAroundYourBusiness = dynamic(() => import("@/components/services/AIBuiltAroundYourBusiness"));
const AgenticAIAgentsSection = dynamic(() => import("@/components/services/AgenticAIAgentsSection"));
const HowWeBuild = dynamic(() => import("@/components/common/HowWeBuild"));
const WhyCloudCentricAI = dynamic(() => import("@/components/services/WhyCloudCentricAI"));
const AISolutionsFAQSection = dynamic(() => import("@/components/services/AISolutionsFAQSection"));
const OurExcellence = dynamic(() => import("@/components/common/OurExcellence"));
// const RankedSection = dynamic(() => import("@/components/common/RankedSection"));
const ContactUs = dynamic(() => import("@/components/contact/ContactUs"));

export default function AISolutionsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Salesforce AI Solutions & Agentforce Services",
      "provider": {
        "@type": "Organization",
        "name": "CloudCentric",
        "url": SITE_URL
      },
      "areaServed": "Worldwide",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "AI & Agentic Automation Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Salesforce Agentforce Deployment" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Einstein AI & Predictive Intelligence" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom AI Agent Development" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Data Cloud & RAG Architecture" } }
        ]
      },
      "description": "Transform Salesforce CRM with autonomous AI agents, Agentforce solutions, Einstein AI, and real-time predictive analytics."
    },
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Salesforce", url: "/service/services" },
      { name: "AI Solutions", url: "/service/ai-solutions" }
    ])
  ];

  return (
    <>
      <SEOHead
        title="Salesforce AI Solutions & Agentforce Services - CloudCentric"
        description="Deploy Salesforce Agentforce autonomous AI agents, Einstein AI, and custom AI solutions integrated seamlessly into your Salesforce Data Cloud."
        canonical={`${SITE_URL}/service/ai-solutions`}
        jsonLd={jsonLd}
      />
      <main className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-clip relative">
        <div className="relative z-10 flex flex-col w-full">
          <AnnouncementBar />
          <Navbar />

          {/* Salesforce AI Solutions Hero Section */}
          <AISolutionsHero />

          {/* AI Built Around Your Business Section */}
          <AIBuiltAroundYourBusiness />

          {/* Agentic AI Agents Section (Understand, Reason, Act, Escalate) */}
          <AgenticAIAgentsSection />

          {/* How We Build Section */}
          <HowWeBuild />

          {/* Why CloudCentric AI Section */}
          <WhyCloudCentricAI />

          {/* AI Solutions FAQ Section */}
          <AISolutionsFAQSection />

          {/* Ranked Section */}
          {/* <RankedSection /> */}
          <OurExcellence />

          {/* Contact Section */}
          <ContactUs />
        </div>
        <Footer />
      </main>
    </>
  );
}
