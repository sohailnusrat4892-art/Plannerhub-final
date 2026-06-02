"use client";

import { useState } from "react";
import { Check, Star, Zap, Shield, ArrowRight, X, Smartphone, CreditCard } from "lucide-react";
import { useUser } from "@/lib/userContext";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const { user, setUser } = useUser();
  const router = useRouter();

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"easypaisa" | "jazzcash">("easypaisa");
  const [mobileNumber, setMobileNumber] = useState("");
  const [cnic, setCnic] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = () => {
    setShowModal(true);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Mock network request
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    if (user) {
      setUser({ ...user, plan: "Pro Member" });
    }
    
    setIsProcessing(false);
    setShowModal(false);
    
    // Redirect to dashboard or show success (redirecting to dashboard)
    router.push("/");
  };

  return (
    <div className="anim-fade-in" style={{ paddingBottom: "4rem", position: "relative" }}>
      {/* ── Page Header ── */}
      <div className="page-header anim-fade-up" style={{ textAlign: "center", alignItems: "center" }}>
        <div className="page-eyebrow" style={{ justifyContent: "center" }}>
          <Star size={16} /> Upgrade Your Workspace
        </div>
        <h1 className="page-title">Simple, transparent pricing</h1>
        <p className="page-subtitle" style={{ maxWidth: "600px" }}>
          Choose the perfect plan to unlock the full potential of PlannerHub's AI-driven health and business tools. No hidden fees.
        </p>
      </div>

      {/* ── Pricing Grid ── */}
      <div 
        className="anim-fade-up anim-delay-1"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          maxWidth: "1100px",
          margin: "0 auto",
          marginTop: "3rem",
          alignItems: "start"
        }}
      >
        {/* 1. Hobby / Starter Plan */}
        <div className="glass-card hover:border-[var(--border-subtle)] transition" style={{ padding: "2.5rem 2rem", display: "flex", flexDirection: "column", height: "100%" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.5rem" }}>Hobby / Starter</h2>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "2rem" }}>
            <span style={{ fontSize: "3rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>$0</span>
            <span style={{ color: "var(--text-muted)" }}>/month</span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2rem", minHeight: "45px" }}>
            Perfect for exploring the platform and testing our core features.
          </p>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem" }}>
            {[
              "3 AI Plans Created",
              "Basic Analytics",
              "Standard Dashboard Access",
            ].map((feature, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.95rem", color: "var(--text-primary)" }}>
                <Check size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", border: "1px solid var(--border-subtle)" }}>
            Get Started <ArrowRight size={16} />
          </button>
        </div>

        {/* 2. Pro Plan (Most Popular) */}
        <div 
          className="glass-card" 
          style={{ 
            padding: "2.5rem 2rem", display: "flex", flexDirection: "column", height: "100%", position: "relative",
            background: "linear-gradient(180deg, rgba(34, 211, 238, 0.05) 0%, rgba(20, 20, 20, 0) 100%), var(--bg-card)",
            boxShadow: "0 0 0 1px var(--accent-cyan), 0 20px 40px -10px rgba(34,211,238,0.15)",
            transform: "scale(1.02)", zIndex: 10
          }}
        >
          <div style={{
            position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "var(--accent-cyan)", color: "#000",
            padding: "0.25rem 1rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", 
            display: "flex", alignItems: "center", gap: "0.3rem", boxShadow: "0 0 20px rgba(34, 211, 238, 0.4)"
          }}>
            <Zap size={12} /> Most Popular
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--accent-cyan)", marginBottom: "0.5rem" }}>Pro Plan</h2>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "2rem" }}>
            <span style={{ fontSize: "3rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>$12</span>
            <span style={{ color: "var(--text-muted)" }}>/month</span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2rem", minHeight: "45px" }}>
            Everything you need to master your productivity, health, and business goals.
          </p>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem" }}>
            {[
              "Unlimited AI Planners (Fitness, Women's Health, Business)",
              "Full AI Food Scanner Access",
              "Unlimited PDF Document Exports",
              "Priority Support",
            ].map((feature, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.95rem", color: "var(--text-primary)" }}>
                <Check size={18} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <button 
            onClick={handleCheckout}
            className="btn btn-primary" 
            style={{ width: "100%", justifyContent: "center", boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)", animation: "pulse 2s infinite" }}
          >
            Upgrade to Pro <ArrowRight size={16} />
          </button>
        </div>

        {/* 3. Enterprise / Team Plan */}
        <div className="glass-card hover:border-[var(--border-subtle)] transition" style={{ padding: "2.5rem 2rem", display: "flex", flexDirection: "column", height: "100%" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--accent-violet)", marginBottom: "0.5rem" }}>Enterprise / Team</h2>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "2rem" }}>
            <span style={{ fontSize: "3rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>$29</span>
            <span style={{ color: "var(--text-muted)" }}>/month</span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2rem", minHeight: "45px" }}>
            Advanced security, syncing, and custom reporting for professional teams.
          </p>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem" }}>
            {[
              "Multi-user License Sync",
              "Custom White-label Reports",
              "API Access Tokens",
              "Dedicated 24/7 Support Desk",
            ].map((feature, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.95rem", color: "var(--text-primary)" }}>
                <Shield size={18} color="var(--accent-violet)" style={{ flexShrink: 0 }} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", border: "1px solid var(--border-subtle)" }}>
            Contact Sales <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* ── Mobile Wallet Checkout Modal ── */}
      {showModal && (
        <div 
          className="anim-fade-in"
          style={{
            position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem"
          }}
        >
          <div 
            className="glass-card anim-scale-in" 
            style={{ 
              width: "100%", maxWidth: "480px", background: "var(--bg-card)", border: "1px solid var(--border-subtle)", 
              borderRadius: "20px", overflow: "hidden", position: "relative" 
            }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem", borderBottom: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ background: "rgba(255,255,255,0.05)", padding: "0.5rem", borderRadius: "10px" }}>
                  <Smartphone size={20} color="var(--text-primary)" />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>Mobile Wallet Payment</h3>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Secure Raast checkout</div>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0.25rem" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              {/* Wallet Selection Tabs */}
              <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
                <button
                  onClick={() => setPaymentMethod("easypaisa")}
                  style={{
                    flex: 1, padding: "1rem", borderRadius: "12px", border: "2px solid",
                    borderColor: paymentMethod === "easypaisa" ? "#16a34a" : "var(--border-subtle)",
                    background: paymentMethod === "easypaisa" ? "rgba(22, 163, 74, 0.1)" : "rgba(255,255,255,0.02)",
                    color: paymentMethod === "easypaisa" ? "#16a34a" : "var(--text-primary)",
                    fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
                  }}
                >
                  Easypaisa
                </button>
                <button
                  onClick={() => setPaymentMethod("jazzcash")}
                  style={{
                    flex: 1, padding: "1rem", borderRadius: "12px", border: "2px solid",
                    borderColor: paymentMethod === "jazzcash" ? "#ea580c" : "var(--border-subtle)",
                    background: paymentMethod === "jazzcash" ? "rgba(234, 88, 12, 0.1)" : "rgba(255,255,255,0.02)",
                    color: paymentMethod === "jazzcash" ? "#ea580c" : "var(--text-primary)",
                    fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
                  }}
                >
                  JazzCash
                </button>
              </div>

              {/* Input Form */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                    Mobile Wallet Number
                  </label>
                  <input
                    type="tel"
                    placeholder="03XX-XXXXXXX"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)",
                      padding: "0.875rem 1rem", borderRadius: "10px", color: "var(--text-primary)", fontSize: "1rem", outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = paymentMethod === "easypaisa" ? "#16a34a" : "#ea580c"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border-subtle)"}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                    CNIC Number <span style={{ opacity: 0.5 }}>(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="XXXXX-XXXXXXX-X"
                    value={cnic}
                    onChange={(e) => setCnic(e.target.value)}
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)",
                      padding: "0.875rem 1rem", borderRadius: "10px", color: "var(--text-primary)", fontSize: "1rem", outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = paymentMethod === "easypaisa" ? "#16a34a" : "#ea580c"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border-subtle)"}
                  />
                </div>
              </div>

              {/* Instructions Box */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)", borderRadius: "12px", padding: "1.25rem", marginBottom: "2rem" }}>
                <h4 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Shield size={16} color="var(--accent-cyan)" /> How to pay?
                </h4>
                <ol style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--text-muted)", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <li>Enter your active {paymentMethod === "easypaisa" ? "Easypaisa" : "JazzCash"} mobile number above.</li>
                  <li>You will instantly receive an approval prompt on your phone via USSD or app notification.</li>
                  <li>Enter your 5-digit PIN to securely authorize the payment and unlock Pro.</li>
                </ol>
              </div>

              {/* Action Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing || mobileNumber.length < 10}
                style={{
                  width: "100%", padding: "1rem", borderRadius: "12px", border: "none", fontWeight: 700, fontSize: "1rem",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", cursor: (isProcessing || mobileNumber.length < 10) ? "not-allowed" : "pointer",
                  background: paymentMethod === "easypaisa" ? "#16a34a" : "#ea580c",
                  color: "white", opacity: (isProcessing || mobileNumber.length < 10) ? 0.7 : 1, transition: "opacity 0.2s"
                }}
              >
                {isProcessing ? (
                  <>
                    <div className="spinner" style={{ width: "20px", height: "20px", borderTopColor: "white", borderRightColor: "white", borderBottomColor: "transparent", borderLeftColor: "transparent" }} />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Pay Safely with {paymentMethod === "easypaisa" ? "Easypaisa" : "JazzCash"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS animation injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(34, 211, 238, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0); }
        }
      `}} />
    </div>
  );
}
