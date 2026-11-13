import Link from "next/link";
import { useRouter } from "next/router";
import type { LucideIcon } from "lucide-react";

export interface AdminSubTab {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Sub-navigation row shown at the top of a module's admin screens. */
export default function AdminSubTabs({ tabs, label }: { tabs: AdminSubTab[]; label: string }) {
  const router = useRouter();

  return (
    <nav
      aria-label={label}
      // Horizontal swipe on narrow screens, but never a visible scrollbar (vertical overflow comes from the -mb-px tab underline)
      className="flex items-center gap-1 border-b border-white/10 font-intel overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {tabs.map((tab) => {
        const isActive = router.pathname === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center gap-2 px-4 py-2.5 -mb-px border-b-2 text-xs font-semibold whitespace-nowrap transition-colors ${
              isActive ? "border-[#a855f7] text-white" : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
