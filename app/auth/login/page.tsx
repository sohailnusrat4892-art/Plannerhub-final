"use client";

import { useState, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail, Lock, Eye, EyeOff, Zap,
  ArrowRight, Dumbbell, Heart, Briefcase, ScanLine,
  AlertCircle, CheckCircle2, LogIn,
} from "lucide-react";
import { useUser } from "@/lib/userContext";
import PlannerHubLogo from "@/components/PlannerHubLogo";

/* ── Feature tiles for left panel ── */
const FEATURES = [
  { icon: Dumbbell,  color: "#00d4ff", label: "Fitness & Health Planner",     desc: "AI-generated 7-day routines"     },
  { icon: Heart,     color: "#f43f5e", label: "Women's Health Tracker",        desc: "Trimester-aware prenatal plans"  },
  { icon: Briefcase, color: "#a855f7", label: "Business Strategy Planner",     desc: "12-week AI roadmap generator"   },
  { icon: ScanLine,  color: "#10d981", label: "AI Food Scanner",               desc: "Instant nutrition breakdowns"    },
];

/* ── Reusable input field ── */
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
        {/* Left icon */}
        <div style={{
          position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
          color: hasError ? "var(--accent-rose)" : "var(--text-muted)", pointerEvents: "none",
          transition: "color 0.2s",
        }}>
          <Icon size={16} />
        </div>

        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          style={{
            width: "100%",
            padding: "0.75rem 2.75rem",
            background: hasError ? "rgba(244,63,94,0.05)" : "rgba(255,255,255,0.04)",
            border: `1.5px solid ${hasError ? "rgba(244,63,94,0.5)" : "rgba(255,255,255,0.1)"}`,
            borderRadius: 12,
            color: "var(--text-primary)",
            fontSize: "0.9rem",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
            fontFamily: "inherit",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = hasError ? "rgba(244,63,94,0.7)" : "rgba(0,212,255,0.5)";
            e.currentTarget.style.boxShadow   = hasError ? "0 0 0 3px rgba(244,63,94,0.1)" : "0 0 0 3px rgba(0,212,255,0.1)";
            e.currentTarget.style.background  = hasError ? "rgba(244,63,94,0.06)" : "rgba(0,212,255,0.04)";
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.borderColor = hasError ? "rgba(244,63,94,0.5)" : "rgba(255,255,255,0.1)";
            e.currentTarget.style.boxShadow   = "none";
            e.currentTarget.style.background  = hasError ? "rgba(244,63,94,0.05)" : "rgba(255,255,255,0.04)";
          }}
        />

        {/* Right slot (eye toggle / etc.) */}
        {rightSlot && (
          <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
            {rightSlot}
          </div>
        )}
      </div>

      {/* Error message */}
      {hasError && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
          <AlertCircle size={12} color="var(--accent-rose)" />
          <span style={{ fontSize: "0.72rem", color: "var(--accent-rose)", fontWeight: 500 }}>{error}</span>
        </div>
      )}
    </div>
  );
}

