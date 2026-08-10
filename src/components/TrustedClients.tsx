"use client";

import Image from "next/image";

export default function TrustedClients() {
  return (
    <section className="w-full bg-[#050505] py-20 px-4 md:px-8 lg:px-12 overflow-hidden text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col space-y-8">
        
        {/* Top Header: Badge & Title aligned right */}
        <div className="flex flex-col items-start text-left self-end space-y-3 pr-2 max-w-2xl">
          <div
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#8673F6]/40 bg-[#8673F6]/10 text-[#A855F7] text-xs tracking-widest uppercase font-intel"
          >
            TRUSTED &amp; RECOGNIZED
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-normal text-white leading-tight tracking-tight text-left font-duru"
          >
            Trusted by Clients. <br />
            Recognized by the Industry.
          </h2>
        </div>

        {/* Overlapping Hero Layout Grid */}
        <div className="relative pt-6 min-h-[540px]">
          
          {/* Left Office Team Photo Box */}
          <div className="w-[42%] h-[480px] rounded-[22.6px] overflow-hidden relative border border-white/10 shadow-2xl z-0">
            <Image
              src="/images/trusted-clients/trusted-clients.png"
              alt="Trusted Clients Team"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          {/* 3 Main Cards Grid Overlaying Right Corner of Office Photo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7 items-end absolute bottom-0 left-[26%] right-0 z-10">

            {/* Card 1: CSAT Card (Overlaps Office Photo) */}
            <div
              className="relative p-6 sm:p-7 flex flex-col justify-between h-[420px] w-full"
              style={{
                borderRadius: "22.637px",
                background: "radial-gradient(100.14% 100.1% at 50% 132.84%, #8673F6 0%, #7F6CED 0%, #7D2E91 37.82%, #000 100%)",
                boxShadow: "0 10.187px 45.275px 0 rgba(0, 0, 0, 0.4)",
              }}
            >
              {/* CSAT Ribbon Badge (Top-Right Edge Pin) */}
              <div className="absolute -top-5 right-4 w-12 h-16 z-30 drop-shadow-md">
                <img
                  src="/images/trusted-clients/csat.svg"
                  alt="CSAT Badge"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h3
                  className="text-2xl font-normal text-white tracking-wide mb-6 font-duru"
                >
                  CSAT
                </h3>
                <p
                  className="text-[10px] font-bold text-white/90 uppercase tracking-wide mb-3 font-intel"
                >
                  4.9★ Customer Satisfaction
                </p>
                <p
                  className="text-xs text-white/70 leading-relaxed font-normal font-intel"
                >
                  Consistently delivering quality solutions with exceptional client experiences.
                </p>
              </div>

              <div
                className="text-xs font-normal text-white/80 font-intel"
              >
                4.9/5 Customer Satisfaction
              </div>
            </div>

            {/* Card 2: Great Place to Work® Certified */}
            <div
              className="relative p-6 sm:p-7 flex flex-col justify-between h-[420px] w-full"
              style={{
                borderRadius: "22.637px",
                background: "radial-gradient(100.14% 100.1% at 50% 132.84%, #8673F6 0%, #7F6CED 0%, #3C2E91 37.82%, #000 100%)",
                boxShadow: "0 10.187px 45.275px 0 rgba(0, 0, 0, 0.2)",
              }}
            >
              {/* Badge Ribbon Top Right */}
              <div className="absolute -top-4 right-5 w-12 h-16 z-30 drop-shadow-md">
                <img
                  src="/images/trusted-clients/greate-place-to-work.svg"
                  alt="Great Place to Work Badge"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h3
                  className="text-2xl font-normal text-white tracking-wide leading-snug mb-6 pr-8 font-duru"
                >
                  Great Place to Work® Certified
                </h3>
                <p
                  className="text-xs text-white/70 leading-relaxed font-normal font-intel"
                >
                  An innovation-driven culture that empowers people to build extraordinary technology.
                </p>
              </div>

              <div
                className="text-xs font-normal text-white/80 leading-relaxed font-intel"
              >
                Certified Great Place to Work® <br />
                Innovation-Driven Culture
              </div>
            </div>

            {/* Card 3: Clutch */}
            <div
              className="relative p-6 sm:p-7 flex flex-col justify-between h-[420px] w-full"
              style={{
                borderRadius: "22.637px",
                background: "radial-gradient(100.14% 100.1% at 50% 132.84%, #8673F6 0%, #7F6CED 0%, #7D2E91 37.82%, #000 100%)",
                boxShadow: "0 10.187px 45.275px 0 rgba(0, 0, 0, 0.2)",
              }}
            >
              {/* Clutch Icon Top Right */}
              <div className="absolute -top-4 right-5 w-12 h-16 z-30 drop-shadow-md">
                <img
                  src="/images/trusted-clients/clutch.svg"
                  alt="Clutch Logo Badge"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h3
                  className="text-2xl font-normal text-white tracking-wide mb-6 font-duru"
                >
                  Clutch
                </h3>
                <p
                  className="text-xs font-bold text-white/90 uppercase tracking-wide mb-3 font-intel"
                >
                  Top Rated Technology Partner
                </p>
                <p
                  className="text-xs text-white/70 leading-relaxed font-normal font-intel"
                >
                  Recognized for delivering secure, scalable, and business-focused digital solutions.
                </p>
              </div>

              <div
                className="space-y-3 text-xs font-normal text-white/90 font-intel"
              >
                <div>
                  <p className="text-white/60 text-[11px]">Average Review Rating</p>
                  <p className="font-semibold text-white text-sm mt-0.5">4.9 (57 reviews)</p>
                </div>
                <div>
                  <p className="text-white/60 text-[11px]">Average Referral Rating</p>
                  <p className="font-bold text-white text-base mt-0.5">5.0 / 5</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
