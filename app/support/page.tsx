"use client";

import { useState, useRef } from "react";
import {
  LifeBuoy, Mail, Copy, CheckCircle2, Send, ChevronDown,
  ChevronUp, Zap, Shield, Clock, MessageSquare, BookOpen,
  ExternalLink, AlertCircle, Sparkles, ArrowRight,
} from "lucide-react";
import { useUser } from "@/lib/userContext";

/* ═══════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════ */
const SUPPORT_EMAIL = "support@plannerhub.com";

const CATEGORIES = [
  "Select a category…",
  "🐛  Bug Report",
  "💡  Feature Request",
  "💳  Billing & Subscription",
  "🔐  Account & Login",
  "📊  Data & Privacy",
  "🤖  AI Plan Issues",
  "💬  General Question",
  "📦  Other",
];

const PRIORITIES = [
  { value: "low",    label: "Low — General inquiry",         color: "#10d981" },
  { value: "medium", label: "Medium — Needs attention soon", color: "#00d4ff" },
  { value: "high",   label: "High — Affecting my workflow",  color: "#f59e0b" },
  { value: "urgent", label: "Urgent — Completely blocked",   color: "#f43f5e" },
];

const FAQS = [
  {
    q: "How does the AI plan generation work?",
    a: "PlannerHub uses a rule-based AI simulation that maps your personal inputs — age, health conditions, fitness goals, or business profile — to a curated database of evidence-backed routines, roadmaps, and nutrition plans. Plans are generated entirely on-device with no data sent to external servers.",
  },
  {
    q: "Can I export my plans to PDF?",
    a: "Yes! Every AI-generated plan includes an Export to PDF button in the top-right corner of the results card. The PDF is rendered from the on-screen content using html2canvas + jsPDF and downloads directly to your device.",
  },
  {
    q: "How do I reset or change my password?",
    a: "Currently, PlannerHub uses a local session-based mock auth. You can create a new account from the Sign Up page at any time. Full password-reset via email will be available in the next release.",
  },
  {
    q: "Is my health and nutrition data stored?",
    a: "All plan data and session info is stored locally in your browser's localStorage — nothing is transmitted to any third-party server. Clearing your browser data will reset your session.",
  },
  {
    q: "Which file types does the AI Food Scanner accept?",
    a: "The Food Scanner accepts JPEG, PNG, WebP, HEIC, and GIF. You can drag & drop, browse files, or paste an image directly from your clipboard (Ctrl+V / ⌘+V). The AI detects meal type from the filename as part of its simulation.",
  },
  {
    q: "How do I switch between the Overview and Generator tabs?",
    a: "Each planner (Fitness, Women's Health, Business) features pill-style tabs at the top — click Overview for your dashboard and AI Plan Generator to create a new personalized plan. Your generated plan persists until you click \"New Plan\".",
  },
];

const QUICK_LINKS = [
  { icon: BookOpen,      label: "Documentation",      sub: "Guides & tutorials",    href: "#", color: "#00d4ff" },
  { icon: MessageSquare, label: "Community Forum",    sub: "Ask the community",     href: "#", color: "#a855f7" },
  { icon: Sparkles,      label: "Feature Requests",  sub: "Vote on new ideas",     href: "#", color: "#10d981" },
  { icon: Shield,        label: "Privacy Policy",     sub: "How we protect you",   href: "#", color: "#f59e0b" },
];

/* ═══════════════════════════════════════════
   COPY BUTTON
═══════════════════════════════════════════ */
function CopyEmailButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
    } catch {
      /* fallback */
      const el = document.createElement("textarea");
      el.value = SUPPORT_EMAIL;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        display: "flex", alignItems: "center", gap: "0.5rem",
        padding: "0.5rem 1rem", borderRadius: 10,
        background: copied ? "rgba(16,217,129,0.15)" : "rgba(0,212,255,0.1)",
        color:      copied ? "var(--accent-emerald)"  : "var(--accent-cyan)",
        fontSize: "0.8rem", fontWeight: 700, cursor: "pointer",
        transition: "all 0.25s ease",
        border: `1px solid ${copied ? "rgba(16,217,129,0.3)" : "rgba(0,212,255,0.25)"}` as string,
        whiteSpace: "nowrap" as const,
      }}
      onMouseEnter={(e) => { if (!copied) { e.currentTarget.style.background = "rgba(0,212,255,0.18)"; } }}
      onMouseLeave={(e) => { if (!copied) { e.currentTarget.style.background = "rgba(0,212,255,0.1)"; } }}
    >
      {copied
        ? <><CheckCircle2 size={14} /> Copied!</>
        : <><Copy size={14} /> Copy Email</>}
    </button>
  );
}

