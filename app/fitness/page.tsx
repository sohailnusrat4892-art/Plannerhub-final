"use client";

import { useState } from "react";
import { Dumbbell, Sparkles, AlertTriangle, Info, ChevronRight, RotateCcw, Activity, Calendar, CheckCircle2, Zap, TrendingUp, Check } from "lucide-react";
import { generateFitnessPlan, FitnessInput, FitnessPlan } from "@/lib/fitnessAI";
import PlannerOutput from "@/components/PlannerOutput";
import ExportPDFButton from "@/components/ExportPDFButton";

const conditionsList = [
  { id: "diabetes", label: "Diabetes" },
  { id: "hypertension", label: "Hypertension" },
  { id: "heart_disease", label: "Heart Disease" },
  { id: "pcos", label: "PCOS" },
  { id: "thyroid", label: "Thyroid" },
  { id: "asthma", label: "Asthma" },
  { id: "arthritis", label: "Arthritis" },
  { id: "none", label: "None" },
];

const defaultInput: FitnessInput = {
  age: 28,
  height: 170,
  weight: 75,
  goal: "weight_loss",
  conditions: [],
  activityLevel: "moderate",
  gender: "male",
};

function BMIGauge({ bmi, category }: { bmi: number; category: string }) {
  const pct = Math.min(100, Math.max(0, ((bmi - 10) / 30) * 100));
  const color =
    bmi < 18.5 ? "var(--accent-cyan)" :
    bmi < 25 ? "var(--accent-emerald)" :
    bmi < 30 ? "var(--accent-amber)" :
    "var(--accent-rose)";

  return (
    <div style={{ textAlign: "center", padding: "1.5rem" }} className="glass-card">
      <div style={{ fontSize: "2.5rem", fontWeight: 800, color, fontFamily: "var(--font-sora)", lineHeight: 1 }}>{bmi.toFixed(1)}</div>
      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem", marginBottom: "0.75rem" }}>BMI</div>
      <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden", marginBottom: "0.5rem" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 100, transition: "width 1s ease" }} />
      </div>
      <span className="badge" style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>{category}</span>
    </div>
  );
}

