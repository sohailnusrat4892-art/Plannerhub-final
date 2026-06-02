"use client";

import { useState } from "react";
import {
  Heart, Sparkles, AlertTriangle, ChevronRight, RotateCcw,
  Baby, Pill, Dumbbell, Calendar, Check, Pencil, X, Save,
  Activity, Star, Clock,
} from "lucide-react";
import { generatePregnancyPlan, PregnancyInput, WeeklyRoutine, PrenatalTask } from "@/lib/pregnancyAI";
import ExportPDFButton from "@/components/ExportPDFButton";

/* ── Static mock data ─────────────────────────────── */
const WEEK_DAYS = [
  { day: "Mon", date: 26, status: "done",    emoji: "💊", note: "Supplements"  },
  { day: "Tue", date: 27, status: "done",    emoji: "🧘", note: "Prenatal yoga" },
  { day: "Wed", date: 28, status: "done",    emoji: "💧", note: "Hydration"    },
  { day: "Thu", date: 29, status: "today",   emoji: "🥗", note: "Nutrition"    },
  { day: "Fri", date: 30, status: "upcoming",emoji: "🏃", note: "Light walk"   },
  { day: "Sat", date: 31, status: "upcoming",emoji: "😴", note: "Rest"         },
  { day: "Sun", date:  1, status: "upcoming",emoji: "❤️", note: "Self-care"    },
];

const SUPPLEMENTS = [
  { name: "Folic Acid",   dose: "400 mcg" },
  { name: "Iron",         dose: "27 mg"   },
  { name: "Calcium",      dose: "1000 mg" },
  { name: "Omega-3 DHA",  dose: "200 mg"  },
  { name: "Vitamin D3",   dose: "600 IU"  },
  { name: "Magnesium",    dose: "300 mg"  },
];

const APPOINTMENTS = [
  { name: "Anatomy Scan",        date: "Jun 5",  color: "var(--accent-rose)",   icon: "🔬" },
  { name: "Blood Glucose Test",  date: "Jun 12", color: "var(--accent-amber)",  icon: "🩸" },
  { name: "OB Checkup",          date: "Jun 19", color: "var(--accent-cyan)",   icon: "🏥" },
];

/* ── Generator setup ──────────────────────────────── */
const complications = [
  { id: "gestational_diabetes", label: "Gestational Diabetes" },
  { id: "preeclampsia",         label: "Pre-eclampsia"        },
  { id: "anemia",               label: "Anemia"               },
  { id: "placenta_previa",      label: "Placenta Previa"      },
  { id: "thyroid",              label: "Thyroid Disorder"     },
  { id: "none",                 label: "No Complications"     },
];

const defaultInput: PregnancyInput = {
  week: 20, weight: 65, age: 28,
  complications: [], activityLevel: "light", previousPregnancies: 0,
};

const priorityColors: Record<string, string> = {
  high: "var(--accent-rose)", medium: "var(--accent-amber)", low: "var(--accent-cyan)",
};

