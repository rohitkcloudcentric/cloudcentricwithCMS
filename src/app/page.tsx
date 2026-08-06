import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BuildingIntelligent from "@/components/BuildingIntelligent";
import RankedSection from "@/components/RankedSection";
import TrustedClients from "@/components/TrustedClients";
import AIEcosystem from "@/components/AIEcosystem";
import HowWeBuild from "@/components/HowWeBuild";
import ContactUs from "@/components/ContactUs";
import FloatingButtons from "@/components/FloatingButtons";

export default function Home() {
  return (
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
        <FloatingButtons />
      </div>
    </main>
  );
}