export default function FitnessPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "generator">("overview");

  // Generator State
  const [input, setInput] = useState<FitnessInput>(defaultInput);
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<FitnessPlan | null>(null);

  // Overview State
  const [checkedExercises, setCheckedExercises] = useState<Record<string, boolean>>({});

  const handleToggleCondition = (id: string) => {
    if (id === "none") {
      setInput({ ...input, conditions: ["none"] });
      return;
    }
    const newConds = input.conditions.filter((c) => c !== "none");
    if (newConds.includes(id)) {
      setInput({ ...input, conditions: newConds.filter((c) => c !== id) });
    } else {
      setInput({ ...input, conditions: [...newConds, id] });
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generated = await generateFitnessPlan(input);
      setPlan(generated);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const weekDays = [
    { day: "Mon", date: "12", done: true, icon: "💪" },
    { day: "Tue", date: "13", done: false, icon: "🏃" },
    { day: "Wed", date: "14", done: true, icon: "🧘" },
    { day: "Thu", date: "15", done: false, icon: "💪", today: true },
    { day: "Fri", date: "16", done: true, icon: "🏃" },
    { day: "Sat", date: "17", done: false, icon: "🧘" },
    { day: "Sun", date: "18", done: false, icon: "💤" },
  ];

  return (
    <div className="anim-fade-in">
      {/* HEADER */}
      <div className="page-header anim-fade-up">
        <div>
          <div className="page-eyebrow">
            <Activity size={16} /> Fitness & Health
          </div>
          <h1 className="page-title">Personalized AI Fitness</h1>
          <p className="page-subtitle">Track your daily stats and generate hyper-personalized fitness plans.</p>
        </div>
        {plan && activeTab === "generator" && (
          <ExportPDFButton targetId="fitness-plan-output" filename="Fitness-Plan.pdf" />
        )}
      </div>

      {/* TABS */}
      <div className="anim-fade-up anim-delay-1" style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", background: "var(--bg-card)", padding: "0.5rem", borderRadius: "100px", width: "fit-content", border: "1px solid var(--border-subtle)" }}>
        <button
          onClick={() => setActiveTab("overview")}
          style={{
            padding: "0.5rem 1.25rem", borderRadius: "100px", fontSize: "0.9rem", fontWeight: 600, border: "none", cursor: "pointer",
            background: activeTab === "overview" ? "var(--accent-cyan)" : "transparent",
            color: activeTab === "overview" ? "#000" : "var(--text-muted)",
            transition: "all 0.2s"
          }}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("generator")}
          style={{
            padding: "0.5rem 1.25rem", borderRadius: "100px", fontSize: "0.9rem", fontWeight: 600, border: "none", cursor: "pointer",
            background: activeTab === "generator" ? "var(--accent-cyan)" : "transparent",
            color: activeTab === "generator" ? "#000" : "var(--text-muted)",
            transition: "all 0.2s"
          }}
        >
          AI Plan Generator
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="anim-fade-up anim-delay-1" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* STATS ROW */}
          <div className="grid-4">
            <div className="stat-card">
              <div className="stat-label">Today's Calories</div>
              <div className="stat-value" style={{ color: "var(--accent-cyan)" }}>2,150 <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>kcal</span></div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Target: 2,400</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Active Streak</div>
              <div className="stat-value" style={{ color: "var(--accent-emerald)" }}>12 <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>days</span></div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Personal best: 24</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Weekly Workouts</div>
              <div className="stat-value" style={{ color: "var(--accent-violet)" }}>4 <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>/ 5</span></div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>On track</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">BMI</div>
              <div className="stat-value" style={{ color: "var(--accent-amber)" }}>23.4</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Normal weight</div>
            </div>
          </div>

          {/* 7-DAY CALENDAR */}
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Calendar size={18} color="var(--accent-cyan)" /> Activity Calendar
            </h3>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {weekDays.map((d, i) => (
                <div key={i} style={{
                  flex: 1, minWidth: "60px", padding: "1rem 0.5rem", borderRadius: "12px", textAlign: "center",
                  background: d.today ? "rgba(34, 211, 238, 0.1)" : "rgba(255,255,255,0.02)",
                  border: d.today ? "1px solid var(--accent-cyan)" : "1px solid var(--border-subtle)"
                }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>{d.day}</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>{d.date}</div>
                  <div style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{d.icon}</div>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: d.done ? "var(--accent-emerald)" : "var(--border-subtle)", margin: "0 auto" }} />
                </div>
              ))}
            </div>
          </div>

          <div className="grid-2">
            {/* MACROS */}
            <div className="glass-card" style={{ padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Zap size={18} color="var(--accent-amber)" /> Today's Macros
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  { label: "Protein", current: 98, target: 150, color: "var(--accent-cyan)" },
                  { label: "Carbs", current: 180, target: 220, color: "var(--accent-amber)" },
                  { label: "Fat", current: 45, target: 70, color: "var(--accent-violet)" },
                  { label: "Fiber", current: 22, target: 30, color: "var(--accent-emerald)" },
                ].map((m) => (
                  <div key={m.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                      <span style={{ color: "var(--text-muted)" }}>{m.label}</span>
                      <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{m.current}g <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>/ {m.target}g</span></span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(m.current/m.target)*100}%`, background: m.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WORKOUT PREVIEW */}
            <div className="glass-card" style={{ padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Dumbbell size={18} color="var(--accent-rose)" /> Today's Workout: Upper Body
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  "Bench Press 3×10",
                  "Pull-Ups 3×8",
                  "Shoulder Press 3×12",
                  "Tricep Dips 3×15"
                ].map((ex) => (
                  <label key={ex} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid var(--border-subtle)", cursor: "pointer" }}>
                    <input 
                      type="checkbox" 
                      checked={checkedExercises[ex] || false}
                      onChange={(e) => setCheckedExercises({...checkedExercises, [ex]: e.target.checked})}
                      style={{ width: "18px", height: "18px", accentColor: "var(--accent-cyan)" }}
                    />
                    <span style={{ fontSize: "0.95rem", color: checkedExercises[ex] ? "var(--text-muted)" : "var(--text-primary)", textDecoration: checkedExercises[ex] ? "line-through" : "none" }}>
                      {ex}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "generator" && (
        <div className="grid-2 anim-fade-up anim-delay-1">
          {/* LEFT: FORM */}
          <div className="glass-card" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Sparkles size={20} color="var(--accent-cyan)" /> AI Plan Parameters
            </h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Age</label>
                <input type="number" className="form-input" value={input.age} onChange={e => setInput({...input, age: Number(e.target.value)})} />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-select" value={input.gender} onChange={e => setInput({...input, gender: e.target.value as any})}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input type="number" className="form-input" value={input.height} onChange={e => setInput({...input, height: Number(e.target.value)})} />
              </div>
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input type="number" className="form-input" value={input.weight} onChange={e => setInput({...input, weight: Number(e.target.value)})} />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: "1.5rem" }}>
              <label className="form-label">Primary Goal</label>
              <select className="form-select" value={input.goal} onChange={e => setInput({...input, goal: e.target.value as any})}>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
                <option value="endurance">Endurance</option>
              </select>
            </div>

            <div className="form-group" style={{ marginTop: "1.5rem" }}>
              <label className="form-label">Activity Level</label>
              <select className="form-select" value={input.activityLevel} onChange={e => setInput({...input, activityLevel: e.target.value as any})}>
                <option value="sedentary">Sedentary (office job, no exercise)</option>
                <option value="light">Light (1-2 days/week)</option>
                <option value="moderate">Moderate (3-5 days/week)</option>
                <option value="active">Active (6-7 days/week)</option>
                <option value="athlete">Athlete (2x per day)</option>
              </select>
            </div>

            <div className="form-group" style={{ marginTop: "1.5rem" }}>
              <label className="form-label">Medical Conditions</label>
              <div className="tag-group">
                {conditionsList.map(c => (
                  <label key={c.id} className="tag-label">
                    <input type="checkbox" className="tag-checkbox" checked={input.conditions.includes(c.id)} onChange={() => handleToggleCondition(c.id)} />
                    {c.label}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? <div className="spinner" /> : <Sparkles size={18} />}
                {isGenerating ? "Analyzing..." : "Generate AI Plan"}
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => { setInput(defaultInput); setPlan(null); }}>
                <RotateCcw size={18} />
              </button>
            </div>
          </div>

          {/* RIGHT: OUTPUT */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* BMI PREVIEW */}
            {!plan && !isGenerating && (
              <BMIGauge bmi={input.weight / Math.pow(input.height / 100, 2)} category={input.weight / Math.pow(input.height / 100, 2) < 18.5 ? "Underweight" : input.weight / Math.pow(input.height / 100, 2) < 25 ? "Normal" : input.weight / Math.pow(input.height / 100, 2) < 30 ? "Overweight" : "Obese"} />
            )}

            {/* PLAN RESULT */}
            {isGenerating && (
              <div className="glass-card" style={{ padding: "3rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                <div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} />
                <h3 style={{ fontSize: "1.2rem", fontWeight: 600 }}>Calculating optimal macros...</h3>
                <p style={{ color: "var(--text-muted)" }}>Our AI is processing your biomechanical profile.</p>
              </div>
            )}

            {plan && !isGenerating && (
              <div id="fitness-plan-output" className="anim-scale-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                
                {plan.warnings && plan.warnings.length > 0 && (
                  <div style={{ padding: "1rem", background: "rgba(244, 63, 94, 0.1)", border: "1px solid rgba(244, 63, 94, 0.3)", borderRadius: "12px", display: "flex", gap: "1rem" }}>
                    <AlertTriangle size={24} color="var(--accent-rose)" style={{ flexShrink: 0 }} />
                    <div>
                      <h4 style={{ fontWeight: 600, color: "var(--accent-rose)", marginBottom: "0.5rem" }}>Medical Considerations</h4>
                      <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.9rem", color: "var(--text-primary)" }}>
                        {plan.warnings.map((w, i) => <li key={i}>{w}</li>)}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="grid-2">
                  <div className="stat-card">
                    <div className="stat-label">Daily Calories</div>
                    <div className="stat-value" style={{ color: "var(--accent-cyan)" }}>{plan.dailyCalories}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Weekly Goal</div>
                    <div className="stat-value" style={{ color: "var(--accent-emerald)", fontSize: "1.2rem", lineHeight: 1.2 }}>{plan.weeklyGoal}</div>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: "1.5rem" }}>
                  <PlannerOutput days={plan.days} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}