/* ── Interactive Checklist component (generator tab) ─ */
function InteractiveChecklist({ tasks, accentColor }: { tasks: PrenatalTask[]; accentColor: string }) {
  const [list, setList] = useState<PrenatalTask[]>(tasks);
  const [editId, setEditId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");

  const toggle = (id: string) => setList((prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));

  const grouped: Record<string, PrenatalTask[]> = {};
  list.forEach((t) => { if (!grouped[t.category]) grouped[t.category] = []; grouped[t.category].push(t); });

  const done = list.filter((t) => t.completed).length;
  const pct  = Math.round((done / list.length) * 100);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>Daily Progress</span>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: accentColor }}>{done}/{list.length} ({pct}%)</span>
          </div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%`, background: accentColor }} /></div>
        </div>
      </div>
      {Object.entries(grouped).map(([cat, catTasks]) => (
        <div key={cat} style={{ marginBottom: "1.25rem" }}>
          <div className="task-section-title">{cat}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            {catTasks.map((task) => {
              const isEditing = editId === task.id;
              return (
                <div key={task.id} className={`task-item ${task.completed ? "completed" : ""}`} style={{ alignItems: isEditing ? "flex-start" : "center" }}>
                  <div className="task-checkbox" style={{ borderColor: task.completed ? "var(--accent-emerald)" : priorityColors[task.priority] || "var(--text-muted)" }} onClick={() => !isEditing && toggle(task.id)}>
                    {task.completed && <Check size={11} color="white" />}
                  </div>
                  {isEditing ? (
                    <div style={{ flex: 1, display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      <input autoFocus value={editVal} onChange={(e) => setEditVal(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { setList((p) => p.map((t) => t.id === task.id ? { ...t, text: editVal } : t)); setEditId(null); } if (e.key === "Escape") setEditId(null); }}
                        className="form-input" style={{ flex: 1, padding: "0.4rem 0.75rem", fontSize: "0.85rem" }} />
                      <button className="btn btn-sm btn-primary btn-icon" onClick={() => { setList((p) => p.map((t) => t.id === task.id ? { ...t, text: editVal } : t)); setEditId(null); }}><Save size={13} /></button>
                      <button className="btn btn-sm btn-ghost btn-icon" onClick={() => setEditId(null)}><X size={13} /></button>
                    </div>
                  ) : (
                    <span className="task-text" style={{ flex: 1 }} onClick={() => toggle(task.id)}>{task.text}</span>
                  )}
                  {!isEditing && !task.completed && (
                    <button className="btn btn-ghost btn-icon" style={{ padding: "0.25rem", opacity: 0, transition: "opacity 0.15s" }}
                      onClick={() => { setEditId(task.id); setEditVal(task.text); }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}>
                      <Pencil size={12} />
                    </button>
                  )}
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: priorityColors[task.priority], flexShrink: 0, opacity: 0.7 }} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── MAIN PAGE ────────────────────────────────────── */
export default function PregnancyPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "generator">("overview");

  /* Generator state */
  const [input, setInput] = useState<PregnancyInput>(defaultInput);
  const [plan,  setPlan]  = useState<WeeklyRoutine | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedComplications, setSelectedComplications] = useState<Set<string>>(new Set(["none"]));

  /* Overview state */
  const [checkedSupplements, setCheckedSupplements] = useState<Set<number>>(new Set());

  const toggleComp = (id: string) => {
    setSelectedComplications((prev) => {
      const next = new Set(prev);
      if (id === "none") return new Set(["none"]);
      next.delete("none");
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleGenerate = async () => {
    setLoading(true);
    const finalInput = { ...input, complications: Array.from(selectedComplications).filter((c) => c !== "none") };
    await new Promise((r) => setTimeout(r, 1100));
    setPlan(generatePregnancyPlan(finalInput));
    setLoading(false);
    setTimeout(() => document.getElementById("pregnancy-output")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const trimColors: Record<number, string> = { 1: "var(--accent-cyan)", 2: "var(--accent-rose)", 3: "var(--accent-amber)" };
  const trimGrads:  Record<number, string> = { 1: "var(--grad-primary)", 2: "var(--grad-rose)", 3: "var(--grad-amber)" };
  const trimesterColor = plan ? trimColors[plan.trimester] : "var(--accent-rose)";
  const trimesterGrad  = plan ? trimGrads[plan.trimester]  : "var(--grad-rose)";

  const tabStyle = (tab: "overview" | "generator") => ({
    padding: "0.5rem 1.25rem", borderRadius: 100, fontSize: "0.875rem", fontWeight: 600 as const,
    cursor: "pointer", border: "none", transition: "all 0.2s ease",
    background: activeTab === tab ? "var(--grad-rose)" : "transparent",
    color:      activeTab === tab ? "white"           : "var(--text-muted)",
    boxShadow:  activeTab === tab ? "0 2px 12px rgba(244,63,94,0.25)" : "none",
  });

  /* Trimester progress */
  const currentWeek = 24;
  const totalWeeks  = 42;
  const weekPct     = Math.round((currentWeek / totalWeeks) * 100);

  return (
    <div>
      {/* ── Header ── */}
      <div className="page-header anim-fade-up">
        <div className="page-eyebrow"><Heart size={14} /> Specialized AI Module</div>
        <h1 className="page-title" style={{ background: "var(--grad-rose)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          Pregnancy &amp; Women&apos;s Health
        </h1>
        <p className="page-subtitle">
          Track your trimester journey, daily supplements, and upcoming appointments — or generate a personalized prenatal plan.
        </p>
      </div>

      {/* ── Tab Switcher ── */}
      <div style={{ display: "inline-flex", gap: "0.25rem", padding: "0.3rem", background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 100, marginBottom: "2rem" }}>
        <button style={tabStyle("overview")}  onClick={() => setActiveTab("overview")}>
          <Activity size={14} style={{ display: "inline", marginRight: 6 }} />Overview
        </button>
        <button style={tabStyle("generator")} onClick={() => setActiveTab("generator")}>
          <Baby size={14} style={{ display: "inline", marginRight: 6 }} />Prenatal Plan Generator
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
              { label: "Current Week",    value: "Week 24", sub: "2nd Trimester",    color: "var(--accent-rose)",   icon: "🤰" },
              { label: "Current Weight",  value: "68.5 kg", sub: "+4.5 kg gained",   color: "var(--accent-cyan)",   icon: "⚖️" },
              { label: "Next Appointment",value: "6 days",  sub: "Anatomy Scan",     color: "var(--accent-amber)",  icon: "📅" },
              { label: "Baby Movements",  value: "8",       sub: "movements today",  color: "var(--accent-emerald)",icon: "👶" },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{s.icon}</div>
                <div className="stat-value" style={{ color: s.color, fontSize: "1.4rem" }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Trimester Timeline */}
          <div className="glass-card anim-fade-up" style={{ padding: "1.5rem", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <Star size={16} color="var(--accent-rose)" />
              <h2 style={{ fontSize: "0.875rem", fontWeight: 700 }}>Trimester Journey</h2>
              <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--accent-rose)", fontWeight: 700 }}>Week {currentWeek} of {totalWeeks}</span>
            </div>

            {/* Phase labels */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "0.75rem" }}>
              {[
                { label: "1st Trimester", range: "Wks 1–13",  color: "var(--accent-cyan)",  active: false },
                { label: "2nd Trimester", range: "Wks 14–26", color: "var(--accent-rose)",  active: true  },
                { label: "3rd Trimester", range: "Wks 27–42", color: "var(--accent-amber)", active: false },
              ].map((t) => (
                <div key={t.label} style={{
                  padding: "0.625rem 0.875rem", borderRadius: 12, textAlign: "center",
                  background: t.active ? `${t.color}12` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${t.active ? `${t.color}40` : "var(--border-subtle)"}`,
                  boxShadow: t.active ? `0 0 16px ${t.color}20` : "none",
                }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: t.active ? t.color : "var(--text-muted)" }}>{t.label}</div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>{t.range}</div>
                  {t.active && <div style={{ fontSize: "0.6rem", color: t.color, marginTop: "0.25rem", fontWeight: 700 }}>● Current</div>}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div style={{ height: 10, background: "rgba(255,255,255,0.05)", borderRadius: 100, overflow: "hidden", marginBottom: "0.625rem" }}>
              <div style={{
                height: "100%", width: `${weekPct}%`,
                background: "linear-gradient(90deg, var(--accent-cyan), var(--accent-rose))",
                borderRadius: 100,
                boxShadow: "0 0 10px rgba(244,63,94,0.4)",
                transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)" }}>
              <span>Week 1</span>
              <span style={{ color: "var(--accent-rose)", fontWeight: 700 }}>Week {currentWeek} · {weekPct}% complete · {totalWeeks - currentWeek} weeks remaining</span>
              <span>Week 42</span>
            </div>
          </div>

          {/* 7-Day Wellness Calendar */}
          <div className="glass-card anim-fade-up anim-delay-1" style={{ padding: "1.5rem", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <Calendar size={16} color="var(--accent-rose)" />
              <h2 style={{ fontSize: "0.875rem", fontWeight: 700 }}>This Week&apos;s Wellness</h2>
              <span style={{ marginLeft: "auto", fontSize: "0.72rem", color: "var(--text-muted)" }}>May 26 – Jun 1</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.5rem" }}>
              {WEEK_DAYS.map((d) => {
                const isToday = d.status === "today";
                const isDone  = d.status === "done";
                return (
                  <div key={d.day} style={{
                    padding: "0.75rem 0.375rem", borderRadius: 12, textAlign: "center",
                    background: isToday ? "rgba(244,63,94,0.08)" : isDone ? "rgba(16,217,129,0.04)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isToday ? "rgba(244,63,94,0.35)" : isDone ? "rgba(16,217,129,0.15)" : "var(--border-subtle)"}`,
                    boxShadow: isToday ? "0 0 16px rgba(244,63,94,0.15)" : "none",
                  }}>
                    <div style={{ fontSize: "0.6rem", fontWeight: 600, color: isToday ? "var(--accent-rose)" : "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.2rem" }}>{d.day}</div>
                    <div style={{ fontSize: "1rem", fontWeight: 800, color: isToday ? "var(--accent-rose)" : "var(--text-primary)", marginBottom: "0.3rem" }}>{d.date}</div>
                    <div style={{ fontSize: "1rem", marginBottom: "0.2rem" }}>{isDone ? "✅" : isToday ? "🔵" : "⭕"}</div>
                    <div style={{ fontSize: "0.9rem" }}>{d.emoji}</div>
                    <div style={{ fontSize: "0.55rem", color: "var(--text-muted)", marginTop: "0.2rem", lineHeight: 1.2 }}>{d.note}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Supplements + Baby size side by side */}
          <div className="grid-2 anim-fade-up anim-delay-1" style={{ marginBottom: "1.25rem" }}>
            {/* Supplements Checklist */}
            <div className="glass-card" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
                <Pill size={16} color="var(--accent-violet-light)" />
                <h2 style={{ fontSize: "0.875rem", fontWeight: 700 }}>Today&apos;s Supplements</h2>
                <span style={{ marginLeft: "auto", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  {checkedSupplements.size}/{SUPPLEMENTS.length} taken
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {SUPPLEMENTS.map((s, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    padding: "0.625rem 0.75rem", borderRadius: 10, cursor: "pointer",
                    background: checkedSupplements.has(i) ? "rgba(16,217,129,0.06)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${checkedSupplements.has(i) ? "rgba(16,217,129,0.2)" : "var(--border-subtle)"}`,
                    transition: "all 0.2s ease",
                  }} onClick={() => setCheckedSupplements((prev) => { const next = new Set(prev); next.has(i) ? next.delete(i) : next.add(i); return next; })}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                      border: `2px solid ${checkedSupplements.has(i) ? "var(--accent-emerald)" : "rgba(255,255,255,0.2)"}`,
                      background: checkedSupplements.has(i) ? "var(--accent-emerald)" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {checkedSupplements.has(i) && <Check size={11} color="white" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.82rem", fontWeight: 600, color: checkedSupplements.has(i) ? "var(--text-muted)" : "var(--text-primary)", textDecoration: checkedSupplements.has(i) ? "line-through" : "none" }}>{s.name}</div>
                      <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{s.dose}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Baby Size Card */}
              <div style={{
                padding: "1.25rem", borderRadius: 20,
                background: "rgba(244,63,94,0.05)", border: "1px solid rgba(244,63,94,0.15)",
              }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-rose)", marginBottom: "0.875rem" }}>👶 Baby at Week 24</div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={{ fontSize: "3rem" }}>🌽</div>
                  <div>
                    <div style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "0.25rem" }}>Size of an Ear of Corn</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Facial features becoming distinct; hearing developing</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  {[{ label: "Weight", val: "~600g" }, { label: "Length", val: "~30 cm" }].map((m) => (
                    <div key={m.label} style={{ padding: "0.5rem 0.75rem", background: "rgba(244,63,94,0.06)", borderRadius: 8, textAlign: "center" }}>
                      <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--accent-rose)", fontFamily: "Sora,sans-serif" }}>{m.val}</div>
                      <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="glass-card" style={{ padding: "1.25rem", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                  <Clock size={15} color="var(--accent-cyan)" />
                  <h2 style={{ fontSize: "0.875rem", fontWeight: 700 }}>Upcoming Appointments</h2>
                </div>
                {APPOINTMENTS.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: i < APPOINTMENTS.length - 1 ? "0.75rem" : 0, padding: "0.625rem 0.75rem", background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid var(--border-subtle)" }}>
                    <span style={{ fontSize: "1.1rem" }}>{a.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.82rem", fontWeight: 600 }}>{a.name}</div>
                    </div>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: a.color, background: `${a.color}15`, border: `1px solid ${a.color}30`, padding: "0.2rem 0.5rem", borderRadius: 6 }}>{a.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ padding: "1.25rem 1.5rem", borderRadius: 16, background: "linear-gradient(135deg, rgba(244,63,94,0.08), rgba(124,58,237,0.08))", border: "1px solid rgba(244,63,94,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>Generate your week-by-week prenatal plan</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>Get a fully tailored routine for your trimester, complications, and activity level.</div>
            </div>
            <button className="btn btn-lg" style={{ background: "var(--grad-rose)", color: "white", gap: "0.5rem", whiteSpace: "nowrap" }} onClick={() => setActiveTab("generator")}>
              <Sparkles size={16} /> Generate Plan
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          GENERATOR TAB
      ══════════════════════════════════════ */}
      {activeTab === "generator" && (
        <div className="anim-fade-in">
          {!plan && (
            <div className="glass-card p-8 anim-fade-up anim-delay-1" style={{ maxWidth: "720px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.75rem" }}>
                <Baby size={18} color="var(--accent-rose)" />
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Your Pregnancy Profile</h2>
              </div>
              <div className="form-grid" style={{ gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div className="form-group">
                  <label className="form-label">Current Pregnancy Week</label>
                  <input type="number" className="form-input" value={input.week} min={1} max={42} onChange={(e) => setInput((p) => ({ ...p, week: Number(e.target.value) }))} placeholder="20" />
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    {input.week <= 13 ? "1st Trimester" : input.week <= 26 ? "2nd Trimester" : "3rd Trimester"}
                  </span>
                </div>
                <div className="form-group">
                  <label className="form-label">Current Weight (kg)</label>
                  <input type="number" className="form-input" value={input.weight} min={40} max={200} onChange={(e) => setInput((p) => ({ ...p, weight: Number(e.target.value) }))} placeholder="65" />
                </div>
                <div className="form-group">
                  <label className="form-label">Age (years)</label>
                  <input type="number" className="form-input" value={input.age} min={15} max={55} onChange={(e) => setInput((p) => ({ ...p, age: Number(e.target.value) }))} placeholder="28" />
                </div>
                <div className="form-group">
                  <label className="form-label">Activity Level</label>
                  <select className="form-select" value={input.activityLevel} onChange={(e) => setInput((p) => ({ ...p, activityLevel: e.target.value as PregnancyInput["activityLevel"] }))}>
                    <option value="sedentary">Sedentary (bed rest / limited)</option>
                    <option value="light">Light (gentle walking)</option>
                    <option value="moderate">Moderate (active lifestyle)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Previous Pregnancies</label>
                  <select className="form-select" value={input.previousPregnancies} onChange={(e) => setInput((p) => ({ ...p, previousPregnancies: Number(e.target.value) }))}>
                    <option value={0}>First pregnancy</option>
                    <option value={1}>1 previous pregnancy</option>
                    <option value={2}>2 previous pregnancies</option>
                    <option value={3}>3 or more</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                <label className="form-label">Complications (if any)</label>
                <div className="tag-group" style={{ marginTop: "0.375rem" }}>
                  {complications.map((c) => (
                    <label key={c.id} style={{ cursor: "pointer" }}>
                      <input type="checkbox" className="tag-checkbox" checked={selectedComplications.has(c.id)} onChange={() => toggleComp(c.id)} />
                      <span className="tag-label">{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: "2rem" }}>
                <label className="form-label">Pregnancy Week: {input.week}</label>
                <input type="range" min={1} max={42} value={input.week} onChange={(e) => setInput((p) => ({ ...p, week: Number(e.target.value) }))} style={{ width: "100%", accentColor: "var(--accent-rose)", cursor: "pointer" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                  <span>Wk 1 (1st Tri)</span><span>Wk 13</span><span>Wk 26</span><span>Wk 42 (Full Term)</span>
                </div>
              </div>
              <button className="btn btn-lg w-full" style={{ background: "var(--grad-rose)", color: "white", boxShadow: "0 4px 20px rgba(244,63,94,0.3)" }} onClick={handleGenerate} disabled={loading}>
                {loading ? <><div className="spinner" style={{ width: 18, height: 18, borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white" }} /> Generating your plan…</> : <><Baby size={18} /> Generate My Prenatal Plan <ChevronRight size={16} /></>}
              </button>
            </div>
          )}

          {loading && (
            <div className="anim-fade-in" style={{ textAlign: "center", padding: "3rem 0" }}>
              <div className="spinner" style={{ width: 40, height: 40, margin: "0 auto 1.25rem", borderColor: "rgba(244,63,94,0.2)", borderTopColor: "var(--accent-rose)" }} />
              <p style={{ color: "var(--text-secondary)" }}>Creating your personalized prenatal plan…</p>
            </div>
          )}

          {plan && !loading && (
            <div id="pregnancy-output" className="anim-scale-in">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.25rem" }}>Week {plan.week} Pregnancy Plan ✨</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{plan.theme}</p>
                </div>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <ExportPDFButton targetId="pregnancy-plan-content" filename="pregnancy-plan" title="Pregnancy & Women's Health Plan" />
                  <button className="btn btn-ghost" onClick={() => { setPlan(null); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ gap: "0.5rem" }}><RotateCcw size={15} /> New Plan</button>
                </div>
              </div>
              <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "1.5rem", background: "rgba(244,63,94,0.05)", borderColor: "rgba(244,63,94,0.15)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
                  <div style={{ fontSize: "3rem" }}>👶</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent-rose)", marginBottom: "0.25rem" }}>Baby at Week {plan.week}</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.25rem" }}>{plan.babySize}</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{plan.babyDev}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.375rem", textTransform: "uppercase" }}>Trimester</div>
                    <span className="badge" style={{ background: `${trimesterColor}20`, color: trimesterColor, border: `1px solid ${trimesterColor}40`, fontSize: "0.875rem", padding: "0.4rem 1rem" }}>
                      {plan.trimester === 1 ? "1st" : plan.trimester === 2 ? "2nd" : "3rd"} Trimester
                    </span>
                  </div>
                </div>
              </div>
              {plan.warnings.length > 0 && plan.warnings.map((w, i) => (
                <div key={i} style={{ display: "flex", gap: "0.875rem", padding: "0.875rem 1.125rem", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "12px", marginBottom: "0.75rem" }}>
                  <AlertTriangle size={16} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{w}</p>
                </div>
              ))}
              <div className="grid-3" style={{ marginBottom: "1.5rem" }}>
                <div className="glass-card" style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}><Pill size={16} color="var(--accent-violet-light)" /><h3 style={{ fontSize: "0.875rem", fontWeight: 700 }}>Daily Supplements</h3></div>
                  {plan.supplements.map((s, i) => (<div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}><span style={{ color: "var(--accent-violet-light)", flexShrink: 0 }}>✦</span><span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{s}</span></div>))}
                </div>
                <div className="glass-card" style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}><Dumbbell size={16} color="var(--accent-emerald)" /><h3 style={{ fontSize: "0.875rem", fontWeight: 700 }}>Safe Exercises</h3></div>
                  {plan.exercises.map((e, i) => (<div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}><span style={{ color: "var(--accent-emerald)", flexShrink: 0 }}>✦</span><span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{e}</span></div>))}
                </div>
                <div className="glass-card" style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}><Calendar size={16} color="var(--accent-cyan)" /><h3 style={{ fontSize: "0.875rem", fontWeight: 700 }}>Appointments</h3></div>
                  {plan.appointments.map((a, i) => (<div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}><span style={{ color: "var(--accent-cyan)", flexShrink: 0 }}>✦</span><span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{a}</span></div>))}
                </div>
              </div>
              <div id="pregnancy-plan-content" className="glass-card" style={{ padding: "1.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                  <Heart size={18} color="var(--accent-rose)" />
                  <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>Daily Routine Checklist</h3>
                  <span className="badge badge-rose" style={{ marginLeft: "auto" }}>Week {plan.week}</span>
                </div>
                <InteractiveChecklist tasks={plan.tasks} accentColor={trimesterGrad.includes("rose") ? "var(--accent-rose)" : trimesterColor} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
