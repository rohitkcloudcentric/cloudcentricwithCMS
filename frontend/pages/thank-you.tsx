import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, BookOpen, FolderOpen, Mail } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import FloatingButtons from "@/components/common/FloatingButtons";

export default function ThankYouPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <>
      <SEOHead
        title="Thank You - CloudCentric"
        description="Thank you for reaching out to CloudCentric. Our AI & Cloud Transformation experts will get back to you shortly."
        canonical={`${SITE_URL}/thank-you`}
        noindex={true}
      />
      <main className="min-h-screen bg-[#050505] text-white flex flex-col justify-between overflow-x-clip relative">
        {/* Background Radial Glow Layer */}
        <div 
          className="absolute top-0 left-0 right-0 h-[800px] pointer-events-none z-0"
          style={{
            backgroundImage: "url('/images/hero-bg-1.png')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
        {/* Background Ribbon Flow Layer */}
        <div 
          className="absolute top-0 left-0 right-0 h-[800px] pointer-events-none z-0 mix-blend-screen opacity-75"
          style={{
            backgroundImage: "url('/images/hero-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            filter: "invert(1) hue-rotate(180deg) brightness(1.25) contrast(1.2)",
          }}
        />

        <div className="relative z-10 flex flex-col w-full flex-grow">
          <AnnouncementBar />
          <Navbar />

          <section className="flex-grow max-w-4xl mx-auto w-full px-6 flex flex-col items-center justify-center text-center py-16 md:py-24">
            {/* Animated Checkmark Icon Wrapper */}
            <div className="relative mb-8 flex items-center justify-center">
              {/* Outer Ripple Effect */}
              <div className="absolute inset-0 rounded-full bg-[#7C3AED]/20 animate-ping opacity-75 pointer-events-none duration-1000" style={{ width: "80px", height: "80px" }} />
              {/* Core Circular Border/Background */}
              <div className="w-20 h-20 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/30 flex items-center justify-center relative shadow-[0_0_30px_rgba(124,58,237,0.3)]">
                <Check className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Main Thank You Typography */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white leading-tight font-duru tracking-tight mb-4">
              Thank You for Reaching Out!
            </h1>
            
            <p className="text-sm md:text-base text-[#C6C6D1] max-w-[580px] leading-relaxed font-normal font-intel mb-10">
              Your inquiry has been successfully received. Our AI &amp; Cloud Transformation experts are already reviewing your details and will get back to you within 24 business hours.
            </p>

            {/* Countdown / Redirect Helper Text */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 text-xs text-white/60 mb-12 font-intel">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Redirecting you to Home in <strong className="text-white font-semibold">{countdown}</strong> seconds...
            </div>

            {/* Back to Home Button */}
            <div className="mt-12 flex justify-center w-full">
              <Link 
                href="/"
                className="group inline-flex items-center justify-between gap-5 py-2 pl-6 pr-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-semibold tracking-wider hover:border-white/20 hover:bg-white/[0.08] transition-all active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.4)] font-intel cursor-pointer"
              >
                <span className="tracking-widest uppercase flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4 text-white/60 group-hover:-translate-x-1 transition-transform" /> Back to Home
                </span>
                <div className="flex items-center justify-center w-14 h-8 bg-white rounded-l-3xl rounded-r-xl transition-transform">
                  <svg className="w-8 h-4 text-[#7C3AED]" viewBox="0 0 32 16" fill="none" aria-hidden="true">
                    <path d="M4 8H26M26 8L20 3M26 8L20 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Link>
            </div>

          </section>

          <Footer />
          <FloatingButtons />
        </div>
      </main>
    </>
  );
}
