"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Upload, ArrowUpRight } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const ALLOWED_FILE_EXTENSIONS = ["zip", "pdf", "pages", "doc", "docx"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  telegram?: string;
  description?: string;
  budget?: string;
  file?: string;
}

export default function ContactForm({ isContactUsPage }: { isContactUsPage?: boolean }) {
  const router = useRouter();
  const isContactPage = isContactUsPage ?? (router?.pathname === "/contact-us" || router?.asPath === "/contact-us");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    telegram: "",
    description: "",
    budget: "",
    referralSource: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

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

      case "telegram":
        if (typeof value === "string" && value.trim()) {
          if (!/^[a-zA-Z0-9_@]+$/.test(value.trim())) {
            return "Please enter a valid Telegram username.";
          }
        }
        return undefined;

      case "description":
        if (typeof value === "string" && !value.trim()) {
          return "Please describe your idea.";
        }
        return undefined;

      case "budget":
        if (typeof value === "string" && (!value || value === "")) {
          return "Please select your budget.";
        }
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setTouched((prev) => ({ ...prev, file: true }));
    const err = validateField("file", file);
    setErrors((prev) => ({ ...prev, file: err }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      phone: validateField("phone", formData.phone),
      telegram: validateField("telegram", formData.telegram),
      description: validateField("description", formData.description),
      budget: validateField("budget", formData.budget),
      file: validateField("file", selectedFile),
    };

    // Filter out undefined errors
    const activeErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, v]) => v !== undefined)
    ) as FormErrors;

    setErrors(activeErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      telegram: true,
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

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div
      className={`relative lg:col-span-7 rounded-[20px] border border-white/[0.1] p-6 sm:p-8 overflow-visible ${
        isContactPage
          ? "bg-transparent shadow-none backdrop-blur-none"
          : "bg-[rgba(14,14,20,0.72)] backdrop-blur-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.65)]"
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
              htmlFor="field-telegram"
              className="text-[11px] font-bold tracking-widest text-white/90 uppercase"
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            >
              TELEGRAM
            </label>
            <input
              id="field-telegram"
              type="text"
              placeholder="@username"
              value={formData.telegram}
              onChange={(e) => handleChange("telegram", e.target.value)}
              onBlur={() => handleBlur("telegram")}
              aria-invalid={!!errors.telegram}
              aria-describedby={errors.telegram ? "error-telegram" : undefined}
              className={`w-full bg-transparent border-b pb-3 text-white/90 placeholder-[#666677] outline-none focus:outline-none focus:ring-0 focus-visible:outline-none transition-all text-sm font-normal ${
                errors.telegram ? "border-red-500 focus:border-red-500" : "border-white/20 focus:border-[#A855F7]"
              }`}
              style={{ fontFamily: "var(--font-manrope), sans-serif" }}
            />
            {errors.telegram && (
              <span id="error-telegram" className="text-red-400 text-[11px] font-medium transition-all">
                {errors.telegram}
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
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? "error-description" : undefined}
            className={`w-full bg-[#111115] border rounded-xl p-4 text-white/90 placeholder-[#666677] outline-none focus:outline-none focus:ring-0 focus-visible:outline-none transition-all resize-none text-sm font-normal ${
              errors.description ? "border-red-500 focus:border-red-500" : "border-white/[0.08] focus:border-[#A855F7]/60"
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
          <div className="flex flex-col space-y-2">
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
          </div>

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
                className="w-full bg-[#111115] border border-white/[0.08] rounded-xl px-4 py-3.5 text-[#666677] focus:text-white outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus:border-[#A855F7]/60 transition-all text-sm font-normal appearance-none cursor-pointer pr-10"
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
        <div className="flex flex-col space-y-2">
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
        </div>

        {/* Submit Button Pill */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full h-14 rounded-full text-white text-sm font-semibold tracking-wider uppercase hover:opacity-95 transition-all flex items-center justify-center space-x-2 group active:scale-98 shadow-[0_0_30px_rgba(47,137,255,0.4)]"
            style={{
              background: "linear-gradient(90deg, #2F89FF 0%, #B021F0 100%)",
              fontFamily: "var(--font-intel-one-mono), monospace",
            }}
          >
            <span>{submitted ? "REQUEST SENT SUCCESSFULLY!" : "SCHEDULE A FREE CONSULTATION"}</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
}
