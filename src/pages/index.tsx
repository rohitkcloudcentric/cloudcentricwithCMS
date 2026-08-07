import Head from "next/head";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BuildingIntelligent from "@/components/BuildingIntelligent";
import HowWeBuild from "@/components/HowWeBuild";
import AIEcosystem from "@/components/AIEcosystem";
import TrustedClients from "@/components/TrustedClients";
import RankedSection from "@/components/RankedSection";
import ContactUs from "@/components/ContactUs";
import FloatingButtons from "@/components/FloatingButtons";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>CloudCentric - Where Artificial Intelligence Meets Business Innovation</title>
      </Head>
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
          <RankedSection />

          <section id="contact">
            <ContactUs />
          </section>
        <Footer />
          <FloatingButtons />
        </div>
      </main>
    </>
  );
}
