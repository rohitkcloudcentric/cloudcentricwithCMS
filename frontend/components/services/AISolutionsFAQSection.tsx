"use client";

import { useState, useEffect, useRef, ReactNode } from "react";

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface AISolutionsFAQSectionProps {
  eyebrow?: string;
  title?: ReactNode;
  description?: string;
  faqs?: FAQItem[];
  ariaLabel?: string;
}

const AI_SOLUTIONS_FAQS: FAQItem[] = [
  {
    id: 1,
    question: "Where should our business start with AI?",
    answer:
      "We recommend starting with an AI readiness assessment and a high-impact proof of concept. We help identify manual bottlenecks, high-value data opportunities, and quick wins to build momentum and prove ROI.",
  },
  {
    id: 2,
    question: "Can you integrate AI with our existing systems?",
    answer:
      "Yes. We can connect AI with Salesforce, CRM platforms, databases, cloud applications, APIs, communication platforms, and other enterprise systems.",
  },
  {
    id: 3,
    question: "Do you build custom AI agents?",
    answer:
      "Yes. We build autonomous AI agents tailored to your business workflows. These agents can understand context, reason through multi-step decisions, connect to your APIs, and execute tasks automatically.",
  },
  {
    id: 4,
    question: "Can we start with a small AI proof of concept?",
    answer:
      "Absolutely. We frequently build small-scale, rapid AI proofs of concept (POCs) so you can validate value, test accuracy, and demonstrate feasibility before rolling out enterprise-wide solutions.",
  },
  {
    id: 5,
    question: "How do you keep enterprise AI secure?",
    answer:
      "We follow strict enterprise security standards including data encryption, role-based access control, secure API gateways, and private cloud deployment to ensure your proprietary business data remains safe and confidential.",
  },
];

function AccordionItem({
  item,
  index,
  isVisible,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  index: number;
  isVisible: boolean;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div 
      className={`border-b border-white/[0.08] transition-all duration-800 ease-out transform ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
      }`}
      style={{ transitionDelay: `${250 + index * 120}ms` }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded-md px-1"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        id={`faq-btn-${item.id}`}
      >
        <span
          className="text-sm sm:text-base text-white font-normal leading-snug group-hover:text-white transition-colors font-duru"
        >
          {item.question}
        </span>
        <span
          className="shrink-0 w-6 h-6 flex items-center justify-center cursor-pointer
            text-white group-hover:text-white transition-all duration-200 text-lg leading-none mt-0.5 font-mono"
          aria-hidden="true"
        >
          {isOpen ? "−" : "+"}
        </span>
      </button>

      {/* Animated answer panel */}
      <div
        id={`faq-answer-${item.id}`}
        role="region"
        aria-labelledby={`faq-btn-${item.id}`}
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="overflow-hidden">
          <p
            className="pb-5 text-xs sm:text-sm text-white/70 leading-relaxed font-intel"
          >
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function AISolutionsFAQSection({
  eyebrow = "Frequently Asked Questions",
  title = (
    <>
      Questions Before You Start Your <br className="hidden sm:inline" />
      <span className="bg-gradient-to-r from-[#2563EB] to-[#A855F7] bg-clip-text text-transparent">
        Salesforce Journey?
      </span>
    </>
  ),
  description = "Get clear answers about our Salesforce expertise, implementation approach, integrations, support, and how we help businesses get more value from Salesforce.",
  faqs = AI_SOLUTIONS_FAQS,
  ariaLabel = "Frequently Asked Questions",
}: AISolutionsFAQSectionProps) {
  /* Second item (index 1 / id 2) open by default matching screenshot */
  const [openId, setOpenId] = useState<number>(2);

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
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggle = (id: number) => setOpenId((prev) => (prev === id ? 0 : id));

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#050505] text-white px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14 overflow-hidden z-10"
      aria-label={ariaLabel}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

        {/* ── Left Column: Heading & Description ── */}
        <div
          className={`flex flex-col space-y-5 lg:sticky lg:top-28 transition-all duration-800 ease-out transform ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          {/* Subtitle */}
          <p className="text-xs font-normal uppercase tracking-widest text-white/80 font-intel">
            {eyebrow}
          </p>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl font-normal leading-tight text-white font-duru">
            {title}
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-white/70 leading-relaxed font-intel max-w-lg">
            {description}
          </p>
        </div>

        {/* ── Right Column: Accordion Questions & Answers ── */}
        <div
          className="flex flex-col divide-y-0"
          role="list"
          aria-label="FAQ accordion"
        >
          {faqs.map((item, idx) => (
            <AccordionItem
              key={item.id}
              item={item}
              index={idx}
              isVisible={isVisible}
              isOpen={openId === item.id}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default AISolutionsFAQSection;


