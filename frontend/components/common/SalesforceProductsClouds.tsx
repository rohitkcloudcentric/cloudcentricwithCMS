"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export interface SpecializationItem {
  id: string;
  name: string;
  icon?: string;
  link?: string;
}

export interface SpecializationCategory {
  id: string;
  label: string;
  items: SpecializationItem[];
}

const SPECIALIZATION_DATA: SpecializationCategory[] = [
  {
    id: "services",
    label: "Salesforce Services",
    items: [
      { id: "s-1", name: "Salesforce Consulting", link: "https://cccinfotech.com/services/salesforce-consulting/" },
      { id: "s-2", name: "Salesforce Implementation", link: "https://cccinfotech.com/services/salesforce-implementation/" },
      { id: "s-3", name: "Salesforce Development", link: "https://cccinfotech.com/services/salesforce-development/" },
      { id: "s-4", name: "Salesforce Integration", link: "https://cccinfotech.com/services/salesforce-integration/" },
      { id: "s-5", name: "Salesforce Data Migration", link: "https://cccinfotech.com/services/salesforce-data-migration/" },
      { id: "s-6", name: "Salesforce Training", link: "https://cccinfotech.com/services/salesforce-training/" },
      { id: "s-7", name: "Salesforce AppExchange", link: "https://cccinfotech.com/services/salesforce-appexchange/" },
      { id: "s-8", name: "Hire salesforce Consultant", link: "https://cccinfotech.com/services/hire-salesforce-consultant/" },
      { id: "s-9", name: "Salesforce Reseller", link: "https://cccinfotech.com/services/salesforce-reseller/" },
      { id: "s-10", name: "Salesforce Mobile SDK Development", link: "https://cccinfotech.com/services/salesforce-mobile-sdk-development/" },
      { id: "s-11", name: "Salesforce Support", link: "#" },
    ],
  },
  {
    id: "clouds",
    label: "Salesforce Clouds",
    items: [
      { id: "c-1", name: "Sales Cloud", icon: "/images/services/salesforce-cloud-icons/sales-cloud.svg", link: "https://cccinfotech.com/services/sales-cloud/" },
      { id: "c-2", name: "Service Cloud", icon: "/images/services/salesforce-cloud-icons/service-cloud.svg", link: "https://cccinfotech.com/services/service-cloud/" },
      { id: "c-3", name: "Marketing Cloud", icon: "/images/services/salesforce-cloud-icons/marketing-cloud.svg", link: "https://cccinfotech.com/services/marketing-cloud/" },
      { id: "c-4", name: "Data Cloud", icon: "/images/services/salesforce-cloud-icons/data-cloud.svg", link: "https://cccinfotech.com/services/data-cloud/" },
      { id: "c-5", name: "Commerce Cloud", icon: "/images/services/salesforce-cloud-icons/commerce-cloud.svg", link: "https://cccinfotech.com/services/commerce-cloud/" },
      { id: "c-6", name: "Health Cloud", icon: "/images/services/salesforce-cloud-icons/health-cloud.svg", link: "https://cccinfotech.com/services/health-cloud/" },
      { id: "c-7", name: "Experience Cloud", icon: "/images/services/salesforce-cloud-icons/experience-cloud.svg", link: "https://cccinfotech.com/services/experience-cloud/" },
      { id: "c-8", name: "Education Cloud", icon: "/images/services/salesforce-cloud-icons/education-cloud.svg", link: "https://cccinfotech.com/services/education-cloud/" },
      { id: "c-9", name: "Manufacturing Cloud", icon: "/images/services/salesforce-cloud-icons/manufacturing-cloud.svg", link: "https://cccinfotech.com/services/manufacturing-cloud/" },
      { id: "c-10", name: "Financial Cloud", icon: "/images/services/salesforce-cloud-icons/financial-cloud.svg", link: "https://cccinfotech.com/services/financial-services-cloud/" },
      { id: "c-11", name: "Net Zero Cloud", icon: "/images/services/salesforce-cloud-icons/net-zero-cloud.svg", link: "#" },
      { id: "c-12", name: "Nonprofit Cloud", icon: "/images/services/salesforce-cloud-icons/nonprofit-cloud.svg", link: "#" },
    ],
  },
  {
    id: "products",
    label: "Salesforce Products",
    items: [
      { id: "p-1", name: "AgentForce", icon: "/images/services/salesforce-product-icons/agentforce.svg", link: "https://cccinfotech.com/services/artificial-intelligence/" },
      { id: "p-2", name: "Einstein Ai", icon: "/images/services/salesforce-product-icons/einstein-ai.svg", link: "https://cccinfotech.com/services/artificial-intelligence/" },
      { id: "p-3", name: "Heroku", icon: "/images/services/salesforce-product-icons/heroku.svg", link: "https://cccinfotech.com/services/heroku/" },
      { id: "p-4", name: "MuleSoft", icon: "/images/services/salesforce-product-icons/mulesoft.svg", link: "https://cccinfotech.com/services/mulesoft/" },
      { id: "p-5", name: "Pardot", icon: "/images/services/salesforce-product-icons/pardot.svg", link: "https://cccinfotech.com/services/marketing-cloud-account-engagement/" },
      { id: "p-6", name: "Tableau", icon: "/images/services/salesforce-product-icons/tableau.svg", link: "https://cccinfotech.com/services/tableau/" },
      { id: "p-7", name: "Slack", icon: "/images/services/salesforce-product-icons/slack.svg", link: "https://cccinfotech.com/services/slack/" },
      { id: "p-8", name: "Field Service Lightning", icon: "/images/services/salesforce-product-icons/field-service-lightning.svg", link: "https://cccinfotech.com/services/field-service-lightning/" },
      { id: "p-9", name: "Analytics", icon: "/images/services/salesforce-product-icons/analytics.svg", link: "https://cccinfotech.com/services/analytics/" },
      { id: "p-10", name: "Consumer Goods", icon: "/images/services/salesforce-product-icons/consumer-goods.svg", link: "https://cccinfotech.com/services/consumer/" },
      { id: "p-11", name: "Lightning Platform", icon: "/images/services/salesforce-product-icons/lightning-platform.svg", link: "#" },
    ],
  },
];

