"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export interface CloudPlatformItem {
  id: string;
  badge: string;
  badgeBg: string;
  badgeBorder: string;
  accentColor: string;
  logoSrc: string;
  logoAlt: string;
  title: string;
  subHeading: string;
  description: string;
  features: string[];
  linkText: string;
  linkHref: string;
}

export const cloudPlatformsData: CloudPlatformItem[] = [
  {
    id: "aws",
    badge: "AMAZON WEB SERVICES",
    badgeBg: "rgba(255, 153, 0, 0.07)",
    badgeBorder: "rgba(255, 153, 0, 0.25)",
    accentColor: "#FF9900",
    logoSrc: "/images/aws-logo.svg",
    logoAlt: "Amazon Web Services Logo",
    title: "AWS",
    subHeading: "Build for Scale on AWS",
    description: "Design and manage secure, scalable cloud environments for applications, data, APIs, and enterprise workloads.",
    features: [
      "EC2, ECS & EKS Containerization",
      "Serverless Lambda & App Runner",
      "S3 & RDS Enterprise Data",
      "CloudFront & API Gateway",
    ],
    linkText: "AWS Cloud Services",
    linkHref: "/contact-us",
  },
  {
    id: "azure",
    badge: "ENTERPRISE CLOUD",
    badgeBg: "rgba(0, 137, 214, 0.07)",
    badgeBorder: "rgba(0, 137, 214, 0.25)",
    accentColor: "#0089D6",
    logoSrc: "/images/azure-logo.svg",
    logoAlt: "Microsoft Azure Logo",
    title: "Microsoft Azure",
    subHeading: "Power Your Enterprise With Azure",
    description: "Modernize applications, connect business systems, and leverage Azure's enterprise cloud capabilities.",
    features: [
      "Azure App Services & AKS",
      "Azure Active Directory & Security",
      "Azure SQL & Cosmos DB",
      "Azure Logic Apps & Service Bus",
    ],
    linkText: "Azure Cloud Services",
    linkHref: "/contact-us",
  },
  {
    id: "gcp",
    badge: "GOOGLE CLOUD PLATFORM",
    badgeBg: "rgba(168, 85, 247, 0.07)",
    badgeBorder: "rgba(168, 85, 247, 0.25)",
    accentColor: "#A855F7",
    logoSrc: "/images/google-cloud-logo.svg",
    logoAlt: "Google Cloud Platform Logo",
    title: "Google Cloud",
    subHeading: "AI-Ready Infrastructure on GCP",
    description: "Leverage Google Cloud's data analytics, BigQuery, Kubernetes Engine, and Vertex AI ecosystem for modern workloads.",
    features: [
      "Google Kubernetes Engine (GKE)",
      "BigQuery & Looker Analytics",
      "Vertex AI & Machine Learning",
      "Cloud Run & Cloud Functions",
    ],
    linkText: "Google Cloud Services",
    linkHref: "/contact-us",
  },
];

export default function CloudFoundationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#050505] text-white py-12 sm:py-16 lg:py-20 px-6 sm:px-10  relative overflow-hidden z-10"
      aria-label="The Right Cloud Foundation for Your Business"
    >
      <div className="max-w-7xl mx-auto flex flex-col space-y-10 lg:space-y-12">
        
        {/* Section Header */}
        <header 
          className={`flex flex-col space-y-4 transition-all duration-800 ease-out transform ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          }`}
          style={{ transitionDelay: "180ms" }}
        >
          {/* Eyebrow */}
          <p className="font-mono font-semibold text-xs text-[#60A5FA] tracking-[3px] uppercase">
            / CLOUD EXPERTISE
          </p>

          {/* Main Heading */}
          <h2 className="font-duru font-normal text-3xl sm:text-4xl lg:text-[50px] leading-[1.1] text-white max-w-3xl">
            The Right Cloud Foundation for Your Business
          </h2>

          {/* Paragraph */}
          <p className="font-mono font-normal text-sm sm:text-base text-white/60 max-w-2xl leading-[26px]">
            We work with leading cloud platforms to help businesses build, migrate, integrate, and optimize their digital infrastructure.
          </p>
        </header>

        {/* Platform Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {cloudPlatformsData.map((item, idx) => (
            <article
              key={item.id}
              className={`group relative rounded-[16px] bg-[#0D0D14] border border-white/[0.08] p-7 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/20 hover:bg-[#12121B] hover:-translate-y-1.5 shadow-xl transform ${
                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-[0.98]"
              }`}
              style={{ transitionDelay: `${250 + idx * 90}ms` }}
            >
              <div className="flex flex-col space-y-5">
                
                {/* Header Row: Badge & Logo */}
                <div className="flex items-center justify-between gap-3 pb-2">
                  <div
                    className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-semibold tracking-[0.6px] uppercase"
                    style={{
                      backgroundColor: item.badgeBg,
                      borderColor: item.badgeBorder,
                      borderWidth: "0.8px",
                      color: item.accentColor,
                    }}
                  >
                    {item.badge}
                  </div>

                  {/* Logo Image */}
                  <div className="relative w-16 h-10 flex-shrink-0 flex items-center justify-end">
                    <Image
                      src={item.logoSrc}
                      alt={item.logoAlt}
                      width={60}
                      height={40}
                      loading="lazy"
                      className="object-contain max-h-10 w-auto"
                    />
                  </div>
                </div>

                {/* Title & Subheading */}
                <div className="flex flex-col space-y-1">
                  <h3 className="font-duru text-2xl text-white font-normal">
                    {item.title}
                  </h3>
                  <p className="font-mono text-sm font-medium text-white/90">
                    {item.subHeading}
                  </p>
                </div>

                {/* Description */}
                <p className="font-mono text-xs sm:text-sm text-white/60 leading-[23px]">
                  {item.description}
                </p>

                {/* Features List */}
                <div className="flex flex-col space-y-2.5 pt-2" aria-label={`${item.title} key features`}>
                  {item.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center space-x-2.5">
                      <CheckCircle2
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: item.accentColor }}
                        aria-hidden="true"
                      />
                      <span className="font-mono text-xs text-white/75">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Bottom Footer Link */}
              <div className="border-t border-white/[0.08] pt-5 mt-4">
                <Link
                  href={item.linkHref}
                  aria-label={`${item.linkText} - ${item.title}`}
                  className="inline-flex items-center space-x-2 text-sm font-mono font-semibold transition-colors group-hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded-md"
                  style={{ color: item.accentColor }}
                >
                  <span>{item.linkText}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
