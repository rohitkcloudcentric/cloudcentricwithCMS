"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

function PolicySection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-800 ease-out transform ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function PrivacyPolicyContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isHeroVisible, setIsHeroVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeroVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-6 pt-10 pb-20 md:pb-28 z-10 overflow-hidden">
      {/* Decorative Right Side Shape (shape-1.svg) */}
      <div className="absolute top-30 right-0 h-auto pointer-events-none z-30 opacity-90 animate-float-slow">
        <Image
          src="/images/what we-do/shape-1.svg"
          alt="Decorative Shape"
          width={142}
          height={153}
          className="w-full h-auto object-contain"
          priority
        />
      </div>

      {/* Top Hero Section Header — Comes from Left */}
      <div ref={heroRef} className="relative w-full flex flex-col items-center justify-center text-center pt-4 pb-6 sm:pb-10 mb-6">

        {/* Breadcrumb Pill — Comes from Left */}
        <div 
          className={`relative z-10 inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-[rgba(18,18,26,0.85)] border border-white/10 text-xs font-semibold tracking-widest uppercase mb-6 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] font-intel transition-all duration-800 ease-out transform ${
            isHeroVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
          }`}
        >
          <Link href="/" className="text-white/60 hover:text-white transition-colors">
            HOME
          </Link>
          <span className="text-[#8B5CF6] font-bold mx-1">•</span>
          <span className="bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#A855F7] bg-clip-text text-transparent font-bold">
            PRIVACY POLICY
          </span>
        </div>

        {/* Page Title — Comes from Left */}
        <h1 
          className={`relative z-10 text-3xl sm:text-5xl lg:text-[56px] font-normal text-white tracking-tight font-duru leading-tight transition-all duration-800 ease-out transform ${
            isHeroVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          Privacy Policy
        </h1>
      </div>

      {/* Content Sections — Each section observes its own scroll visibility & comes from Bottom */}
      <div className="max-w-5xl mx-auto space-y-10 sm:space-y-12">
        {/* Section 1: Legal Disclaimer */}
        <PolicySection className="space-y-3">
          <h2 className="text-xl sm:text-xl font-normal text-white tracking-wide font-duru">
            Legal Disclaimer:
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            The information provided on this site is for general informational purposes only and does not constitute legal, financial, or professional advice. While we strive to keep content accurate and up to date, we make no guarantees regarding completeness, reliability, or suitability for specific purposes. Any reliance you place on such information is strictly at your own risk. We are not liable for any losses or damages arising from the use of our Site.
          </p>
        </PolicySection>

        {/* Section 2: Credit Reporting Terms of Service */}
        <PolicySection className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            Credit Reporting Terms of Service
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            By accessing or using our credit reporting services, you agree to comply with all applicable laws and regulations. You acknowledge that the information provided is based on third-party data sources and may not always reflect the most current status in your credit profile. Our site is to deliver reports for informational purposes only and not to make lending or financial decisions on your behalf.
          </p>
          <ol className="list-decimal space-y-2.5 pl-6 text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel ml-5">
            <li>Credit report access is limited to authorized users and requires identity verification.</li>
            <li>You are responsible for reviewing your credit report and reporting any discrepancies to the appropriate agencies.</li>
            <li>We do not guarantee approval for loans, mortgages, or other financial products based on credit report data.</li>
            <li>Unauthorized use, distribution, or resale of credit reports is strictly prohibited.</li>
          </ol>
        </PolicySection>

        {/* Section 3: Ownership of Site Agreement to Terms of Use */}
        <PolicySection className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            Ownership of Site Agreement to Terms of Use
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            This Site and all of its content, including but not limited to text, graphics, logos, icons, images, and software, are the property of the Site owner or its licensors. By using this Site, you agree to abide by these Terms of Use and all applicable local, national, and international laws.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            You may not reproduce, distribute, modify, or otherwise exploit any part of the Site without prior written permission. Continued use of the Site constitutes acceptance of these terms.
          </p>
        </PolicySection>

        {/* Section 4: Provision of Services */}
        <PolicySection className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            Provision of Services
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            We reserve the right to modify, suspend, or discontinue any part of our services at any time without prior notice. While we aim to ensure continuous availability, we do not guarantee that the Site or its services will be uninterrupted, error-free, or free from harmful components such as viruses. Your use of the services is at your own risk.
          </p>
        </PolicySection>

        {/* Section 5: Limitation of Liability */}
        <PolicySection className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            Limitation of Liability
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            To the fullest extent permitted by law, we disclaim all liability for any direct, indirect, incidental, or consequential damages resulting from your use or inability to use the Site or its services. This includes but is not limited to loss of profits, business interruption, or data loss, even if we have been advised of the possibility of such damages.
          </p>
        </PolicySection>

        {/* Section 6: Accounts, Passwords and Security */}
        <PolicySection className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            Accounts, Passwords and Security
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            When creating an account, you are responsible for maintaining the confidentiality of your login credentials, including your username and password. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            We are not liable for any loss or damage arising from your failure to protect account information. You may be held responsible for activities that occur under your account if adequate precautions are not taken.
          </p>
        </PolicySection>
      </div>
    </section>
  );
}
