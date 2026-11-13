"use client";

import Link from "next/link";
import Image from "next/image";
import { useContactSettings } from "@/components/common/useContactSettings";
import { FOOTER_ICON_IMAGES, PlatformIcon } from "@/components/common/SocialIcons";
import { phoneHref, phoneLabel } from "@/lib/contact-settings";

export default function Footer() {
  // Addresses, numbers, emails and social links come from Admin > Contact Settings
  const contact = useContactSettings();
  const companyLinks = [
    { name: "About Us", href: "/who-we-are" },
    { name: "Our Team", href: "/who-we-are" },
    { name: "Careers", href: "/contact-us" },
    { name: "Our Clients", href: "/our-clients" },
    { name: "Contact Us", href: "/contact-us" },
    // { name: "Services", href: "/services" },
  ];

  const aiSalesforceLinks = [
    { name: "AI Solutions", href: "/service/ai-solutions" },
    { name: "Custom Development", href: "/service/custom-development" },
    { name: "Cloud Solutions", href: "/service/cloud-integration" },
    { name: "Growth & Digital Experience", href: "/service/growth-digital-experience" },
  ];

  const productLinks = [
    { name: "FieldBlaze", href: "https://fieldblaze.com/", external: true },
    { name: "FlyBlaze", href: "https://flyblaze.com/", external: true },
    { name: "Messagify", href: "https://messagify.net/", external: true },
    { name: "Hoopmein", href: "https://hoopmein.com/", external: true },
    { name: "C3IM", href: "https://appexchange.salesforce.com/appxListingDetail?listingId=a0N3A00000FvKpqUAF", external: true },
  ];

  const resourceLinks = [
    { name: "Blog and Insights", href: "/blogs" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Success Stories", href: "/our-clients" },
    { name: "News & Insights", href: "/blogs" },
  ];

  return (
    <footer 
      className="w-full border-t border-white/[0.08] pt-12 pb-6 space-y-12 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/images/footer-bg.png')" }}
    >
      <div className="w-[95%] max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col space-y-5">
            <h2 className="text-2xl sm:text-4xl md:text-[46px] font-normal text-white leading-[1.15] font-sans tracking-tight">
              Building Technology <br /> That Powers Business Growth
            </h2>
            
            {/* Outline / Stroked 10+ Years Text in white with Duru Sans font */}
            <div
              className="text-3xl sm:text-4xl font-normal text-transparent tracking-tight py-1 font-duru"
              style={{
                WebkitTextStroke: "1px #FFFFFF",
              }}
            >
              10+ Years of <br /> Innovation
            </div>

            {/* Social Icons (active links only; hidden when none) */}
            {contact && contact.social.length > 0 && (
              <div className="pt-2 flex flex-col space-y-3">
                <span className="text-md font-semibold text-white/80">Follow Us</span>
                <div className="flex flex-wrap items-center gap-3">
                  {contact.social.map((social) => {
                    const img = FOOTER_ICON_IMAGES[social.platform];
                    return (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`CloudCentric on ${social.name} (opens in a new tab)`}
                        className="w-9 h-9 rounded-full bg-white text-black hover:bg-[#8B3DFF] hover:text-white flex items-center justify-center transition-all duration-200 shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-110 cursor-pointer"
                      >
                        {social.iconUrl ? (
                          <PlatformIcon platform={social.platform} iconUrl={social.iconUrl} className="w-[22px] h-[22px] rounded-full" />
                        ) : img ? (
                          <Image src={img} alt="" width={30} height={30} className="w-[30px] h-auto object-contain" />
                        ) : (
                          <PlatformIcon platform={social.platform} className="w-4 h-4 text-[#7C3AED]" />
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          {/* Right Column: Company Description & 4 Columns */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            <p className="text-sm md:text-base text-[#BDBDC8] leading-relaxed font-intel">
              CloudCentric Infotech is an AI-first technology company helping businesses accelerate growth through intelligent automation, Salesforce solutions, enterprise software, cloud technologies, and innovative SaaS products. We build secure, scalable, and future-ready digital experiences for organizations worldwide.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
              {/* Company */}
              <div className="flex flex-col space-y-2.5">
                <h3 className="font-bold text-white text-sm tracking-wide font-duru">
                  Company
                </h3>
                {companyLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-[#BDBDC8] hover:text-[#8B3DFF] transition-colors text-sm font-intel"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* AI & Salesforce */}
              <div className="flex flex-col space-y-2.5">
                <h3 className="font-bold text-white text-sm tracking-wide font-duru">
                  AI &amp; Salesforce
                </h3>
                {aiSalesforceLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-[#BDBDC8] hover:text-[#8B3DFF] transition-colors text-sm font-intel"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Products */}
              <div className="flex flex-col space-y-2.5">
                <h3 className="font-bold text-white text-sm tracking-wide font-duru">
                  Products
                </h3>
                {productLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#BDBDC8] hover:text-[#8B3DFF] transition-colors text-sm font-intel"
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              {/* Resources */}
              <div className="flex flex-col space-y-2.5">
                <h3 className="font-bold text-white text-sm tracking-wide font-duru">
                  Resources
                </h3>
                {resourceLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-[#BDBDC8] hover:text-[#8B3DFF] transition-colors text-sm font-intel"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact details (Admin > Contact Settings; empty groups are hidden) */}
            {contact && (contact.phones.length > 0 || contact.emails.length > 0 || contact.offices.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                {contact.phones.length > 0 && (
                  <div className="flex flex-col space-y-2.5">
                    <h3 className="font-bold text-white text-sm tracking-wide font-duru">Call Us</h3>
                    {contact.phones.map((p) => (
                      <a key={p.id} href={phoneHref(p)} className="text-[#BDBDC8] hover:text-[#8B3DFF] transition-colors text-sm font-intel">
                        {phoneLabel(p)}
                      </a>
                    ))}
                  </div>
                )}
                {contact.emails.length > 0 && (
                  <div className="flex flex-col space-y-2.5">
                    <h3 className="font-bold text-white text-sm tracking-wide font-duru">Email</h3>
                    {contact.emails.map((e) => (
                      <a key={e.id} href={`mailto:${e.email}`} title={e.type} className="text-[#BDBDC8] hover:text-[#8B3DFF] transition-colors text-sm font-intel break-all">
                        {e.email}
                      </a>
                    ))}
                  </div>
                )}
                {contact.offices.length > 0 && (
                  <div className="flex flex-col space-y-2.5">
                    <h3 className="font-bold text-white text-sm tracking-wide font-duru">Offices</h3>
                    {contact.offices.map((o) => (
                      <p key={o.id} className="text-[#BDBDC8] text-sm font-intel leading-relaxed whitespace-pre-line">
                        <span className="text-white font-medium">{o.location}</span> – {o.address}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row items-center justify-between text-sm font-normal text-white gap-2">
          <span>© 2026 CloudCentric Infotech Pvt. Ltd. All Rights Reserved.</span>
          <div className="flex items-center space-x-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <span>|</span>
            <Link href="/contact-us" className="hover:text-white transition-colors">Customer Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
