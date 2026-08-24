"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export interface ProductItem {
  name: string;
  icon: string;
}

export interface JourneyCard {
  id: string;
  title: string;
  description: string;
  productsLabel: string;
  products: ProductItem[];
}

export interface JourneyTab {
  id: string;
  label: string;
  line1?: string;
  line2?: string;
  cards: JourneyCard[];
}

const JOURNEY_TABS: JourneyTab[] = [
  {
    id: "sales-optimization",
    label: "Sales Optimization",
    line1: "Sales",
    line2: "Optimization",
    cards: [
      {
        id: "lead-management",
        title: "Lead Management",
        description:
          "Capture, qualify, and prioritize leads in real time with automated workflows and smart insights—ensuring every high-value opportunity is engaged at the right moment.",
        productsLabel: "Products That Power Sales :",
        products: [
          { name: "Sales Cloud", icon: "/images/services/salesforce-cloud-icons/sales-cloud.svg" },
          { name: "Marketing Cloud", icon: "/images/services/salesforce-cloud-icons/marketing-cloud.svg" },
        ],
      },
      {
        id: "opportunity-tracking",
        title: "Opportunity Tracking",
        description:
          "Track pipeline progress, predict win probabilities with AI forecasting, and remove friction across stage transitions to close deals faster and increase win rates.",
        productsLabel: "Products That Power Sales :",
        products: [
          { name: "Sales Cloud", icon: "/images/services/salesforce-cloud-icons/sales-cloud.svg" },
          { name: "Marketing Cloud", icon: "/images/services/salesforce-cloud-icons/marketing-cloud.svg" },
        ],
      },
      {
        id: "sales-automation",
        title: "Sales Automation",
        description:
          "Automate quote generation, task assignments, and activity tracking so reps spend less time on manual admin and more time building strong customer relationships.",
        productsLabel: "Products That Power Sales :",
        products: [
          { name: "Sales Cloud", icon: "/images/services/salesforce-cloud-icons/sales-cloud.svg" },
          { name: "Marketing Cloud", icon: "/images/services/salesforce-cloud-icons/marketing-cloud.svg" },
        ],
      },
    ],
  },
  {
    id: "marketing-mastery",
    label: "Marketing Mastery",
    line1: "Marketing",
    line2: "Mastery",
    cards: [
      {
        id: "personalized-journeys",
        title: "Personalized Journeys",
        description:
          "Design and orchestrate multi-channel customer journeys tailored to user actions, preferences, and real-time behavioral data across every touchpoint.",
        productsLabel: "Products That Power Marketing :",
        products: [
          { name: "Marketing Cloud", icon: "/images/services/salesforce-cloud-icons/marketing-cloud.svg" },
          { name: "Sales Cloud", icon: "/images/services/salesforce-cloud-icons/sales-cloud.svg" },
        ],
      },
      {
        id: "campaign-performance",
        title: "Campaign Performance",
        description:
          "Track cross-channel campaign ROI in real time, gain actionable audience insights, and optimize marketing spend across all digital marketing channels.",
        productsLabel: "Products That Power Marketing :",
        products: [
          { name: "Marketing Cloud", icon: "/images/services/salesforce-cloud-icons/marketing-cloud.svg" },
          { name: "Sales Cloud", icon: "/images/services/salesforce-cloud-icons/sales-cloud.svg" },
        ],
      },
      {
        id: "lead-nurturing",
        title: "Lead Nurturing & Engagement",
        description:
          "Deliver automated drip campaigns, smart email triggers, and behavioral scoring to turn lukewarm prospects into ready-to-buy customers seamlessly.",
        productsLabel: "Products That Power Marketing :",
        products: [
          { name: "Marketing Cloud", icon: "/images/services/salesforce-cloud-icons/marketing-cloud.svg" },
          { name: "Sales Cloud", icon: "/images/services/salesforce-cloud-icons/sales-cloud.svg" },
        ],
      },
    ],
  },
  {
    id: "cx-support",
    label: "Customer Experience & Support",
    line1: "Customer Experience",
    line2: "& Support",
    cards: [
      {
        id: "omnichannel-service",
        title: "Omnichannel Service",
        description:
          "Unify phone, live chat, email, and social support into a single console, giving service agents a complete 360-degree view of every customer interaction.",
        productsLabel: "Products That Power Support :",
        products: [
          { name: "Sales Cloud", icon: "/images/services/salesforce-cloud-icons/sales-cloud.svg" },
          { name: "Marketing Cloud", icon: "/images/services/salesforce-cloud-icons/marketing-cloud.svg" },
        ],
      },
      {
        id: "agentforce-ai",
        title: "AI-Powered Agentforce",
        description:
          "Deploy autonomous AI agents to resolve routine support queries 24/7, reduce ticket backlogs, and seamlessly route complex cases to human experts.",
        productsLabel: "Products That Power Support :",
        products: [
          { name: "Sales Cloud", icon: "/images/services/salesforce-cloud-icons/sales-cloud.svg" },
          { name: "Marketing Cloud", icon: "/images/services/salesforce-cloud-icons/marketing-cloud.svg" },
        ],
      },
      {
        id: "field-service",
        title: "Field Service Excellence",
        description:
          "Empower mobile field technicians with real-time job routing, inventory visibility, digital signatures, and instant remote expert assistance.",
        productsLabel: "Products That Power Support :",
        products: [
          { name: "Sales Cloud", icon: "/images/services/salesforce-cloud-icons/sales-cloud.svg" },
          { name: "Marketing Cloud", icon: "/images/services/salesforce-cloud-icons/marketing-cloud.svg" },
        ],
      },
    ],
  },
  {
    id: "data-intelligence",
    label: "Data, Insights & Intelligence",
    line1: "Data, Insights &",
    line2: "Intelligence",
    cards: [
      {
        id: "unified-data-cloud",
        title: "Unified Data Cloud",
        description:
          "Harmonize customer data from disparate ERPs, CRMs, and custom databases into a single real-time profile for instant personalized action.",
        productsLabel: "Products That Power Intelligence :",
        products: [
          { name: "Sales Cloud", icon: "/images/services/salesforce-cloud-icons/sales-cloud.svg" },
          { name: "Marketing Cloud", icon: "/images/services/salesforce-cloud-icons/marketing-cloud.svg" },
        ],
      },
      {
        id: "predictive-analytics",
        title: "Predictive Analytics",
        description:
          "Leverage built-in AI models to forecast revenue, identify churn risk early, and uncover hidden upsell opportunities across your account base.",
        productsLabel: "Products That Power Intelligence :",
        products: [
          { name: "Sales Cloud", icon: "/images/services/salesforce-cloud-icons/sales-cloud.svg" },
          { name: "Marketing Cloud", icon: "/images/services/salesforce-cloud-icons/marketing-cloud.svg" },
        ],
      },
      {
        id: "executive-dashboards",
        title: "Executive Dashboards",
        description:
          "Gain instant visibility into KPIs through interactive, customized dashboards accessible anytime on desktop or mobile devices.",
        productsLabel: "Products That Power Intelligence :",
        products: [
          { name: "Sales Cloud", icon: "/images/services/salesforce-cloud-icons/sales-cloud.svg" },
          { name: "Marketing Cloud", icon: "/images/services/salesforce-cloud-icons/marketing-cloud.svg" },
        ],
      },
    ],
  },
  {
    id: "integration-automation",
    label: "Integration & Automation",
    line1: "Integration &",
    line2: "Automation",
    cards: [
      {
        id: "api-integration",
        title: "API & Ecosystem Integration",
        description:
          "Connect Salesforce smoothly with legacy ERP systems, payment gateways, and custom backend microservices using robust API integrations.",
        productsLabel: "Products That Power Automation :",
        products: [
          { name: "Sales Cloud", icon: "/images/services/salesforce-cloud-icons/sales-cloud.svg" },
          { name: "Marketing Cloud", icon: "/images/services/salesforce-cloud-icons/marketing-cloud.svg" },
        ],
      },
      {
        id: "process-flow",
        title: "Process Flow Automation",
        description:
          "Eliminate repetitive manual tasks with event-driven Salesforce Flows, automated approvals, and instant notifications across your workspace.",
        productsLabel: "Products That Power Automation :",
        products: [
          { name: "Sales Cloud", icon: "/images/services/salesforce-cloud-icons/sales-cloud.svg" },
          { name: "Marketing Cloud", icon: "/images/services/salesforce-cloud-icons/marketing-cloud.svg" },
        ],
      },
      {
        id: "custom-app-dev",
        title: "Custom App Development",
        description:
          "Extend standard CRM capabilities with custom Lightning Web Components (LWC), AppExchange extensions, and bespoke cloud applications.",
        productsLabel: "Products That Power Automation :",
        products: [
          { name: "Sales Cloud", icon: "/images/services/salesforce-cloud-icons/sales-cloud.svg" },
          { name: "Marketing Cloud", icon: "/images/services/salesforce-cloud-icons/marketing-cloud.svg" },
        ],
      },
    ],
  },
  {
    id: "ai-agentic-automation",
    label: "AI & Agentic Automation",
    line1: "AI & Agentic",
    line2: "Automation",
    cards: [
      {
        id: "autonomous-ai",
        title: "Autonomous AI Agents",
        description:
          "Deploy custom AI agents to automate workflow routing, data synthesis, and instant decision making across your enterprise ecosystem.",
        productsLabel: "Products That Power AI :",
        products: [
          { name: "Sales Cloud", icon: "/images/services/salesforce-cloud-icons/sales-cloud.svg" },
          { name: "Marketing Cloud", icon: "/images/services/salesforce-cloud-icons/marketing-cloud.svg" },
        ],
      },
      {
        id: "ai-copilot",
        title: "Einstein Copilot & AI",
        description:
          "Enhance sales and service rep productivity with generative AI assistance for real-time customer summaries and next-best action recommendations.",
        productsLabel: "Products That Power AI :",
        products: [
          { name: "Sales Cloud", icon: "/images/services/salesforce-cloud-icons/sales-cloud.svg" },
          { name: "Marketing Cloud", icon: "/images/services/salesforce-cloud-icons/marketing-cloud.svg" },
        ],
      },
      {
        id: "agentforce-studio",
        title: "Agentforce Studio",
        description:
          "Build, test, and deploy customized autonomous agents integrated directly into your Salesforce ecosystem for round-the-clock efficiency.",
        productsLabel: "Products That Power AI :",
        products: [
          { name: "Sales Cloud", icon: "/images/services/salesforce-cloud-icons/sales-cloud.svg" },
          { name: "Marketing Cloud", icon: "/images/services/salesforce-cloud-icons/marketing-cloud.svg" },
        ],
      },
    ],
  },
];

