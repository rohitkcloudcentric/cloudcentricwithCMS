"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Minus,
  Send,
  Bot,
  User,
  Headphones,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronDown,
  RefreshCw,
  Clock,
  ArrowRight,
  Maximize2,
  Mail,
  Phone,
  Building,
} from "lucide-react";

export interface ChatMessageItem {
  id: string;
  sender: "user" | "bot" | "agent" | "system";
  text: string;
  sources?: Array<{
    documentTitle: string;
    snippet: string;
    sectionTitle?: string;
  }> | null;
  isLiveAgent?: boolean;
  createdAt?: string;
}

interface ChatbotPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

const INQUIRY_PURPOSES = [
  "Custom AI Agents & Workflow Automation",
  "Salesforce & Cloud Integration",
  "Enterprise Software Development",
  "Digital Transformation & CMS",
  "Product Pricing & Retainer Consultation",
  "Customer Support & SLAs",
  "Other Inquiry",
];

const QUICK_PROMPTS = [
  "What AI agents do you build?",
  "Tell me about Salesforce integration",
  "What are your engagement models & pricing?",
  "Where are your global headquarters?",
];

export default function ChatbotPanel({ isOpen, onClose, initialMessage = "" }: ChatbotPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  // Flow step: "form" | "chat"
  const [step, setStep] = useState<"form" | "chat">("form");

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [purpose, setPurpose] = useState(INQUIRY_PURPOSES[0]);
  const [companyName, setCompanyName] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Chat states
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string>("");
  const [mode, setMode] = useState<"ai" | "live_agent">("ai");
  const [agentName, setAgentName] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, step]);

  // Restore existing session from storage if present
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedSessionId = sessionStorage.getItem("cc_chat_session_id");
    const savedCustomerName = sessionStorage.getItem("cc_chat_customer_name");

    if (savedSessionId) {
      setSessionId(savedSessionId);
      if (savedCustomerName) setCustomerName(savedCustomerName);

      // Fetch existing session messages
      fetch(`/api/v1/chat/messages?sessionId=${savedSessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.messages) {
            setMessages(data.messages);
            if (data.session) {
              setMode(data.session.mode || "ai");
              setAgentName(data.session.agentName || null);
            }
            setStep("chat");
          }
        })
        .catch(() => {});
    }
  }, []);

  // Poll for live agent messages when in live agent mode
  useEffect(() => {
    if (!sessionId || mode !== "live_agent" || !isOpen) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/v1/chat/messages?sessionId=${sessionId}`);
        const data = await res.json();
        if (data.success && data.messages) {
          setMessages((prev) => {
            if (data.messages.length !== prev.length) {
              return data.messages;
            }
            return prev;
          });
          if (data.session) {
            setAgentName(data.session.agentName || null);
          }
        }
      } catch {
        // Polling failure non-fatal
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [sessionId, mode, isOpen]);

  // Form Submit Handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!fullName.trim() || fullName.trim().length < 2) {
      setFormError("Please enter your full name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }

    const cleanPhone = contactNumber.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 7) {
      setFormError("Please enter a valid contact number (at least 7 digits).");
      return;
    }

    if (!purpose.trim()) {
      setFormError("Please select the purpose of your chat.");
      return;
    }

    setIsSubmittingForm(true);

    try {
      const res = await fetch("/api/v1/chat/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          contactNumber: contactNumber.trim(),
          purpose: purpose.trim(),
          companyName: companyName.trim() || undefined,
          additionalInfo: additionalInfo.trim() || undefined,
          initialMessage: initialMessage.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSessionId(data.sessionId);
        setCustomerName(data.customer?.fullName || fullName);
        setMessages(data.messages || []);
        setStep("chat");

        if (typeof window !== "undefined") {
          sessionStorage.setItem("cc_chat_session_id", data.sessionId);
          sessionStorage.setItem("cc_chat_customer_name", data.customer?.fullName || fullName);
        }
      } else {
        setFormError(data.error || "Unable to start chat. Please verify your information.");
      }
    } catch {
      setFormError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Send Message Handler
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !sessionId) return;

    setInputText("");

    // Optimistically add user message
    const tempUserMsg: ChatMessageItem = {
      id: `temp-${Date.now()}`,
      sender: "user",
      text,
      createdAt: new Date().toISOString(),
      isLiveAgent: mode === "live_agent",
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/v1/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: text,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.botMessage) {
          setMessages((prev) => [...prev.filter((m) => m.id !== tempUserMsg.id), data.userMessage, data.botMessage]);
        } else if (data.userMessage) {
          setMessages((prev) => [...prev.filter((m) => m.id !== tempUserMsg.id), data.userMessage]);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: "system",
            text: data.error || "Failed to deliver message. Please retry.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "system",
          text: "Network issue sending message. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
      chatInputRef.current?.focus();
    }
  };

  // Transfer to Live Agent Handler
  const handleTransferToLiveAgent = async () => {
    if (!sessionId || isTransferring) return;

    setIsTransferring(true);

    try {
      const res = await fetch("/api/v1/chat/transfer-live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMode("live_agent");
        setAgentName(data.agent?.name || "Live Specialist");

        // Refresh messages list to get system and agent intro messages
        const msgRes = await fetch(`/api/v1/chat/messages?sessionId=${sessionId}`);
        const msgData = await msgRes.json();
        if (msgData.success && msgData.messages) {
          setMessages(msgData.messages);
        }
      }
    } catch (e) {
      console.error("Live agent transfer failed:", e);
    } finally {
      setIsTransferring(false);
    }
  };

  // Reset / Start New Chat
  const handleResetChat = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("cc_chat_session_id");
      sessionStorage.removeItem("cc_chat_customer_name");
    }
    setSessionId(null);
    setMessages([]);
    setStep("form");
    setMode("ai");
    setAgentName(null);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed right-3 md:right-6 bottom-3 md:bottom-6 z-[99999] w-[95vw] sm:w-[440px] transition-all duration-300 ease-out flex flex-col font-sans ${
        isMinimized ? "h-[62px]" : "h-[680px] max-h-[92vh]"
      } bg-[#0A0A0E]/95 backdrop-blur-[24px] border border-white/[0.15] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(124,58,237,0.35)] overflow-hidden text-white`}
      role="dialog"
      aria-label="CloudCentric AI & Live Agent Assistant"
    >
      {/* Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-[#14141E] via-[#0E0E18] to-[#14141E] border-b border-white/[0.08] flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#7C3AED] via-[#6366F1] to-[#3B82F6] flex items-center justify-center text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]">
              {mode === "live_agent" ? <Headphones className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0A0A0E] ${
                mode === "live_agent" ? "bg-emerald-400 animate-pulse" : "bg-[#7C3AED]"
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight text-white font-manrope">
                {mode === "live_agent" ? agentName || "Live Specialist" : "CloudCentric AI"}
              </h3>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                  mode === "live_agent"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/30"
                }`}
              >
                {mode === "live_agent" ? "Live Human" : "AI Agent"}
              </span>
            </div>
            <p className="text-[11px] text-[#A1A1AA] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Grounded in Company Documentation</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5">
          {step === "chat" && mode === "ai" && (
            <button
              onClick={handleTransferToLiveAgent}
              disabled={isTransferring}
              title="Switch to a Live Human Agent"
              className="px-2.5 py-1 text-[11px] rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all flex items-center gap-1 font-medium cursor-pointer"
            >
              <Headphones className="w-3 h-3" />
              <span>{isTransferring ? "Connecting..." : "Live Agent"}</span>
            </button>
          )}

          <button
            onClick={() => setIsMinimized((prev) => !prev)}
            aria-label={isMinimized ? "Maximize Chat" : "Minimize Chat"}
            className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[#A1A1AA] hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClose}
            aria-label="Close Chat"
            className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-red-500/20 text-[#A1A1AA] hover:text-red-400 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* STEP 1: Customer Information Form */}
          {step === "form" && (
            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5 custom-scrollbar">
              {/* If user triggered via AIChatBar with an initial message */}
              {initialMessage && (
                <div className="p-3.5 rounded-2xl bg-[#14141E] border border-white/[0.08] space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-[#A78BFA] tracking-wider flex items-center gap-1 font-intel">
                    <Sparkles className="w-3 h-3" /> Your Initial Inquiry
                  </span>
                  <p className="text-xs text-white/90 italic font-medium">&ldquo;{initialMessage}&rdquo;</p>
                </div>
              )}

              <div className="space-y-1">
                <h4 className="text-base font-bold text-white font-manrope">Welcome to CloudCentric</h4>
                <p className="text-xs text-[#A1A1AA] font-intel leading-relaxed">
                  Please share a few details so our AI documentation assistant and live specialists can tailor exact solutions for you.
                </p>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#C6C6D1] uppercase tracking-wider font-intel">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#14141E] border border-white/[0.1] rounded-xl text-white placeholder-[#71717A] focus:outline-none focus:border-[#7C3AED] transition-all"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#C6C6D1] uppercase tracking-wider font-intel">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#14141E] border border-white/[0.1] rounded-xl text-white placeholder-[#71717A] focus:outline-none focus:border-[#7C3AED] transition-all"
                    />
                  </div>
                </div>

                {/* Contact Phone */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#C6C6D1] uppercase tracking-wider font-intel">
                    Contact Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#14141E] border border-white/[0.1] rounded-xl text-white placeholder-[#71717A] focus:outline-none focus:border-[#7C3AED] transition-all"
                    />
                  </div>
                </div>

                {/* Purpose of Chat */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#C6C6D1] uppercase tracking-wider font-intel">
                    Purpose of Chat / Inquiry <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#14141E] border border-white/[0.1] rounded-xl text-white appearance-none focus:outline-none focus:border-[#7C3AED] transition-all cursor-pointer"
                    >
                      {INQUIRY_PURPOSES.map((item) => (
                        <option key={item} value={item} className="bg-[#14141E] text-white">
                          {item}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#71717A] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Company Name (Optional) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider font-intel">
                    Company Name <span className="text-white/40">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Acme Enterprises"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#14141E] border border-white/[0.1] rounded-xl text-white placeholder-[#71717A] focus:outline-none focus:border-[#7C3AED] transition-all"
                    />
                  </div>
                </div>

                {/* Additional Information (Optional) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider font-intel">
                    Additional Context <span className="text-white/40">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Briefly describe what your team is looking to achieve..."
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#14141E] border border-white/[0.1] rounded-xl text-white placeholder-[#71717A] focus:outline-none focus:border-[#7C3AED] transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingForm}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#6366F1] to-[#3B82F6] hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(124,58,237,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingForm ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying & Opening Chat...</span>
                    </>
                  ) : (
                    <>
                      <span>Start Conversation</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: Live Chatbot / Live Agent Stream */}
          {step === "chat" && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg, idx) => {
                  const isUser = msg.sender === "user";
                  const isSystem = msg.sender === "system";
                  const isAgent = msg.sender === "agent";

                  if (isSystem) {
                    return (
                      <div key={msg.id || idx} className="flex justify-center my-2">
                        <div className="px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] text-[#A1A1AA] flex items-center gap-1.5 max-w-[90%] text-center">
                          <Clock className="w-3 h-3 text-[#A78BFA] shrink-0" />
                          <span>{msg.text}</span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id || idx}
                      className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1`}
                    >
                      <div className="flex items-end gap-2 max-w-[88%]">
                        {!isUser && (
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 mb-1 ${
                              isAgent
                                ? "bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                : "bg-gradient-to-tr from-[#7C3AED] to-[#3B82F6] shadow-[0_0_10px_rgba(124,58,237,0.5)]"
                            }`}
                          >
                            {isAgent ? <Headphones className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                          </div>
                        )}

                        <div
                          className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 ${
                            isUser
                              ? "bg-gradient-to-r from-[#7C3AED] to-[#6366F1] text-white rounded-br-none shadow-[0_4px_15px_rgba(124,58,237,0.3)]"
                              : isAgent
                              ? "bg-[#10241B] border border-emerald-500/30 text-emerald-100 rounded-bl-none shadow-[0_4px_15px_rgba(16,185,129,0.15)]"
                              : "bg-[#14141E] border border-white/[0.1] text-white/95 rounded-bl-none shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                          }`}
                        >
                          <div className="whitespace-pre-line font-medium leading-relaxed font-sans">
                            {msg.text}
                          </div>

                          {/* Sources citation footer for AI responses */}
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="pt-2 mt-2 border-t border-white/[0.08] space-y-1">
                              <span className="text-[10px] font-semibold text-[#A78BFA] uppercase tracking-wider flex items-center gap-1 font-intel">
                                <FileText className="w-3 h-3" /> Grounded In Company Documentation:
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {msg.sources.map((src, sIdx) => (
                                  <span
                                    key={sIdx}
                                    title={src.snippet}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-[10px] text-[#C6C6D1] font-mono hover:bg-white/[0.1] transition-colors"
                                  >
                                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                                    {src.documentTitle}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Timestamp & Sender */}
                      <span className="text-[9px] text-[#71717A] px-2 font-mono">
                        {isUser ? "You" : isAgent ? agentName || "Live Specialist" : "CloudCentric AI"}
                      </span>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#3B82F6] flex items-center justify-center text-white shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="px-4 py-2.5 rounded-2xl rounded-bl-none bg-[#14141E] border border-white/10 flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick suggestions pills (when in AI mode) */}
              {mode === "ai" && messages.length <= 4 && (
                <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-white/[0.05]">
                  {QUICK_PROMPTS.map((prompt, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => handleSendMessage(prompt)}
                      className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[10px] text-[#C6C6D1] whitespace-nowrap transition-colors cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="p-3 bg-[#0E0E18] border-t border-white/[0.08] flex items-center gap-2">
                <input
                  ref={chatInputRef}
                  type="text"
                  placeholder={
                    mode === "live_agent"
                      ? `Message ${agentName || "live specialist"}...`
                      : "Ask about AI agents, Salesforce, cloud services..."
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1 bg-[#14141E] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-[#7C3AED] transition-all font-sans"
                />

                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim()}
                  aria-label="Send message"
                  className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#6366F1] flex items-center justify-center text-white shrink-0 hover:scale-105 active:scale-95 transition-transform disabled:opacity-30 disabled:scale-100 cursor-pointer shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Footer status & reset session */}
              <div className="px-4 py-1.5 bg-[#0A0A0E] border-t border-white/[0.04] flex items-center justify-between text-[10px] text-[#71717A]">
                <span>Logged as {customerName || "Visitor"}</span>
                <button
                  onClick={handleResetChat}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Start New Session
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
