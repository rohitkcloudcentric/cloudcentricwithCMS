import dynamic from "next/dynamic";
import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import SalesforceServiceHero from "@/components/services/SalesforceServiceHero";
import Footer from "@/components/common/Footer";

// Below-the-fold components loaded dynamically for Performance optimization (LCP/TBT)
const LeadToCustomerJourney = dynamic(() => import("@/components/common/LeadToCustomerJourney"));
const SalesforceProductsClouds = dynamic(() => import("@/components/common/SalesforceProductsClouds"));
const OurExcellence = dynamic(() => import("@/components/common/OurExcellence"));
const FAQSection = dynamic(() => import("@/components/home/FAQSection"));
const TrustedClients = dynamic(() => import("@/components/common/TrustedClients"));
// const RankedSection = dynamic(() => import("@/components/common/RankedSection"));
const ContactUs = dynamic(() => import("@/components/contact/ContactUs"));

export default function ServicesPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Salesforce Services & Ecosystem Solutions",
      "provider": {
        "@type": "Organization",
        "name": "CloudCentric",
        "url": SITE_URL
      },
      "areaServed": "Worldwide",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Salesforce Consulting & Implementation Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Salesforce Consulting" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Salesforce Implementation" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Salesforce Development" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Salesforce Integration" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "AI & Agentic Automation" } }
        ]
      },
      "description": "We help businesses maximize Salesforce with strategy, implementation, development, integration, and intelligent automation. 10+ years expertise & 400+ successful projects."
    },
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Services", url: "/services" }
    ])
  ];

  return (
    <>
      <SEOHead
        title="Salesforce Services - CloudCentric | Strategy, Implementation & Automation"
        description="We help businesses maximize Salesforce with strategy, implementation, development, integration, and intelligent automation. 10+ years expertise & 400+ successful projects."
        canonical={`${SITE_URL}/services`}
        jsonLd={jsonLd}
      />
      <main className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-clip relative">
        <div className="relative z-10 flex flex-col w-full">
          <AnnouncementBar />
          <Navbar />

          {/* New Salesforce Service Hero Section */}
          <SalesforceServiceHero />

          {/* From Lead to Customer Journey Section */}
          <LeadToCustomerJourney />

          {/* Salesforce Products & Clouds Specialization Section */}
          <SalesforceProductsClouds />

          {/* Our Excellence Certifications & Awards Section */}
          <OurExcellence />

          {/* FAQ Section */}
          <FAQSection />

          {/* Trusted Clients Section */}
          <TrustedClients />

          {/* Ranked Section */}
          {/* <RankedSection /> */}

          {/* Ready to Build Something Intelligent Contact Section */}
          <ContactUs />
        </div>
        <Footer />
      </main>
    </>
  );
}
