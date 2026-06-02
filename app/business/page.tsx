"use client";

import { useState } from "react";
import {
  Briefcase, Sparkles, ChevronDown, ChevronUp, RotateCcw,
  Target, TrendingUp, AlertTriangle, Check, Pencil, X, Save,
  BarChart3, Calendar, Zap, DollarSign, Users, Activity,
} from "lucide-react";
import { generateBusinessPlan, BusinessInput, BusinessPlan, Milestone } from "@/lib/businessAI";
import ExportPDFButton from "@/components/ExportPDFButton";

/* ── Static mock data ─────────────────────────────── */
const PHASES_OVERVIEW = [
  { num: 1, name: "Research & Validation", emoji: "🔍", status: "done",    color: "var(--accent-emerald)", pct: 100 },
  { num: 2, name: "MVP Development",       emoji: "⚙️",  status: "active",  color: "var(--accent-violet-light)", pct: 65  },
  { num: 3, name: "Launch & Marketing",    emoji: "🚀",  status: "upcoming",color: "var(--accent-cyan)",    pct: 0   },
  { num: 4, name: "Growth & Scale",        emoji: "📈",  status: "upcoming",color: "var(--accent-amber)",   pct: 0   },
];

const WEEKS_CALENDAR = [
  { wk: 1,  phase: 1, color: "#10d981", done: true,    label: "Market research" },
  { wk: 2,  phase: 1, color: "#10d981", done: true,    label: "Competitor analysis" },
  { wk: 3,  phase: 1, color: "#10d981", done: true,    label: "ICP interviews" },
  { wk: 4,  phase: 1, color: "#10d981", done: true,    label: "Validation report" },
  { wk: 5,  phase: 2, color: "#a855f7", done: true,    label: "Tech stack setup" },
  { wk: 6,  phase: 2, color: "#a855f7", done: false,   label: "Core features", today: true },
  { wk: 7,  phase: 2, color: "#a855f7", done: false,   label: "Beta testing" },
  { wk: 8,  phase: 2, color: "#a855f7", done: false,   label: "Polish & QA" },
  { wk: 9,  phase: 3, color: "#00d4ff", done: false,   label: "Landing page" },
  { wk: 10, phase: 3, color: "#00d4ff", done: false,   label: "Launch campaign" },
  { wk: 11, phase: 4, color: "#f59e0b", done: false,   label: "Scale ads" },
  { wk: 12, phase: 4, color: "#f59e0b", done: false,   label: "Partnerships" },
];

const KPIS = [
  { label: "Customer Signups", current: 143, target: 500,  unit: "",  color: "var(--accent-cyan)",         trend: "+12% this week" },
  { label: "Email List",       current: 892, target: 2000, unit: "",  color: "var(--accent-violet-light)", trend: "+8% this week"  },
  { label: "Social Followers", current: 2100,target: 5000, unit: "",  color: "var(--accent-amber)",        trend: "+5% this week"  },
];

const WEEK_TASKS = [
  "Finish landing page copy",
  "Set up email automation",
  "Run 3 user interviews",
  "Publish 2 blog posts",
  "Configure payment gateway",
];

const KEY_METRICS = [
  { label: "Revenue Growth",     pct: 55, color: "var(--accent-emerald)" },
  { label: "User Retention",     pct: 72, color: "var(--accent-cyan)"    },
  { label: "Product Completion", pct: 65, color: "var(--accent-violet-light)" },
];

/* ── Generator setup ──────────────────────────────── */
const defaultInput: BusinessInput = {
  businessName: "", industry: "Technology", businessType: "saas",
  budget: "5k_20k", timeline: "3_months", teamSize: "solo", targetMarket: "",
};

