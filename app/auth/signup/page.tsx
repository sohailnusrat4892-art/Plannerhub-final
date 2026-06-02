"use client";

import { useState, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail, Lock, Eye, EyeOff, Sparkles, User,
  ArrowRight, Dumbbell, Heart, Briefcase, ScanLine,
  AlertCircle, CheckCircle2, UserPlus, ShieldCheck,
} from "lucide-react";
import { useUser } from "@/lib/userContext";

/* ── Shared feature tiles ── */
const FEATURES = [
  { icon: Dumbbell,  color: "#00d4ff", label: "Fitness & Health Planner",     desc: "AI-generated 7-day routines"    },
  { icon: Heart,     color: "#f43f5e", label: "Women's Health Tracker",        desc: "Trimester-aware prenatal plans" },
  { icon: Briefcase, color: "#a855f7", label: "Business Strategy Planner",     desc: "12-week AI roadmap generator"  },
  { icon: ScanLine,  color: "#10d981", label: "AI Food Scanner",               desc: "Instant nutrition breakdowns"   },
];

/* ── Reusable input ── */
function AuthInput({
  id, label, type, value, onChange, onBlur, error, placeholder, icon: Icon, rightSlot,
}: {
  id: string; label: string; type: string; value: string;
  onChange: (v: string) => void; onBlur?: () => void;
  error?: string; placeholder?: string;
  icon: React.ElementType; rightSlot?: React.ReactNode;
}) {
  const hasError = !!error;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      <label htmlFor={id} style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <div style={{
          position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
          color: hasError ? "var(--accent-rose)" : "var(--text-muted)", pointerEvents: "none",
          transition: "color 0.2s",
        }}>
          <Icon size={16} />
        </div>

        <input
          id={id} type={type} value={value} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          style={{
            width: "100%", padding: "0.75rem 2.75rem",
            background: hasError ? "rgba(244,63,94,0.05)" : "rgba(255,255,255,0.04)",
            border: `1.5px solid ${hasError ? "rgba(244,63,94,0.5)" : "rgba(255,255,255,0.1)"}`,
            borderRadius: 12, color: "var(--text-primary)", fontSize: "0.9rem",
            outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit",
            transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = hasError ? "rgba(244,63,94,0.7)" : "rgba(124,58,237,0.5)";
            e.currentTarget.style.boxShadow   = hasError ? "0 0 0 3px rgba(244,63,94,0.1)" : "0 0 0 3px rgba(124,58,237,0.12)";
            e.currentTarget.style.background  = hasError ? "rgba(244,63,94,0.06)" : "rgba(124,58,237,0.04)";
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.borderColor = hasError ? "rgba(244,63,94,0.5)" : "rgba(255,255,255,0.1)";
            e.currentTarget.style.boxShadow   = "none";
            e.currentTarget.style.background  = hasError ? "rgba(244,63,94,0.05)" : "rgba(255,255,255,0.04)";
          }}
        />

        {rightSlot && (
          <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
            {rightSlot}
          </div>
        )}
      </div>
      {hasError && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
          <AlertCircle size={12} color="var(--accent-rose)" />
          <span style={{ fontSize: "0.72rem", color: "var(--accent-rose)", fontWeight: 500 }}>{error}</span>
        </div>
      )}
    </div>
  );
}

/* ── Password strength ── */
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels  = ["", "Weak", "Fair", "Good", "Strong"];
  const colors  = ["", "#f43f5e", "#f59e0b", "#00d4ff", "#10d981"];
  const color   = colors[score];
  const label   = labels[score];

  return (
    <div style={{ marginTop: "-0.25rem" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: "0.25rem" }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 100,
            background: i <= score ? color : "rgba(255,255,255,0.08)",
            transition: "background 0.3s ease",
          }} />
        ))}
      </div>
      <div style={{ fontSize: "0.68rem", fontWeight: 600, color, transition: "color 0.3s" }}>
        {label} password
        {score < 3 && " — add uppercase, numbers, or symbols to strengthen"}
      </div>
    </div>
  );
}

