import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SEOHead from "@/components/seo/SEOHead";
import { SITE_URL } from "@/config/seo.config";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

const MONO = { fontFamily: "var(--font-intel-one-mono), monospace" } as const;

export default function NewsletterUnsubscribePage() {
  const router = useRouter();
  const token = typeof router.query.token === "string" ? router.query.token : "";
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const unsubscribe = async () => {
    setState("loading");
    try {
      const res = await fetch(`/api/v1/newsletter/unsubscribe?token=${encodeURIComponent(token)}`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      setState(data.success ? "done" : "error");
      setMessage(data.message || data.error || "");
    } catch {
      setState("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <>
      <SEOHead title="Unsubscribe - CloudCentric Newsletter" description="Manage your CloudCentric newsletter subscription." canonical={`${SITE_URL}/newsletter/unsubscribe`} noindex />
      <main className="min-h-screen bg-[#050505] text-white flex flex-col">
        <AnnouncementBar />
        <Navbar />
        <section className="flex-1 flex items-center justify-center px-6 py-24">
          <div className="w-full max-w-lg rounded-[24px] bg-[#050711] border border-white/15 p-8 sm:p-10 space-y-6 shadow-2xl text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-white/50 font-bold block" style={MONO}>NEWSLETTER</span>
            {state === "done" ? (
              <>
                <h1 className="text-2xl sm:text-3xl font-normal font-duru">You&apos;ve been unsubscribed</h1>
                <p className="text-sm text-white/70" style={MONO}>You won&apos;t receive newsletter emails from us anymore. You can subscribe again anytime from any blog or case study page.</p>
              </>
            ) : !token ? (
              <>
                <h1 className="text-2xl sm:text-3xl font-normal font-duru">Invalid link</h1>
                <p className="text-sm text-white/70" style={MONO}>This unsubscribe link is missing its token. Please use the link from your email.</p>
              </>
            ) : (
              <>
                <h1 className="text-2xl sm:text-3xl font-normal font-duru">Unsubscribe from our newsletter?</h1>
                <p className="text-sm text-white/70" style={MONO}>Click below to stop receiving CloudCentric newsletter emails.</p>
                <button
                  type="button"
                  onClick={unsubscribe}
                  disabled={state === "loading"}
                  className="w-full py-3.5 px-5 rounded-[18px] bg-[rgba(60,70,140,0.35)] hover:bg-[rgba(60,70,140,0.45)] border border-white/25 text-white text-xs sm:text-sm font-medium tracking-[0.15em] uppercase transition-all disabled:opacity-60 cursor-pointer"
                  style={MONO}
                >
                  {state === "loading" ? "Unsubscribing..." : "Unsubscribe"}
                </button>
                {state === "error" && <p className="text-sm text-red-400" role="alert" style={MONO}>{message}</p>}
              </>
            )}
            <Link href="/blogs" className="inline-block text-xs text-white/60 hover:text-white underline" style={MONO}>
              Back to articles
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