export default function LeadToCustomerJourney() {
  const [activeTabId, setActiveTabId] = useState<string>("sales-optimization");
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

  const currentTab =
    JOURNEY_TABS.find((t) => t.id === activeTabId) || JOURNEY_TABS[0];

  return (
    <section ref={sectionRef} className="w-full bg-[#050505] text-white py-16 sm:py-24 px-6 sm:px-10 lg:px-16 z-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col space-y-12 sm:space-y-14">
        
        {/* ── Section Header Frame ── */}
        <div className={`flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-[73px] transition-all duration-1000 ease-out transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          {/* Left Script Badge */}
          <div className="shrink-0">
            <span className="font-caveat font-bold text-4xl sm:text-5xl lg:text-[56px] bg-gradient-to-r from-[#2F89FF] to-[#B021F0] bg-clip-text text-transparent inline-block">
              From Lead to Customer :
            </span>
          </div>

          {/* Right Main Headline */}
          <div className="max-w-[882px]">
            <h2 className="font-duru font-normal text-2xl sm:text-3xl lg:text-[42px] leading-tight lg:leading-[52px] text-white">
              The Ultimate Journey of Sales, Marketing &amp; Customer Experience
            </h2>
          </div>
        </div>

        {/* ── Tabs Navigation Bar ── */}
        <div className={`w-full border-b border-white/15 relative transition-all duration-1000 delay-150 ease-out transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-6 lg:gap-8 pt-2">
            {JOURNEY_TABS.map((tab) => {
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={`relative text-left font-intel transition-all duration-200 cursor-pointer pb-4 shrink-0 flex flex-col justify-end min-w-max ${
                    isActive ? "text-white opacity-100" : "text-white/50 hover:text-white/80"
                  }`}
                >
                  <span className="text-sm sm:text-base lg:text-[17px] font-semibold leading-tight tracking-tight block">
                    {tab.line1 || tab.label}
                  </span>
                  {tab.line2 && (
                    <span className="text-sm sm:text-base lg:text-[17px] font-semibold leading-tight tracking-tight block mt-0.5">
                      {tab.line2}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#2F89FF] to-[#B021F0] rounded-full shadow-[0_0_10px_rgba(47,137,255,0.5)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Cards Grid (3 Cards) ── */}
        <div 
          key={activeTabId}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-[26px] transition-all duration-700 ease-out transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {currentTab.cards.map((card) => (
            <div
              key={card.id}
              className="group bg-[#121214] border border-white/[0.08] rounded-[16px] p-7 sm:p-8 flex flex-col justify-between space-y-7 min-h-[460px] lg:min-h-[480px] hover:border-[#2F89FF]/40 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(47,137,255,0.15)] transition-all duration-300 cursor-pointer shadow-2xl"
            >
              {/* Card Top Section */}
              <div className="flex flex-col space-y-5">
                {/* Purple/Blue Gradient Cloud Vector Icon Outline */}
                <div className="w-[48px] h-[35px] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 ease-out">
                  <svg
                    width="48"
                    height="35"
                    viewBox="0 0 64 47"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    <defs>
                      <linearGradient
                        id={`cloudGrad-${card.id}`}
                        x1="0"
                        y1="0"
                        x2="64"
                        y2="47"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0%" stopColor="#2F89FF" />
                        <stop offset="100%" stopColor="#B021F0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M48.2 18.2C46.6 9.8 38.6 3 28.7 3C20.1 3 12.8 7.8 9.2 14.8C4.5 15.6 1 19.8 1 25C1 31.1 6.1 36 12.5 36H48.4C53.9 36 58.4 31.5 58.4 26C58.4 20.8 54.1 18.5 48.2 18.2Z"
                      stroke={`url(#cloudGrad-${card.id})`}
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Card Title & Description */}
                <div className="flex flex-col space-y-3">
                  <h3 className="font-duru font-normal text-xl sm:text-[22px] leading-[30px] text-white group-hover:text-cyan-200 transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="font-intel font-normal text-sm sm:text-[15px] leading-[24px] text-white/70">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Card Bottom Section (Products) */}
              <div className="flex flex-col space-y-3.5 pt-2">
                <span className="font-caveat font-bold text-lg sm:text-xl leading-[24px] text-white">
                  {card.productsLabel}
                </span>

                <div className="flex items-center space-x-5">
                  {card.products.map((prod, idx) => {
                    const nameParts = prod.name.split(" ");
                    return (
                      <div key={idx} className="flex flex-col items-center space-y-2 w-[64px]">
                        {/* Circle White Icon Container */}
                        <div className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center p-2.5 shadow-md shrink-0 hover:scale-110 hover:shadow-xl transition-all duration-300">
                          <Image
                            src={prod.icon}
                            alt={prod.name}
                            width={28}
                            height={28}
                            className="w-7 h-7 object-contain"
                          />
                        </div>

                        {/* Product Name */}
                        <span className="font-intel font-normal text-[12px] leading-[16px] text-center text-white/80 flex flex-col items-center">
                          {nameParts.map((part, pIdx) => (
                            <span key={pIdx} className="block whitespace-nowrap">{part}</span>
                          ))}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
