"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Upload, ArrowUpRight } from "lucide-react";

export default function ContactForm({ isContactUsPage }: { isContactUsPage?: boolean }) {
  const router = useRouter();
  const isContactPage = isContactUsPage ?? (router?.pathname === "/contact-us" || router?.asPath === "/contact-us");

  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div
      className={`relative lg:col-span-7 rounded-[20px] border border-white/[0.1] p-6 sm:p-8 overflow-visible ${
        isContactPage
          ? "bg-transparent shadow-none backdrop-blur-none"
          : "bg-[rgba(14,14,20,0.72)] backdrop-blur-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.65)]"
      }`}
    >
      {/* Floating Bottom Left Metallic Flower Image image-2.png - Behind Glass Effect */}
      <div className="absolute -bottom-10 -left-10 w-44 h-44 z-0 pointer-events-none opacity-90 drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)]">
        <Image
          src="/images/image-2.png"
          alt="3D Metallic Ornament"
          width={170}
          height={170}
          className="w-full h-full object-contain"
        />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-6 text-xs relative z-10">
        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label
              className="text-[11px] font-bold tracking-widest text-white/90 uppercase flex items-center"
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            >
              NAME<span className="text-[#A855F7] ml-1">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Your name"
              className="w-full bg-transparent border-b border-white/20 pb-3 text-white/90 placeholder-[#666677] outline-none focus:border-[#A855F7] transition-all text-sm font-normal"
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label
              className="text-[11px] font-bold tracking-widest text-white/90 uppercase flex items-center"
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            >
              EMAIL<span className="text-[#A855F7] ml-1">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="example@gmail.com"
              className="w-full bg-transparent border-b border-white/20 pb-3 text-white/90 placeholder-[#666677] outline-none focus:border-[#A855F7] transition-all text-sm font-normal"
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            />
          </div>
        </div>

        {/* Row 2: Phone Number & Telegram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label
              className="text-[11px] font-bold tracking-widest text-white/90 uppercase flex items-center"
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            >
              PHONE NUMBER<span className="text-[#A855F7] ml-1">*</span>
            </label>
            <div className="flex items-center space-x-3 border-b border-white/20 pb-3 focus-within:border-[#A855F7] transition-all">
              <span className="text-sm shrink-0">🇺🇸</span>
              <input
                type="tel"
                required
                placeholder="+1 201-555-0123"
                className="w-full bg-transparent text-white/90 placeholder-[#666677] outline-none text-sm font-normal"
                style={{ fontFamily: "var(--font-manrope), sans-serif" }}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <label
              className="text-[11px] font-bold tracking-widest text-white/90 uppercase"
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            >
              TELEGRAM
            </label>
            <input
              type="text"
              placeholder="@username"
              className="w-full bg-transparent border-b border-white/20 pb-3 text-white/90 placeholder-[#666677] outline-none focus:border-[#A855F7] transition-all text-sm font-normal"
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            />
          </div>
        </div>

        {/* Describe your idea */}
        <div className="flex flex-col space-y-2">
          <label
            className="text-[11px] font-bold tracking-widest text-white/90 uppercase flex items-center"
            style={{ fontFamily: "var(--font-manrope), sans-serif" }}
          >
            DESCRIBE YOUR IDEA<span className="text-[#A855F7] ml-1">*</span>
          </label>
          <textarea
            rows={4}
            required
            placeholder="How can we help you?"
            className="w-full bg-[#111115] border border-white/[0.08] rounded-xl p-4 text-white/90 placeholder-[#666677] outline-none focus:border-[#A855F7]/60 transition-all resize-none text-sm font-normal"
            style={{ fontFamily: "var(--font-manrope), sans-serif" }}
          />
        </div>

        {/* Budget & How Did You Hear About Us */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label
              className="text-[11px] font-bold tracking-widest text-white/90 uppercase flex items-center"
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            >
              WHAT IS YOUR BUDGET?<span className="text-[#A855F7] ml-1">*</span>
            </label>
            <div className="relative">
              <select
                className="w-full bg-[#111115] border border-white/[0.08] rounded-xl px-4 py-3.5 text-[#666677] focus:text-white outline-none focus:border-[#A855F7]/60 transition-all text-sm font-normal appearance-none cursor-pointer pr-10"
                style={{ fontFamily: "var(--font-manrope), sans-serif" }}
              >
                <option value="">Choose an option here</option>
                <option value="5k-10k">$5k - $10k</option>
                <option value="10k-25k">$10k - $25k</option>
                <option value="25k-50k">$25k - $50k</option>
                <option value="50k+">$50k+</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label
              className="text-[11px] font-bold tracking-widest text-white/90 uppercase"
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            >
              HOW DID YOU HEAR ABOUT US?
            </label>
            <div className="relative">
              <select
                className="w-full bg-[#111115] border border-white/[0.08] rounded-xl px-4 py-3.5 text-[#666677] focus:text-white outline-none focus:border-[#A855F7]/60 transition-all text-sm font-normal appearance-none cursor-pointer pr-10"
                style={{ fontFamily: "var(--font-manrope), sans-serif" }}
              >
                <option value="">Choose an option here</option>
                <option value="google">Google Search</option>
                <option value="linkedin">LinkedIn</option>
                <option value="referral">Client Referral</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* File Upload Drag & Drop Box */}
        <div className="relative border border-dashed border-white/15 hover:border-[#A855F7]/60 rounded-xl p-6 text-center bg-[#111116] transition-all cursor-pointer group">
          <input
            type="file"
            onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="flex items-center justify-start space-x-4 pl-2">
            <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/80 group-hover:text-[#A855F7] transition-colors shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p
                className="text-sm font-semibold text-white"
                style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
              >
                {fileName ? fileName : <>Drag &amp; Drop Your Files or <span className="text-[#A855F7] underline">Browse</span></>}
              </p>
              <p
                className="text-xs text-[#77778B] mt-1"
                style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
              >
                You can upload ZIP, PDF, PAGES, DOC, or DOCX up to 5 MB each.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button Pill */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full h-14 rounded-full text-white text-sm font-semibold tracking-wider uppercase hover:opacity-95 transition-all flex items-center justify-center space-x-2 group active:scale-98 shadow-[0_0_30px_rgba(47,137,255,0.4)]"
            style={{
              background: "linear-gradient(90deg, #2F89FF 0%, #B021F0 100%)",
              fontFamily: "var(--font-intel-one-mono), monospace",
            }}
          >
            <span>{submitted ? "REQUEST SENT SUCCESSFULLY!" : "SCHEDULE A FREE CONSULTATION"}</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
}
