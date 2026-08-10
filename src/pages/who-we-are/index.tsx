import Head from "next/head";
import Image from "next/image";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import WhoWeAreHero from "@/components/WhoWeAreHero";
import OurFoundation from "@/components/OurFoundation";
import OurValues from "@/components/OurValues";
import TrustedClients from "@/components/TrustedClients";
import RankedSection from "@/components/RankedSection";
import WhoWeAreCTA from "@/components/CTA";

export default function WhoWeAre() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Who We Are - CloudCentric",
    "url": "https://cloudcentric.com/who-we-are",
    "description": "Learn about CloudCentric's foundation, values, and global mission to drive intelligent business transformation through AI and enterprise software."
  };

  return (
    <>
      <Head>
        <title>Who We Are - CloudCentric</title>
        <meta
          name="description"
          content="Learn about CloudCentric's foundation, values, and global mission to drive intelligent business transformation through AI and enterprise software."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://cloudcentric.com/who-we-are" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Who We Are - CloudCentric" />
        <meta property="og:description" content="Learn about CloudCentric's foundation, values, and global mission." />
        <meta property="og:url" content="https://cloudcentric.com/who-we-are" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Who We Are - CloudCentric" />
        <meta name="twitter:description" content="Learn about CloudCentric's foundation, values, and global mission." />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <main className="min-h-screen bg-[#050505] text-white flex flex-col justify-between overflow-x-clip relative">
        {/* Background Image & Glow for the Hero Area */}
        <div className="absolute top-0 left-0 right-0 h-[850px] md:h-[950px] lg:h-[1050px] pointer-events-none z-0">
          <Image
            src="/images/how-we-are/how-we-hero-bg.png"
            alt="Who We Are Background"
            fill
            className="object-cover object-top opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#050505]" />
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
          <RankedSection />

          {/* Footer */}
          <Footer />
        </div>

        <FloatingButtons />
      </main>
    </>
  );
}
