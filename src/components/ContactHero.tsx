import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Upload } from "lucide-react";

export interface OfficeLocation {
  country: string;
  cities: string;
}

export const officeLocations: OfficeLocation[] = [
  { country: "India", cities: "Noida, Uttar Pradesh" },
  { country: "USA", cities: "Delaware" },
  { country: "United Kingdom", cities: "London" },
];

export const FacebookIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

export const LinkedinIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9z" />
  </svg>
);

export const XIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const YoutubeIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const socialLinks = [
  { name: "Facebook", icon: FacebookIcon, href: "https://facebook.com" },
  { name: "LinkedIn", icon: LinkedinIcon, href: "https://linkedin.com" },
  { name: "X", icon: XIcon, href: "https://twitter.com" },
  { name: "Instagram", icon: InstagramIcon, href: "https://instagram.com" },
  { name: "YouTube", icon: YoutubeIcon, href: "https://youtube.com" },
];

export const ContactInfo: React.FC = () => {
  return (
    <div className="flex flex-col space-y-10 text-white">
      {/* Eyebrow Header */}
      <div className="flex flex-col space-y-4">
        <p
          className="text-[12px] font-medium uppercase tracking-[3px] text-[#9CA3AF]"
          style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
        >
          / GET IN TOUCH
        </p>
        <h1
          className="text-[30px] sm:text-[40px] lg:text-[50px] font-medium leading-[1.05] text-white tracking-tight"
          style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
        >
          Let&apos;s Build <br />
          Something <br />
          Intelligent Together
        </h1>
        <p
          className="text-ms leading-[1.8] text-[#B6B6C2] pt-2 max-w-[90%]"
          style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
        >
          Whether you&apos;re exploring AI, Salesforce, enterprise software, or digital transformation,
          our experts are here to help you find the right solution for your business.
        </p>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6 pt-4">
        {/* Call Us */}
        <div className="flex flex-col space-y-3">
          <h3
            className="text-[16px] font-semibold text-white tracking-wide"
            style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
          >
            Call Us
          </h3>
          <div
            className="flex flex-col space-y-1 text-[15px] text-[#B6B6C2]"
            style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
          >
            <a href="tel:+917042912246" className="hover:text-white transition-colors">
              +91 70429 12246
            </a>
            <a href="tel:+1XXXXXXXXXX" className="hover:text-white transition-colors">
              +1 XXX XXX XXXX
            </a>
          </div>
        </div>

        {/* Offices */}
        <div className="flex flex-col space-y-3">
          <h3
            className="text-[16px] font-semibold text-white tracking-wide"
            style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
          >
            Offices
          </h3>
          <div
            className="flex flex-col space-y-1 text-[15px] text-[#B6B6C2]"
            style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
          >
            {officeLocations.map((loc) => (
              <p key={loc.country}>
                <span className="text-white font-medium">{loc.country}</span> – {loc.cities}
              </p>
            ))}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col space-y-3">
          <h3
            className="text-[16px] font-semibold text-white tracking-wide"
            style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
          >
            Email
          </h3>
          <a
            href="mailto:sales@cloudcentric.com"
            className="text-[15px] text-[#B6B6C2] hover:text-white transition-colors"
            style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
          >
            sales@cloudcentric.com
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex flex-col space-y-3">
          <h3
            className="text-[16px] font-semibold text-white tracking-wide"
            style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
          >
            Social network
          </h3>
          <div className="flex items-center space-x-3 pt-1">
            {socialLinks.map((item) => {
              const IconComp = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                  className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-[#A855F7]/20 hover:border-[#A855F7]/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:scale-110 transition-all duration-300"
                >
                  <IconComp className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export interface UploadFieldProps {
  onFileSelect?: (file: File | null) => void;
}

export const UploadField: React.FC<UploadFieldProps> = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFileName(file.name);
      if (onFileSelect) onFileSelect(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      if (onFileSelect) onFileSelect(file);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`relative w-full rounded-2xl border border-dashed transition-all duration-300 p-6 flex items-center space-x-4 cursor-pointer bg-white/[0.02] backdrop-blur-md ${
        dragActive
          ? "border-[#A855F7] bg-[#A855F7]/10 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          : "border-white/15 hover:border-[#A855F7]/60 hover:bg-white/[0.04]"
      }`}
    >
      <input
        type="file"
        id="file-upload"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleChange}
        accept=".zip,.pdf,.fig,.doc,.docx"
      />
      <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0 text-white/70">
        <Upload className="w-5 h-5" />
      </div>
      <div className="flex flex-col">
        <p className="text-sm font-medium text-white/90">
          {uploadedFileName ? (
            <span className="text-[#A855F7] font-semibold">{uploadedFileName}</span>
          ) : (
            <>
              Drag &amp; Drop Your Files or{" "}
              <span className="text-[#A855F7] underline underline-offset-2">Browse</span>
            </>
          )}
        </p>
        <p
          className="text-xs text-white/50 pt-1"
          style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
        >
          You can upload ZIP, PDF, PAGES, DOC, or DOCX up to 8 MB each.
        </p>
      </div>
    </div>
  );
};

export const ContactFormCard: React.FC<{ isContactUsPage?: boolean }> = ({ isContactUsPage }) => {
  const router = useRouter();
  const isContactPage = isContactUsPage ?? (router?.pathname === "/contact-us" || router?.asPath === "/contact-us");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    telegram: "",
    description: "",
    budget: "",
    referralSource: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! Your request has been submitted successfully.");
  };

  return (
    <div
      className={`relative w-full rounded-[24px] border border-white/[0.08] p-6 sm:p-10 overflow-hidden ${
        isContactPage
          ? "bg-transparent shadow-none backdrop-blur-none"
          : "bg-[rgba(255,255,255,0.04)] backdrop-blur-[16px] shadow-[0_20px_60px_rgba(124,58,237,0.15)]"
      }`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="contact-name"
              className="text-[12px] font-semibold tracking-[2px] text-white/90 uppercase font-intel"
            >
              NAME <span className="text-[#A855F7]">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              required
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-[56px] bg-transparent border-b border-white/12 text-white placeholder-[#8B8B95] outline-none focus:border-[#A855F7] transition-all text-sm font-intel"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="contact-email"
              className="text-[12px] font-semibold tracking-[2px] text-white/90 uppercase font-intel"
            >
              EMAIL <span className="text-[#A855F7]">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              required
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full h-[56px] bg-transparent border-b border-white/12 text-white placeholder-[#8B8B95] outline-none focus:border-[#A855F7] transition-all text-sm font-intel"
            />
          </div>
        </div>

        {/* Row 2: Phone & Telegram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="contact-phone"
              className="text-[12px] font-semibold tracking-[2px] text-white/90 uppercase font-intel"
            >
              PHONE NUMBER <span className="text-[#A855F7]">*</span>
            </label>
            <div className="flex items-center space-x-3 border-b border-white/12 focus-within:border-[#A855F7] transition-all h-[56px]">
              <span className="text-sm shrink-0" aria-hidden="true">🇺🇸</span>
              <input
                id="contact-phone"
                type="tel"
                required
                placeholder="+1 201-555-0123"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-transparent text-white placeholder-[#8B8B95] outline-none text-sm font-intel"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="contact-telegram"
              className="text-[12px] font-semibold tracking-[2px] text-white/90 uppercase font-intel"
            >
              TELEGRAM
            </label>
            <input
              id="contact-telegram"
              type="text"
              placeholder="@username"
              value={formData.telegram}
              onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
              className="w-full h-[56px] bg-transparent border-b border-white/12 text-white placeholder-[#8B8B95] outline-none focus:border-[#A855F7] transition-all text-sm font-intel"
            />
          </div>
        </div>

        {/* Row 3: Describe Your Idea */}
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="contact-description"
            className="text-[12px] font-semibold tracking-[2px] text-white/90 uppercase font-intel"
          >
            DESCRIBE YOUR IDEA <span className="text-[#A855F7]">*</span>
          </label>
          <textarea
            id="contact-description"
            required
            rows={3}
            placeholder="How can we help you?"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full min-h-[130px] bg-transparent border border-white/12 rounded-xl p-4 text-white placeholder-[#8B8B95] outline-none focus:border-[#A855F7] transition-all text-sm resize-none font-intel"
          />
        </div>

        {/* Row 4: Budget & Referral */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="contact-budget"
              className="text-[12px] font-semibold tracking-[2px] text-white/90 uppercase font-intel"
            >
              WHAT IS YOUR BUDGET? <span className="text-[#A855F7]">*</span>
            </label>
            <select
              id="contact-budget"
              required
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full h-[56px] bg-[#0E0E12]/90 border border-white/12 rounded-xl px-4 text-white/80 outline-none focus:border-[#A855F7] transition-all text-sm appearance-none cursor-pointer font-intel"
            >
              <option value="" disabled>Choose an option here</option>
              <option value="10k-25k">$10k – $25k</option>
              <option value="25k-50k">$25k – $50k</option>
              <option value="50k-100k">$50k – $100k</option>
              <option value="100k+">$100k+</option>
            </select>
          </div>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="contact-referral"
              className="text-[12px] font-semibold tracking-[2px] text-white/90 uppercase font-intel"
            >
              HOW DID YOU HEAR ABOUT US?
            </label>
            <select
              id="contact-referral"
              value={formData.referralSource}
              onChange={(e) => setFormData({ ...formData, referralSource: e.target.value })}
              className="w-full h-[56px] bg-[#0E0E12]/90 border border-white/12 rounded-xl px-4 text-white/80 outline-none focus:border-[#A855F7] transition-all text-sm appearance-none cursor-pointer font-intel"
            >
              <option value="" disabled>Choose an option here</option>
              <option value="google">Search Engine (Google)</option>
              <option value="linkedin">LinkedIn</option>
              <option value="referral">Client Referral</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Upload File Area */}
        <UploadField />

        {/* CTA Button */}
        <button
          type="submit"
          className="w-full h-[58px] rounded-full bg-gradient-to-r from-[#4F7CFF] to-[#B624FF] text-white text-[13px] font-bold tracking-[2px] uppercase shadow-[0_0_30px_rgba(182,36,255,0.4)] hover:shadow-[0_0_40px_rgba(182,36,255,0.6)] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2"
          style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
        >
          <span>SCHEDULE A FREE CONSULTATION</span>
          <span className="text-base">↗</span>
        </button>
      </form>
    </div>
  );
};

export default function ContactHero() {
  return (
    <section className="relative w-full bg-[#050505] text-white py-[70px] sm:py-[90px] lg:py-[120px] px-5 sm:px-8 overflow-hidden z-10">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/contact/contact-hero-bg.png"
          alt="Contact Hero Background"
          fill
          className="object-cover object-center opacity-85"
          priority
        />
        <div className="absolute inset-0 bg-[#050505]/72" />
        {/* Curved Glow Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-[350px] bg-gradient-to-t from-[#B624FF]/15 via-[#4F7CFF]/10 to-transparent pointer-events-none blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-[70px] items-start">
        {/* Left Column (45% on lg = 5 cols) */}
        <div className="lg:col-span-5">
          <ContactInfo />
        </div>

        {/* Right Column (55% on lg = 7 cols) */}
        <div className="lg:col-span-7">
          <ContactFormCard />
        </div>
      </div>
    </section>
  );
}
