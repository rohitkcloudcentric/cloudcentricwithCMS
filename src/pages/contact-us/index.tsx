import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import ContactHero from "@/components/contact/ContactHero";
import TrustedClients from "@/components/common/TrustedClients";
import FAQSection from "@/components/home/FAQSection";
import RankedSection from "@/components/common/RankedSection";
import ContactCTA from "@/components/home/CTA";
import FloatingButtons from "@/components/common/FloatingButtons";
import Footer from "@/components/common/Footer";

export default function ContactUsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Us - CloudCentric",
      "url": `${SITE_URL}/contact-us`,
      "description": "Let's build something intelligent together. Contact CloudCentric for AI, Salesforce, enterprise software, and cloud solutions."
    },
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Contact Us", url: "/contact-us" }
    ])
  ];

  return (
    <>
      <SEOHead
        title="Contact Us - CloudCentric | Get in Touch with AI & Cloud Experts"
        description="Let's build something intelligent together. Contact CloudCentric for AI, Salesforce, enterprise software, and cloud solutions."
        canonical={`${SITE_URL}/contact-us`}
        jsonLd={jsonLd}
      />
      <main className="min-h-screen bg-[#050505] text-white flex flex-col justify-between overflow-x-clip relative">
        <div className="relative z-10 flex flex-col w-full">
          <AnnouncementBar />
          <Navbar />

          <ContactHero />
          <TrustedClients />
          <FAQSection />
          <RankedSection />
          <ContactCTA />

          <FloatingButtons />
        </div>
        <Footer />
      </main>
    </>
  );
}
