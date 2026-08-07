"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/* ─────────────────────────────────────────────
   Category definitions
───────────────────────────────────────────── */
const CATEGORIES = [
  "All Clients",
  "Real Estate",
  "IT & Services",
  "Agriculture",
  "Healthcare",
  "Financial Services",
  "Manufacturing",
  "Education",
  "Travel & Hospitality",
  "Utilities",
  "Professional Services",
  "Retail & Consumer Goods",
  "Automotives",
  "Media & Entertainments",
  "High Tech",
  "Food & Beverage",
  "Non Profit",
] as const;

/* ─────────────────────────────────────────────
   Client logo definitions
───────────────────────────────────────────── */
interface Client {
  name: string;
  src: string;
  category: string;
}

const CLIENTS: Client[] = [
  { name: "GTC Marketing", src: "/images/our-clients-1/gtcsvg.svg", category: "Professional Services" },
  { name: "SparkTG", src: "/images/our-clients-1/sparktg.svg", category: "IT & Services" },
  { name: "Fellowship Travel & Tours", src: "/images/our-clients-1/fellowship.svg", category: "Travel & Hospitality" },
  { name: "Abhushan", src: "/images/our-clients-1/abhushan.svg", category: "Retail & Consumer Goods" },
  { name: "Magic Billion", src: "/images/our-clients-1/magic-billion.svg", category: "Professional Services" },
  { name: "Preferred Square", src: "/images/our-clients-1/prefrred.svg", category: "Real Estate" },
  { name: "BIMTECH", src: "/images/our-clients-1/bimtech.svg", category: "Education" },
  { name: "Intuit Lab", src: "/images/our-clients-1/intuit-lab.svg", category: "High Tech" },
  { name: "CU Online", src: "/images/our-clients-1/cu-online.svg", category: "Education" },
  { name: "ALLEN", src: "/images/our-clients-1/allen.svg", category: "Education" },
  { name: "Footprints", src: "/images/our-clients-1/footprints.svg", category: "Education" },
  { name: "Maplebear", src: "/images/our-clients-1/maplebear.svg", category: "Food & Beverage" },
  { name: "Adventus.io", src: "/images/our-clients-1/adventus.svg", category: "IT & Services" },
  { name: "New Light Institute", src: "/images/our-clients-1/new-light-institute.svg", category: "Education" },
  { name: "Bhagwati", src: "/images/our-clients-1/bhagwati.svg", category: "Manufacturing" },
  { name: "Adle Broswon Group", src: "/images/our-clients-1/adle-broswon.svg", category: "Professional Services" },
  { name: "Asees", src: "/images/our-clients-1/asees.svg", category: "Non Profit" },
  { name: "Genus", src: "/images/our-clients-1/genus.svg", category: "Utilities" },
  { name: "ED Camp", src: "/images/our-clients-1/ed-camp.svg", category: "Education" },
  { name: "TechnoStruct", src: "/images/our-clients-1/technostruct.svg", category: "IT & Services" },
];

/* ─────────────────────────────────────────────
   Lightbox Modal
───────────────────────────────────────────── */
interface LightboxProps {
  clients: Client[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

function Lightbox({ clients, activeIndex, onClose, onNavigate }: LightboxProps) {
  const [mounted, setMounted] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);

  /* Smooth mount animation */
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate(Math.max(0, activeIndex - 1));
      if (e.key === "ArrowRight") onNavigate(Math.min(clients.length - 1, activeIndex + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, clients.length, onClose, onNavigate]);

  /* Auto-scroll thumbnail strip to keep active thumb visible */
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const thumb = strip.children[activeIndex] as HTMLElement;
    if (thumb) {
      thumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeIndex]);

