import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Upload } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isSpamSubmission } from "@/lib/spam-detector";
import { currentPageName, hasClientIp, saveContactSubmission } from "@/lib/contact-submission-client";
import { useContactSettings } from "@/components/common/useContactSettings";
import { PlatformIcon } from "@/components/common/SocialIcons";
import { phoneHref, phoneLabel } from "@/lib/contact-settings";

const MONO = { fontFamily: "var(--font-intel-one-mono), monospace" } as const;
const DURU = { fontFamily: "var(--font-duru-sans), sans-serif" } as const;

// Contact details come from Admin > Contact Settings (no hardcoded values)
export { FacebookIcon, LinkedinIcon, XIcon, InstagramIcon, YoutubeIcon } from "@/components/common/SocialIcons";
export const ContactInfo: React.FC = () => {
  const contact = useContactSettings();
  return (
    <div className="flex flex-col space-y-10 text-white">
      {/* Eyebrow Header */}
      <div className="flex flex-col space-y-4">
        <p
          className="text-[12px] font-medium uppercase tracking-[3px] text-[#9CA3AF]"
          style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
        >
          / GET IN TOUCH
        </p>
        <h1
          className="text-[30px] sm:text-[40px] lg:text-[50px] font-medium leading-[1.05] text-white tracking-tight"
          style={{ fontFamily: "var(--font-duru-sans), sans-serif" }}
        >
          Let&apos;s Build <br />
          Something <br />
          Intelligent Together
        </h1>
        <p
          className="text-ms leading-[1.8] text-[#B6B6C2] pt-2 max-w-[90%]"
          style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
        >
          Whether you&apos;re exploring AI, Salesforce, enterprise software, or digital transformation,
          our experts are here to help you find the right solution for your business.
        </p>
      </div>

      {/* Info Grid (Admin > Contact Settings; empty sections are hidden) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6 pt-4 min-h-40">
        {/* Call Us */}
        {contact && contact.phones.length > 0 && (
          <div className="flex flex-col space-y-3">
            <h3 className="text-[16px] font-semibold text-white tracking-wide" style={DURU}>
              Call Us
            </h3>
            <div className="flex flex-col space-y-1 text-[15px] text-[#B6B6C2]" style={MONO}>
              {contact.phones.map((p) => (
                <a key={p.id} href={phoneHref(p)} className="hover:text-white transition-colors">
                  {phoneLabel(p)}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Offices */}
        {contact && contact.offices.length > 0 && (
          <div className="flex flex-col space-y-3">
            <h3 className="text-[16px] font-semibold text-white tracking-wide" style={DURU}>
              Offices
            </h3>
            <div className="flex flex-col space-y-1 text-[15px] text-[#B6B6C2]" style={MONO}>
              {contact.offices.map((loc) => (
                <p key={loc.id} className="mb-4 whitespace-pre-line">
                  <span className="text-white font-medium">{loc.location}</span> – {loc.address}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Email */}
        {contact && contact.emails.length > 0 && (
          <div className="flex flex-col space-y-3">
            <h3 className="text-[16px] font-semibold text-white tracking-wide" style={DURU}>
              Email
            </h3>
            <div className="flex flex-col space-y-1">
              {contact.emails.map((e) => (
                <a
                  key={e.id}
                  href={`mailto:${e.email}`}
                  title={e.type}
                  className="text-[15px] text-[#B6B6C2] hover:text-white transition-colors break-all"
                  style={MONO}
                >
                  {e.email}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Social Icons */}
        {contact && contact.social.length > 0 && (
          <div className="flex flex-col space-y-3">
            <h3 className="text-[16px] font-semibold text-white tracking-wide" style={DURU}>
              Social network
            </h3>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {contact.social.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.name} (opens in a new tab)`}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-[#A855F7]/20 hover:border-[#A855F7]/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:scale-110 transition-all duration-300"
                >
                  <PlatformIcon platform={item.platform} iconUrl={item.iconUrl} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export interface UploadFieldProps {
  onFileSelect?: (file: File | null) => void;
}

export const UploadField: React.FC<UploadFieldProps> = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFileName(file.name);
      if (onFileSelect) onFileSelect(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      if (onFileSelect) onFileSelect(file);
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`relative w-full rounded-2xl border border-dashed transition-all duration-300 p-6 flex items-center space-x-4 cursor-pointer bg-white/2 backdrop-blur-md ${
        dragActive
          ? "border-[#A855F7] bg-[#A855F7]/10 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          : "border-white/15 hover:border-[#A855F7]/60 hover:bg-white/4"
      }`}
    >
      <input
        type="file"
        id="file-upload"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleChange}
        accept=".zip,.pdf,.fig,.doc,.docx"
      />
      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-white/70">
        <Upload className="w-5 h-5" />
      </div>
      <div className="flex flex-col">
        <p className="text-sm font-medium text-white/90">
          {uploadedFileName ? (
            <span className="text-[#A855F7] font-semibold">{uploadedFileName}</span>
          ) : (
            <>
              Drag &amp; Drop Your Files or{" "}
              <span className="text-[#A855F7] underline underline-offset-2">Browse</span>
            </>
          )}
        </p>
        <p
          className="text-xs text-white/50 pt-1"
          style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
        >
          You can upload ZIP, PDF, PAGES, DOC, or DOCX up to 8 MB each.
        </p>
      </div>
    </div>
  );
};

export const ContactFormCard: React.FC<{ isContactUsPage?: boolean }> = ({ isContactUsPage }) => {
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

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [selectedFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
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

  const validateField = (name: string, value: string | File | null): string | undefined => {
    switch (name) {
      case "name":
        if (typeof value === "string" && !value.trim()) return "Name is required.";
        return undefined;
      case "email":
        if (typeof value === "string") {
          if (!value.trim()) return "Please enter a valid email address.";
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "Please enter a valid email address.";
        }
        return undefined;
      case "phone":
        if (typeof value === "string") {
          const digits = value.replace(/\D/g, "");
          if (!digits || digits.length < 7) return "Please enter a valid phone number.";
        }
        return undefined;
      case "location":
        return undefined;
      case "description":
        if (typeof value === "string" && !value.trim()) return "Please describe your idea.";
        return undefined;
      case "budget":
        // if (typeof value === "string" && (!value || value === "")) return "Please select your budget.";
        return undefined;
      case "file":
        if (value && value instanceof File) {
          const ext = value.name.split(".").pop()?.toLowerCase() || "";
          if (!["zip", "pdf", "pages", "doc", "docx"].includes(ext)) return "This file type is not supported.";
          if (value.size > 5 * 1024 * 1024) return "File size must be less than 5 MB.";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || submitted) return;
    setSubmitError("");

    const newErrors: Record<string, string | undefined> = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      phone: validateField("phone", formData.phone),
      location: validateField("location", formData.location),
      description: validateField("description", formData.description),
      // budget: validateField("budget", formData.budget),
      file: validateField("file", selectedFile),
    };

    const activeErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([, v]) => v !== undefined)
    );

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
      const firstInvalidId = Object.keys(activeErrors)[0];
      const element = document.getElementById(`hero-field-${firstInvalidId}`);
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

    try {
      const lastSub = localStorage.getItem("cc_last_submission");
      if (lastSub) {
        const { email: lastEmail, time: lastTime } = JSON.parse(lastSub);
        if (lastEmail === formData.email && Date.now() - lastTime < 60000 && !isLocalhost) {
          router.push("/thank-you");
          return;
        }
      }
    } catch {}

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

    // Save the enquiry in our database first; the Pardot hand-off below is unchanged.
    const pageName = formData.pageName || currentPageName(router?.pathname);
    const saved = await saveContactSubmission({ ...formData, pageName });
    if (!saved.ok) {
      if (saved.fieldErrors) setErrors((prev) => ({ ...prev, ...saved.fieldErrors }));
      setSubmitError(saved.error);
      setSubmitting(false);
      return;
    }

    try {
      localStorage.setItem(
        "cc_last_submission",
        JSON.stringify({ email: formData.email, time: Date.now() })
      );
    } catch {}

    // Pardot requires the visitor IP; if the lookup was blocked, the enquiry is still saved in our database
    if (!hasClientIp(formData.ipAddress)) {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        router.push("/thank-you");
      }, 1500);
      return;
    }
    if (hiddenFormRef.current) {
      hiddenFormRef.current.submit();
    }

    // The enquiry is already saved, so treat a slow Pardot response as success instead of re-enabling the button.
    fallbackTimerRef.current = setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      fallbackTimerRef.current = null;
      setTimeout(() => {
        router.push("/thank-you");
      }, 1500);
    }, 5000);
  };

  return (
    <div
      className={`relative w-full rounded-3xl border border-white/8 p-6 sm:p-10 overflow-hidden ${
        isContactPage
          ? "bg-transparent shadow-none backdrop-blur-none"
          : "bg-[rgba(255,255,255,0.04)] backdrop-blur-lg shadow-[0_20px_60px_rgba(124,58,237,0.15)]"
      }`}
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col space-y-6">
        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="hero-field-name"
              className="text-[12px] font-semibold tracking-[2px] text-white/90 uppercase font-intel"
            >
              NAME <span className="text-[#A855F7]">*</span>
            </label>
            <input
              id="hero-field-name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "hero-error-name" : undefined}
              className={`w-full h-14 bg-transparent border-b text-white placeholder-[#8B8B95] outline-none transition-all text-sm font-intel ${
                errors.name ? "border-red-500 focus:border-red-500" : "border-white/12 focus:border-[#A855F7]"
              }`}
            />
            {errors.name && (
              <span id="hero-error-name" className="text-red-400 text-[11px] font-medium font-intel">
                {errors.name}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="hero-field-email"
              className="text-[12px] font-semibold tracking-[2px] text-white/90 uppercase font-intel"
            >
              EMAIL <span className="text-[#A855F7]">*</span>
            </label>
            <input
              id="hero-field-email"
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "hero-error-email" : undefined}
              className={`w-full h-14 bg-transparent border-b text-white placeholder-[#8B8B95] outline-none transition-all text-sm font-intel ${
                errors.email ? "border-red-500 focus:border-red-500" : "border-white/12 focus:border-[#A855F7]"
              }`}
            />
            {errors.email && (
              <span id="hero-error-email" className="text-red-400 text-[11px] font-medium font-intel">
                {errors.email}
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Phone & Telegram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="hero-field-phone"
              className="text-[12px] font-semibold tracking-[2px] text-white/90 uppercase font-intel"
            >
              PHONE NUMBER <span className="text-[#A855F7]">*</span>
            </label>
            <div
              className={`relative border-b transition-all custom-phone-container h-14 flex items-center ${
                errors.phone ? "border-red-500 focus-within:border-red-500" : "border-white/12 focus-within:border-[#A855F7]"
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
                  name: "phone",
                  id: "hero-field-phone",
                  "aria-invalid": !!errors.phone,
                  "aria-describedby": errors.phone ? "hero-error-phone" : undefined,
                }}
                containerClass="!bg-transparent !w-full"
                inputClass="!w-full !bg-transparent !text-white !text-sm !border-none !h-auto !py-2 !pl-14 !font-intel focus:!outline-none focus:!ring-0"
                buttonClass="!bg-transparent !border-none !p-0 !mr-2"
                dropdownClass="!bg-[#0E0E12] !text-white !border !border-white/10 !rounded-xl !shadow-2xl"
                searchClass="!bg-[#181820] !text-white !border-b !border-white/10 !p-2"
              />
            </div>
            {errors.phone && (
              <span id="hero-error-phone" className="text-red-400 text-[11px] font-medium font-intel">
                {errors.phone}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="hero-field-location"
              className="text-[12px] font-semibold tracking-[2px] text-white/90 uppercase font-intel"
            >
              LOCATION
            </label>
            <input
              id="hero-field-location"
              type="text"
              placeholder="e.g. New York, USA"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              onBlur={() => handleBlur("location")}
              aria-invalid={!!errors.location}
              aria-describedby={errors.location ? "hero-error-location" : undefined}
              className={`w-full h-14 bg-transparent border-b text-white placeholder-[#8B8B95] outline-none transition-all text-sm font-intel ${
                errors.location ? "border-red-500 focus:border-red-500" : "border-white/12 focus:border-[#A855F7]"
              }`}
            />
            {errors.location && (
              <span id="hero-error-location" className="text-red-400 text-[11px] font-medium font-intel">
                {errors.location}
              </span>
            )}
          </div>
        </div>

        {/* Row 3: Describe Your Idea */}
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="hero-field-description"
            className="text-[12px] font-semibold tracking-[2px] text-white/90 uppercase font-intel"
          >
            DESCRIBE YOUR IDEA <span className="text-[#A855F7]">*</span>
          </label>
          <textarea
            id="hero-field-description"
            rows={3}
            placeholder="How can we help you?"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            onBlur={() => handleBlur("description")}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? "hero-error-description" : undefined}
            className={`w-full min-h-32.5 bg-transparent border rounded-xl p-4 text-white placeholder-[#8B8B95] outline-none transition-all text-sm resize-none font-intel ${
              errors.description ? "border-red-500 focus:border-red-500" : "border-white/12 focus:border-[#A855F7]"
            }`}
          />
          {errors.description && (
            <span id="hero-error-description" className="text-red-400 text-[11px] font-medium font-intel">
              {errors.description}
            </span>
          )}
        </div>

        {/* Row 4: Budget & Referral */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* <div className="flex flex-col space-y-2">
            <label
              htmlFor="hero-field-budget"
              className="text-[12px] font-semibold tracking-[2px] text-white/90 uppercase font-intel"
            >
              WHAT IS YOUR BUDGET? <span className="text-[#A855F7]">*</span>
            </label>
            <select
              id="hero-field-budget"
              value={formData.budget}
              onChange={(e) => handleChange("budget", e.target.value)}
              onBlur={() => handleBlur("budget")}
              aria-invalid={!!errors.budget}
              aria-describedby={errors.budget ? "hero-error-budget" : undefined}
              className={`w-full h-[56px] bg-[#0E0E12]/90 border rounded-xl px-4 text-white/80 outline-none transition-all text-sm appearance-none cursor-pointer font-intel ${
                errors.budget ? "border-red-500 focus:border-red-500" : "border-white/12 focus:border-[#A855F7]"
              }`}
            >
              <option value="">Choose an option here</option>
              <option value="10k-25k">$10k – $25k</option>
              <option value="25k-50k">$25k – $50k</option>
              <option value="50k-100k">$50k – $100k</option>
              <option value="100k+">$100k+</option>
            </select>
            {errors.budget && (
              <span id="hero-error-budget" className="text-red-400 text-[11px] font-medium font-intel">
                {errors.budget}
              </span>
            )}
          </div> */}

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="hero-field-referralSource"
              className="text-[12px] font-semibold tracking-[2px] text-white/90 uppercase font-intel"
            >
              HOW DID YOU HEAR ABOUT US?
            </label>
            <select
              id="hero-field-referralSource"
              value={formData.referralSource}
              onChange={(e) => setFormData({ ...formData, referralSource: e.target.value })}
              className="w-full h-14 bg-[#0E0E12]/90 border border-white/12 rounded-xl px-4 text-white/80 outline-none focus:border-[#A855F7] transition-all text-sm appearance-none cursor-pointer font-intel"
            >
              <option value="">Choose an option here</option>
              <option value="google">Search Engine (Google)</option>
              <option value="linkedin">LinkedIn</option>
              <option value="referral">Client Referral</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Upload File Area */}
        {/* <UploadField
          onFileSelect={(file) => {
            setSelectedFile(file);
            setTouched((prev) => ({ ...prev, file: true }));
            const err = validateField("file", file);
            setErrors((prev) => ({ ...prev, file: err }));
          }}
        />
        {errors.file && (
          <span id="hero-error-file" className="text-red-400 text-[11px] font-medium font-intel -mt-4">
            {errors.file}
          </span>
        )} */}

        {/* Honeypot field for spam prevention */}
        <p style={{ position: "absolute", width: "190px", left: "-9999px", top: "-9999px", opacity: 0, pointerEvents: "none" }} aria-hidden="true">
          <label htmlFor="hero-field-honeypot">Comments</label>
          <input 
            type="text" 
            name="pi_extra_field" 
            id="hero-field-honeypot" 
            tabIndex={-1} 
            value={formData.honeypot} 
            onChange={(e) => setFormData(prev => ({ ...prev, honeypot: e.target.value }))} 
            autoComplete="off"
          />
        </p>

        {submitError && (
          <p role="alert" className="text-red-400 text-xs font-medium font-intel">
            {submitError}
          </p>
        )}
        {submitted && (
          <p role="status" className="text-emerald-400 text-xs font-medium font-intel">
            Thank you! Your request has been received. We will get back to you shortly.
          </p>
        )}
        {/* CTA Button */}
        <button
          type="submit"
          disabled={submitting || submitted}
          className="w-full h-14.5 rounded-full bg-linear-to-r from-[#4F7CFF] to-[#B624FF] text-white text-[13px] font-bold tracking-[2px] uppercase shadow-[0_0_30px_rgba(182,36,255,0.4)] hover:shadow-[0_0_40px_rgba(182,36,255,0.6)] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-80 disabled:cursor-not-allowed disabled:pointer-events-none"
          style={{ fontFamily: "var(--font-intel-one-mono), monospace" }}
        >
          <span>{submitted ? "REQUEST SENT SUCCESSFULLY!" : submitting ? "SUBMITTING..." : "SCHEDULE A FREE CONSULTATION"}</span>
          {submitting ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <span className="text-base">↗</span>
          )}
        </button>
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
};

export default function ContactHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full bg-[#050505] text-white py-17.5 sm:py-22.5 lg:py-30 px-5 sm:px-8 overflow-hidden z-10"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/contact/contact-hero-bg.png"
          alt="Contact Hero Background"
          fill
          className="object-cover object-center opacity-85"
          priority
        />
        <div className="absolute inset-0 bg-[#050505]/72" />
        {/* Curved Glow Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-87.5 bg-linear-to-t from-[#B624FF]/15 via-[#4F7CFF]/10 to-transparent pointer-events-none blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-17.5 items-start">
        {/* Left Column (45% on lg = 5 cols) — Comes from Left */}
        <div 
          className={`lg:col-span-5 transition-all duration-800 ease-out transform ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          <ContactInfo />
        </div>

        {/* Right Column (55% on lg = 7 cols) — Comes from Right */}
        <div 
          className={`lg:col-span-7 transition-all duration-800 ease-out transform ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
          }`}
          style={{ transitionDelay: "350ms" }}
        >
          <ContactFormCard />
        </div>
      </div>
    </section>
  );
}
