"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  ScanLine, Upload, Camera, Sparkles, RotateCcw, Plus,
  CheckCircle, Zap, Shield, Flame, ClipboardPaste,
  FlaskConical, Star, TrendingUp, Activity,
} from "lucide-react";
import { analyzeFoodImage, FoodAnalysis } from "@/lib/foodAI";
import ExportPDFButton from "@/components/ExportPDFButton";

/* ════════════════════════════════════════════════════════
   COUNT-UP HOOK
════════════════════════════════════════════════════════ */
function useCountUp(target: number, duration = 1200, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    let raf: number;
    t = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const e = 1 - Math.pow(1 - p, 3);          // ease-out cubic
        setVal(Math.round(e * target));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [target, duration, delay]);
  return val;
}

/* ════════════════════════════════════════════════════════
   SCAN STEPS
════════════════════════════════════════════════════════ */
const STEPS = [
  { label: "Detecting food items…",        pct: 16,  icon: "🔍", color: "#00d4ff" },
  { label: "Isolating ingredients…",       pct: 32,  icon: "⚗️",  color: "#a855f7" },
  { label: "Estimating portion size…",     pct: 50,  icon: "⚖️",  color: "#10d981" },
  { label: "Calculating macronutrients…",  pct: 66,  icon: "🧬", color: "#f59e0b" },
  { label: "Mapping vitamins & minerals…", pct: 82,  icon: "💊", color: "#f43f5e" },
  { label: "Generating health report…",    pct: 100, icon: "✅", color: "#10d981" },
];

/* ════════════════════════════════════════════════════════
   SCAN ANIMATION
════════════════════════════════════════════════════════ */
function ScanAnimation({ imageUrl }: { imageUrl: string }) {
  const [stepIdx,  setStepIdx]  = useState(0);
  const [scanY,    setScanY]    = useState(0);
  const [pct,      setPct]      = useState(0);

  useEffect(() => {
    /* Bouncing scan line */
    let dir = 1;
    const scanInterval = setInterval(() => {
      setScanY((y) => {
        const next = y + dir * 2;
        if (next >= 100) dir = -1;
        if (next <= 0)   dir = 1;
        return Math.max(0, Math.min(100, next));
      });
    }, 16);

    /* Step progression over 2.2 s (matches foodAI delay) */
    const totalMs = 2000;
    const perStep = totalMs / STEPS.length;
    const timers = STEPS.map((s, i) =>
      setTimeout(() => { setStepIdx(i); setPct(s.pct); }, i * perStep)
    );

    return () => { clearInterval(scanInterval); timers.forEach(clearTimeout); };
  }, []);

  const step = STEPS[stepIdx];

  return (
    <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", userSelect: "none" }}>
      {/* Meal image — darkened */}
      <img src={imageUrl} alt="Scanning" style={{ width: "100%", height: 340, objectFit: "cover", display: "block", filter: "brightness(0.6) saturate(1.2)" }} />

      {/* Scan line */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: `${scanY}%`,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${step.color}80 20%, ${step.color} 50%, ${step.color}80 80%, transparent)`,
        boxShadow: `0 0 18px 5px ${step.color}60`,
        pointerEvents: "none",
      }} />

      {/* Glow at scan-line position */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: `${scanY}%`,
        height: 60, marginTop: -30,
        background: `radial-gradient(ellipse at center, ${step.color}15 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Three pulsing rings */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            position: "absolute",
            width:  80 + i * 70, height: 80 + i * 70,
            border: `1px solid ${step.color}35`,
            borderRadius: "50%",
            animation: `ph-pulse 2.2s ease-out ${i * 0.45}s infinite`,
          }} />
        ))}
        {/* Centre beacon */}
        <div style={{
          width: 12, height: 12, borderRadius: "50%",
          background: step.color,
          boxShadow: `0 0 20px 6px ${step.color}80`,
          transition: "background 0.4s, box-shadow 0.4s",
        }} />
      </div>

      {/* Corner brackets */}
      {(["tl","tr","bl","br"] as const).map((c) => {
        const isL = c[1] === "l"; const isT = c[0] === "t";
        return (
          <div key={c} style={{
            position: "absolute",
            [isT ? "top" : "bottom"]: 14,
            [isL ? "left" : "right"]: 14,
            width: 24, height: 24,
            borderTop:    isT  ? `2px solid ${step.color}` : "none",
            borderBottom: !isT ? `2px solid ${step.color}` : "none",
            borderLeft:   isL  ? `2px solid ${step.color}` : "none",
            borderRight:  !isL ? `2px solid ${step.color}` : "none",
            borderRadius: `${isT && isL ? "4px 0 0 0" : isT ? "0 4px 0 0" : isL ? "0 0 0 4px" : "0 0 4px 0"}`,
            transition: "border-color 0.4s",
          }} />
        );
      })}

      {/* Bottom status overlay */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(transparent, rgba(7,11,20,0.97))",
        padding: "2.5rem 1.25rem 1.25rem",
      }}>
        {/* Progress bar */}
        <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 100, marginBottom: "0.75rem", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: `linear-gradient(90deg, #00d4ff, ${step.color})`,
            borderRadius: 100, boxShadow: `0 0 8px ${step.color}80`,
            transition: "width 0.4s cubic-bezier(0.4,0,0.2,1), background 0.4s",
          }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>{step.icon}</span>
            <span style={{ color: "var(--text-primary)" }}>{step.label}</span>
          </span>
          <span style={{ fontSize: "0.8rem", fontWeight: 800, color: step.color, fontFamily: "Sora, sans-serif", transition: "color 0.4s" }}>
            {pct}%
          </span>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   MACRO CARD  (Calorie ring + 4 macro bars)