/* ── Left branding panel ── */
function BrandPanel() {
  return (
    <div style={{
      flex: "0 0 42%", minHeight: "100vh",
      background: "linear-gradient(145deg, #070b14 0%, #0d1117 40%, #0a0f1e 100%)",
      padding: "3rem 2.5rem",
      display: "flex", flexDirection: "column", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -80, right: -60, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.13) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -80, left: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,217,129,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "2.75rem" }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--grad-violet)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(124,58,237,0.35)" }}>
            <Sparkles size={24} color="white" />
          </div>
          <div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, fontFamily: "Sora, sans-serif" }}>PlannerHub</div>
            <div style={{ fontSize: "0.7rem", color: "var(--accent-violet-light)", fontWeight: 600, letterSpacing: "0.08em" }}>AI-POWERED PLATFORM</div>
          </div>
        </div>

        <h1 style={{ fontSize: "2rem", fontWeight: 900, lineHeight: 1.2, marginBottom: "0.875rem", fontFamily: "Sora, sans-serif" }}>
          Start your journey<br />
          <span style={{ background: "var(--grad-violet)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            in 30 seconds.
          </span>
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "2.25rem" }}>
          Create a free account and unlock AI-powered planning tools that adapt to your unique health, fitness, and business goals.
        </p>

        {/* Feature tiles */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "2.25rem" }}>
          {FEATURES.map(({ icon: Icon, color, label, desc }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 0.875rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, backdropFilter: "blur(8px)" }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `${color}18`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={16} color={color} />
              </div>
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: 700 }}>{label}</div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.875rem 1rem", background: "rgba(16,217,129,0.06)", border: "1px solid rgba(16,217,129,0.15)", borderRadius: 12 }}>
          <ShieldCheck size={16} color="var(--accent-emerald)" />
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            <strong style={{ color: "var(--accent-emerald)" }}>Free forever</strong> — no credit card required. Upgrade anytime.
          </span>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   SIGNUP PAGE
