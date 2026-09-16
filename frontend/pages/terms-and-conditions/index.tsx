import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";
import TermsAndConditionsContent from "@/components/terms-and-conditions/TermsAndConditionsContent";

export default function TermsAndConditionsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Terms and Conditions - CloudCentric",
      "url": `${SITE_URL}/terms-and-conditions`,
      "description": "Read the Terms and Conditions for CloudCentric Infotech."
    },
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Terms and Conditions", url: "/terms-and-conditions" }
    ])
  ];

  return (
    <>
      <SEOHead
        title="Terms and Conditions - CloudCentric"
        description="Read the Terms and Conditions for CloudCentric Infotech."
        canonical={`${SITE_URL}/terms-and-conditions`}
        jsonLd={jsonLd}
      />
      <main className="min-h-screen bg-[#050505] text-white flex flex-col justify-between overflow-x-clip relative">
        <div className="relative z-10 flex flex-col w-full min-h-screen justify-between">
          {/* Header */}
          <AnnouncementBar />
          <Navbar />

          {/* Terms and Conditions Content */}
          <TermsAndConditionsContent />

          {/* Footer */}
          <Footer />
        </div>

        <FloatingButtons />
      </main>
    </>
  );
}