════════════════════════════════════════════════════════ */
const MACROS = [
  { key: "protein" as const, label: "Protein",       unit: "g",   max: 60,  color: "#00d4ff", icon: "🥩" },
  { key: "carbs"   as const, label: "Carbohydrates", unit: "g",   max: 130, color: "#f59e0b", icon: "🌾" },
  { key: "fat"     as const, label: "Total Fat",     unit: "g",   max: 65,  color: "#a855f7", icon: "💧" },
  { key: "fiber"   as const, label: "Dietary Fiber", unit: "g",   max: 30,  color: "#10d981", icon: "🌿" },
];

function CalorieRing({ calories }: { calories: number }) {
  const counted = useCountUp(calories, 1200);
  const pct     = Math.min(1, calories / 2000);
  const r       = 68; const circ = 2 * Math.PI * r;
  const offset  = circ * (1 - pct);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
      <div style={{ position: "relative", width: 156, height: 156 }}>
        <svg width={156} height={156} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={78} cy={78} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={13} />
          <circle cx={78} cy={78} r={r} fill="none" stroke="url(#calGrad)" strokeWidth={13}
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1)" }} />
          <defs>
            <linearGradient id="calGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d4ff" /><stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{
            fontSize: "2rem", fontWeight: 900, lineHeight: 1, fontFamily: "Sora, sans-serif",
            background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>{counted}</span>
          <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 600 }}>kcal</span>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
        <div style={{ fontSize: "0.875rem", fontWeight: 700 }}>Total Calories</div>
        <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
          {Math.round(pct * 100)}% of 2,000 kcal daily goal
        </div>
      </div>
    </div>
  );
}

