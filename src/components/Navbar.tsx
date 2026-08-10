"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Sparkles, LayoutGrid, BookOpen, FileText, Video, HelpCircle, Briefcase } from "lucide-react";

export default function Navbar() {
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const resourceSubMenu = [
    { name: "Our Clients", description: "Brands & enterprises who trust us", icon: Briefcase, href: "/our-clients" },
    { name: "Blog & Insights", description: "Latest AI trends & whitepapers", icon: BookOpen, href: "#blog" },
    { name: "Case Studies", description: "Real-world client success stories", icon: Briefcase, href: "#case-studies" },
    { name: "Documentation", description: "Developer guides & API specs", icon: FileText, href: "#docs" },
    { name: "Webinars & Videos", description: "Watch expert keynotes and demos", icon: Video, href: "#webinars" },
    { name: "FAQs & Support", description: "Get answers to common questions", icon: HelpCircle, href: "#faq" },
  ];

  return (
    <div className={`w-full flex justify-center z-50 sticky top-0 transition-all duration-300 ${scrolled ? "pt-2 pb-1 bg-black/10 backdrop-blur-md" : "pt-2 pb-2 bg-transparent"}`}>
      <nav className="w-[95%] max-w-7xl h-[64px] rounded-[18px] bg-[rgba(10,10,12,0.45)] backdrop-blur-[24px] border border-white/[0.08] px-6 flex items-center justify-between shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
        {/* Left Logo */}
        <Link href="/" className="flex items-center cursor-pointer">
          <Image
            src="/logo.svg"
            alt="CloudCentric Logo"
            width={170}
            height={42}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        {/* Right Aligned Navigation Group (Links + ASK AI + Grid Icon) */}
        <div className="flex items-center space-x-6">
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-7">
            <Link
              href="/who-we-are"
              className={`relative text-sm transition-colors py-1 group ${
                pathname === "/who-we-are"
                  ? "bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent font-bold"
                  : "text-white/80 hover:text-white font-medium"
              }`}
              style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
            >
              Who we are
            </Link>

            <Link
              href="/what-we-do"
              className={`relative text-sm transition-colors py-1 group ${
                pathname === "/what-we-do"
                  ? "bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent font-bold"
                  : "text-white/80 hover:text-white font-medium"
              }`}
              style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
            >
              What we do
            </Link>

            <Link
              href="/#products"
              className={`relative text-sm transition-colors py-1 group ${
                pathname === "/#products"
                  ? "bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent font-bold"
                  : "text-white/80 hover:text-white font-medium"
              }`}
              style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
            >
              Products
            </Link>

            {/* Resources with exact reference corner drop indicator */}
            <div
              className="relative"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <button 
                onClick={() => setResourcesOpen((prev) => !prev)}
                className={`relative flex items-center space-x-1 text-sm transition-colors py-1 group ${
                  resourcesOpen || pathname === "/resources" || pathname === "/our-clients"
                    ? "bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent font-bold"
                    : "text-white/80 hover:text-white font-medium"
                }`}
                style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
              >
                <span>Resources</span>
                {/* Micro corner wedge stroke matching reference screenshot */}
                <svg
                  className={`w-2.5 h-2.5 transition-transform duration-200 ${
                    resourcesOpen || pathname === "/resources" || pathname === "/our-clients"
                      ? "text-[#A855F7] rotate-180"
                      : "text-white/80"
                  }`}
                  viewBox="0 0 10 10"
                  fill="none"
                >
                  <path
                    d="M3 4L5 6L7 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Sub Menu Dropdown Card */}
              {resourcesOpen && (
                <div className="absolute top-full right-0 pt-2 w-72 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="rounded-2xl bg-[rgba(18,18,24,0.95)] backdrop-blur-[24px] border border-white/[0.12] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(124,58,237,0.2)]">
                    {resourceSubMenu.map((item) => {
                      const IconComp = item.icon;
                      const isSubActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setResourcesOpen(false)}
                          className={`flex items-start space-x-3 p-2.5 rounded-xl transition-all duration-150 group ${
                            isSubActive ? "bg-white/[0.08]" : "hover:bg-white/[0.08]"
                          }`}
                        >
                          <div className={`p-2 rounded-lg transition-colors shrink-0 mt-0.5 ${
                            isSubActive
                              ? "bg-[#7C3AED] text-white"
                              : "bg-[#7C3AED]/10 text-[#A855F7] group-hover:bg-[#7C3AED] group-hover:text-white"
                          }`}>
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-xs font-semibold transition-colors ${
                              isSubActive
                                ? "bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent font-bold"
                                : "text-white group-hover:text-[#4F8BFF]"
                            }`}>
                              {item.name}
                            </span>
                            <span className="text-[10px] text-white/50 leading-tight mt-0.5">
                              {item.description}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/contact-us"
              className={`relative text-sm transition-colors py-1 group ${
                pathname === "/contact-us"
                  ? "bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent font-bold"
                  : "text-white/80 hover:text-white font-medium"
              }`}
              style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
            >
              Contact Us
            </Link>
          </div>

          {/* ASK AI Button & Grid Icon */}
          <div className="flex items-center space-x-3">
            <button 
              className="flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#4F8BFF] via-[#7C3AED] to-[#A855F7] text-white text-sm font-semibold tracking-wider hover:opacity-95 transition-all shadow-[0_0_20px_rgba(124,58,237,0.6)] active:scale-95"
              style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ASK AI</span>
            </button>

            <button
              aria-label="Menu"
              className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.12] text-white/80 hover:text-white hover:bg-white/[0.08] flex items-center justify-center transition-all"
            >
              <LayoutGrid className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