/* ── Left branding panel ── */
function BrandPanel() {
  return (
    <div style={{
      flex: "0 0 45%", minHeight: "100vh",
      background: "linear-gradient(145deg, #070b14 0%, #0d1117 40%, #0a0f1e 100%)",
      padding: "3rem 2.5rem",
      display: "flex", flexDirection: "column", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* Decorative blobs */}
      <div style={{ position: "absolute", top: -120, left: -80, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -100, right: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "40%", right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,217,129,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Grid pattern overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
        backgroundSize: "48px 48px", pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ marginBottom: "3rem" }}>
          <PlannerHubLogo width={200} showTagline={true} />
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: "2.25rem", fontWeight: 900, lineHeight: 1.18, marginBottom: "1rem", fontFamily: "Sora, sans-serif" }}>
          Plan Smarter.<br />
          <span style={{ background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Live Healthier.
          </span><br />
          Grow Faster.
        </h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: 340 }}>
          Your all-in-one AI workspace for fitness, health, pregnancy tracking, business strategy, and nutrition — all beautifully unified.
        </p>

        {/* Feature tiles */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {FEATURES.map(({ icon: Icon, color, label, desc }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: "0.875rem",
              padding: "0.875rem 1rem",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14,
              backdropFilter: "blur(8px)",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: `${color}18`, border: `1px solid ${color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={17} color={color} />
              </div>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.1rem" }}>{label}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div style={{ display: "flex", gap: "2rem", marginTop: "2.5rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          {[{ val: "10K+", label: "Active Users" }, { val: "50K+", label: "Plans Generated" }, { val: "98%", label: "Satisfaction" }].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, fontFamily: "Sora, sans-serif", color: "var(--accent-cyan)" }}>{s.val}</div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   LOGIN PAGE
════════════════════════════════════════════════ */
export default function LoginPage() {
  const { login } = useUser();
  const router = useRouter();
  const uid = useId();

  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [errors,    setErrors]    = useState<{ email?: string; password?: string }>({});
  const [apiError,  setApiError]  = useState("");
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);

  /* field-level validation */
  const validateField = (field: "email" | "password", val: string) => {
    if (field === "email") {
      if (!val.trim()) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Enter a valid email address.";
    }
    if (field === "password") {
      if (!val) return "Password is required.";
      if (val.length < 6) return "Password must be at least 6 characters.";
    }
    return undefined;
  };

  const validate = () => {
    const e = {
      email:    validateField("email",    email),
      password: validateField("password", password),
    };
    setErrors(e);
    return !e.email && !e.password;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setApiError("");
    if (!validate()) return;

    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);

    if (!res.success) {
      setApiError(res.error ?? "Login failed. Please try again.");
      return;
    }
    setSuccess(true);
    setTimeout(() => router.replace("/"), 600);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left branding */}
      <BrandPanel />

      {/* Right form panel */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "2rem 1.5rem",
        background: "var(--bg-surface)",
      }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Header */}
          <div style={{ marginBottom: "2.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-cyan)", boxShadow: "0 0 8px var(--accent-cyan)" }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent-cyan)" }}>
                Welcome Back
              </span>
            </div>
            <h2 style={{ fontSize: "2rem", fontWeight: 900, fontFamily: "Sora, sans-serif", marginBottom: "0.5rem" }}>
              Sign in to your account
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" style={{ color: "var(--accent-cyan)", fontWeight: 600, textDecoration: "none" }}>
                Create one free →
              </Link>
            </p>
          </div>

          {/* Demo credentials hint */}
          <div style={{
            padding: "0.875rem 1rem", marginBottom: "1.75rem", borderRadius: 12,
            background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.18)",
            display: "flex", gap: "0.75rem", alignItems: "flex-start",
          }}>
            <Zap size={15} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--accent-cyan)", marginBottom: "0.2rem" }}>Quick Demo Access</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Email: <strong style={{ color: "var(--text-primary)" }}>demo@plannerhub.com</strong>
                {" · "}
                Password: <strong style={{ color: "var(--text-primary)" }}>demo123</strong>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
            <AuthInput
              id={`${uid}-email`}
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              onBlur={() => setErrors((e) => ({ ...e, email: validateField("email", email) }))}
              error={errors.email}
              placeholder="you@example.com"
              icon={Mail}
            />

            <AuthInput
              id={`${uid}-password`}
              label="Password"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={setPassword}
              onBlur={() => setErrors((e) => ({ ...e, password: validateField("password", password) }))}
              error={errors.password}
              placeholder="••••••••"
              icon={Lock}
              rightSlot={
                <button type="button" onClick={() => setShowPass((s) => !s)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0.25rem", display: "flex", alignItems: "center" }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {/* Forgot password */}
            <div style={{ textAlign: "right", marginTop: "-0.5rem" }}>
              <span style={{ fontSize: "0.78rem", color: "var(--accent-cyan)", fontWeight: 600, cursor: "pointer" }}>
                Forgot password?
              </span>
            </div>

            {/* API-level error */}
            {apiError && (
              <div style={{
                display: "flex", alignItems: "flex-start", gap: "0.625rem",
                padding: "0.875rem 1rem", borderRadius: 12,
                background: "rgba(244,63,94,0.07)", border: "1px solid rgba(244,63,94,0.25)",
              }}>
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
                background: success ? "var(--grad-emerald)" : "var(--grad-primary)",
                color: "white", fontSize: "0.95rem", fontWeight: 700,
                cursor: loading || success ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.625rem",
                boxShadow: success ? "0 4px 20px rgba(16,217,129,0.35)" : "0 4px 20px rgba(0,212,255,0.3)",
                opacity: loading ? 0.85 : 1,
                transition: "all 0.3s ease",
                width: "100%",
              }}
            >
              {success ? (
                <><CheckCircle2 size={18} /> Redirecting to Dashboard…</>
              ) : loading ? (
                <><div style={{ width: 18, height: 18, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "white", animation: "spin 0.8s linear infinite" }} /> Signing in…</>
              ) : (
                <><LogIn size={18} /> Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Footer */}
          <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", textAlign: "center", marginTop: "2rem", lineHeight: 1.6 }}>
            By signing in you agree to our{" "}
            <span style={{ color: "var(--text-secondary)", cursor: "pointer" }}>Terms of Service</span>
            {" "}and{" "}
            <span style={{ color: "var(--text-secondary)", cursor: "pointer" }}>Privacy Policy</span>.
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