function MacroBar({ label, value, unit, max, color, icon, delay = 0 }: {
  label: string; value: number; unit: string; max: number; color: string; icon: string; delay?: number;
}) {
  const counted = useCountUp(value, 1000, delay);
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: `${color}15`, border: `1px solid ${color}30`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>{label}</span>
          <span style={{ fontSize: "0.82rem", fontWeight: 800, color, fontFamily: "Sora, sans-serif" }}>
            {counted}<span style={{ fontSize: "0.62rem", fontWeight: 600, color: "var(--text-muted)", marginLeft: 1 }}>{unit}</span>
          </span>
        </div>
        <div style={{ height: 7, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 100,
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            boxShadow: `0 0 8px ${color}60`,
            width: `${pct}%`,
            transition: `width 1s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
          }} />
        </div>
        <div style={{ fontSize: "0.62rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
          {Math.round(pct)}% of daily target
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   HEALTH SCORE RING
════════════════════════════════════════════════════════ */
function HealthRing({ score, label }: { score: number; label: string }) {
  const counted = useCountUp(score, 900, 200);
  const color   = score >= 80 ? "#10d981" : score >= 65 ? "#00d4ff" : score >= 50 ? "#f59e0b" : "#f43f5e";
  const r       = 22; const circ = 2 * Math.PI * r;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "1rem",
      padding: "1rem 1.25rem", borderRadius: 16,
      background: `${color}0d`, border: `1px solid ${color}25`,
    }}>
      <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
        <svg width={56} height={56} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={28} cy={28} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={7} />
          <circle cx={28} cy={28} r={r} fill="none" stroke={color} strokeWidth={7}
            strokeLinecap="round" strokeDasharray={circ}
            strokeDashoffset={circ * (1 - score / 100)}
            style={{ transition: "stroke-dashoffset 1s ease" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "0.9rem", fontWeight: 900, color, fontFamily: "Sora, sans-serif" }}>{counted}</span>
        </div>
      </div>
      <div>
        <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color, marginBottom: "0.2rem" }}>Health Score</div>
        <div style={{ fontSize: "0.825rem", fontWeight: 600, color: "var(--text-primary)" }}>{label}</div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   VITAMIN PILL
════════════════════════════════════════════════════════ */
function VitaminPill({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  const counted = useCountUp(value, 800, 500);
  return (
    <div style={{
      padding: "0.75rem 0.875rem", borderRadius: 12,
      background: `${color}0d`, border: `1px solid ${color}22`,
      display: "flex", flexDirection: "column", alignItems: "center", minWidth: 74,
    }}>
      <span style={{ fontSize: "1.1rem", fontWeight: 800, color, fontFamily: "Sora, sans-serif", lineHeight: 1 }}>{counted}</span>
      <span style={{ fontSize: "0.58rem", color, fontWeight: 600, marginTop: 2 }}>{unit}</span>
      <span style={{ fontSize: "0.62rem", color: "var(--text-muted)", marginTop: 3 }}>{label}</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   RESULTS CARD
════════════════════════════════════════════════════════ */
function ResultsCard({ analysis, onReset }: { analysis: FoodAnalysis; onReset: () => void }) {
  const [added, setAdded] = useState(false);

  return (
    <div id="food-result" className="anim-scale-in" style={{ maxWidth: 800, margin: "0 auto" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
            <CheckCircle size={18} color="var(--accent-emerald)" />
            <span style={{ fontSize: "1.2rem", fontWeight: 800 }}>Analysis Complete</span>
          </div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            AI confidence: <strong style={{ color: "var(--accent-emerald)" }}>{analysis.confidence}%</strong>
            &nbsp;·&nbsp;Serving: {analysis.servingSize}
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
          <ExportPDFButton targetId="food-pdf-content" filename="nutrition-report" title="AI Food Analysis Report" />
          <button className="btn btn-ghost" onClick={onReset} style={{ gap: "0.5rem" }}>
            <RotateCcw size={14} /> Scan Again
          </button>
        </div>
      </div>

      <div id="food-pdf-content">
        {/* Food identity + health score */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "start", marginBottom: "1.25rem" }}>
          <div style={{ padding: "1.25rem 1.5rem", background: "rgba(16,217,129,0.05)", border: "1px solid rgba(16,217,129,0.15)", borderRadius: 18 }}>
            <div style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-emerald)", marginBottom: "0.35rem" }}>🔬 AI Detected</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: "0.25rem", fontFamily: "Sora, sans-serif" }}>{analysis.detectedFood}</div>
            <div style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{analysis.recommendation}</div>
          </div>
          <HealthRing score={analysis.healthScore} label={analysis.healthLabel} />
        </div>

        {/* ── Calorie ring + Macro bars ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "auto 1fr", gap: "2rem", alignItems: "center",
          padding: "1.75rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)", borderRadius: 20,
          marginBottom: "1.25rem",
        }}>
          <CalorieRing calories={analysis.calories} />
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {MACROS.map((m, i) => (
              <MacroBar key={m.key} label={m.label} value={analysis[m.key]} unit={m.unit} max={m.max} color={m.color} icon={m.icon} delay={i * 100} />
            ))}
          </div>
        </div>

        {/* ── Additional stats row ── */}
        <div className="grid-4" style={{ marginBottom: "1.25rem" }}>
          {[
            { label: "Sugar",     value: analysis.sugar,    unit: "g",  color: "#f43f5e", icon: "🍭" },
            { label: "Sodium",    value: analysis.sodium,   unit: "mg", color: analysis.sodium > 900 ? "#f59e0b" : "#94a3b8", icon: "🧂" },
            { label: "Potassium", value: analysis.potassium,unit: "mg", color: "#22d3ee", icon: "⚡" },
            { label: "Calcium",   value: analysis.calcium,  unit: "mg", color: "#a78bfa", icon: "🦴" },
          ].map((s) => (
            <div key={s.label} className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
              <div style={{ fontSize: "1.25rem", marginBottom: "0.375rem" }}>{s.icon}</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: s.color, fontFamily: "Sora, sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: "0.1rem" }}>{s.unit}</div>
              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-secondary)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Vitamins ── */}
        <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)", borderRadius: 20, marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <FlaskConical size={15} color="var(--accent-violet-light)" />
            <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)" }}>Vitamins &amp; Minerals</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
            <VitaminPill label="Vitamin A"   value={analysis.vitaminA}   unit="IU"  color="#f97316" />
            <VitaminPill label="Vitamin C"   value={analysis.vitaminC}   unit="mg"  color="#fbbf24" />
            <VitaminPill label="Vitamin D"   value={analysis.vitaminD}   unit="IU"  color="#60a5fa" />
            <VitaminPill label="Vitamin B12" value={analysis.vitaminB12} unit="mcg" color="#34d399" />
            <VitaminPill label="Iron"        value={analysis.iron}       unit="mg"  color="#f87171" />
          </div>
        </div>

        {/* ── Pros & Cons ── */}
        <div className="grid-2" style={{ marginBottom: "1.25rem" }}>
          <div style={{ padding: "1.25rem", background: "rgba(16,217,129,0.05)", border: "1px solid rgba(16,217,129,0.15)", borderRadius: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
              <Star size={14} color="var(--accent-emerald)" />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--accent-emerald)" }}>Nutritional Pros</span>
            </div>
            {analysis.pros.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "flex-start" }}>
                <span style={{ color: "var(--accent-emerald)", fontSize: "0.8rem", flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{p}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "1.25rem", background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
              <Shield size={14} color="var(--accent-amber)" />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--accent-amber)" }}>Watch Points</span>
            </div>
            {analysis.cons.length > 0 ? analysis.cons.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "flex-start" }}>
                <span style={{ color: "var(--accent-amber)", flexShrink: 0, marginTop: 1 }}>⚠</span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{c}</span>
              </div>
            )) : (
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <CheckCircle size={14} color="var(--accent-emerald)" />
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>No concerns — excellent nutritional balance!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add to planner CTA */}
      {!added ? (
        <button
          className="btn btn-primary btn-lg w-full"
          style={{ gap: "0.75rem", fontSize: "0.95rem" }}
          onClick={() => setAdded(true)}
        >
          <Plus size={18} /> Add to Daily Planner <Sparkles size={14} />
        </button>
      ) : (
        <div style={{
          display: "flex", alignItems: "center", gap: "1rem",
          padding: "1.125rem 1.5rem", borderRadius: 16,
          background: "rgba(16,217,129,0.07)", border: "1px solid rgba(16,217,129,0.2)",
        }}>
          <CheckCircle size={22} color="var(--accent-emerald)" />
          <div>
            <div style={{ fontWeight: 700, color: "var(--accent-emerald)" }}>Added to Daily Planner!</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>
              {analysis.calories} kcal · {analysis.protein}g protein · {analysis.carbs}g carbs · {analysis.fat}g fat logged
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   DROPZONE
════════════════════════════════════════════════════════ */
function Dropzone({ onFile }: { onFile: (f: File) => void }) {
  const [dragging, setDragging]     = useState(false);
  const [pasting,  setPasting]      = useState(false);
  const inputRef                    = useRef<HTMLInputElement>(null);

  const handle = useCallback((file: File) => {
    if (file.type.startsWith("image/")) onFile(file);
  }, [onFile]);

  /* Paste from clipboard */
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items ?? []).find((i) => i.type.startsWith("image/"));
      if (!item) return;
      const file = item.getAsFile();
      if (file) { setPasting(true); setTimeout(() => setPasting(false), 500); handle(file); }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handle]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0]; if (f) handle(f);
  };

  const isActive = dragging || pasting;

  return (
    <div style={{ maxWidth: 660, margin: "0 auto" }}>
      {/* Main drop zone */}
      <div
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          position: "relative", cursor: "pointer",
          border: `2px dashed ${isActive ? "rgba(0,212,255,0.75)" : "rgba(0,212,255,0.22)"}`,
          borderRadius: 24, padding: "3.75rem 2rem", textAlign: "center",
          background: isActive ? "rgba(0,212,255,0.07)" : "rgba(0,212,255,0.025)",
          boxShadow: isActive ? "0 0 40px rgba(0,212,255,0.12) inset" : "none",
          transition: "all 0.25s ease", overflow: "hidden",
        }}
      >
        {/* Ambient top glow */}
        <div style={{
          position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)",
          width: 320, height: 220, borderRadius: "50%",
          background: `radial-gradient(ellipse, ${isActive ? "rgba(0,212,255,0.16)" : "rgba(0,212,255,0.09)"} 0%, transparent 70%)`,
          pointerEvents: "none", transition: "background 0.3s",
        }} />

        <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); }} />

        {/* Icon */}
        <div style={{
          width: 84, height: 84, borderRadius: 22, margin: "0 auto 1.75rem",
          background: isActive ? "rgba(0,212,255,0.15)" : "rgba(0,212,255,0.08)",
          border: `1px solid ${isActive ? "rgba(0,212,255,0.4)" : "rgba(0,212,255,0.18)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: isActive ? "0 0 30px rgba(0,212,255,0.35)" : "none",
          transition: "all 0.3s ease",
        }}>
          {isActive
            ? <Sparkles size={38} color="var(--accent-cyan)" />
            : <ScanLine  size={38} color="var(--accent-cyan)" />
          }
        </div>

        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.625rem" }}>
          {pasting ? "Pasting from clipboard…" : dragging ? "Release to start scanning" : "Drop your meal photo here"}
        </h2>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: 1.65 }}>
          Drag &amp; drop, paste from clipboard, or choose a source below.<br />
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Supports JPEG · PNG · WebP · HEIC · GIF</span>
        </p>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <div className="btn btn-secondary" style={{ gap: "0.5rem", pointerEvents: "none", fontSize: "0.85rem" }}>
            <Upload size={15} /> Browse Files
          </div>
          <div className="btn btn-secondary"
            style={{ gap: "0.5rem", pointerEvents: "none", fontSize: "0.85rem" }}
            onClick={(e) => { e.stopPropagation(); if (inputRef.current) { inputRef.current.setAttribute("capture","environment"); inputRef.current.click(); } }}>
            <Camera size={15} /> Take Photo
          </div>
          <div className="btn btn-secondary" style={{ gap: "0.5rem", pointerEvents: "none", fontSize: "0.85rem" }}>
            <ClipboardPaste size={15} /> Paste <kbd style={{ fontSize: "0.62rem", padding: "0.1rem 0.35rem", background: "rgba(255,255,255,0.1)", borderRadius: 4 }}>Ctrl+V</kbd>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.625rem", marginTop: "1.5rem" }}>
        {[
          { n: "01", emoji: "📸", title: "Upload Photo",       sub: "Any meal or snack"      },
          { n: "02", emoji: "🔬", title: "AI Scans Image",     sub: "Detects ingredients"    },
          { n: "03", emoji: "📊", title: "Macro Breakdown",    sub: "Full nutrient profile"  },
          { n: "04", emoji: "📋", title: "Log to Planner",     sub: "Track your daily macros"},
        ].map((s) => (
          <div key={s.n} style={{ padding: "1rem 0.75rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)", borderRadius: 14, textAlign: "center" }}>
            <div style={{ fontSize: "0.6rem", fontWeight: 700, color: "var(--accent-cyan)", letterSpacing: "0.08em", marginBottom: "0.375rem" }}>{s.n}</div>
            <div style={{ fontSize: "1.4rem", marginBottom: "0.375rem" }}>{s.emoji}</div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, marginBottom: "0.2rem" }}>{s.title}</div>
            <div style={{ fontSize: "0.63rem", color: "var(--text-muted)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent scans hint */}
      <div style={{
        marginTop: "1.5rem", padding: "1rem 1.25rem", borderRadius: 14,
        background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)",
        display: "flex", alignItems: "center", gap: "1rem",
      }}>
        <Activity size={16} color="var(--accent-violet-light)" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 600, marginBottom: "0.1rem" }}>Tip: Try scanning a meal from your gallery</div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
            Works best with clear, well-lit food photos. The AI detects the meal type from the filename too.
          </div>
        </div>
        <TrendingUp size={14} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   PREVIEW STAGE
