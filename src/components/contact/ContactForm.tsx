"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ArrowUpRight } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isSpamSubmission } from "@/lib/spam-detector";

const ALLOWED_FILE_EXTENSIONS = ["zip", "pdf", "pages", "doc", "docx"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  description?: string;
  budget?: string;
  file?: string;
}

export default function ContactForm({ isContactUsPage }: { isContactUsPage?: boolean }) {
  const router = useRouter();
  const hiddenFormRef = useRef<HTMLFormElement>(null);
  const isContactPage = isContactUsPage ?? (router?.pathname === "/contact-us" || router?.asPath === "/contact-us");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    description: "",
    budget: "",
    referralSource: "",
    ipAddress: "",
    pageName: "",
    honeypot: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [selectedFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleIframeLoad = () => {
    if (submitting) {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
      }
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        router.push("/thank-you");
      }, 1500);
    }
  };

  useEffect(() => {
    // Fetch user IP address and dynamic page name asynchronously
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => {
        const currentPage = router?.pathname || (typeof window !== "undefined" ? window.location.pathname : "") || "unknown";
        const displayName = currentPage === "/" ? "Home Page" : currentPage;
        if (data && data.ip) {
          setFormData((prev) => ({ ...prev, ipAddress: data.ip, pageName: prev.pageName || displayName }));
        }
      })
      .catch(() => {
        const currentPage = router?.pathname || (typeof window !== "undefined" ? window.location.pathname : "") || "unknown";
        const displayName = currentPage === "/" ? "Home Page" : currentPage;
        setFormData((prev) => ({ ...prev, ipAddress: "Blocked or Unavailable", pageName: prev.pageName || displayName }));
      });

    return () => {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
      }
    };
  }, [router]);

  // Field validation helpers
  const validateField = (name: string, value: string | File | null): string | undefined => {
    switch (name) {
      case "name":
        if (typeof value === "string" && !value.trim()) {
          return "Name is required.";
        }
        return undefined;

      case "email":
        if (typeof value === "string") {
          if (!value.trim()) return "Please enter a valid email address.";
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value.trim())) return "Please enter a valid email address.";
        }
        return undefined;

      case "phone":
        if (typeof value === "string") {
          const digits = value.replace(/\D/g, "");
          if (!digits || digits.length < 7) {
            return "Please enter a valid phone number.";
          }
        }
        return undefined;

      case "location":
        return undefined;

      case "description":
        if (typeof value === "string" && !value.trim()) {
          return "Please describe your idea.";
        }
        return undefined;

      case "budget":
        // if (typeof value === "string" && (!value || value === "")) {
        //   return "Please select your budget.";
        // }
        return undefined;

      case "file":
        if (value && value instanceof File) {
          const ext = value.name.split(".").pop()?.toLowerCase() || "";
          if (!ALLOWED_FILE_EXTENSIONS.includes(ext)) {
            return "This file type is not supported.";
          }
          if (value.size > MAX_FILE_SIZE_BYTES) {
            return "File size must be less than 5 MB.";
          }
        }
        return undefined;

      default:
        return undefined;
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const val = field === "file" ? selectedFile : (formData[field as keyof typeof formData] as string);
    const err = validateField(field, val);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleChange = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (touched[field]) {
      const err = validateField(field, val);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  /*
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setTouched((prev) => ({ ...prev, file: true }));
    const err = validateField("file", file);
    setErrors((prev) => ({ ...prev, file: err }));
  };
  */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Restrict submission until IP address is successfully captured
    if (!formData.ipAddress || formData.ipAddress === "Blocked or Unavailable" || formData.ipAddress.trim() === "") {
      return;
    }

    const newErrors: FormErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      phone: validateField("phone", formData.phone),
      location: validateField("location", formData.location),
      description: validateField("description", formData.description),
      // budget: validateField("budget", formData.budget),
      file: validateField("file", selectedFile),
    };

    // Filter out undefined errors
    const activeErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([, v]) => v !== undefined)
    ) as FormErrors;

    setErrors(activeErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      location: true,
      description: true,
      budget: true,
      file: true,
    });

    if (Object.keys(activeErrors).length > 0) {
      // Focus first invalid field
      const firstInvalidId = Object.keys(activeErrors)[0];
      const element = document.getElementById(`field-${firstInvalidId}`);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const spamCheck = isSpamSubmission(formData);
    const isLocalhost = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

    if (spamCheck.isSpam) {
      if (isLocalhost) {
        console.warn("Spam detected but bypassed because on localhost:", spamCheck.reason);
      } else {
        // Spam submission: Silently drop it and show success to the spammer/bot
        setSubmitted(true);
        setTimeout(() => {
          router.push("/thank-you");
        }, 1500);
        return;
      }
    }

    // Check duplicate submission in localStorage
    try {
      const lastSub = localStorage.getItem("cc_last_submission");
      if (lastSub) {
        const { email: lastEmail, time: lastTime } = JSON.parse(lastSub);
        if (lastEmail === formData.email && Date.now() - lastTime < 60000 && !isLocalhost) {
          // Block duplicate and redirect immediately
          router.push("/thank-you");
          return;
        }
      }
    } catch {
      // Ignore localStorage errors
    }

    console.log("Submitting form data to Pardot:", {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      description: formData.description,
      budget: formData.budget,
      pageName: formData.pageName,
      ipAddress: formData.ipAddress,
      referralSource: formData.referralSource,
    });

    setSubmitting(true);

    try {
      localStorage.setItem(
        "cc_last_submission",
        JSON.stringify({ email: formData.email, time: Date.now() })
      );
    } catch {
      // Ignore localStorage
    }

    if (hiddenFormRef.current) {
      hiddenFormRef.current.submit();
    }

    // Set fallback timeout (5 seconds) to re-enable button if iframe fails to load
    fallbackTimerRef.current = setTimeout(() => {
      setSubmitting(false);
      fallbackTimerRef.current = null;
    }, 5000);
  };

  return (
    <div
      className={`relative lg:col-span-7 rounded-[20px] border border-white/10 p-6 sm:p-8 overflow-visible ${
        isContactPage
          ? "bg-transparent shadow-none backdrop-blur-none"
          : "bg-[rgba(14,14,20,0.72)] backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.65)]"
      }`}
    >
      {/* Floating Bottom Left Metallic Flower Image */}
      <div className="absolute -bottom-10 -left-10 w-44 h-44 z-0 pointer-events-none opacity-90 drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)]">
        <Image
          src="/images/image-2.png"
          alt="3D Metallic Ornament"
          width={170}
          height={170}
          className="w-full h-full object-contain"
        />
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col space-y-6 text-xs relative z-10">
        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="field-name"
              className="text-[11px] font-bold tracking-widest text-white/90 uppercase flex items-center"
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            >
              NAME<span className="text-[#A855F7] ml-1">*</span>
            </label>
            <input
              id="field-name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              required
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "error-name" : undefined}
              className={`w-full bg-transparent border-b pb-3 text-white/90 placeholder-[#666677] outline-none focus:outline-none focus:ring-0 focus-visible:outline-none transition-all text-sm font-normal ${
                errors.name ? "border-red-500 focus:border-red-500" : "border-white/20 focus:border-[#A855F7]"
              }`}
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            />
            {errors.name && (
              <span id="error-name" className="text-red-400 text-[11px] font-medium transition-all">
                {errors.name}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="field-email"
              className="text-[11px] font-bold tracking-widest text-white/90 uppercase flex items-center"
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            >
              EMAIL<span className="text-[#A855F7] ml-1">*</span>
            </label>
            <input
              id="field-email"
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              required
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "error-email" : undefined}
              className={`w-full bg-transparent border-b pb-3 text-white/90 placeholder-[#666677] outline-none focus:outline-none focus:ring-0 focus-visible:outline-none transition-all text-sm font-normal ${
                errors.email ? "border-red-500 focus:border-red-500" : "border-white/20 focus:border-[#A855F7]"
              }`}
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            />
            {errors.email && (
              <span id="error-email" className="text-red-400 text-[11px] font-medium transition-all">
                {errors.email}
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Phone Number & Telegram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="field-phone"
              className="text-[11px] font-bold tracking-widest text-white/90 uppercase flex items-center"
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            >
              PHONE NUMBER<span className="text-[#A855F7] ml-1">*</span>
            </label>
            <div
              className={`relative border-b pb-1 transition-all custom-phone-container ${
                errors.phone ? "border-red-500 focus-within:border-red-500" : "border-white/20 focus-within:border-[#A855F7]"
              }`}
            >
              <PhoneInput
                country={"us"}
                enableSearch
                searchPlaceholder="Search country..."
                value={formData.phone}
                onChange={(phoneVal) => handleChange("phone", phoneVal)}
                onBlur={() => handleBlur("phone")}
                placeholder="+1 201-555-0123"
                inputProps={{
                  id: "field-phone",
                  name: "phone",
                  "aria-invalid": !!errors.phone,
                  "aria-describedby": errors.phone ? "error-phone" : undefined,
                }}
                containerClass="!bg-transparent !w-full"
                inputClass="!w-full !bg-transparent !text-white/90 !text-sm !border-none !h-auto !py-2 !pl-14 !font-normal focus:!outline-none focus:!ring-0"
                buttonClass="!bg-transparent !border-none !p-0 !mr-2"
                dropdownClass="!bg-[#111116] !text-white !border !border-white/10 !rounded-xl !shadow-2xl"
                searchClass="!bg-[#181820] !text-white !border-b !border-white/10 !p-2"
              />
            </div>
            {errors.phone && (
              <span id="error-phone" className="text-red-400 text-[11px] font-medium transition-all">
                {errors.phone}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="field-location"
              className="text-[11px] font-bold tracking-widest text-white/90 uppercase"
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            >
              LOCATION
            </label>
            <input
              id="field-location"
              type="text"
              placeholder="e.g. New York, USA"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              onBlur={() => handleBlur("location")}
              aria-invalid={!!errors.location}
              aria-describedby={errors.location ? "error-location" : undefined}
              className={`w-full bg-transparent border-b pb-3 text-white/90 placeholder-[#666677] outline-none focus:outline-none focus:ring-0 focus-visible:outline-none transition-all text-sm font-normal ${
                errors.location ? "border-red-500 focus:border-red-500" : "border-white/20 focus:border-[#A855F7]"
              }`}
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            />
            {errors.location && (
              <span id="error-location" className="text-red-400 text-[11px] font-medium transition-all">
                {errors.location}
              </span>
            )}
          </div>
        </div>

        {/* Describe your idea */}
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="field-description"
            className="text-[11px] font-bold tracking-widest text-white/90 uppercase flex items-center"
            style={{ fontFamily: "var(--font-manrope), sans-serif" }}
          >
            DESCRIBE YOUR IDEA<span className="text-[#A855F7] ml-1">*</span>
          </label>
          <textarea
            id="field-description"
            rows={4}
            placeholder="How can we help you?"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            onBlur={() => handleBlur("description")}
            required
            aria-required="true"
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? "error-description" : undefined}
            className={`w-full bg-[#111115] border rounded-xl p-4 text-white/90 placeholder-[#666677] outline-none focus:outline-none focus:ring-0 focus-visible:outline-none transition-all resize-none text-sm font-normal ${
              errors.description ? "border-red-500 focus:border-red-500" : "border-white/8 focus:border-[#A855F7]/60"
            }`}
            style={{ fontFamily: "var(--font-manrope), sans-serif" }}
          />
          {errors.description && (
            <span id="error-description" className="text-red-400 text-[11px] font-medium transition-all">
              {errors.description}
            </span>
          )}
        </div>

        {/* Budget & How Did You Hear About Us */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* <div className="flex flex-col space-y-2">
            <label
              htmlFor="field-budget"
              className="text-[11px] font-bold tracking-widest text-white/90 uppercase flex items-center"
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            >
              WHAT IS YOUR BUDGET?<span className="text-[#A855F7] ml-1">*</span>
            </label>
            <div className="relative">
              <select
                id="field-budget"
                value={formData.budget}
                onChange={(e) => handleChange("budget", e.target.value)}
                onBlur={() => handleBlur("budget")}
                required
                aria-required="true"
                aria-invalid={!!errors.budget}
                aria-describedby={errors.budget ? "error-budget" : undefined}
                className={`w-full bg-[#111115] border rounded-xl px-4 py-3.5 text-[#666677] focus:text-white outline-none focus:outline-none focus:ring-0 focus-visible:outline-none transition-all text-sm font-normal appearance-none cursor-pointer pr-10 ${
                  errors.budget ? "border-red-500 focus:border-red-500" : "border-white/[0.08] focus:border-[#A855F7]/60"
                }`}
                style={{ fontFamily: "var(--font-manrope), sans-serif" }}
              >
                <option value="">Choose an option here</option>
                <option value="5k-10k">$5k - $10k</option>
                <option value="10k-25k">$10k - $25k</option>
                <option value="25k-50k">$25k - $50k</option>
                <option value="50k+">$50k+</option>
              </select>
            </div>
            {errors.budget && (
              <span id="error-budget" className="text-red-400 text-[11px] font-medium transition-all">
                {errors.budget}
              </span>
            )}
          </div> */}

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="field-referralSource"
              className="text-[11px] font-bold tracking-widest text-white/90 uppercase"
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            >
              HOW DID YOU HEAR ABOUT US?
            </label>
            <div className="relative">
              <select
                id="field-referralSource"
                value={formData.referralSource}
                onChange={(e) => handleChange("referralSource", e.target.value)}
                className="w-full bg-[#111115] border border-white/8 rounded-xl px-4 py-3.5 text-[#666677] focus:text-white outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus:border-[#A855F7]/60 transition-all text-sm font-normal appearance-none cursor-pointer pr-10"
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
        {/* <div className="flex flex-col space-y-2">
          <div
            className={`relative border border-dashed rounded-xl p-6 text-center bg-[#111116] transition-all cursor-pointer group ${
              errors.file ? "border-red-500" : "border-white/15 hover:border-white/30"
            }`}
          >
            <input
              id="field-file"
              type="file"
              onChange={handleFileChange}
              onBlur={() => handleBlur("file")}
              aria-invalid={!!errors.file}
              aria-describedby={errors.file ? "error-file" : undefined}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex items-center justify-start space-x-4 pl-2">
              <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/80 group-hover:text-white transition-colors shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p
                  className="text-sm font-semibold text-white"
                  style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
                >
                  {selectedFile ? selectedFile.name : <>Drag &amp; Drop Your Files or <span className="text-[#A855F7] underline">Browse</span></>}
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
          {errors.file && (
            <span id="error-file" className="text-red-400 text-[11px] font-medium transition-all">
              {errors.file}
            </span>
          )}
        </div> */}

        {/* Honeypot field for spam prevention */}
        <p style={{ position: "absolute", width: "190px", left: "-9999px", top: "-9999px", opacity: 0, pointerEvents: "none" }} aria-hidden="true">
          <label htmlFor="field-honeypot">Comments</label>
          <input 
            type="text" 
            name="pi_extra_field" 
            id="field-honeypot" 
            tabIndex={-1} 
            value={formData.honeypot} 
            onChange={(e) => setFormData(prev => ({ ...prev, honeypot: e.target.value }))} 
            autoComplete="off"
          />
        </p>

        {/* Submit Button Pill */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting || submitted}
            className="w-full h-14 rounded-full text-white text-sm font-semibold tracking-wider uppercase hover:opacity-95 transition-all flex items-center justify-center space-x-2 group active:scale-98 shadow-[0_0_30px_rgba(47,137,255,0.4)] disabled:opacity-80 disabled:cursor-not-allowed disabled:pointer-events-none"
            style={{
              background: "linear-gradient(90deg, #2F89FF 0%, #B021F0 100%)",
              fontFamily: "var(--font-intel-one-mono), monospace",
            }}
          >
            <span>{submitted ? "REQUEST SENT SUCCESSFULLY!" : submitting ? "SUBMITTING..." : "SCHEDULE A FREE CONSULTATION"}</span>
            {submitting ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            )}
          </button>
        </div>
      </form>

      {/* Hidden Pardot Submission Elements */}
      <form
        ref={hiddenFormRef}
        action="https://sales.cccinfotech.com/l/978703/2026-08-17/64gn8"
        method="POST"
        target="pardot-iframe"
        style={{ display: "none" }}
      >
        <input type="hidden" name="978703_93907pi_978703_93907" value={formData.name} />
        <input type="hidden" name="978703_93913pi_978703_93913" value={formData.email} />
        <input type="hidden" name="978703_93919pi_978703_93919" value={formData.location} />
        <input type="hidden" name="978703_93922pi_978703_93922" value={formData.description} />
        <input type="hidden" name="978703_93925pi_978703_93925" value={formData.budget} />
        <input type="hidden" name="978703_93928pi_978703_93928" value={formData.pageName} />
        <input type="hidden" name="978703_93931pi_978703_93931" value={formData.ipAddress} />
        <input type="hidden" name="978703_93934pi_978703_93934" value={formData.referralSource} />
        <input type="hidden" name="pi_extra_field" value={formData.honeypot} />
        <input type="hidden" name="978703_93916pi_978703_93916" value={formData.phone} />
        <input type="hidden" name="_utf8" value="☃" />
      </form>
      <iframe
        name="pardot-iframe"
        id="pardot-iframe"
        style={{ display: "none" }}
        onLoad={handleIframeLoad}
      />
    </div>
  );
}
