import type { GetServerSideProps } from "next";
import { getOurClientsData, type OurClientsData } from "@/lib/client-data";
import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";
import OurClientsHero from "@/components/our-clients/OurClientsHero";
import TrustedClients from "@/components/common/TrustedClients";
import FAQSection from "@/components/home/FAQSection";
import OurExcellence from "@/components/common/OurExcellence";
import WhoWeAreCTA from "@/components/home/CTA";

export const getServerSideProps: GetServerSideProps<OurClientsData> = async () => {
  return { props: await getOurClientsData() };
};

export default function OurClients({ clients = [], categories = [] }: OurClientsData) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Our Clients - CloudCentric",
      "url": `${SITE_URL}/our-clients`,
      "description": "Discover the global brands and enterprise clients that trust CloudCentric to power their digital transformation."
    },
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Our Clients", url: "/our-clients" }
    ])
  ];

  return (
    <>
      <SEOHead
        title="Our Clients & Partners - CloudCentric"
        description="Discover the global brands and enterprises that trust CloudCentric to power their digital transformation."
        canonical={`${SITE_URL}/our-clients`}
        jsonLd={jsonLd}
      />
      <main className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-clip relative">
        <div className="relative z-10 flex flex-col w-full">
          <AnnouncementBar />
          <Navbar />

          <OurClientsHero clients={clients} categories={categories} />
          <TrustedClients />
          <FAQSection />
          {/* <RankedSection /> */}
          <OurExcellence />
          <WhoWeAreCTA />

          <FloatingButtons />
        </div>
        <Footer />
      </main>
    </>
  );
}
