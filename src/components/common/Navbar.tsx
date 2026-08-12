"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Sparkles, LayoutGrid, BookOpen, FileText, Video, HelpCircle, Briefcase, Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
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

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    const handle = requestAnimationFrame(() => setMobileDrawerOpen(false));
    return () => cancelAnimationFrame(handle);
  }, [pathname]);

  const resourceSubMenu = [
    { name: "Our Clients", description: "Brands & enterprises who trust us", icon: Briefcase, href: "/our-clients" },
    { name: "Blog & Insights", description: "Latest AI trends & whitepapers", icon: BookOpen, href: "/blogs" },
    // { name: "Case Studies", description: "Real-world client success stories", icon: Briefcase, href: "#case-studies" },
    // { name: "Documentation", description: "Developer guides & API specs", icon: FileText, href: "#docs" },
    // { name: "Webinars & Videos", description: "Watch expert keynotes and demos", icon: Video, href: "#webinars" },
    // { name: "FAQs & Support", description: "Get answers to common questions", icon: HelpCircle, href: "#faq" },
  ];

  return (
    <>
      <header className={`w-full flex justify-center z-50 sticky top-0 transition-all duration-300 ${scrolled ? "pt-2 pb-1 bg-black/10 backdrop-blur-md" : "pt-2 pb-2 bg-transparent"}`}>
        <nav aria-label="Main Navigation" className="w-[95%] max-w-7xl h-[64px] rounded-[18px] bg-[rgba(10,10,12,0.45)] backdrop-blur-[24px] border border-white/[0.08] px-6 flex items-center justify-between shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
          {/* Left Logo */}
          <Link href="/" className="flex items-center cursor-pointer" aria-label="CloudCentric Home">
            <Image
              src="/logo.svg"
              alt="CloudCentric Logo"
              width={210}
              height={52}
              className="object-contain"
              priority
            />
          </Link>

          {/* Right Aligned Navigation Group (Links + ASK AI + Grid / Hamburger Icon) */}
          <div className="flex items-center space-x-6">
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-7">
              <Link
                href="/who-we-are"
                className={`relative text-sm transition-colors py-1 group font-duru ${
                  pathname === "/who-we-are"
                    ? "bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent font-bold"
                    : "text-white/80 hover:text-white font-medium"
                }`}
              >
                Who we are
              </Link>

              <Link
                href="/what-we-do"
                className={`relative text-sm transition-colors py-1 group font-duru ${
                  pathname === "/what-we-do"
                    ? "bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent font-bold"
                    : "text-white/80 hover:text-white font-medium"
                }`}
              >
                What we do
              </Link>

              <Link
                href="/#products"
                className={`relative text-sm transition-colors py-1 group font-duru ${
                  pathname === "/#products"
                    ? "bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent font-bold"
                    : "text-white/80 hover:text-white font-medium"
                }`}
              >
                Products
              </Link>

              {/* Resources Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setResourcesOpen(true)}
                onMouseLeave={() => setResourcesOpen(false)}
              >
                <button 
                  onClick={() => setResourcesOpen((prev) => !prev)}
                  aria-expanded={resourcesOpen}
                  aria-haspopup="true"
                  aria-label="Resources menu"
                  className={`relative flex items-center space-x-1 text-sm transition-colors py-1 group font-duru ${
                    resourcesOpen || pathname === "/resources" || pathname === "/our-clients" || pathname === "/blogs" || pathname?.startsWith("/blog")
                      ? "bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent font-bold"
                      : "text-white/80 hover:text-white font-medium"
                  }`}
                >
                  <span>Resources</span>
                  <svg
                    className={`w-2.5 h-2.5 transition-transform duration-200 ${
                      resourcesOpen || pathname === "/resources" || pathname === "/our-clients" || pathname === "/blogs" || pathname?.startsWith("/blog")
                        ? "text-[#A855F7] rotate-180"
                        : "text-white/80"
                    }`}
                    viewBox="0 0 10 10"
                    fill="none"
                    aria-hidden="true"
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
                        const isSubActive =
                          pathname === item.href ||
                          (item.href === "/blogs" && (pathname === "/blogs" || pathname?.startsWith("/blog")));
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
                className={`relative text-sm transition-colors py-1 group font-duru ${
                  pathname === "/contact-us"
                    ? "bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent font-bold"
                    : "text-white/80 hover:text-white font-medium"
                }`}
              >
                Contact Us
              </Link>
            </div>

            {/* ASK AI Button & Grid Icon (Desktop) / Hamburger Icon (Mobile) */}
            <div className="flex items-center space-x-3">
              <button 
                type="button"
                aria-label="Open AI Assistant"
                className="hidden sm:flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#4F8BFF] via-[#7C3AED] to-[#A855F7] text-white text-sm font-semibold tracking-wider hover:opacity-95 transition-all shadow-[0_0_20px_rgba(124,58,237,0.6)] active:scale-95 font-intel"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>ASK AI</span>
              </button>

              {/* Grid Icon on Desktop */}
              <button
                aria-label="Toggle navigation options"
                className="hidden md:flex w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.12] text-white/80 hover:text-white hover:bg-white/[0.08] items-center justify-center transition-all"
              >
                <LayoutGrid className="w-4.5 h-4.5" />
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileDrawerOpen(true)}
                aria-label="Open mobile menu"
                aria-expanded={mobileDrawerOpen}
                aria-controls="mobile-navigation-drawer"
                className="flex md:hidden w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.15] text-white hover:bg-white/[0.1] items-center justify-center transition-all shadow-md active:scale-95"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Mobile Right-Side Slide-Out Navigation Drawer ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          mobileDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        id="mobile-navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-[340px] bg-[#0E0E12]/95 backdrop-blur-2xl border-l border-white/[0.12] p-6 z-[101] flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.9)] transition-transform duration-300 ease-out transform ${
          mobileDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col space-y-6 overflow-y-auto">
          {/* Drawer Header with Logo & Close Button */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <Link href="/" onClick={() => setMobileDrawerOpen(false)}>
              <Image
                src="/logo.svg"
                alt="CloudCentric Logo"
                width={140}
                height={35}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <button
              onClick={() => setMobileDrawerOpen(false)}
              aria-label="Close mobile menu"
              className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 text-white/80 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links List */}
          <nav className="flex flex-col space-y-3 font-duru">
            <Link
              href="/who-we-are"
              onClick={() => setMobileDrawerOpen(false)}
              className={`text-base py-2.5 px-3 rounded-xl transition-colors ${
                pathname === "/who-we-are"
                  ? "bg-[#7C3AED]/20 text-[#A855F7] font-semibold border border-[#7C3AED]/40"
                  : "text-white/90 hover:bg-white/5"
              }`}
            >
              Who we are
            </Link>

            <Link
              href="/what-we-do"
              onClick={() => setMobileDrawerOpen(false)}
              className={`text-base py-2.5 px-3 rounded-xl transition-colors ${
                pathname === "/what-we-do"
                  ? "bg-[#7C3AED]/20 text-[#A855F7] font-semibold border border-[#7C3AED]/40"
                  : "text-white/90 hover:bg-white/5"
              }`}
            >
              What we do
            </Link>

            <Link
              href="/#products"
              onClick={() => setMobileDrawerOpen(false)}
              className={`text-base py-2.5 px-3 rounded-xl transition-colors ${
                pathname === "/#products"
                  ? "bg-[#7C3AED]/20 text-[#A855F7] font-semibold border border-[#7C3AED]/40"
                  : "text-white/90 hover:bg-white/5"
              }`}
            >
              Products
            </Link>

            {/* Mobile Resources Accordion */}
            <div className="flex flex-col">
              <button
                onClick={() => setMobileResourcesOpen((prev) => !prev)}
                className="flex items-center justify-between text-base py-2.5 px-3 rounded-xl text-white/90 hover:bg-white/5 transition-colors w-full text-left"
              >
                <span>Resources</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileResourcesOpen ? "rotate-180 text-[#A855F7]" : "text-white/50"}`} />
              </button>

              {mobileResourcesOpen && (
                <div className="pl-4 pr-1 py-2 flex flex-col space-y-2 border-l-2 border-[#7C3AED]/40 ml-3 my-1">
                  {resourceSubMenu.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className="text-xs py-1.5 px-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors flex items-center space-x-2"
                    >
                      <item.icon className="w-3.5 h-3.5 text-[#A855F7]" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/contact-us"
              onClick={() => setMobileDrawerOpen(false)}
              className={`text-base py-2.5 px-3 rounded-xl transition-colors ${
                pathname === "/contact-us"
                  ? "bg-[#7C3AED]/20 text-[#A855F7] font-semibold border border-[#7C3AED]/40"
                  : "text-white/90 hover:bg-white/5"
              }`}
            >
              Contact Us
            </Link>
          </nav>
        </div>

        {/* Drawer Footer Actions */}
        <div className="pt-6 border-t border-white/10 flex flex-col space-y-3">
          <button 
            type="button"
            aria-label="Open AI Assistant"
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-full bg-gradient-to-r from-[#4F8BFF] via-[#7C3AED] to-[#A855F7] text-white text-xs font-semibold tracking-wider shadow-[0_0_20px_rgba(124,58,237,0.5)] active:scale-95 font-intel"
          >
            <Sparkles className="w-4 h-4" />
            <span>ASK AI</span>
          </button>
        </div>
      </div>
    </>
  );
}
