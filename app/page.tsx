"use client";

import Link from "next/link";
import {
  Dumbbell,
  Heart,
  Briefcase,
  ScanLine,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Flame,
  ArrowRight,
  Sparkles,
  Activity,
  Target,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/userContext";

const modules = [
  {
    href: "/fitness",
    name: "Fitness & Health",
    desc: "Personalized workout plans, meal prep, and health routines tailored to your medical profile.",
    icon: "💪",
    color: "cyan",
    gradient: "var(--grad-primary)",
    stats: [{ value: "7-Day", label: "Plans" }, { value: "100+", label: "Exercises" }],
    badge: "Most Popular",
    badgeClass: "badge-cyan",
  },
  {
    href: "/pregnancy",
    name: "Women's Health",
    desc: "Trimester-aware routines, prenatal nutrition, safe exercises, and supplement reminders.",
    icon: "🤰",
    color: "rose",
    gradient: "var(--grad-rose)",
    stats: [{ value: "40 Wk", label: "Coverage" }, { value: "3", label: "Trimesters" }],
    badge: "Specialized",
    badgeClass: "badge-rose",
  },
  {
    href: "/business",
    name: "Business Planner",
    desc: "Turn your idea into a 12-week launch roadmap with budget breakdowns and milestones.",
    icon: "🚀",
    color: "violet",
    gradient: "var(--grad-violet)",
    stats: [{ value: "12 Wk", label: "Roadmap" }, { value: "4", label: "Phases" }],
    badge: "Strategy",
    badgeClass: "badge-violet",
  },
  {
    href: "/food-scanner",
    name: "AI Food Scanner",
    desc: "Upload any meal photo and get instant macro & micro-nutrient analysis powered by AI.",
    icon: "🔬",
    color: "emerald",
    gradient: "var(--grad-emerald)",
    stats: [{ value: "AI", label: "Vision" }, { value: "10+", label: "Nutrients" }],
    badge: "NEW",
    badgeClass: "badge-emerald",
  },
];

const quickStats = [
  { label: "Plans Created", value: "12", change: "+3 this week", positive: true, icon: Target, color: "var(--accent-cyan)" },
  { label: "Meals Logged", value: "84", change: "+7 today", positive: true, icon: Flame, color: "var(--accent-amber)" },
  { label: "Goals Achieved", value: "6", change: "2 in progress", positive: true, icon: CheckCircle2, color: "var(--accent-emerald)" },
  { label: "Days Tracked", value: "28", change: "Current streak", positive: true, icon: Calendar, color: "var(--accent-violet-light)" },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function Dashboard() {
  const { user } = useUser();
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
      setDate(
        now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
      );
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {/* Hero Header */}
      <div className="anim-fade-up" style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div className="page-eyebrow">
              <Sparkles size={14} />
              AI-Powered Dashboard
            </div>
            <h1 style={{ fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.4rem" }}>
              {getGreeting()},{" "}
              <span className="gradient-text">{user?.firstName ?? ""}</span> 👋
            </h1>
            <p className="text-secondary" style={{ fontSize: "1rem" }}>
              {mounted ? date : "Loading..."} &nbsp;·&nbsp; {mounted ? time : "--:--"}
            </p>
          </div>
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "14px",
            padding: "0.75rem 1.25rem",
            backdropFilter: "blur(16px)",
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
          }}>
            <Activity size={16} color="var(--accent-emerald)" />
            <span style={{ fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)" }}>
              All systems active
            </span>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "var(--accent-emerald)",
              boxShadow: "0 0 8px var(--accent-emerald)",
              animation: "pulse-glow 2s infinite"
            }} />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid-4 anim-fade-up anim-delay-1" style={{ marginBottom: "2rem" }}>
        {quickStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card" style={{ animationDelay: `${i * 0.05}s` }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "10px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Icon size={18} color={stat.color} />
                </div>
                <TrendingUp size={14} color="var(--accent-emerald)" />
              </div>
              <div className="stat-value" style={{ background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {stat.value}
              </div>
              <div className="stat-label">{stat.label}</div>
              <div className={`stat-change ${stat.positive ? "positive" : "negative"}`}>
                ↑ {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Section Title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }} className="anim-fade-up anim-delay-2">
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.2rem" }}>Your AI Modules</h2>
          <p className="text-muted" style={{ fontSize: "0.8rem" }}>Select a planner to get started</p>
        </div>
        <div className="badge badge-cyan">
          <Sparkles size={10} />4 Active
        </div>
      </div>

      {/* Module Cards */}
      <div className="grid-2 anim-fade-up anim-delay-3" style={{ marginBottom: "2.5rem" }}>
        {modules.map((mod, i) => (
          <Link
            key={mod.href}
            href={mod.href}
            className={`module-card ${mod.color}`}
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            {/* Glow orb */}
            <div style={{
              position: "absolute", top: -40, right: -40, width: 120, height: 120,
              borderRadius: "50%", background: mod.gradient,
              opacity: 0.08, filter: "blur(30px)", pointerEvents: "none"
            }} />

            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div className="module-icon" style={{ background: `${mod.gradient}22`, border: `1px solid ${mod.gradient}33` }}>
                  <span style={{ fontSize: "1.5rem" }}>{mod.icon}</span>
                </div>
                <div>
                  <div className="module-name">{mod.name}</div>
                  <span className={`badge ${mod.badgeClass}`} style={{ fontSize: "0.65rem" }}>{mod.badge}</span>
                </div>
              </div>
              <ArrowRight className="module-arrow" size={18} />
            </div>

            {/* Description */}
            <p className="module-desc">{mod.desc}</p>

            {/* Stats */}
            <div className="module-stats">
              {mod.stats.map((s) => (
                <div key={s.label} className="module-stat">
                  <span className="module-stat-value" style={{ background: mod.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    {s.value}
                  </span>
                  <span className="module-stat-label">{s.label}</span>
                </div>
              ))}
              <div style={{ marginLeft: "auto" }}>
                <span style={{
                  fontSize: "0.72rem", color: "var(--text-muted)",
                  display: "flex", alignItems: "center", gap: "0.25rem"
                }}>
                  <Clock size={11} /> Start Planning →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="anim-fade-up anim-delay-4">
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>Recent Activity</h2>
        <div className="glass-card" style={{ padding: "1.25rem" }}>
          {[
            { icon: "💪", label: "Fitness Plan Generated", sub: "7-day workout + meal plan • Medical: Hypertension", time: "2h ago", color: "var(--accent-cyan)" },
            { icon: "🔬", label: "Food Scan Completed", sub: "Grilled Salmon — 485 kcal · 42g protein", time: "5h ago", color: "var(--accent-emerald)" },
            { icon: "🚀", label: "Business Roadmap Created", sub: "E-commerce · $5K budget · 12-week plan", time: "1d ago", color: "var(--accent-violet-light)" },
            { icon: "🤰", label: "Women's Health Plan", sub: "Week 24 pregnancy routine created", time: "3d ago", color: "var(--accent-rose)" },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "1rem",
              padding: "0.875rem 0",
              borderBottom: i < 3 ? "1px solid var(--border-subtle)" : "none"
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "12px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border-subtle)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.2rem", flexShrink: 0
              }}>
                {item.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.1rem" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: "0.775rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.sub}
                </div>
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", flexShrink: 0 }}>
                {item.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
