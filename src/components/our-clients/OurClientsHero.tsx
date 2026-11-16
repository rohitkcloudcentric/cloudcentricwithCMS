"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Search, ExternalLink } from "lucide-react";
import type { PublicClient } from "@/lib/client-data";

/* ─────────────────────────────────────────────
   Searchable Dropdown Component
───────────────────────────────────────────── */
interface SearchableDropdownOption<T extends string | number> {
  label: string;
  value: T;
}

interface SearchableDropdownProps<T extends string | number> {
  label?: string;
  options: SearchableDropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
}

function SearchableDropdown<T extends string | number>({
  label,
  options,
  value,
  onChange,
  placeholder = "Search...",
}: SearchableDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOpt = options.find((o) => o.value === value) || options[0];

  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="w-full flex flex-col items-start gap-1.5" ref={containerRef}>
      {label && (
        <label className="text-white text-sm font-semibold uppercase tracking-wider font-intel text-left">
          {label}
        </label>
      )}
      <div className="relative w-full">
        {/* Trigger button */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setSearchQuery("");
          }}
          className="w-full bg-[#181621] text-white border border-white/20 rounded-lg px-4 py-2 text-sm font-medium flex items-center justify-between focus:outline-none focus:border-[#7C3AED] transition-colors"
          style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
        >
          <span className="truncate pr-2">{selectedOpt ? selectedOpt.label : "Select..."}</span>
          <svg
            className={`w-4 h-4 text-white/60 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown panel */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-[#181621] border border-white/20 rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col max-h-60">
            {/* Search Input Box */}
            <div className="p-2 border-b border-white/10 sticky top-0 bg-[#181621] z-10 flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-white/40 shrink-0 ml-1" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-black/40 text-white text-xs rounded px-2.5 py-1.5 border border-white/10 focus:outline-none focus:border-[#7C3AED]"
                autoFocus
              />
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 scrollbar-thin">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-sm transition-colors hover:bg-[#7C3AED]/20 ${
                      opt.value === value
                        ? "bg-[#7C3AED] text-white font-semibold"
                        : "text-white/80"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-xs text-white/40 text-center">No matches found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Data (loaded from the CMS; see src/lib/client-data.ts)
───────────────────────────────────────────── */
const ALL_CLIENTS = "All Clients";

type Client = PublicClient;

/** Local images go through next/image; external URLs use a plain <img> (no remote-domain config needed). */
function LogoImage({ src, alt, sizes, priority }: { src: string; alt: string; sizes: string; priority?: boolean }) {
  if (src.startsWith("/")) {
    return <Image src={src} alt={alt} fill className="object-contain" sizes={sizes} priority={priority} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" className="absolute inset-0 w-full h-full object-contain" />
  );
}

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
  if (!current) return null;

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
          <div className="relative w-full h-[180px]" key={current.id}>
            <LogoImage src={current.src} alt={current.alt} sizes="(max-width: 768px) 90vw, 700px" priority />
          </div>
        </div>

        {/* Optional description + website from the CMS */}
        {(current.description || current.websiteUrl) && (
          <div className="w-full max-w-xl text-center space-y-3 px-4">
            {current.description && (
              <p className="text-white/70 text-sm leading-relaxed font-intel">{current.description}</p>
            )}
            {current.websiteUrl && (
              <a
                href={current.websiteUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1.5 text-sm text-[#A78BFA] hover:text-white underline underline-offset-4 font-intel"
              >
                Visit website <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
        )}

        {/* Client name (Desktop text / Mobile searchable dropdown filter with label) */}
        <div className="w-full flex justify-center px-4">
          <p
            className="hidden sm:block text-white/90 text-base font-medium tracking-wide"
            style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
          >
            {current.name}
          </p>

          <div className="sm:hidden w-full max-w-[280px]">
            <SearchableDropdown
              label="Select Client"
              placeholder="Search client name..."
              value={activeIndex}
              options={clients.map((c, i) => ({ label: c.name, value: i }))}
              onChange={(newIdx) => onNavigate(newIdx)}
            />
          </div>
        </div>

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
                key={c.id}
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
                  <LogoImage src={c.src} alt="" sizes="64px" />
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
          className="text-white/40 text-xs font-intel"
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
      className="group flex items-center justify-center bg-[#181621] border border-[#7C3AED]/40 rounded-[10px] p-2 sm:p-2.5 cursor-pointer hover:bg-[#7C3AED]/10 hover:border-[#A855F7] hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(124,58,237,0.35)] focus-visible:outline-none focus-visible:border-[#A855F7] transition-all duration-200"
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
      {/* Light logo panel: keeps dark/transparent logos and white-background logos equally readable */}
      <div className="w-full h-[64px] sm:h-[84px] bg-white rounded-[6px] px-3 py-2 sm:px-4 sm:py-2.5">
        <div className="relative w-full h-full">
          <LogoImage src={client.src} alt={client.alt} sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 240px" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Hero Component
───────────────────────────────────────────── */
interface OurClientsHeroProps {
  /** Active clients from the CMS (featured first, then display order) */
  clients: Client[];
  /** Client categories from the CMS, in display order */
  categories: string[];
}

/** Rows of logos shown before the first Load More click */
const INITIAL_ROWS = 4;

export default function OurClientsHero({ clients, categories }: OurClientsHeroProps) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CLIENTS);
  const [visibleRows, setVisibleRows] = useState<number>(INITIAL_ROWS);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const CATEGORIES = [ALL_CLIENTS, ...categories];

  const filtered =
    activeCategory === ALL_CLIENTS
      ? clients
      : clients.filter((c) => c.category === activeCategory);

  // Columns per breakpoint match the grid: 2 (mobile), 3 (sm), 4 (lg)
  const shownMobile = visibleRows * 2;
  const shownTablet = visibleRows * 3;
  const shownDesktop = visibleRows * 4;

  const handleLoadMore = () => setVisibleRows((rows) => rows + 1);

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
              className="text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-tight tracking-tight font-duru"
            >
              Trusted by Businesses Worldwide
            </h1>
            <p
              className="text-sm sm:text-sm text-white leading-relaxed tracking-wide max-w-4xl mx-auto font-intel"
            >
              From ambitious startups to established enterprises, organizations across industries trust
              CloudCentric to deliver AI, Salesforce, enterprise software, and digital transformation
              solutions that create measurable business value.
            </p>
          </div>

          {/* ── Category Filter Pills & Mobile Searchable Dropdown ── */}
          {/* Mobile Category Searchable Dropdown Filter */}
          <div className="md:hidden w-full max-w-xs">
            <SearchableDropdown
              label="Filter Industry"
              placeholder="Search industry..."
              value={activeCategory}
              options={CATEGORIES.map((cat) => ({ label: cat, value: cat }))}
              onChange={(cat) => {
                setActiveCategory(cat);
                setVisibleRows(INITIAL_ROWS);
              }}
            />
          </div>

          {/* Desktop Category Filter Pills */}
          <div
            className="hidden md:flex flex-wrap justify-center gap-2"
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
                  onClick={() => {
                    setActiveCategory(cat);
                    setVisibleRows(INITIAL_ROWS);
                  }}
                  className={`
                    px-3.5 py-1.5 rounded-[5px] text-sm font-medium tracking-wide transition-all duration-200 font-manrope
                    ${isActive
                      ? "text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                      : "bg-[#1816214D] text-white border border-white/10 hover:border-white/25 hover:text-white"
                    }
                  `}
                  style={
                    isActive
                      ? {
                          background: "linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)",
                        }
                      : undefined
                  }
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* ── Logo Grid ── */}
          {filtered.length > 0 ? (
            <div className="w-full flex flex-col items-center gap-6">
              <div
                className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6"
                role="list"
                aria-label="Client logos"
              >
                {filtered.map((client, i) => (
                  <div 
                    key={client.id} 
                    role="listitem"
                    className={`${i < shownMobile ? "block" : "hidden"} ${i < shownTablet ? "sm:block" : "sm:hidden"} ${i < shownDesktop ? "lg:block" : "lg:hidden"}`}
                  >
                    <LogoCard
                      client={client}
                      index={i < INITIAL_ROWS * 4 ? i : i % 4}
                      onClick={() => handleCardClick(i)}
                    />
                  </div>
                ))}
              </div>

              {/* Load More: reveals one more row per click; hidden once every row is shown */}
              {filtered.length > shownMobile && (
                <div
                  className={`pt-2 justify-center w-full ${filtered.length > shownMobile ? "flex" : "hidden"} ${filtered.length > shownTablet ? "sm:flex" : "sm:hidden"} ${filtered.length > shownDesktop ? "lg:flex" : "lg:hidden"}`}
                >
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    className="px-6 py-2.5 rounded-full border border-white/20 bg-[#181621] hover:border-white/40 transition-all font-manrope font-semibold text-sm shadow-lg active:scale-95 cursor-pointer"
                  >
                    <span
                      style={{
                        background: "linear-gradient(90deg, #2563EB 0%, #7C3AED 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Load More
                    </span>
                  </button>
                </div>
              )}
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
