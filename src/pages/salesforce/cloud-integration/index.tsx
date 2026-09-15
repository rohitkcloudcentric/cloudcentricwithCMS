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
const AISolutionsFAQSection = dynamic(() => import("@/components/services/AISolutionsFAQSection"));
const OurExcellence = dynamic(() => import("@/components/common/OurExcellence"));
// const RankedSection = dynamic(() => import("@/components/common/RankedSection"));
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
      { name: "Salesforce", url: "/services" },
      { name: "Cloud & Integration", url: "/service/cloud-integration" }
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
          <AISolutionsFAQSection
            title={
              <>
                Questions Before You Start Your <br className="hidden sm:inline" />
                <span className="bg-linear-to-r from-[#2563EB] to-[#A855F7] bg-clip-text text-transparent">
                  Cloud & Integration?
                </span>
              </>
            }
            description="Find answers to common questions about cloud migration, API development, system integration, and infrastructure management."
            faqs={[
              {
                id: 1,
                question: "01. Can you migrate our existing applications to the cloud?",
                answer:
                  "Yes. We specialize in migrating legacy software, databases, and enterprise applications to public or hybrid clouds like AWS and Azure with minimal downtime and data integrity.",
              },
              {
                id: 2,
                question: "02. Do you work with AWS and Azure?",
                answer:
                  "Yes. We help businesses design, migrate, develop, integrate, and optimize solutions across leading cloud platforms including AWS and Microsoft Azure.",
              },
              {
                id: 3,
                question: "03. Can you integrate our existing business systems?",
                answer:
                  "Yes. We connect your enterprise software, CRM platforms, databases, and third-party tools via custom REST APIs, GraphQL, and secure middleware.",
              },
              {
                id: 4,
                question: "04. Can you manage our DevOps and deployment processes?",
                answer:
                  "Yes. We set up automated CI/CD pipelines, containerized environments using Docker and Kubernetes, and infrastructure-as-code to streamline deployments.",
              },
              {
                id: 5,
                question: "05. Can you optimize our existing cloud infrastructure?",
                answer:
                  "Yes. We audit your current cloud setups to enhance security, improve resource performance, eliminate inefficiencies, and lower operational costs.",
              },
            ]}
          />

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
