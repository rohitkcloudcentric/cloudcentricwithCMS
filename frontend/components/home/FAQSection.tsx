"use client";

import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   FAQ data
───────────────────────────────────────────── */
interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 1,
    question: "What industries does CloudCentric serve?",
    answer:
      "CloudCentric serves a broad range of industries including Real Estate, Education, Healthcare, Financial Services, Manufacturing, Retail, Travel & Hospitality, and more. Our cross-industry expertise allows us to tailor intelligent solutions to virtually any business domain.",
  },
  {
    id: 2,
    question: "Can you customize solutions for our business requirements?",
    answer:
      "Absolutely. Every solution is designed around your business processes, goals, and industry needs. We build customized AI, Salesforce, and enterprise solutions that fit your organization — not the other way around.",
  },
  {
    id: 3,
    question: "Do you provide ongoing support after project delivery?",
    answer:
      "Yes. We offer comprehensive post-delivery support including performance monitoring, bug fixes, feature enhancements, and dedicated SLA-based maintenance packages to keep your systems running smoothly.",
  },
  {
    id: 4,
    question: "Can CloudCentric integrate with our existing systems?",
    answer:
      "Absolutely. Our team specializes in seamless integrations with CRMs, ERPs, third-party APIs, cloud platforms, and legacy systems — ensuring your new solution works in harmony with your existing technology stack.",
  },
  {
    id: 5,
    question: "Why do businesses choose CloudCentric?",
    answer:
      "Businesses choose CloudCentric for our proven track record of 400+ successful projects, AI-first approach, deep Salesforce expertise, and a dedicated team of 100+ technology experts who are committed to delivering measurable business value.",
  },
];

/* ─────────────────────────────────────────────
   Accordion Item
───────────────────────────────────────────── */
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
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
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
            text-white group-hover:text-white transition-all duration-200 text-lg leading-none mt-0.5"
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
            className="pb-5 text-sm text-white leading-relaxed font-intel"
          >
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main FAQ Section
───────────────────────────────────────────── */
export default function FAQSection() {
  /* Second item (index 1) open by default */
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
      className="w-full bg-black text-white px-4 sm:px-6 lg:px-8 py-20 overflow-hidden"
      aria-label="Frequently Asked Questions"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

        {/* ── Left Column: Heading & Description (Comes from Left) ── */}
        <div
          className={`flex flex-col space-y-5 lg:sticky lg:top-28 transition-all duration-800 ease-out transform ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          {/* Subtitle */}
          <p
            className="text-xs font-normal uppercase tracking-widest text-white font-intel"
          >
            Frequently Asked Questions
          </p>

          {/* Heading */}
          <h2
            className="text-3xl sm:text-4xl font-normal leading-tight text-white font-duru"
          >
            Questions Before You Partner <br className="hidden sm:inline" /> With Us?{" "} <br />
            <span
              className="bg-gradient-to-r from-[#2563EB] to-[#A855F7] bg-clip-text text-transparent"
            >
              We&apos;ve Got the Answers.
            </span>
          </h2>

          {/* Description */}
          <p
            className="text-md text-white leading-relaxed max-full font-intel"
          >
            Learn more about how we work, the industries we serve, and what you
            can expect when partnering with CloudCentric for AI, Salesforce, and
            digital transformation.
          </p>
        </div>

        {/* ── Right Column: Accordion Questions & Answers (Comes One-by-One from Right) ── */}
        <div
          className="flex flex-col divide-y-0"
          role="list"
          aria-label="FAQ accordion"
        >
          {FAQS.map((item, idx) => (
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