/* ═══════════════════════════════════════════
   FAQ ACCORDION
═══════════════════════════════════════════ */
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderRadius: 14, overflow: "hidden",
        border: `1px solid ${open ? "rgba(0,212,255,0.2)" : "var(--border-subtle)"}`,
        background: open ? "rgba(0,212,255,0.03)" : "rgba(255,255,255,0.02)",
        transition: "border-color 0.2s, background 0.2s",
        animationDelay: `${index * 0.05}s`,
      }}
      className="anim-fade-up"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: "1rem",
          padding: "1.125rem 1.25rem", background: "none",
          border: "none", cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.45 }}>
          {q}
        </span>
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: open ? "rgba(0,212,255,0.12)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${open ? "rgba(0,212,255,0.25)" : "var(--border-subtle)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s",
        }}>
          {open
            ? <ChevronUp  size={14} color="var(--accent-cyan)" />
            : <ChevronDown size={14} color="var(--text-muted)" />}
        </div>
      </button>

      {open && (
        <div style={{
          padding: "0 1.25rem 1.25rem",
          fontSize: "0.85rem", color: "var(--text-secondary)",
          lineHeight: 1.7, borderTop: "1px solid var(--border-subtle)",
          paddingTop: "1rem",
        }}>
          {a}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   PRIORITY SELECTOR
═══════════════════════════════════════════ */
function PrioritySelector({
  value, onChange,
}: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "0.5rem" }}>
      {PRIORITIES.map((p) => {
        const active = value === p.value;
        return (
          <button
            key={p.value}
            type="button"
            onClick={() => onChange(p.value)}
            style={{
              padding: "0.625rem 0.75rem", borderRadius: 10,
              cursor: "pointer", textAlign: "left",
              background: active ? `${p.color}14` : "rgba(255,255,255,0.02)",
              border: `1.5px solid ${active ? `${p.color}50` : "rgba(255,255,255,0.08)"}` as string,
              transition: "all 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: p.color,
                boxShadow: active ? `0 0 6px ${p.color}` : "none",
                transition: "box-shadow 0.2s",
              }} />
              <span style={{
                fontSize: "0.78rem", fontWeight: active ? 700 : 500,
                color: active ? p.color : "var(--text-muted)",
                transition: "color 0.2s",
              }}>
                {p.label.split("—")[0].trim()}
              </span>
            </div>
            {active && (
              <div style={{ fontSize: "0.65rem", color: p.color, marginTop: "0.2rem", paddingLeft: "1rem", opacity: 0.8 }}>
                {p.label.split("—")[1]?.trim()}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════ */
interface FormState {
  name: string; email: string; category: string;
  subject: string; message: string; priority: string;
}
interface FormErrors { [k: string]: string | undefined }

function inputStyle(hasError: boolean) {
  return {
    width: "100%",
    padding: "0.75rem 1rem",
    background: hasError ? "rgba(244,63,94,0.05)" : "rgba(255,255,255,0.04)",
    border: `1.5px solid ${hasError ? "rgba(244,63,94,0.4)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 12,
    color: "var(--text-primary)",
    fontSize: "0.875rem",
    outline: "none",
    boxSizing: "border-box" as const,
    fontFamily: "inherit",
    transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
  };
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.3rem" }}>
      <AlertCircle size={11} color="var(--accent-rose)" />
      <span style={{ fontSize: "0.7rem", color: "var(--accent-rose)", fontWeight: 500 }}>{msg}</span>
    </div>
  );
}

function ContactForm() {
  const { user } = useUser();

  const [form, setForm] = useState<FormState>({
    name:     `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
    email:    user?.email ?? "",
    category: CATEGORIES[0],
    subject:  "",
    message:  "",
    priority: "medium",
  });
  const [errors,    setErrors]    = useState<FormErrors>({});
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const ticketRef = useRef(`#PH-${Math.floor(Math.random() * 90000 + 10000)}`);

  const set = (k: keyof FormState) => (v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim())    e.name    = "Your name is required.";
    if (!form.email.trim())   e.email   = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (form.category === CATEGORIES[0]) e.category = "Please select a category.";
    if (!form.subject.trim()) e.subject = "A short subject helps us route your ticket faster.";
    if (form.message.trim().length < 20) e.message  = "Please describe your issue in at least 20 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1300));
    setLoading(false);
    setSubmitted(true);
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, hasError: boolean) => {
    e.currentTarget.style.borderColor = hasError ? "rgba(244,63,94,0.6)" : "rgba(0,212,255,0.45)";
    e.currentTarget.style.boxShadow   = hasError ? "0 0 0 3px rgba(244,63,94,0.09)" : "0 0 0 3px rgba(0,212,255,0.09)";
    e.currentTarget.style.background  = hasError ? "rgba(244,63,94,0.06)" : "rgba(0,212,255,0.04)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, hasError: boolean) => {
    e.currentTarget.style.borderColor = hasError ? "rgba(244,63,94,0.4)" : "rgba(255,255,255,0.1)";
    e.currentTarget.style.boxShadow   = "none";
    e.currentTarget.style.background  = hasError ? "rgba(244,63,94,0.05)" : "rgba(255,255,255,0.04)";
  };

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="anim-scale-in" style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", textAlign: "center",
        padding: "3rem 2rem", minHeight: 380,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%", marginBottom: "1.5rem",
          background: "rgba(16,217,129,0.12)", border: "2px solid rgba(16,217,129,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 30px rgba(16,217,129,0.2)",
        }}>
          <CheckCircle2 size={36} color="var(--accent-emerald)" />
        </div>

        <div style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          Ticket Submitted!
        </div>
        <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.65, maxWidth: 360 }}>
          We&apos;ve received your request and will respond to{" "}
          <strong style={{ color: "var(--text-primary)" }}>{form.email}</strong> within
          {" "}24 hours. Check your inbox for a confirmation.
        </div>

        <div style={{
          padding: "0.875rem 1.25rem", borderRadius: 14,
          background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.18)",
          display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "2rem",
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-cyan)", boxShadow: "0 0 6px var(--accent-cyan)", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--accent-cyan)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Ticket Reference
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 800, fontFamily: "Sora, monospace", color: "var(--text-primary)" }}>
              {ticketRef.current}
            </div>
          </div>
        </div>

        <button
          onClick={() => { setSubmitted(false); setForm((f) => ({ ...f, subject: "", message: "", category: CATEGORIES[0] })); }}
          className="btn btn-ghost"
          style={{ gap: "0.5rem" }}
        >
          Submit Another Request <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>

      {/* Name + Email */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
        <div>
          <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.375rem" }}>
            Your Name
          </label>
          <input
            value={form.name} onChange={(e) => set("name")(e.target.value)}
            placeholder="Muhammad Kabir"
            style={inputStyle(!!errors.name)}
            onFocus={(e) => focusStyle(e, !!errors.name)}
            onBlur={(e) => { blurStyle(e, !!errors.name); validate(); }}
          />
          <FieldError msg={errors.name} />
        </div>
        <div>
          <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.375rem" }}>
            Email Address
          </label>
          <input
            type="email" value={form.email} onChange={(e) => set("email")(e.target.value)}
            placeholder="you@example.com"
            style={inputStyle(!!errors.email)}
            onFocus={(e) => focusStyle(e, !!errors.email)}
            onBlur={(e) => { blurStyle(e, !!errors.email); validate(); }}
          />
          <FieldError msg={errors.email} />
        </div>
      </div>

      {/* Category */}
      <div>
        <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.375rem" }}>
          Category
        </label>
        <select
          value={form.category}
          onChange={(e) => set("category")(e.target.value)}
          style={{
            ...inputStyle(!!errors.category),
            cursor: "pointer",
            appearance: "none" as const,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23718096' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.875rem center",
            paddingRight: "2.5rem",
          }}
          onFocus={(e) => focusStyle(e, !!errors.category)}
          onBlur={(e) => blurStyle(e, !!errors.category)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c} disabled={c === CATEGORIES[0]} style={{ background: "#121820" }}>
              {c}
            </option>
          ))}
        </select>
        <FieldError msg={errors.category} />
      </div>

      {/* Subject */}
      <div>
        <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.375rem" }}>
          Subject
        </label>
        <input
          value={form.subject} onChange={(e) => set("subject")(e.target.value)}
          placeholder="Brief summary of your issue or question…"
          style={inputStyle(!!errors.subject)}
          onFocus={(e) => focusStyle(e, !!errors.subject)}
          onBlur={(e) => { blurStyle(e, !!errors.subject); validate(); }}
        />
        <FieldError msg={errors.subject} />
      </div>

      {/* Priority */}
      <div>
        <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "0.625rem" }}>
          Priority
        </label>
        <PrioritySelector value={form.priority} onChange={set("priority")} />
      </div>

      {/* Message */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
          <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)" }}>
            Message
          </label>
          <span style={{ fontSize: "0.7rem", color: form.message.length < 20 ? "var(--text-muted)" : "var(--accent-emerald)" }}>
            {form.message.length} / 2000
          </span>
        </div>
        <textarea
          rows={5}
          value={form.message}
          onChange={(e) => set("message")(e.target.value)}
          placeholder="Describe your issue in as much detail as possible — steps to reproduce, what you expected vs what happened, screenshots etc."
          style={{
            ...inputStyle(!!errors.message),
            resize: "vertical",
            minHeight: 120,
            lineHeight: 1.65,
          } as React.CSSProperties}
          maxLength={2000}
          onFocus={(e) => focusStyle(e, !!errors.message)}
          onBlur={(e) => { blurStyle(e, !!errors.message); validate(); }}
        />
        <FieldError msg={errors.message} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "0.9rem 1.5rem", borderRadius: 14, border: "none",
          background: "var(--grad-primary)", color: "white",
          fontSize: "0.95rem", fontWeight: 700, cursor: loading ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "0.625rem",
          boxShadow: "0 4px 20px rgba(0,212,255,0.25)",
          opacity: loading ? 0.85 : 1, transition: "all 0.25s ease",
          width: "100%",
        }}
      >
        {loading ? (
          <><div style={{ width: 18, height: 18, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "white", animation: "ph-spin 0.8s linear infinite" }} /> Sending your ticket…</>
        ) : (
          <><Send size={17} /> Submit Ticket <ArrowRight size={15} /></>
        )}
      </button>

      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", textAlign: "center", lineHeight: 1.6 }}>
        We typically respond within <strong style={{ color: "var(--text-secondary)" }}>24 hours</strong> on business days.
        Your ticket will receive an auto-confirmation to the email above.
      </p>
    </form>
  );
}

