"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

function TermsSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
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

export default function TermsAndConditionsContent() {
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
            TERMS &amp; CONDITIONS
          </span>
        </div>

        {/* Page Title — Comes from Left */}
        <h1 
          className={`relative z-10 text-3xl sm:text-5xl lg:text-[56px] font-normal text-white tracking-tight font-duru leading-tight transition-all duration-800 ease-out transform ${
            isHeroVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          Terms and Conditions
        </h1>
        <p className="mt-4 text-sm sm:text-base text-white/60 font-intel">
          Effective Date: August 10, 2026
        </p>
      </div>

      {/* Content Sections — Scroll visible & smooth entry */}
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-12">
        {/* Intro */}
        <TermsSection className="space-y-3 sm:space-y-4">
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            Welcome to <Link href="https://cloudcentric.in" className="text-[#8B5CF6] hover:underline" target="_blank" rel="noopener noreferrer">cloudcentric.in</Link>, the website of CloudCentric Infotech. These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of our website and the information, content, and services made available through it.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            By accessing or using this website, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree with any part of these Terms, please discontinue use of the website.
          </p>
        </TermsSection>

        {/* 1. About CloudCentric Infotech */}
        <TermsSection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            1. About CloudCentric Infotech
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            CloudCentric Infotech provides technology and business solutions to organizations, including Salesforce consulting and implementation, website development, application development, digital marketing, and other related technology services.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            Information available on this website is provided for general informational and business purposes.
          </p>
        </TermsSection>

        {/* 2. Use of the Website */}
        <TermsSection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            2. Use of the Website
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            You agree to use this website only for lawful purposes and in a manner that does not:
          </p>
          <ul className="list-disc ml-5 sm:ml-8 pl-6 space-y-2 text-sm sm:text-base text-[#BDBDC8] font-intel">
            <li>Violate any applicable local, national, or international law or regulation</li>
            <li>Infringe upon the rights of CloudCentric Infotech or any third party</li>
            <li>Attempt to gain unauthorized access to the website or its systems</li>
            <li>Introduce malicious software, viruses, or harmful code</li>
            <li>Interfere with the normal operation or security of the website</li>
            <li>Use automated systems to access or collect website information without permission</li>
            <li>Misuse contact forms or submit false, misleading, or fraudulent information</li>
          </ul>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel pt-2">
            We reserve the right to restrict or terminate access to the website if we believe these Terms have been violated.
          </p>
        </TermsSection>

        {/* 3. Website Content */}
        <TermsSection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            3. Website Content
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            All content published on this website, including but not limited to text, images, graphics, logos, videos, articles, case studies, whitepapers, presentations, service descriptions, product information, website design and layout, is provided for general informational purposes.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            While we make reasonable efforts to keep the information accurate and up to date, we do not guarantee that all information on the website will always be complete, accurate, current, or error-free.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            CloudCentric Infotech reserves the right to modify, update, remove, or discontinue any website content without prior notice.
          </p>
        </TermsSection>

        {/* 4. Intellectual Property Rights */}
        <TermsSection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            4. Intellectual Property Rights
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            Unless otherwise stated, all intellectual property rights relating to this website and its content are owned by or licensed to CloudCentric Infotech.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            You may view, access, and use the website for legitimate personal or business purposes.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            You may not, without prior written permission:
          </p>
          <ul className="list-disc ml-5 sm:ml-8 pl-6 space-y-2 text-sm sm:text-base text-[#BDBDC8] font-intel">
            <li>Copy or reproduce website content</li>
            <li>Republish content on another website or platform</li>
            <li>Modify or distribute our content</li>
            <li>Use our logos, trademarks, or brand assets</li>
            <li>Sell, license, or commercially exploit website content</li>
            <li>Create derivative works from our content</li>
          </ul>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel pt-2">
            All trademarks, logos, product names, service names, and brand identities displayed on this website remain the property of their respective owners.
          </p>
        </TermsSection>

        {/* 5. Services and Information */}
        <TermsSection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            5. Services and Information
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            Information about our services, solutions, capabilities, pricing, timelines, and features displayed on this website is for general information only.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            The availability, scope, pricing, specifications, timelines, and terms of any service may vary depending on the individual requirements of a client.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            Any specific engagement between CloudCentric Infotech and a client will be governed by separate agreements, proposals, statements of work, service agreements, or other applicable contractual documents.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            In the event of a conflict between these Terms and a specific written agreement with a client, the applicable client agreement will take precedence for that engagement.
          </p>
        </TermsSection>

        {/* 6. Contact and Inquiry Forms */}
        <TermsSection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            6. Contact and Inquiry Forms
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            If you submit information through our website, you agree that:
          </p>
          <ul className="list-disc ml-5 sm:ml-8 pl-6 space-y-2 text-sm sm:text-base text-[#BDBDC8] font-intel">
            <li>The information you provide is accurate and truthful</li>
            <li>You have the right to provide the information</li>
            <li>You will not submit misleading, fraudulent, or unlawful information</li>
            <li>CloudCentric Infotech may use the information to respond to your inquiry or provide requested information</li>
          </ul>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel pt-2">
            Our handling of personal information is governed by our <Link href="/privacy-policy" className="text-[#8B5CF6] hover:underline">Privacy Policy</Link>.
          </p>
        </TermsSection>

        {/* 7. Third-Party Links and Services */}
        <TermsSection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            7. Third-Party Links and Services
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            Our website may contain links to third-party websites, applications, platforms, or services.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            These links are provided for convenience or informational purposes. CloudCentric Infotech does not control or necessarily endorse third-party websites and is not responsible for their content, availability, security, privacy practices, terms and conditions, products, or services.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            Your use of third-party websites is subject to the terms and policies of those third parties.
          </p>
        </TermsSection>

        {/* 8. Website Availability */}
        <TermsSection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            8. Website Availability
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            We aim to keep our website available and functioning properly. However, we do not guarantee that the website will always be:
          </p>
          <ul className="list-disc ml-5 sm:ml-8 pl-6 space-y-2 text-sm sm:text-base text-[#BDBDC8] font-intel">
            <li>Available without interruption</li>
            <li>Free from errors</li>
            <li>Free from viruses or other harmful components</li>
            <li>Compatible with every device or browser</li>
          </ul>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel pt-2">
            The website may occasionally be unavailable due to maintenance, updates, technical issues, security concerns, or circumstances beyond our reasonable control.
          </p>
        </TermsSection>

        {/* 9. Disclaimer */}
        <TermsSection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            9. Disclaimer
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            To the maximum extent permitted by applicable law, the website and its content are provided on an &quot;as is&quot; and &quot;as available&quot; basis.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            CloudCentric Infotech makes no warranties, express or implied, regarding the accuracy, reliability, completeness, suitability, or availability of the website or its content.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            Information provided on the website should not be considered professional, legal, financial, or other specialized advice unless expressly stated otherwise.
          </p>
        </TermsSection>

        {/* 10. Limitation of Liability */}
        <TermsSection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            10. Limitation of Liability
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            To the maximum extent permitted by applicable law, CloudCentric Infotech shall not be liable for any direct, indirect, incidental, consequential, special, or other damages arising from or related to:
          </p>
          <ul className="list-disc ml-5 sm:ml-8 pl-6 space-y-2 text-sm sm:text-base text-[#BDBDC8] font-intel">
            <li>Your use or inability to use the website</li>
            <li>Reliance on information available on the website</li>
            <li>Website interruptions or technical issues</li>
            <li>Loss of data</li>
            <li>Unauthorized access resulting from circumstances beyond our reasonable control</li>
            <li>Third-party websites or services accessed through links on our website</li>
          </ul>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel pt-2">
            Nothing in these Terms is intended to exclude or limit liability that cannot legally be excluded or limited under applicable law.
          </p>
        </TermsSection>

        {/* 11. Indemnification */}
        <TermsSection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            11. Indemnification
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            You agree to indemnify and hold harmless CloudCentric Infotech, its directors, employees, affiliates, and representatives from claims, liabilities, damages, losses, or expenses arising from your:
          </p>
          <ul className="list-disc ml-5 sm:ml-8 pl-6 space-y-2 text-sm sm:text-base text-[#BDBDC8] font-intel">
            <li>Violation of these Terms</li>
            <li>Misuse of the website</li>
            <li>Violation of applicable laws or regulations</li>
            <li>Infringement of the rights of CloudCentric Infotech or any third party</li>
          </ul>
        </TermsSection>

        {/* 12. Confidentiality */}
        <TermsSection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            12. Confidentiality
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            Information submitted through general website forms should not be considered confidential unless a separate confidentiality agreement or other written agreement exists between you and CloudCentric Infotech.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            Please do not submit confidential, proprietary, or sensitive business information through publicly accessible website forms unless specifically requested.
          </p>
        </TermsSection>

        {/* 13. Changes to These Terms */}
        <TermsSection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            13. Changes to These Terms
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            CloudCentric Infotech may update or modify these Terms from time to time.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            Any changes will become effective when the revised Terms are published on this page, unless otherwise stated. We encourage you to review this page periodically to remain informed about the current Terms and Conditions.
          </p>
        </TermsSection>

        {/* 14. Governing Law */}
        <TermsSection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            14. Governing Law
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            These Terms shall be governed by and interpreted in accordance with the applicable laws of India, without regard to conflict-of-law principles.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            Any disputes arising in connection with these Terms or your use of the website shall be subject to the jurisdiction of the appropriate courts in India.
          </p>
        </TermsSection>

        {/* 15. Severability */}
        <TermsSection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            15. Severability
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            If any provision of these Terms is found to be invalid, unlawful, or unenforceable, that provision shall be modified or removed to the extent necessary, while the remaining provisions will continue to remain in full force and effect.
          </p>
        </TermsSection>

        {/* 16. Entire Agreement */}
        <TermsSection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            16. Entire Agreement
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            These Terms, together with our <Link href="/privacy-policy" className="text-[#8B5CF6] hover:underline">Privacy Policy</Link> and any other policies or legal notices published on the website, constitute the general terms governing your use of cloudcentric.in.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            These Terms do not replace or modify any separate written agreement entered into between CloudCentric Infotech and its clients.
          </p>
        </TermsSection>

        {/* 17. Contact Us */}
        <TermsSection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            17. Contact Us
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            If you have any questions regarding these Terms and Conditions, please contact us:
          </p>
          <div className="bg-[#12121A]/80 border border-white/10 rounded-xl p-6 space-y-2 text-sm sm:text-base text-[#BDBDC8] font-intel backdrop-blur-md">
            <p className="font-semibold text-white">CloudCentric Infotech</p>
            <p>Website: <Link href="https://cloudcentric.in" className="text-[#8B5CF6] hover:underline" target="_blank" rel="noopener noreferrer">cloudcentric.in</Link></p>
            <p>Email: <a href="mailto:info@cloudcentric.in" className="text-[#8B5CF6] hover:underline">info@cloudcentric.in</a></p>
          </div>
          <p className="text-sm text-white/60 font-intel pt-2">
            Last Updated: August 10, 2026
          </p>
        </TermsSection>

        {/* Disclaimer Note */}
        <TermsSection className="pt-6 border-t border-white/10">
          <p className="text-xs sm:text-sm text-white/40 italic font-intel">
            Disclaimer: These Terms and Conditions are general website terms and should be reviewed by your legal or compliance team before publication to ensure they accurately reflect your company&apos;s services, contracts, jurisdiction, and business practices.
          </p>
        </TermsSection>
      </div>
    </section>
  );
}
