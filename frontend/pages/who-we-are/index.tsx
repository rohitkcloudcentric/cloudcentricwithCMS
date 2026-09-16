import Image from "next/image";
import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { generateBreadcrumbSchema } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";
import WhoWeAreHero from "@/components/who-we-are/WhoWeAreHero";
import OurFoundation from "@/components/home/OurFoundation";
import OurValues from "@/components/who-we-are/OurValues";
import TrustedClients from "@/components/common/TrustedClients";
import OurExcellence from "@/components/common/OurExcellence";
import WhoWeAreCTA from "@/components/home/CTA";

export default function WhoWeAre() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "Who We Are - CloudCentric",
      "url": `${SITE_URL}/who-we-are`,
      "description": "Learn about CloudCentric's foundation, values, and global mission to drive intelligent business transformation through AI and enterprise software."
    },
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Who We Are", url: "/who-we-are" }
    ])
  ];

  return (
    <>
      <SEOHead
        title="Who We Are - CloudCentric | Foundation, Mission & Values"
        description="Learn about CloudCentric's foundation, values, and global mission to drive intelligent business transformation through AI and enterprise software."
        canonical={`${SITE_URL}/who-we-are`}
        jsonLd={jsonLd}
      />
      <main className="min-h-screen bg-[#050505] text-white flex flex-col justify-between overflow-x-clip relative">
        {/* Background Image & Glow for the Hero Area */}
        <div className="absolute top-0 left-0 right-0 h-212.5 md:h-237.5 lg:h-262.5 pointer-events-none z-0">
          <Image
            src="/images/how-we-are/how-we-hero-bg.png"
            alt="Who We Are Background"
            fill
            className="object-cover object-top opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-[#050505]" />
        </div>

        <div className="relative z-10 flex flex-col w-full min-h-screen justify-between">
          {/* Header */}
          <AnnouncementBar />
          <Navbar />

          {/* Content Area - Who We Are Hero */}
          <WhoWeAreHero />

          {/* Our Foundation section */}
          <OurFoundation />

          {/* Our Values section */}
          <OurValues />

          {/* Trusted Clients Section */}
          <TrustedClients />

          {/* Who We Are CTA Section */}
          <WhoWeAreCTA />

          {/* Ranked Section */}
          {/* <RankedSection /> */}
          <OurExcellence />

          {/* Footer */}
          <Footer />
        </div>

        <FloatingButtons />
      </main>
    </>
  );
}
