import Head from "next/head";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";
import OurClientsHero from "@/components/our-clients/OurClientsHero";
import TrustedClients from "@/components/common/TrustedClients";
import FAQSection from "@/components/home/FAQSection";
import RankedSection from "@/components/common/RankedSection";
import WhoWeAreCTA from "@/components/home/CTA";

export default function OurClients() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Our Clients - CloudCentric",
    "url": "https://cloudcentric.com/our-clients",
    "description": "Discover the global brands and enterprise clients that trust CloudCentric to power their digital transformation."
  };

  return (
    <>
      <Head>
        <title>Our Clients - CloudCentric</title>
        <meta
          name="description"
          content="Discover the global brands and enterprises that trust CloudCentric to power their digital transformation."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://cloudcentric.com/our-clients" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Our Clients - CloudCentric" />
        <meta property="og:description" content="Discover global brands that trust CloudCentric to power their digital transformation." />
        <meta property="og:url" content="https://cloudcentric.com/our-clients" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Clients - CloudCentric" />
        <meta name="twitter:description" content="Discover global brands that trust CloudCentric." />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <main className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-clip relative">
        <div className="relative z-10 flex flex-col w-full">
          <AnnouncementBar />
          <Navbar />

          <OurClientsHero />
          <TrustedClients />
          <FAQSection />
          <RankedSection />
          <WhoWeAreCTA />

          <FloatingButtons />
        </div>
        <Footer />
      </main>
    </>
  );
}