  const current = clients[activeIndex];

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Viewing ${current.name}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        className="relative z-10 flex flex-col items-center gap-6 w-full max-w-3xl mx-4"
        style={{
          transform: mounted ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
          transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 border border-white/20
            flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Main image card */}
        <div className="w-full bg-white rounded-2xl p-8 shadow-[0_30px_80px_rgba(0,0,0,0.7)] flex items-center justify-center min-h-[220px]">
          <div className="relative w-full h-[180px]">
            <Image
              key={current.src}
              src={current.src}
              alt={current.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 90vw, 700px"
              priority
            />
          </div>
        </div>

        {/* Client name */}
        <p
          className="text-white/90 text-base font-medium tracking-wide"
          style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
        >
          {current.name}
        </p>

        {/* Navigation row */}
        <div className="flex items-center gap-4 w-full">
          {/* Prev */}
          <button
            onClick={() => onNavigate(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className="shrink-0 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center
              text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous client"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Scrollable thumbnail strip */}
          <div
            ref={stripRef}
            className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide py-1"
            style={{ scrollbarWidth: "none" }}
          >
            {clients.map((c, i) => (
              <button
                key={c.src}
                onClick={() => onNavigate(i)}
                className={`shrink-0 w-16 h-12 rounded-lg bg-white p-1.5 transition-all duration-200
                  ${i === activeIndex
                    ? "ring-2 ring-[#7C3AED] scale-105 shadow-[0_0_12px_rgba(124,58,237,0.5)]"
                    : "opacity-50 hover:opacity-80"
                  }`}
                aria-label={c.name}
                aria-current={i === activeIndex ? "true" : undefined}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={c.src}
                    alt={c.name}
                    fill
                    className="object-contain"
                    sizes="64px"
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Next */}
          <button
            onClick={() => onNavigate(Math.min(clients.length - 1, activeIndex + 1))}
            disabled={activeIndex === clients.length - 1}
            className="shrink-0 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center
              text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next client"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Counter */}
        <p
          className="text-white/40 text-xs"
          style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
        >
          {activeIndex + 1} / {clients.length}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Logo Card
───────────────────────────────────────────── */
interface LogoCardProps {
  client: Client;
  index: number;
  onClick: () => void;
}

function LogoCard({ client, index, onClick }: LogoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className="group bg-white rounded-[4px] p-4 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(0,0,0,0.3)] hover:ring-2 hover:ring-[#7C3AED]/40 transition-all duration-200"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 0.45s ease ${index * 50}ms, transform 0.45s ease ${index * 50}ms`,
      }}
      aria-label={`View ${client.name}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
    >
      <div className="relative w-full h-[90px]">
        <Image
          src={client.src}
          alt={client.name}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 16vw"
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Hero Component
───────────────────────────────────────────── */
export default function OurClientsHero() {
  const [activeCategory, setActiveCategory] = useState<string>("All Clients");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "All Clients"
      ? CLIENTS
      : CLIENTS.filter((c) => c.category === activeCategory);

  const handleCardClick = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const handleClose = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const handleNavigate = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  return (
    <>
      <section
        className="w-full bg-black text-white px-4 sm:px-6 lg:px-8 pt-16 pb-24"
        aria-label="Our Clients"
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center space-y-5">

          {/* ── Heading ── */}
          <div className="text-center space-y-4 max-w-4xl">
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
            >
              Trusted by Businesses Worldwide
            </h1>
            <p
              className="text-sm sm:text-sm text-white leading-relaxed tracking-wide max-w-4xl mx-auto"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              From ambitious startups to established enterprises, organizations across industries trust
              CloudCentric to deliver AI, Salesforce, enterprise software, and digital transformation
              solutions that create measurable business value.
            </p>
          </div>

          {/* ── Category Filter Pills ── */}
          <div
            className="flex flex-wrap justify-center gap-2"
            role="tablist"
            aria-label="Filter clients by industry"
          >
            {CATEGORIES.map((cat) => {
              const isActive = cat === activeCategory;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    px-3.5 py-1.5 rounded-[5px] text-sm font-medium tracking-wide transition-all duration-200
                    ${isActive
                      ? "text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                      : "bg-[#1816214D] text-white border border-white/10 hover:border-white/25 hover:text-white"
                    }
                  `}
                  style={
                    isActive
                      ? {
                          background: "linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)",
                          fontFamily: "var(--font-manrope), sans-serif",
                        }
                      : { fontFamily: "var(--font-manrope), sans-serif" }
                  }
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* ── Logo Grid ── */}
          {filtered.length > 0 ? (
            <div
              className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-1.5 gap-y-1 sm:gap-x-3 sm:gap-y-3"
              role="list"
              aria-label="Client logos"
            >
              {filtered.map((client, i) => (
                <div key={client.src} role="listitem">
                  <LogoCard
                    client={client}
                    index={i}
                    onClick={() => handleCardClick(i)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/40 text-sm py-16">No clients in this category yet.</p>
          )}

        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <Lightbox
          clients={filtered}
          activeIndex={lightboxIndex}
          onClose={handleClose}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );
}