/* ═══════════════════════════════════════════
   PAGE
═══════════════════════════════════════════ */
export default function SupportPage() {
  return (
    <div>
      {/* ── Page Header ── */}
      <div className="page-header anim-fade-up">
        <div className="page-eyebrow"><LifeBuoy size={14} /> Help Center</div>
        <h1 className="page-title" style={{
          background: "var(--grad-primary)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>
          Support &amp; Help
        </h1>
        <p className="page-subtitle">
          We&apos;re here to help. Browse the FAQ, submit a support ticket, or reach us directly
          — our team responds within 24 hours on business days.
        </p>
      </div>

      {/* ── Top strip — SLA indicators ── */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "2rem",
      }} className="anim-fade-up">
        {[
          { icon: Clock,          color: "#00d4ff", label: "< 24h",        sub: "Average response"    },
          { icon: CheckCircle2,   color: "#10d981", label: "98.9%",        sub: "Satisfaction rate"   },
          { icon: Shield,         color: "#a855f7", label: "End-to-End",   sub: "Encrypted tickets"   },
          { icon: Zap,            color: "#f59e0b", label: "Live 24/7",    sub: "Status monitoring"   },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{
              flex: "1 1 140px",
              padding: "1rem 1.125rem",
              background: `${s.color}08`,
              border: `1px solid ${s.color}20`,
              borderRadius: 16, display: "flex", alignItems: "center", gap: "0.75rem",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: `${s.color}14`, border: `1px solid ${s.color}25`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={16} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: "1rem", fontWeight: 800, color: s.color, fontFamily: "Sora, sans-serif", lineHeight: 1 }}>{s.label}</div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>{s.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Main two-column layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "1.5rem", alignItems: "start" }}>

        {/* LEFT — FAQ + Quick links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* FAQ */}
          <div className="glass-card anim-fade-up" style={{ padding: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.5rem" }}>
              <BookOpen size={17} color="var(--accent-cyan)" />
              <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Frequently Asked Questions</h2>
              <span style={{
                marginLeft: "auto", fontSize: "0.65rem", fontWeight: 700,
                padding: "0.2rem 0.625rem", borderRadius: 100,
                background: "rgba(0,212,255,0.1)", color: "var(--accent-cyan)",
                border: "1px solid rgba(0,212,255,0.2)",
              }}>
                {FAQS.length} articles
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {FAQS.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} index={i} />
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="glass-card anim-fade-up" style={{ padding: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem" }}>
              <ExternalLink size={16} color="var(--accent-violet-light)" />
              <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Quick Resources</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {QUICK_LINKS.map(({ icon: Icon, label, sub, href, color }) => (
                <a
                  key={label} href={href}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    padding: "0.875rem 1rem", borderRadius: 14, textDecoration: "none",
                    background: `${color}08`, border: `1px solid ${color}1a`,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `${color}14`; e.currentTarget.style.borderColor = `${color}35`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = `${color}08`; e.currentTarget.style.borderColor = `${color}1a`; }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                    background: `${color}12`, border: `1px solid ${color}25`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={16} color={color} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>{label}</div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>{sub}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Contact card + Ticket form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* ── Contact card ── */}
          <div className="anim-fade-up" style={{
            borderRadius: 20, overflow: "hidden",
            border: "1px solid rgba(0,212,255,0.2)",
            background: "linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(124,58,237,0.06) 100%)",
          }}>
            {/* Card header */}
            <div style={{
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid rgba(0,212,255,0.1)",
              background: "rgba(0,212,255,0.04)",
              display: "flex", alignItems: "center", gap: "0.75rem",
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))",
                border: "1px solid rgba(0,212,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 16px rgba(0,212,255,0.2)",
              }}>
                <Mail size={20} color="var(--accent-cyan)" />
              </div>
              <div>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent-cyan)", marginBottom: "0.15rem" }}>
                  Official Support Channel
                </div>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  Direct Email Support
                </div>
              </div>
            </div>

            {/* Email display */}
            <div style={{ padding: "1.5rem" }}>
              <div style={{
                padding: "1.125rem 1.25rem", borderRadius: 14,
                background: "rgba(7,11,20,0.5)",
                border: "1px solid rgba(0,212,255,0.15)",
                marginBottom: "1rem",
              }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                  Support Email
                </div>
                <div style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between", flexWrap: "wrap", gap: "0.625rem",
                }}>
                  <span style={{
                    fontSize: "1.05rem", fontWeight: 800,
                    fontFamily: "Sora, monospace",
                    background: "var(--grad-primary)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    backgroundClip: "text", letterSpacing: "-0.01em",
                  }}>
                    {SUPPORT_EMAIL}
                  </span>
                  <CopyEmailButton />
                </div>
              </div>

              {/* Contact meta */}
              {[
                { icon: Clock,   label: "Response Time",  value: "Within 24 hours",       color: "#00d4ff" },
                { icon: Shield,  label: "Working Hours",  value: "Mon – Fri, 9am – 6pm",  color: "#a855f7" },
                { icon: CheckCircle2, label: "Languages", value: "English · Urdu · Arabic", color: "#10d981" },
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.label} style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    padding: "0.625rem 0",
                    borderBottom: "1px solid var(--border-subtle)",
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: `${row.color}10`, border: `1px solid ${row.color}20`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={13} color={row.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 600 }}>{row.label}</div>
                      <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)" }}>{row.value}</div>
                    </div>
                  </div>
                );
              })}

              {/* Status chip */}
              <div style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                marginTop: "1rem", padding: "0.625rem 0.875rem",
                background: "rgba(16,217,129,0.07)", border: "1px solid rgba(16,217,129,0.18)",
                borderRadius: 10,
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "var(--accent-emerald)",
                  boxShadow: "0 0 6px var(--accent-emerald)",
                  animation: "ph-pulse-glow 2s ease-in-out infinite",
                }} />
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--accent-emerald)" }}>
                  All systems operational
                </span>
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginLeft: "auto" }}>
                  <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Status page ↗</a>
                </span>
              </div>
            </div>
          </div>

          {/* ── Ticket form card ── */}
          <div className="glass-card anim-fade-up anim-delay-1" style={{ padding: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.5rem" }}>
              <MessageSquare size={17} color="var(--accent-violet-light)" />
              <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Submit a Support Ticket</h2>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>

      {/* ── Bottom security strip ── */}
      <div className="anim-fade-up" style={{
        marginTop: "1.5rem", padding: "1.125rem 1.5rem", borderRadius: 16,
        background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "0.75rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <Shield size={15} color="var(--accent-violet-light)" />
          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 500 }}>
            All support communications are encrypted and handled in strict confidence. We never share your data with third parties.
          </span>
        </div>
        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
          PlannerHub Support · v2.0
        </span>
      </div>

      <style>{`
        @keyframes ph-spin        { to { transform: rotate(360deg); } }
        @keyframes ph-pulse-glow  { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
      `}</style>
    </div>
  );
}
