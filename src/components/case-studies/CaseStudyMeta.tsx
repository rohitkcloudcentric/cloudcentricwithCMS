"use client";

interface CaseStudyMetaProps {
  category: string;
  impact?: string;
  client?: string;
  date?: string;
}

export default function CaseStudyMeta({
  category,
  impact,
  client = "ENTERPRISE CLIENT",
  date = "AUGUST 12, 2026",
}: CaseStudyMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
      <span className="px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-[0.18em] uppercase text-white/80 border border-white/20 bg-white/[0.03] font-intel">
        {category}
      </span>
      {impact && (
        <span className="px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-[0.18em] uppercase text-[#A855F7] border border-[#7C3AED]/40 bg-[#7C3AED]/10 font-intel">
          {impact}
        </span>
      )}
      <span className="px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-[0.18em] uppercase text-white/80 border border-white/20 bg-white/[0.03] font-intel">
        {client}
      </span>
      <span className="px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-[0.18em] uppercase text-white/80 border border-white/20 bg-white/[0.03] font-intel">
        {date}
      </span>
    </div>
  );
}