════════════════════════════════════════════════ */
export default function SignupPage() {
  const { signup } = useUser();
  const router     = useRouter();
  const uid        = useId();

  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [showConf,  setShowConf]  = useState(false);
  const [agreed,    setAgreed]    = useState(false);

  const [errors,   setErrors]   = useState<Record<string, string | undefined>>({});
  const [apiError, setApiError] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);

  /* field validation rules */
  const rules: Record<string, (v: string) => string | undefined> = {
    firstName: (v) => !v.trim() ? "First name is required." : v.trim().length < 2 ? "Must be at least 2 characters." : undefined,
    lastName:  (v) => !v.trim() ? "Last name is required."  : v.trim().length < 2 ? "Must be at least 2 characters." : undefined,
    email:     (v) => !v.trim() ? "Email is required." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email." : undefined,
    password:  (v) => !v ? "Password is required." : v.length < 6 ? "Minimum 6 characters." : undefined,
    confirm:   (v) => !v ? "Please confirm your password." : v !== password ? "Passwords do not match." : undefined,
  };

  const validateField = (field: string, val: string) => rules[field]?.(val);

  const validateAll = () => {
    const vals = { firstName, lastName, email, password, confirm };
    const e: Record<string, string | undefined> = {};
    for (const [k, v] of Object.entries(vals)) e[k] = validateField(k, v);
    setErrors(e);
    return Object.values(e).every((v) => !v);
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setApiError("");
    if (!validateAll()) return;
    if (!agreed) { setApiError("You must agree to the Terms of Service to continue."); return; }

    setLoading(true);
    const res = await signup(firstName.trim(), lastName.trim(), email.trim(), password);
    setLoading(false);

    if (!res.success) {
      setApiError(res.error ?? "Sign up failed. Please try again.");
      return;
    }
    setSuccess(true);
    setTimeout(() => router.replace("/"), 700);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left branding */}
      <BrandPanel />

      {/* Right form */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "2rem 1.5rem", background: "var(--bg-surface)", overflowY: "auto",
      }}>
        <div style={{ width: "100%", maxWidth: 440 }}>

          {/* Header */}
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-violet-light)", boxShadow: "0 0 8px var(--accent-violet-light)" }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent-violet-light)" }}>
                Get Started Free
              </span>
            </div>
            <h2 style={{ fontSize: "1.875rem", fontWeight: 900, fontFamily: "Sora, sans-serif", marginBottom: "0.5rem" }}>
              Create your account
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Already have an account?{" "}
              <Link href="/auth/login" style={{ color: "var(--accent-violet-light)", fontWeight: 600, textDecoration: "none" }}>
                Sign in →
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Name row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
              <AuthInput
                id={`${uid}-fn`} label="First Name" type="text"
                value={firstName} onChange={setFirstName}
                onBlur={() => setErrors((e) => ({ ...e, firstName: validateField("firstName", firstName) }))}
                error={errors.firstName} placeholder="Muhammad" icon={User}
              />
              <AuthInput
                id={`${uid}-ln`} label="Last Name" type="text"
                value={lastName} onChange={setLastName}
                onBlur={() => setErrors((e) => ({ ...e, lastName: validateField("lastName", lastName) }))}
                error={errors.lastName} placeholder="Kabir" icon={User}
              />
            </div>

            <AuthInput
              id={`${uid}-email`} label="Email address" type="email"
              value={email} onChange={setEmail}
              onBlur={() => setErrors((e) => ({ ...e, email: validateField("email", email) }))}
              error={errors.email} placeholder="you@example.com" icon={Mail}
            />

            <div>
              <AuthInput
                id={`${uid}-pw`} label="Password" type={showPass ? "text" : "password"}
                value={password} onChange={setPassword}
                onBlur={() => setErrors((e) => ({ ...e, password: validateField("password", password) }))}
                error={errors.password} placeholder="Min. 6 characters" icon={Lock}
                rightSlot={
                  <button type="button" onClick={() => setShowPass((s) => !s)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0.25rem", display: "flex", alignItems: "center" }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              <div style={{ marginTop: "0.5rem" }}>
                <PasswordStrength password={password} />
              </div>
            </div>

            <AuthInput
              id={`${uid}-conf`} label="Confirm Password" type={showConf ? "text" : "password"}
              value={confirm} onChange={setConfirm}
              onBlur={() => setErrors((e) => ({ ...e, confirm: validateField("confirm", confirm) }))}
              error={errors.confirm} placeholder="Re-enter your password" icon={Lock}
              rightSlot={
                <button type="button" onClick={() => setShowConf((s) => !s)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0.25rem", display: "flex", alignItems: "center" }}>
                  {showConf ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {/* Terms */}
            <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
              <div
                onClick={() => setAgreed((a) => !a)}
                style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                  border: `2px solid ${agreed ? "var(--accent-violet-light)" : "rgba(255,255,255,0.2)"}`,
                  background: agreed ? "var(--accent-violet-light)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s", cursor: "pointer",
                }}
              >
                {agreed && <CheckCircle2 size={12} color="white" />}
              </div>
              <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.55, userSelect: "none" }}>
                I agree to PlannerHub&apos;s{" "}
                <span style={{ color: "var(--accent-violet-light)", cursor: "pointer" }}>Terms of Service</span>
                {" "}and{" "}
                <span style={{ color: "var(--accent-violet-light)", cursor: "pointer" }}>Privacy Policy</span>
              </span>
            </label>

            {/* API error */}
            {apiError && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", padding: "0.875rem 1rem", borderRadius: 12, background: "rgba(244,63,94,0.07)", border: "1px solid rgba(244,63,94,0.25)" }}>
                <AlertCircle size={15} color="var(--accent-rose)" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: "0.8rem", color: "var(--accent-rose)", lineHeight: 1.5 }}>{apiError}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success}
              style={{
                padding: "0.875rem 1.5rem", borderRadius: 14, border: "none",
                background: success ? "var(--grad-emerald)" : "var(--grad-violet)",
                color: "white", fontSize: "0.95rem", fontWeight: 700,
                cursor: loading || success ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.625rem",
                boxShadow: success ? "0 4px 20px rgba(16,217,129,0.35)" : "0 4px 20px rgba(124,58,237,0.3)",
                opacity: loading ? 0.85 : 1, transition: "all 0.3s ease", width: "100%",
              }}
            >
              {success ? (
                <><CheckCircle2 size={18} /> Account created! Entering dashboard…</>
              ) : loading ? (
                <><div style={{ width: 18, height: 18, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "white", animation: "spin 0.8s linear infinite" }} /> Creating your account…</>
              ) : (
                <><UserPlus size={18} /> Create Free Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