export default function SalesforceProductsClouds() {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("services");
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

  const currentCategory =
    SPECIALIZATION_DATA.find((cat) => cat.id === activeCategoryId) ||
    SPECIALIZATION_DATA[0];

  return (
    <section ref={sectionRef} className="w-full bg-[#050505] text-white py-16 sm:py-24 px-6 sm:px-10  z-10 relative">
      <div className="max-w-7xl mx-auto flex flex-col space-y-10 sm:space-y-12">
        
        {/* ── Section Header ── */}
        <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-6 transition-all duration-1000 ease-out transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <div className="flex flex-col space-y-1">
            <h2 className="font-duru font-normal text-3xl sm:text-4xl lg:text-[42px] leading-tight text-white">
              We Specialize in
            </h2>
            <span className="font-duru font-medium text-3xl sm:text-4xl lg:text-[42px] leading-tight bg-gradient-to-r from-[#2F89FF] to-[#B021F0] bg-clip-text text-transparent">
              Salesforce Products &amp; Clouds
            </span>
          </div>

          <a
            href="https://cccinfotech.com/services/salesforce-development/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-[#2F89FF] to-[#B021F0] text-white font-intel font-semibold text-sm px-6 py-3 rounded-lg shadow-lg hover:opacity-90 transition-all duration-200 cursor-pointer shrink-0 self-start sm:self-end inline-flex items-center justify-center"
          >
            Talk to Salesforce Expert
          </a>
        </div>

        {/* ── Main Split Container ── */}
        <div className={`bg-[#121214] border border-white/10 rounded-[18px] overflow-hidden flex flex-col lg:flex-row shadow-2xl transition-all duration-1000 delay-200 ease-out transform ${
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-[0.99]"
        }`}>
          {/* Left Sidebar Tabs (First Card) */}
          <div role="tablist" aria-label="Salesforce Specializations" className="w-full lg:w-[380px] xl:w-[420px] bg-[#121214] p-6 sm:p-8 lg:p-10 flex flex-col justify-start space-y-3 shrink-0">
            {SPECIALIZATION_DATA.map((cat) => {
              const isActive = cat.id === activeCategoryId;
              return (
                <button
                  key={cat.id}
                  id={`sp-tab-${cat.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`sp-panel-${cat.id}`}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`w-full text-left font-intel transition-all duration-200 cursor-pointer px-5 py-3.5 rounded-[10px] flex items-center justify-between focus-visible:ring-2 focus-visible:ring-[#2F89FF] focus-visible:outline-none ${
                    isActive
                      ? "bg-white text-[#111113] font-semibold shadow-md"
                      : "text-white/70 hover:text-white hover:bg-white/5 font-semibold"
                  }`}
                >
                  <span className="text-base sm:text-[17px]">{cat.label}</span>
                  {isActive && (
                    <Image
                      src="/images/services/drop-icons.svg"
                      alt="Selected Tab Indicator"
                      width={16}
                      height={24}
                      className="w-4 h-5 object-contain shrink-0 ml-2"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Content Box */}
          <div 
            id={`sp-panel-${activeCategoryId}`}
            role="tabpanel"
            aria-labelledby={`sp-tab-${activeCategoryId}`}
            className="bg-white p-6 sm:p-8 lg:p-10 flex-1 flex flex-col space-y-5 rounded-b-[18px] lg:rounded-b-none lg:rounded-r-[18px]"
          >
            <h3 className="font-intel font-semibold text-xl sm:text-[22px] text-[#111113]">
              {currentCategory.label}
            </h3>

            <div className="flex flex-wrap gap-2.5 sm:gap-3 items-center">
              {currentCategory.items.map((item) => (
                <a
                  key={item.id}
                  href={item.link || "https://cccinfotech.com/services/salesforce-development/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#F4F4F6] hover:bg-[#EAEAEF] hover:border-[#2F89FF]/40 border border-gray-200/50 rounded-[8px] px-3.5 py-2 sm:px-4 sm:py-2.5 flex items-center space-x-2.5 transition-all duration-200 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 group focus-visible:ring-2 focus-visible:ring-[#2F89FF] focus-visible:outline-none"
                >
                  {item.icon && (
                    <div className="w-4 h-4 sm:w-[18px] sm:h-[18px] relative shrink-0 flex items-center justify-center">
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={18}
                        height={18}
                        className="w-4 h-4 sm:w-[18px] sm:h-[18px] object-contain"
                      />
                    </div>
                  )}
                  <span className="font-intel font-semibold text-xs sm:text-[13px] text-[#2d2d32] group-hover:text-[#2F89FF] transition-colors whitespace-nowrap">
                    {item.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