/* ── PhaseCard (generator tab) ───────────────────── */
function PhaseCard({ phase, index }: { phase: BusinessPlan["phases"][number]; index: number }) {
  const [expanded,   setExpanded]   = useState(index === 0);
  const [milestones, setMilestones] = useState<Milestone[]>(phase.milestones);
  const [editId,     setEditId]     = useState<string | null>(null);
  const [editVal,    setEditVal]    = useState("");

  const toggle = (id: string) => setMilestones((prev) => prev.map((m) => m.id === id ? { ...m, completed: !m.completed } : m));
  const done   = milestones.filter((m) => m.completed).length;
  const pct    = Math.round((done / milestones.length) * 100);

  return (
    <div className="glass-card anim-fade-up" style={{ overflow: "hidden", animationDelay: `${index * 0.1}s` }}>
      <div onClick={() => setExpanded((e) => !e)} style={{ padding: "1.25rem 1.5rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "1rem", borderBottom: expanded ? "1px solid var(--border-subtle)" : "none", background: "rgba(255,255,255,0.02)", transition: "background 0.2s" }}>
        <div style={{ width: 44, height: 44, borderRadius: "12px", background: phase.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0, boxShadow: `0 4px 16px ${phase.color}30` }}>{phase.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: phase.color }}>Phase {phase.phase}</span>
            <span className="badge" style={{ background: `${phase.color}15`, color: phase.color, border: `1px solid ${phase.color}30`, fontSize: "0.65rem" }}>{phase.weeks}</span>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Budget: {phase.budget}</span>
          </div>
          <div style={{ fontSize: "1rem", fontWeight: 700, marginTop: "0.2rem" }}>{phase.name}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.1rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{phase.goal}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", flexShrink: 0 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1rem", fontWeight: 800, color: pct === 100 ? "var(--accent-emerald)" : phase.color }}>{pct}%</div>
            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{done}/{milestones.length}</div>
          </div>
          {expanded ? <ChevronUp size={16} style={{ color: "var(--text-muted)" }} /> : <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />}
        </div>
      </div>
      {expanded && (
        <div style={{ padding: "1.5rem" }}>
          <div style={{ marginBottom: "1.25rem" }}>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%`, background: phase.gradient }} /></div>
          </div>
          <div style={{ marginBottom: "1.25rem" }}>
            <div className="task-section-title">Success KPIs</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.5rem", marginTop: "0.5rem" }}>
              {phase.kpis.map((kpi, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", padding: "0.5rem 0.75rem", background: `${phase.color}08`, borderRadius: "8px", border: `1px solid ${phase.color}15` }}>
                  <Target size={12} color={phase.color} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{kpi}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="task-section-title" style={{ marginBottom: "0.5rem" }}>Action Milestones</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            {milestones.map((m) => {
              const isEditing = editId === m.id;
              return (
                <div key={m.id} className={`task-item ${m.completed ? "completed" : ""}`} style={{ alignItems: isEditing ? "flex-start" : "center" }}>
                  <div className="task-checkbox" style={{ borderColor: m.completed ? "var(--accent-emerald)" : phase.color }} onClick={() => !isEditing && toggle(m.id)}>
                    {m.completed && <Check size={11} color="white" />}
                  </div>
                  {isEditing ? (
                    <div style={{ flex: 1, display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      <input autoFocus value={editVal} onChange={(e) => setEditVal(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { setMilestones((p) => p.map((ms) => ms.id === m.id ? { ...ms, text: editVal } : ms)); setEditId(null); } if (e.key === "Escape") setEditId(null); }}
                        className="form-input" style={{ flex: 1, padding: "0.4rem 0.75rem", fontSize: "0.85rem" }} />
                      <button className="btn btn-sm btn-primary btn-icon" onClick={() => { setMilestones((p) => p.map((ms) => ms.id === m.id ? { ...ms, text: editVal } : ms)); setEditId(null); }}><Save size={13} /></button>
                      <button className="btn btn-sm btn-ghost btn-icon" onClick={() => setEditId(null)}><X size={13} /></button>
                    </div>
                  ) : (
                    <div style={{ flex: 1 }}>
                      <span className="task-text" onClick={() => toggle(m.id)}>{m.text}</span>
                      {m.cost && <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>💰 {m.cost}</div>}
                    </div>
                  )}
                  {!isEditing && !m.completed && (
                    <button className="btn btn-ghost btn-icon" style={{ padding: "0.25rem", opacity: 0, transition: "opacity 0.15s" }}
                      onClick={() => { setEditId(m.id); setEditVal(m.text); }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}>
                      <Pencil size={12} />
                    </button>
                  )}
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", flexShrink: 0, marginLeft: "0.5rem" }}>Wk {m.week}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── MAIN PAGE ────────────────────────────────────── */
export default function BusinessPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "generator">("overview");

  /* Generator state */
  const [input,   setInput]   = useState<BusinessInput>(defaultInput);
  const [plan,    setPlan]    = useState<BusinessPlan | null>(null);
  const [loading, setLoading] = useState(false);

  /* Overview state */
  const [checkedTasks, setCheckedTasks] = useState<Set<number>>(new Set());

  const handleGenerate = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setPlan(generateBusinessPlan(input));
    setLoading(false);
    setTimeout(() => document.getElementById("business-output")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const tabStyle = (tab: "overview" | "generator") => ({
    padding: "0.5rem 1.25rem", borderRadius: 100, fontSize: "0.875rem", fontWeight: 600 as const,
    cursor: "pointer", border: "none", transition: "all 0.2s ease",
    background: activeTab === tab ? "var(--grad-violet)" : "transparent",
    color:      activeTab === tab ? "white"              : "var(--text-muted)",
    boxShadow:  activeTab === tab ? "0 2px 12px rgba(124,58,237,0.25)" : "none",
  });

  return (
    <div>
      {/* ── Header ── */}
      <div className="page-header anim-fade-up">
        <div className="page-eyebrow"><Briefcase size={14} /> Strategy AI Module</div>
        <h1 className="page-title" style={{ background: "var(--grad-violet)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          Business &amp; Strategy Planner
        </h1>
        <p className="page-subtitle">
          Track your launch progress, KPIs, and 12-week milestones — or generate a full AI-powered business roadmap.
        </p>
      </div>

      {/* ── Tab Switcher ── */}
      <div style={{ display: "inline-flex", gap: "0.25rem", padding: "0.3rem", background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 100, marginBottom: "2rem" }}>
        <button style={tabStyle("overview")}  onClick={() => setActiveTab("overview")}>
          <BarChart3 size={14} style={{ display: "inline", marginRight: 6 }} />Overview
        </button>
        <button style={tabStyle("generator")} onClick={() => setActiveTab("generator")}>
          <Sparkles size={14} style={{ display: "inline", marginRight: 6 }} />Roadmap Generator
        </button>
      </div>

      {/* ══════════════════════════════════════
          OVERVIEW TAB
      ══════════════════════════════════════ */}
      {activeTab === "overview" && (
        <div className="anim-fade-in">

          {/* Stats Row */}
          <div className="grid-4 anim-fade-up" style={{ marginBottom: "1.5rem" }}>
            {[
              { label: "Budget Used",     value: "$8,400", sub: "of $15K · 56%",    color: "var(--accent-amber)",        icon: "💰" },
              { label: "Milestones Done", value: "14/28",  sub: "50% complete",      color: "var(--accent-violet-light)", icon: "🎯" },
              { label: "Days to Launch",  value: "47",     sub: "days remaining",    color: "var(--accent-cyan)",         icon: "🚀" },
              { label: "Monthly Revenue", value: "$2,800", sub: "target $5K",        color: "var(--accent-emerald)",      icon: "📈" },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{s.icon}</div>
                <div className="stat-value" style={{ color: s.color, fontSize: "1.5rem" }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* 4-Phase Launch Timeline */}
          <div className="glass-card anim-fade-up" style={{ padding: "1.5rem", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <Target size={16} color="var(--accent-violet-light)" />
              <h2 style={{ fontSize: "0.875rem", fontWeight: 700 }}>Launch Phase Timeline</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
              {PHASES_OVERVIEW.map((ph, i) => (
                <div key={ph.num} style={{ position: "relative" }}>
                  <div style={{
                    padding: "1rem 0.875rem", borderRadius: 14, textAlign: "center",
                    background: ph.status === "active" ? `${ph.color}10` : ph.status === "done" ? "rgba(16,217,129,0.06)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${ph.status === "active" ? `${ph.color}40` : ph.status === "done" ? "rgba(16,217,129,0.2)" : "var(--border-subtle)"}`,
                    boxShadow: ph.status === "active" ? `0 0 20px ${ph.color}20` : "none",
                  }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.375rem" }}>{ph.emoji}</div>
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", color: ph.status === "done" ? "var(--accent-emerald)" : ph.color, letterSpacing: "0.06em", marginBottom: "0.25rem" }}>Phase {ph.num}</div>
                    <div style={{ fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.625rem", lineHeight: 1.3 }}>{ph.name}</div>
                    <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 100, overflow: "hidden", marginBottom: "0.5rem" }}>
                      <div style={{ height: "100%", width: `${ph.pct}%`, background: ph.status === "done" ? "var(--accent-emerald)" : ph.color, borderRadius: 100, transition: "width 1s ease" }} />
                    </div>
                    <span className="badge" style={{
                      fontSize: "0.6rem",
                      background: ph.status === "done" ? "rgba(16,217,129,0.12)" : ph.status === "active" ? `${ph.color}15` : "rgba(255,255,255,0.05)",
                      color:      ph.status === "done" ? "var(--accent-emerald)" : ph.status === "active" ? ph.color : "var(--text-muted)",
                      border: `1px solid ${ph.status === "done" ? "rgba(16,217,129,0.25)" : ph.status === "active" ? `${ph.color}30` : "var(--border-subtle)"}`,
                    }}>
                      {ph.status === "done" ? "✅ Complete" : ph.status === "active" ? `⚡ ${ph.pct}%` : "⭕ Upcoming"}
                    </span>
                  </div>
                  {/* Connector */}
                  {i < PHASES_OVERVIEW.length - 1 && (
                    <div style={{ position: "absolute", top: "50%", right: -8, width: 8, height: 2, background: "var(--border-subtle)", zIndex: 1 }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 12-Week Calendar + This Week's Tasks */}
          <div className="grid-2 anim-fade-up anim-delay-1" style={{ marginBottom: "1.25rem" }}>
            {/* 12-Week Calendar */}
            <div className="glass-card" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
                <Calendar size={16} color="var(--accent-cyan)" />
                <h2 style={{ fontSize: "0.875rem", fontWeight: 700 }}>12-Week Roadmap</h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem" }}>
                {WEEKS_CALENDAR.map((w) => (
                  <div key={w.wk} style={{
                    padding: "0.625rem 0.5rem", borderRadius: 10, textAlign: "center",
                    background: w.today ? `${w.color}18` : w.done ? `${w.color}08` : "rgba(255,255,255,0.02)",
                    border: `1px solid ${w.today ? `${w.color}50` : w.done ? `${w.color}20` : "var(--border-subtle)"}`,
                    boxShadow: w.today ? `0 0 14px ${w.color}25` : "none",
                  }}>
                    <div style={{ fontSize: "0.6rem", fontWeight: 700, color: w.today ? w.color : "var(--text-muted)", marginBottom: "0.2rem" }}>Wk {w.wk}</div>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: w.color, margin: "0 auto 0.3rem", opacity: w.done || w.today ? 1 : 0.3 }} />
                    <div style={{ fontSize: "0.55rem", color: w.today ? "var(--text-primary)" : "var(--text-muted)", lineHeight: 1.3 }}>{w.done ? "✓" : w.today ? "→" : ""} {w.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* This Week's Focus */}
            <div className="glass-card" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
                <Zap size={16} color="var(--accent-violet-light)" />
                <h2 style={{ fontSize: "0.875rem", fontWeight: 700 }}>This Week&apos;s Focus</h2>
                <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: "var(--text-muted)" }}>{checkedTasks.size}/{WEEK_TASKS.length} done</span>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.round((checkedTasks.size / WEEK_TASKS.length) * 100)}%`, background: "var(--grad-violet)" }} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {WEEK_TASKS.map((task, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    padding: "0.625rem 0.75rem", borderRadius: 10, cursor: "pointer",
                    background: checkedTasks.has(i) ? "rgba(124,58,237,0.07)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${checkedTasks.has(i) ? "rgba(124,58,237,0.2)" : "var(--border-subtle)"}`,
                    transition: "all 0.2s ease",
                  }} onClick={() => setCheckedTasks((prev) => { const next = new Set(prev); next.has(i) ? next.delete(i) : next.add(i); return next; })}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                      border: `2px solid ${checkedTasks.has(i) ? "var(--accent-violet-light)" : "rgba(255,255,255,0.2)"}`,
                      background: checkedTasks.has(i) ? "var(--accent-violet-light)" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {checkedTasks.has(i) && <Check size={11} color="white" />}
                    </div>
                    <span style={{ fontSize: "0.82rem", color: checkedTasks.has(i) ? "var(--text-muted)" : "var(--text-secondary)", textDecoration: checkedTasks.has(i) ? "line-through" : "none" }}>
                      {task}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KPI Tracking + Key Metrics */}
          <div className="grid-2 anim-fade-up anim-delay-1" style={{ marginBottom: "1.25rem" }}>
            {/* KPIs */}
            <div className="glass-card" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
                <Users size={16} color="var(--accent-cyan)" />
                <h2 style={{ fontSize: "0.875rem", fontWeight: 700 }}>KPI Tracker</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {KPIS.map((kpi) => {
                  const pct = Math.round((kpi.current / kpi.target) * 100);
                  return (
                    <div key={kpi.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>{kpi.label}</span>
                        <span style={{ fontSize: "0.82rem", fontWeight: 800, color: kpi.color, fontFamily: "Sora, sans-serif" }}>
                          {kpi.current.toLocaleString()} <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 500 }}>/ {kpi.target.toLocaleString()}</span>
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: kpi.color }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.2rem" }}>
                        <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{pct}% of target</span>
                        <span style={{ fontSize: "0.65rem", color: "var(--accent-emerald)" }}>↑ {kpi.trend}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="glass-card" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
                <TrendingUp size={16} color="var(--accent-emerald)" />
                <h2 style={{ fontSize: "0.875rem", fontWeight: 700 }}>Performance Metrics</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {KEY_METRICS.map((m) => (
                  <div key={m.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                      <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>{m.label}</span>
                      <span style={{ fontSize: "0.875rem", fontWeight: 800, color: m.color, fontFamily: "Sora, sans-serif" }}>{m.pct}%</span>
                    </div>
                    <div style={{ height: 10, background: "rgba(255,255,255,0.04)", borderRadius: 100, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${m.pct}%`, background: m.color, borderRadius: 100, transition: "width 1s ease", boxShadow: `0 0 8px ${m.color}50` }} />
                    </div>
                  </div>
                ))}

                {/* Revenue snapshot */}
                <div style={{ paddingTop: "0.75rem", borderTop: "1px solid var(--border-subtle)" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "0.75rem" }}>Revenue Snapshot</div>
                  {[
                    { label: "This Month",    val: "$2,800", up: true  },
                    { label: "Last Month",    val: "$1,950", up: true  },
                    { label: "MoM Growth",    val: "+43.6%", up: true  },
                  ].map((r) => (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{r.label}</span>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: r.up ? "var(--accent-emerald)" : "var(--accent-rose)" }}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ padding: "1.25rem 1.5rem", borderRadius: 16, background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(0,212,255,0.08))", border: "1px solid rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>Build your AI-powered 12-week roadmap</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>Enter your business profile and get a full phased launch plan with budget breakdowns and KPIs.</div>
            </div>
            <button className="btn btn-lg" style={{ background: "var(--grad-violet)", color: "white", gap: "0.5rem", whiteSpace: "nowrap" }} onClick={() => setActiveTab("generator")}>
              <Sparkles size={16} /> Generate Roadmap
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          ROADMAP GENERATOR TAB
      ══════════════════════════════════════ */}
      {activeTab === "generator" && (
        <div className="anim-fade-in">
          {!plan && (
            <div className="glass-card p-8 anim-fade-up anim-delay-1" style={{ maxWidth: "720px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.75rem" }}>
                <Sparkles size={18} color="var(--accent-violet-light)" />
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Your Business Profile</h2>
              </div>
              <div className="form-grid" style={{ gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div className="form-group">
                  <label className="form-label">Business / Venture Name</label>
                  <input className="form-input" value={input.businessName} onChange={(e) => setInput((p) => ({ ...p, businessName: e.target.value }))} placeholder="e.g. NexaFlow, HealthSync…" />
                </div>
                <div className="form-group">
                  <label className="form-label">Industry / Sector</label>
                  <input className="form-input" value={input.industry} onChange={(e) => setInput((p) => ({ ...p, industry: e.target.value }))} placeholder="e.g. Technology, Health, E-commerce" />
                </div>
                <div className="form-group">
                  <label className="form-label">Business Type</label>
                  <select className="form-select" value={input.businessType} onChange={(e) => setInput((p) => ({ ...p, businessType: e.target.value as BusinessInput["businessType"] }))}>
                    <option value="saas">SaaS / Software Product</option>
                    <option value="ecommerce">E-Commerce Store</option>
                    <option value="service">Service Business</option>
                    <option value="consulting">Consulting / Agency</option>
                    <option value="content">Content / Media Brand</option>
                    <option value="food">Food &amp; Beverage</option>
                    <option value="retail">Retail / Physical Store</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Available Budget</label>
                  <select className="form-select" value={input.budget} onChange={(e) => setInput((p) => ({ ...p, budget: e.target.value as BusinessInput["budget"] }))}>
                    <option value="under_1k">Under $1,000 (Bootstrap)</option>
                    <option value="1k_5k">$1,000 – $5,000 (Lean)</option>
                    <option value="5k_20k">$5,000 – $20,000 (Growth)</option>
                    <option value="20k_plus">$20,000+ (Funded)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Launch Timeline</label>
                  <select className="form-select" value={input.timeline} onChange={(e) => setInput((p) => ({ ...p, timeline: e.target.value as BusinessInput["timeline"] }))}>
                    <option value="3_months">3 Months (Aggressive)</option>
                    <option value="6_months">6 Months (Balanced)</option>
                    <option value="1_year">1 Year (Steady)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Team Size</label>
                  <select className="form-select" value={input.teamSize} onChange={(e) => setInput((p) => ({ ...p, teamSize: e.target.value as BusinessInput["teamSize"] }))}>
                    <option value="solo">Solo Founder</option>
                    <option value="2_5">2–5 People</option>
                    <option value="6_20">6–20 People</option>
                    <option value="20_plus">20+ People</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: "2rem" }}>
                <label className="form-label">Target Market / Customer</label>
                <input className="form-input" value={input.targetMarket} onChange={(e) => setInput((p) => ({ ...p, targetMarket: e.target.value }))} placeholder="e.g. SMB owners, fitness enthusiasts, first-time moms…" />
              </div>
              <button className="btn btn-lg w-full" style={{ background: "var(--grad-violet)", color: "white", boxShadow: "0 4px 20px rgba(124,58,237,0.3)" }} onClick={handleGenerate} disabled={loading}>
                {loading ? <><div className="spinner" style={{ width: 18, height: 18, borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} /> Building your roadmap…</> : <><Sparkles size={18} /> Generate 12-Week Roadmap <ChevronDown size={16} /></>}
              </button>
            </div>
          )}

          {loading && (
            <div className="anim-fade-in" style={{ textAlign: "center", padding: "3rem 0" }}>
              <div className="spinner" style={{ width: 40, height: 40, margin: "0 auto 1.25rem", borderColor: "rgba(124,58,237,0.2)", borderTopColor: "var(--accent-violet-light)" }} />
              <p style={{ color: "var(--text-secondary)" }}>Analyzing your business profile and building your roadmap…</p>
            </div>
          )}

          {plan && !loading && (
            <div id="business-output" className="anim-scale-in">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.25rem" }}>Your 12-Week Launch Roadmap 🚀</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{plan.summary}</p>
                </div>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <ExportPDFButton targetId="business-plan-content" filename="business-roadmap" title="Business Launch Roadmap" />
                  <button className="btn btn-ghost" onClick={() => { setPlan(null); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ gap: "0.5rem" }}><RotateCcw size={15} /> New Plan</button>
                </div>
              </div>
              <div className="grid-4" style={{ marginBottom: "1.5rem" }}>
                {[
                  { label: "Total Budget",        value: plan.totalBudget,                      icon: "💰", color: "var(--accent-amber)"        },
                  { label: "Est. Revenue (Mo 6)", value: plan.estimatedRevenue.split("–")[0],   icon: "📈", color: "var(--accent-emerald)"      },
                  { label: "Break-Even",          value: plan.breakEvenMonth,                   icon: "⚖️", color: "var(--accent-cyan)"          },
                  { label: "Total Milestones",    value: plan.phases.reduce((s, p) => s + p.milestones.length, 0).toString(), icon: "🎯", color: "var(--accent-violet-light)" },
                ].map((s) => (
                  <div key={s.label} className="stat-card">
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{s.icon}</div>
                    <div className="stat-value" style={{ color: s.color, fontSize: "1.1rem" }}>{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="grid-2" style={{ marginBottom: "1.5rem" }}>
                <div className="glass-card" style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}><AlertTriangle size={16} color="var(--accent-amber)" /><h3 style={{ fontSize: "0.875rem", fontWeight: 700 }}>Key Risks to Mitigate</h3></div>
                  {plan.keyRisks.map((r, i) => (<div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.625rem" }}><span style={{ color: "var(--accent-amber)", flexShrink: 0 }}>⚠</span><span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{r}</span></div>))}
                </div>
                <div className="glass-card" style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}><TrendingUp size={16} color="var(--accent-emerald)" /><h3 style={{ fontSize: "0.875rem", fontWeight: 700 }}>Critical Success Factors</h3></div>
                  {plan.successFactors.map((f, i) => (<div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.625rem" }}><span style={{ color: "var(--accent-emerald)", flexShrink: 0 }}>✦</span><span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{f}</span></div>))}
                </div>
              </div>
              <div id="business-plan-content" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {plan.phases.map((phase, i) => (<PhaseCard key={phase.id} phase={phase} index={i} />))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
