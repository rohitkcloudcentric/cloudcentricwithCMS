"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer 
      className="w-full border-t border-white/[0.08] pt-12 pb-6 space-y-12 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/images/footer-bg.png')" }}
    >
      <div className="w-[95%] max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
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

            {/* Social Icons from public/social-media-icons */}
            <div className="pt-2 flex flex-col space-y-3">
              <span className="text-md font-semibold text-white/80">Follow Us</span>
              <div className="flex items-center space-x-3">
                {[
                  { name: "Facebook", src: "/social-media-icons/facebook.svg", href: "https://www.facebook.com/cloudcentricinfotech/" },
                  { name: "LinkedIn", src: "/social-media-icons/linkedin.svg", href: "https://www.linkedin.com/company/cccinfotech/" },
                  { name: "Twitter", src: "/social-media-icons/twitter.svg", href: "https://x.com/CCCInfotech" },
                  { name: "Instagram", src: "/social-media-icons/instagram.svg", href: "https://www.instagram.com/cccinfotech/" },
                  { name: "YouTube", src: "/social-media-icons/youtube.svg", href: "https://www.youtube.com/channel/UC21Gs_6xh8PF1nc8-XIyHJg" },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`CloudCentric on ${social.name}`}
                    className="w-9 h-9 rounded-full bg-white text-black hover:bg-[#8B3DFF] hover:text-white flex items-center justify-center transition-all duration-200 shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-110 cursor-pointer"
                  >
                    <img
                      src={social.src}
                      alt={`${social.name} Icon`}
                      className="w-[30px] h-auto"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Company Description & 4 Columns */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            <p
              className="text-sm md:text-base text-[#BDBDC8] leading-relaxed font-intel"
            >
              CloudCentric Infotech is an AI-first technology company helping businesses accelerate growth through intelligent automation, Salesforce solutions, enterprise software, cloud technologies, and innovative SaaS products. We build secure, scalable, and future-ready digital experiences for organizations worldwide.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
              {/* Company */}
              <div className="flex flex-col space-y-2.5">
                <h3
                  className="font-bold text-white text-sm tracking-wide font-duru"
                >
                  Company
                </h3>
                {["About Us", "Our Team", "Careers", "Our Clients", "Contact Us"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-[#BDBDC8] hover:text-[#8B3DFF] transition-colors text-sm font-intel"
                  >
                    {item}
                  </a>
                ))}
              </div>

              {/* AI & Salesforce */}
              <div className="flex flex-col space-y-2.5">
                <h3
                  className="font-bold text-white text-sm tracking-wide font-duru"
                >
                  AI &amp; Salesforce
                </h3>
                {["AI Solutions", "Salesforce & Agentforce", "Custom Development", "Cloud Solutions", "Implementation & Support"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-[#BDBDC8] hover:text-[#8B3DFF] transition-colors text-sm font-intel"
                  >
                    {item}
                  </a>
                ))}
              </div>

              {/* Products */}
              <div className="flex flex-col space-y-2.5">
                <h3
                  className="font-bold text-white text-sm tracking-wide font-duru"
                >
                  Products
                </h3>
                {["FieldBlaze", "FlyBlaze", "Messagify", "HoopMeln", "CSIN"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-[#BDBDC8] hover:text-[#8B3DFF] transition-colors text-sm font-intel"
                  >
                    {item}
                  </a>
                ))}
              </div>

              {/* Resources */}
              <div className="flex flex-col space-y-2.5">
                <h3
                  className="font-bold text-white text-sm tracking-wide font-duru"
                >
                  Resources
                </h3>
                {["Blog and Insights", "Case Studies", "Success Stories", "News & Insights"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-[#BDBDC8] hover:text-[#8B3DFF] transition-colors text-sm font-intel"
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
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Terms of Services</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Customer Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
