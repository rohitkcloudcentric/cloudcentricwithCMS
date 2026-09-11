"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export interface CertificationBadge {
  id: string;
  name: string;
  icon: string;
}

const CERTIFICATIONS: CertificationBadge[] = [
  {
    id: "summit-partner",
    name: "Salesforce Summit Partner",
    icon: "/images/services/our-excellence/summit-partner.svg",
  },
  {
    id: "pdo",
    name: "Salesforce PDO",
    icon: "/images/services/our-excellence/pdo.svg",
  },
  {
    id: "appexchange",
    name: "Available on AppExchange",
    icon: "/images/services/our-excellence/available-on-appexchange.svg",
  },
  {
    id: "cloud-reseller",
    name: "Authorized Cloud Reseller",
    icon: "/images/services/our-excellence/authorized-cloud-reseller.svg",
  },
  {
    id: "navigator-expert",
    name: "Salesforce Navigator Expert",
    icon: "/images/services/our-excellence/navigator-expert.svg",
  },
  {
    id: "pledge-1",
    name: "Pledge 1%",
    icon: "/images/services/our-excellence/pledge-1.svg",
  },
  {
    id: "iso",
    name: "ISO 9001:2015",
    icon: "/images/services/our-excellence/iso.svg",
  },
];

export default function OurExcellence() {
  const sectionRef = useRef<HTMLElement>(null);
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
    <section ref={sectionRef} className="w-full bg-[#050505] text-white py-8 sm:py-12 px-6 sm:px-10  z-10 relative">
      <div className="max-w-7xl mx-auto">
        {/* Gradient Border Card Wrapper */}
        <div className={`relative rounded-[18px] p-[1.5px] bg-gradient-to-r from-[#2F89FF] via-[#7C3AED] to-[#B021F0] shadow-xl transition-all duration-1000 ease-out transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <div className="bg-[#111113] rounded-[16.5px] p-6 sm:p-8 lg:px-10 lg:py-7 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            
            {/* Left Header Titles */}
            <div className="flex flex-col space-y-1 text-center lg:text-left shrink-0">
              <span className="font-intel font-semibold text-lg sm:text-xl lg:text-[22px] text-white tracking-tight">
                Our Excellence
              </span>
              <h3 className="font-intel font-semibold text-xl sm:text-2xl lg:text-[26px] bg-gradient-to-r from-[#2F89FF] via-[#8B3DFF] to-[#B021F0] bg-clip-text text-transparent tracking-tight">
                Certifications &amp; Awards
              </h3>
            </div>

            {/* Right Certifications Badges Grid */}
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3.5 sm:gap-5 lg:gap-6">
              {CERTIFICATIONS.map((cert) => (
                <div
                  key={cert.id}
                  className="w-[54px] h-[54px] sm:w-[60px] sm:h-[60px] lg:w-[64px] lg:h-[64px] relative shrink-0 transition-transform duration-200 hover:scale-105"
                  title={cert.name}
                >
                  <Image
                    src={cert.icon}
                    alt={cert.name}
                    width={64}
                    height={64}
                    loading="lazy"
                    className="w-full h-full object-contain rounded-md"
                  />
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