════════════════════════════════════════════════════════ */
function PreviewStage({ imageUrl, imageName, onScan, onChange, onReset }: {
  imageUrl: string; imageName: string;
  onScan: () => void; onChange: () => void; onReset: () => void;
}) {
  return (
    <div className="anim-scale-in" style={{ maxWidth: 660, margin: "0 auto" }}>
      <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", marginBottom: "1.25rem" }}>
        <img src={imageUrl} alt="Preview" style={{ width: "100%", maxHeight: 380, objectFit: "cover", display: "block" }} />
        {/* File badge */}
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: "rgba(7,11,20,0.82)", backdropFilter: "blur(8px)",
          border: "1px solid var(--border-subtle)", borderRadius: 10,
          padding: "0.375rem 0.875rem", fontSize: "0.72rem", fontWeight: 600, color: "var(--text-secondary)",
        }}>
          📸 {imageName}
        </div>
        {/* Subtle vignette at bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: "linear-gradient(transparent, rgba(7,11,20,0.5))" }} />
      </div>

      <div style={{ display: "flex", gap: "0.875rem" }}>
        <button className="btn btn-primary btn-lg" style={{ flex: 1, gap: "0.75rem", fontSize: "0.95rem" }} onClick={onScan}>
          <Zap size={18} /> Scan with AI <Sparkles size={14} />
        </button>
        <button className="btn btn-secondary" onClick={onChange} style={{ gap: "0.5rem" }}>
          <Upload size={15} /> Change
        </button>
        <button className="btn btn-ghost" onClick={onReset}>
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════ */
type Stage = "idle" | "preview" | "scanning" | "done";

export default function FoodScannerPage() {
  const [stage,    setStage]    = useState<Stage>("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageName,setImageName]= useState<string>("");
  const [file,     setFile]     = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const changeRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setImageUrl(URL.createObjectURL(f));
    setImageName(f.name);
    setAnalysis(null);
    setStage("preview");
  }, []);

  const handleScan = async () => {
    if (!file) return;
    setStage("scanning");
    const result = await analyzeFoodImage(file);
    setAnalysis(result);
    setStage("done");
    setTimeout(() => document.getElementById("food-result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const handleReset = () => {
    setStage("idle"); setImageUrl(null); setImageName(""); setFile(null); setAnalysis(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="page-header anim-fade-up">
        <div className="page-eyebrow"><ScanLine size={14} /> AI Vision Technology</div>
        <h1 className="page-title" style={{
          background: "var(--grad-emerald)", WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>
          AI Food Scanner
        </h1>
        <p className="page-subtitle">
          Upload, drag, or paste any meal photo — our vision AI detects ingredients, estimates portions, and delivers
          a complete macro &amp; micronutrient breakdown in seconds.
        </p>
      </div>

      {/* ── Idle: Dropzone ── */}
      {stage === "idle" && (
        <div className="anim-fade-up anim-delay-1">
          <Dropzone onFile={handleFile} />
        </div>
      )}

      {/* ── Preview ── */}
      {stage === "preview" && imageUrl && (
        <>
          <PreviewStage
            imageUrl={imageUrl} imageName={imageName}
            onScan={handleScan}
            onChange={() => changeRef.current?.click()}
            onReset={handleReset}
          />
          <input ref={changeRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </>
      )}

      {/* ── Scanning ── */}
      {stage === "scanning" && imageUrl && (
        <div className="anim-fade-in" style={{ maxWidth: 660, margin: "0 auto" }}>
          <ScanAnimation imageUrl={imageUrl} />
          <div style={{
            marginTop: "1.25rem", padding: "1rem 1.25rem", borderRadius: 14, textAlign: "center",
            background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)",
          }}>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", fontWeight: 500 }}>
              🤖&nbsp; AI vision model processing your meal — results ready in 2–3 seconds…
            </p>
          </div>
        </div>
      )}

      {/* ── Results ── */}
      {stage === "done" && analysis && (
        <ResultsCard analysis={analysis} onReset={handleReset} />
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes ph-pulse {
          0%   { transform: scale(0.8); opacity: 0.8; }
          60%  { opacity: 0.15; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
