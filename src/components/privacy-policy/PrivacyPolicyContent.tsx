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
        <p className="mt-4 text-sm sm:text-base text-white/60 font-intel">
          Effective Date: August 10, 2026
        </p>
      </div>

      {/* Content Sections — Scroll visible & smooth entry */}
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-12">
        {/* Intro */}
        <PolicySection className="space-y-3 sm:space-y-4">
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            At CloudCentric Infotech, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and protect information when you visit or interact with our website <Link href="https://cccinfotech.in" className="text-[#8B5CF6] hover:underline" target="_blank" rel="noopener noreferrer">cccinfotech.in</Link> and use our services.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            By accessing or using our website, you agree to the practices described in this Privacy Policy.
          </p>
        </PolicySection>

        {/* 1. About Us */}
        <PolicySection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            1. About Us
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            This website is operated by CloudCentric Infotech (&quot;CloudCentric Infotech,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            We provide technology and business solutions, including Salesforce consulting and implementation, website development, application development, digital marketing, and related technology services.
          </p>
        </PolicySection>

        {/* 2. Information We Collect */}
        <PolicySection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            2. Information We Collect
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            We may collect different types of information when you visit our website, contact us, request information, or use our services.
          </p>
          
          <h3 className="text-lg font-medium text-white font-duru pt-2">
            Information You Provide Directly
          </h3>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            You may provide information when you:
          </p>
          <ul className="list-disc ml-5 sm:ml-8 pl-6 space-y-2 text-sm sm:text-base text-[#BDBDC8] font-intel">
            <li>Submit a contact or inquiry form</li>
            <li>Request a consultation or service</li>
            <li>Request a quotation or proposal</li>
            <li>Subscribe to our newsletters or marketing communications</li>
            <li>Download resources from our website</li>
            <li>Contact us through email, phone, or other communication channels</li>
            <li>Apply for employment opportunities through our website</li>
          </ul>

          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel pt-2">
            Depending on how you interact with us, this information may include:
          </p>
          <ul className="list-disc ml-5 sm:ml-8 pl-6 space-y-2 text-sm sm:text-base text-[#BDBDC8] font-intel">
            <li>Name</li>
            <li>Company name</li>
            <li>Job title</li>
            <li>Business email address</li>
            <li>Phone number</li>
            <li>Country or location</li>
            <li>Information about your business or requirements</li>
            <li>Any other information you voluntarily provide</li>
          </ul>

          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel pt-2 italic">
            Please do not submit sensitive personal information through our website unless specifically requested and necessary for the service being provided.
          </p>
        </PolicySection>

        {/* 3. Information Collected Automatically */}
        <PolicySection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            3. Information Collected Automatically
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            When you visit our website, certain information may be collected automatically, including:
          </p>
          <ul className="list-disc ml-5 sm:ml-8 pl-6 space-y-2 text-sm sm:text-base text-[#BDBDC8] font-intel">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device type</li>
            <li>Operating system</li>
            <li>Pages visited</li>
            <li>Time spent on pages</li>
            <li>Referring website or source</li>
            <li>Date and time of access</li>
            <li>Website interaction and usage information</li>
          </ul>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel pt-2">
            This information helps us understand how visitors use our website and improve its performance, security, and user experience.
          </p>
        </PolicySection>

        {/* 4. Cookies and Tracking Technologies */}
        <PolicySection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            4. Cookies and Tracking Technologies
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            Our website may use cookies and similar tracking technologies to improve website functionality, understand visitor behavior, analyze website traffic, and support marketing activities.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            Cookies may help us:
          </p>
          <ul className="list-disc ml-5 sm:ml-8 pl-6 space-y-2 text-sm sm:text-base text-[#BDBDC8] font-intel">
            <li>Remember user preferences</li>
            <li>Understand website usage</li>
            <li>Measure website performance</li>
            <li>Analyze traffic and engagement</li>
            <li>Improve our content and services</li>
            <li>Support marketing and advertising activities</li>
          </ul>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel pt-2">
            You can control or disable cookies through your browser settings. However, disabling certain cookies may affect some website functionality.
          </p>
        </PolicySection>

        {/* 5. How We Use Your Information */}
        <PolicySection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            5. How We Use Your Information
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            We may use the information we collect to:
          </p>
          <ul className="list-disc ml-5 sm:ml-8 pl-6 space-y-2 text-sm sm:text-base text-[#BDBDC8] font-intel">
            <li>Respond to your inquiries and requests</li>
            <li>Provide information about our services</li>
            <li>Prepare proposals, quotations, or consultations</li>
            <li>Communicate with you about our products and services</li>
            <li>Provide and improve our services</li>
            <li>Improve website functionality and user experience</li>
            <li>Analyze website traffic and performance</li>
            <li>Conduct marketing and promotional activities</li>
            <li>Send newsletters, updates, and relevant business communications</li>
            <li>Maintain website security and prevent fraudulent or unauthorized activity</li>
            <li>Comply with applicable legal and regulatory requirements</li>
          </ul>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel pt-2">
            We will use your personal information only for legitimate business purposes and in accordance with applicable laws.
          </p>
        </PolicySection>

        {/* 6. Marketing Communications */}
        <PolicySection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            6. Marketing Communications
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            If you provide your contact information or subscribe to our communications, we may send you information about our services, solutions, events, resources, or other business updates.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            You may unsubscribe from marketing communications at any time by following the unsubscribe instructions included in the communication or by contacting us directly.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            Please note that you may still receive essential communications related to an inquiry, service, transaction, or other business relationship.
          </p>
        </PolicySection>

        {/* 7. Third-Party Services */}
        <PolicySection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            7. Third-Party Services
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            We may use trusted third-party service providers to support our website, analytics, marketing, communication, hosting, security, and business operations.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            These providers may process information on our behalf and may include services such as:
          </p>
          <ul className="list-disc ml-5 sm:ml-8 pl-6 space-y-2 text-sm sm:text-base text-[#BDBDC8] font-intel">
            <li>Website hosting and infrastructure providers</li>
            <li>Analytics platforms</li>
            <li>Marketing automation and email platforms</li>
            <li>Customer relationship management (CRM) platforms</li>
            <li>Advertising and social media platforms</li>
            <li>Security and website performance services</li>
          </ul>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel pt-2">
            These third parties are expected to handle information in accordance with applicable privacy and security requirements. Where third-party services are used, their own privacy policies may also apply.
          </p>
        </PolicySection>

        {/* 8. Data Sharing and Disclosure */}
        <PolicySection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            8. Data Sharing and Disclosure
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            We do not sell or rent your personal information to third parties.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            We may share information with:
          </p>
          <ul className="list-disc ml-5 sm:ml-8 pl-6 space-y-2 text-sm sm:text-base text-[#BDBDC8] font-intel">
            <li>Authorized service providers that help us operate our business</li>
            <li>Technology and infrastructure providers</li>
            <li>Professional advisors where necessary</li>
            <li>Government authorities or regulatory bodies when required by law</li>
            <li>Legal or law-enforcement authorities where legally required</li>
            <li>Business partners where necessary to provide a requested service and where permitted by applicable law</li>
          </ul>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel pt-2">
            We take reasonable steps to ensure that information is shared only when necessary and for legitimate purposes.
          </p>
        </PolicySection>

        {/* 9. Data Security */}
        <PolicySection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            9. Data Security
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            We take reasonable technical and organizational measures to protect personal information against unauthorized access, alteration, disclosure, loss, misuse, or destruction.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            However, no method of transmitting or storing information electronically can be guaranteed to be completely secure. Therefore, while we take reasonable precautions to protect your information, we cannot guarantee absolute security.
          </p>
        </PolicySection>

        {/* 10. Data Retention */}
        <PolicySection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            10. Data Retention
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            We retain personal information only for as long as reasonably necessary to fulfill the purposes for which it was collected, maintain our business relationship with you, comply with legal obligations, resolve disputes, and enforce our agreements.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            The retention period may vary depending on the type of information and the purpose for which it was collected.
          </p>
        </PolicySection>

        {/* 11. Your Privacy Rights */}
        <PolicySection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            11. Your Privacy Rights
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            Depending on applicable laws, you may have certain rights regarding your personal information, including the right to:
          </p>
          <ul className="list-disc ml-5 sm:ml-8 pl-6 space-y-2 text-sm sm:text-base text-[#BDBDC8] font-intel">
            <li>Request access to personal information we hold about you</li>
            <li>Request correction of inaccurate or incomplete information</li>
            <li>Request deletion of your personal information where legally applicable</li>
            <li>Withdraw consent where processing is based on consent</li>
            <li>Object to certain types of processing</li>
            <li>Opt out of marketing communications</li>
            <li>Request information about how your personal information is processed</li>
          </ul>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel pt-2">
            To exercise any applicable rights, you may contact us using the details provided below.
          </p>
        </PolicySection>

        {/* 12. Children's Privacy */}
        <PolicySection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            12. Children&apos;s Privacy
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            Our website and services are intended primarily for businesses and professional users. We do not knowingly collect personal information from children.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            If you believe that a child has provided personal information to us, please contact us so that we can take appropriate action.
          </p>
        </PolicySection>

        {/* 13. International Data Transfers */}
        <PolicySection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            13. International Data Transfers
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            As we work with clients and service providers in different countries, your information may be processed or stored in locations outside your country of residence.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            Where required, we take reasonable steps to ensure that such transfers are handled in accordance with applicable privacy and data protection laws.
          </p>
        </PolicySection>

        {/* 14. Links to Third-Party Websites */}
        <PolicySection className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            14. Links to Third-Party Websites
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            Our website may contain links to third-party websites, platforms, or services.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            We are not responsible for the privacy practices, security, or content of third-party websites. We recommend reviewing the privacy policies of those websites before providing them with your personal information.
          </p>
        </PolicySection>

        {/* 15. Changes to This Privacy Policy */}
        <PolicySection className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            15. Changes to This Privacy Policy
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            We may update this Privacy Policy from time to time to reflect changes in our services, technology, business practices, or applicable legal requirements.
          </p>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            When we make changes, we will update the &quot;Effective Date&quot; at the top of this page. We encourage you to review this Privacy Policy periodically.
          </p>
        </PolicySection>

        {/* 16. Contact Us */}
        <PolicySection className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-normal text-white tracking-wide font-duru">
            16. Contact Us
          </h2>
          <p className="text-sm sm:text-base text-[#BDBDC8] leading-relaxed font-intel">
            If you have questions, concerns, or requests regarding this Privacy Policy or the way we handle your personal information, please contact us.
          </p>
          <div className="bg-[#12121A]/80 border border-white/10 rounded-xl p-6 space-y-2 text-sm sm:text-base text-[#BDBDC8] font-intel backdrop-blur-md">
            <p className="font-semibold text-white">CloudCentric Infotech</p>
            <p>Website: <Link href="https://cccinfotech.in" className="text-[#8B5CF6] hover:underline" target="_blank" rel="noopener noreferrer">cccinfotech.in</Link></p>
            <p>Email: <a href="mailto:info@cccinfotech.in" className="text-[#8B5CF6] hover:underline">info@cccinfotech.in</a></p>
          </div>
        </PolicySection>

        {/* Disclaimer Note */}
        <PolicySection className="pt-6 border-t border-white/10">
          <p className="text-xs sm:text-sm text-white/40 italic font-intel">
            Disclaimer: This Privacy Policy is provided as general website content and should be reviewed by your legal or compliance team before publication to ensure that it accurately reflects CloudCentric Infotech&apos;s actual data practices and applicable privacy laws.
          </p>
        </PolicySection>
      </div>
    </section>
  );
}

