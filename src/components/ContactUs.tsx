"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Phone, Mail, ArrowUpRight, ChevronDown } from "lucide-react";

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white pt-8 pb-16 px-4 md:px-8 lg:px-16 overflow-hidden">
      {/* Background Lighting Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-radial from-[#8B3DFF]/20 via-[#4F8BFF]/10 to-transparent blur-[140px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[700px] h-[700px] rounded-full bg-radial from-[#4F8BFF]/20 via-[#8B3DFF]/10 to-transparent blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col space-y-16">
        {/* Main Hero Header */}
        <div className="text-center space-y-2 pt-4">
          <h1
            className="text-4xl sm:text-6xl lg:text-[72px] font-black uppercase text-white leading-tight"
            style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
          >
            READY TO BUILD <br className="hidden sm:inline" />
            SOMETHING INTELLIGENT?
          </h1>
        </div>

        {/* Form and Right Hologram Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Contact Form Card - Premium Frosted Glassmorphism UI */}
          <div className="relative lg:col-span-7 rounded-[20px] bg-[rgba(14,14,20,0.72)] backdrop-blur-[40px] border border-white/[0.1] p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.65)] overflow-visible">
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

          {/* Right Information & Global Presence Card */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Hologram Card - Matching exact reference design */}
            <div className="relative rounded-[20px] bg-[#0E0E13] border border-white/[0.08] p-6 h-[420px] overflow-visible flex flex-col items-center justify-start text-center shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
              {/* Vertical light stripe column lines background */}
              <div className="absolute inset-0 rounded-[20px] overflow-hidden pointer-events-none flex justify-around opacity-30">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-full border-r border-white/[0.05] bg-gradient-to-b from-[#181824]/40 via-transparent to-[#4F8BFF]/20"
                  />
                ))}
              </div>

              {/* Floating Top Right 3D Glass Prism/Cube Image-1.png */}
              <div className="absolute -top-6 -right-6 w-32 h-32 z-30 pointer-events-none drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]">
                <Image
                  src="/images/Image-1.png"
                  alt="3D Glass Crystal"
                  width={140}
                  height={140}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Center Frosted Glass Title Badge */}
              <div className="relative z-20 mt-6 w-full max-w-[280px] rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/[0.08] px-4 py-5 shadow-lg">
                <h3
                  className="text-xl sm:text-2xl font-normal text-white tracking-wide leading-snug"
                  style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                >
                  Meet Your <br /> Technology Partner
                </h3>
                <p
                  className="text-xs text-white/70 font-normal mt-2"
                  style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                >
                  10+ Years of Experience
                </p>
              </div>

              {/* Bottom Glowing Ray Wave Effect */}
              <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#4F8BFF]/25 via-[#8B3DFF]/15 to-transparent pointer-events-none rounded-b-[20px]" />
            </div>

            {/* Our Global Presence Section */}
            <div>
              <h4
                className="text-md font-bold text-white tracking-wider mb-2"
                style={{ fontFamily: "var(--font-manrope), sans-serif" }}
              >
                Our Global Presence
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center items-end pt-2">
                {/* India */}
                <div className="flex flex-col items-start space-y-3 group">
                  <div className="h-14 flex items-end justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <Image
                      src="/images/india.png"
                      alt="India Skyline"
                      width={100}
                      height={48}
                      className="h-12 w-auto object-contain brightness-0 invert"
                    />
                  </div>
                  <span
                    className="text-sm font-semibold text-white/90 tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-manrope), sans-serif" }}
                  >
                    INDIA
                  </span>
                </div>

                {/* USA */}
                <div className="flex flex-col items-center space-y-3 group">
                  <div className="h-14 flex items-end justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <Image
                      src="/images/usa.png"
                      alt="USA Skyline"
                      width={100}
                      height={48}
                      className="h-12 w-auto object-contain brightness-0 invert"
                    />
                  </div>
                  <span
                    className="text-sm font-semibold text-white/90 tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-manrope), sans-serif" }}
                  >
                    USA
                  </span>
                </div>

                {/* UK */}
                <div className="flex flex-col items-center space-y-3 group">
                  <div className="h-14 flex items-end justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <Image
                      src="/images/uk.png"
                      alt="UK Skyline"
                      width={100}
                      height={48}
                      className="h-12 w-auto object-contain brightness-0 invert"
                    />
                  </div>
                  <span
                    className="text-sm font-semibold text-white/90 tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-manrope), sans-serif" }}
                  >
                    UK
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Strip - Matching exact reference image with clickable anchor tags */}
        <div className="w-full flex flex-wrap items-center justify-center gap-4 text-xs font-normal">
          {/* Phone section */}
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-black shadow-sm shrink-0">
              <Phone className="w-3.5 h-3.5 fill-black stroke-black" />
            </div>
            <div className="flex items-center space-x-2">
              {["+91-7042912244", "+1-3024060272", "+44 7842243933"].map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="bg-[#111116] text-sm border border-white/[0.06] text-[#A855F7] px-3 py-1.5 rounded-md hover:border-[#8B3DFF]/80 hover:text-purple-300 transition-colors"
                  style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                >
                  {phone}
                </a>
              ))}
            </div>
          </div>

          {/* Email section */}
          <div className="flex items-center space-x-2 ml-0 sm:ml-4">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-black shadow-sm shrink-0">
              <Mail className="w-3.5 h-3.5 stroke-black" />
            </div>
            <div className="flex items-center space-x-2">
              {["support@cccinfotech.com", "sales@cccinfotech.com"].map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="bg-[#111116] text-sm border border-white/[0.06] text-[#A855F7] px-3 py-1.5 rounded-md hover:border-[#8B3DFF]/80 hover:text-purple-300 transition-colors"
                  style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                >
                  {email}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Large Footer */}
        <footer className="w-full border-t border-white/[0.08] pt-12 pb-6 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-5 flex flex-col space-y-5">
              <h2 className="text-2xl sm:text-4xl md:text-[46px] font-normal text-white leading-[1.15] font-sans tracking-tight">
                Building Technology <br /> That Powers Business Growth
              </h2>
              
              {/* Outline / Stroked 10+ Years Text in white with Duru Sans font */}
              <div
                className="text-3xl sm:text-4xl font-normal text-transparent tracking-tight py-1"
                style={{
                  WebkitTextStroke: "1px #FFFFFF",
                  fontFamily: "var(--font-duru-sans), sans-serif",
                }}
              >
                10+ Years of <br /> Innovation
              </div>

              {/* Social Icons from public/social-media-icons */}
              <div className="pt-2 flex flex-col space-y-3">
                <span className="text-md font-semibold text-white/80">Follow Us</span>
                <div className="flex items-center space-x-3">
                  {[
                    { name: "Facebook", src: "/social-media-icons/facebook.svg" },
                    { name: "LinkedIn", src: "/social-media-icons/linkedin.svg" },
                    { name: "Twitter", src: "/social-media-icons/twitter.svg" },
                    { name: "Instagram", src: "/social-media-icons/instagram.svg" },
                    { name: "YouTube", src: "/social-media-icons/youtube.svg" },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href="#"
                      className="w-9 h-9 rounded-full bg-white text-black hover:bg-[#8B3DFF] hover:text-white flex items-center justify-center transition-all duration-200 shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-110"
                    >
                      <img
                        src={social.src}
                        alt={social.name}
                        className="w-100 h-auto"
                      />

                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Company Description & 4 Columns */}
            <div className="lg:col-span-7 flex flex-col space-y-8">
              <p
                className="text-sm md:text-base text-[#BDBDC8] leading-relaxed"
                style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
              >
                CloudCentric Infotech is an AI-first technology company helping businesses accelerate growth through intelligent automation, Salesforce solutions, enterprise software, cloud technologies, and innovative SaaS products. We build secure, scalable, and future-ready digital experiences for organizations worldwide.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
                {/* Company */}
                <div className="flex flex-col space-y-2.5">
                  <h5
                    className="font-bold text-white text-sm tracking-wide"
                    style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
                  >
                    Company
                  </h5>
                  {["About Us", "Our Team", "Careers", "Our Clients", "Contact Us"].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="text-[#BDBDC8] hover:text-[#8B3DFF] transition-colors text-sm"
                      style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                    >
                      {item}
                    </a>
                  ))}
                </div>

                {/* AI & Salesforce */}
                <div className="flex flex-col space-y-2.5">
                  <h5
                    className="font-bold text-white text-sm tracking-wide"
                    style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
                  >
                    AI &amp; Salesforce
                  </h5>
                  {["AI Solutions", "Salesforce & Agentforce", "Custom Development", "Cloud Solutions", "Implementation & Support"].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="text-[#BDBDC8] hover:text-[#8B3DFF] transition-colors text-sm"
                      style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                    >
                      {item}
                    </a>
                  ))}
                </div>

                {/* Products */}
                <div className="flex flex-col space-y-2.5">
                  <h5
                    className="font-bold text-white text-sm tracking-wide"
                    style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
                  >
                    Products
                  </h5>
                  {["FieldBlaze", "FlyBlaze", "Messagify", "HoopMeln", "CSIN"].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="text-[#BDBDC8] hover:text-[#8B3DFF] transition-colors text-sm"
                      style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                    >
                      {item}
                    </a>
                  ))}
                </div>

                {/* Resources */}
                <div className="flex flex-col space-y-2.5">
                  <h5
                    className="font-bold text-white text-sm tracking-wide"
                    style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
                  >
                    Resources
                  </h5>
                  {["Blog and Insights", "Case Studies", "Success Stories", "News & Insights"].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="text-[#BDBDC8] hover:text-[#8B3DFF] transition-colors text-sm"
                      style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Strip */}
          <div className="border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row items-center justify-between text-sm font-normal text-white gap-2">
            <span>© 2026 CloudCentric Infotech Pvt. Ltd. All Rights Reserved.</span>
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Services</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">Customer Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
