import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import { FAQ_SCHEMA } from "@/lib/sitemap-helper";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import Hero from "@/components/home/Hero";
import BuildingIntelligent from "@/components/home/BuildingIntelligent";
import HowWeBuild from "@/components/common/HowWeBuild";
import AIEcosystem from "@/components/home/AIEcosystem";
import TrustedClients from "@/components/common/TrustedClients";
// import RankedSection from "@/components/common/RankedSection";
import OurExcellence from "@/components/common/OurExcellence";
import ContactUs from "@/components/contact/ContactUs";
import Footer from "@/components/common/Footer";

export default function Home() {
  return (
    <>
      <SEOHead
        title="CloudCentric - Where Artificial Intelligence Meets Business Innovation"
        description="CloudCentric helps modern businesses adopt AI, automate workflows, optimize customer experiences, and build scalable digital ecosystems."
        canonical={SITE_URL}
        jsonLd={[FAQ_SCHEMA]}
      />
      <main className="min-h-screen bg-[#050505] text-white flex flex-col overflow-x-clip selection:bg-[#7C3AED] selection:text-white relative">
        {/* Background Radial Glow Layer */}
        <div 
          className="absolute top-0 left-0 right-0 h-[1000px] pointer-events-none z-0"
          style={{
            backgroundImage: "url('/images/hero-bg-1.png')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
        {/* Background Ribbon Flow Layer */}
        <div 
          className="absolute top-0 left-0 right-0 h-[1000px] pointer-events-none z-0 mix-blend-screen opacity-85"
          style={{
            backgroundImage: "url('/images/hero-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            filter: "invert(1) hue-rotate(180deg) brightness(1.25) contrast(1.2)",
          }}
        />

        <div className="relative z-10 flex flex-col w-full">
          <AnnouncementBar />
          <Navbar />
          <Hero />
          <BuildingIntelligent />
          <HowWeBuild />
          <AIEcosystem />
          <TrustedClients />
          {/* <RankedSection /> */}
          <OurExcellence />

          <section id="contact">
            <ContactUs />
          </section>
        <Footer />
        </div>
      </main>
    </>
  );
}
