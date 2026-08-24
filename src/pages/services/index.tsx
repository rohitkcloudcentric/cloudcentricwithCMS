import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import SalesforceServiceHero from "@/components/services/SalesforceServiceHero";
import OurExcellence from "@/components/common/OurExcellence";
import LeadToCustomerJourney from "@/components/common/LeadToCustomerJourney";
import SalesforceProductsClouds from "@/components/common/SalesforceProductsClouds";
import FAQSection from "@/components/home/FAQSection";
import TrustedClients from "@/components/common/TrustedClients";
import RankedSection from "@/components/common/RankedSection";
import ContactUs from "@/components/contact/ContactUs";
import Footer from "@/components/common/Footer";

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
      "description": "We help businesses maximize Salesforce with strategy, implementation, development, integration, and intelligent automation."
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
          <RankedSection />

          {/* Ready to Build Something Intelligent Contact Section */}
          <ContactUs />
        </div>
        <Footer />
      </main>
    </>
  );
}
