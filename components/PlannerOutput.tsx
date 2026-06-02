"use client";

import { useState, useCallback } from "react";
import { DayPlan, TaskItem } from "@/lib/fitnessAI";
import { ChevronDown, ChevronUp, Check, Pencil, X, Save } from "lucide-react";

interface PlannerOutputProps {
  days: DayPlan[];
  accentColor?: string;
  accentGradient?: string;
}

interface EditState {
  dayIndex: number;
  taskId: string;
  value: string;
}

export default function PlannerOutput({ days, accentColor = "var(--accent-cyan)", accentGradient = "var(--grad-primary)" }: PlannerOutputProps) {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([0]));
  const [tasks, setTasks] = useState<DayPlan[]>(days);
  const [editState, setEditState] = useState<EditState | null>(null);

  const toggleDay = (day: number) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  };

  const toggleTask = useCallback((dayIndex: number, taskId: string) => {
    setTasks((prev) =>
      prev.map((d, di) =>
        di !== dayIndex ? d : {
          ...d,
          tasks: d.tasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          ),
        }
      )
    );
  }, []);

  const startEdit = (dayIndex: number, task: TaskItem) => {
    setEditState({ dayIndex, taskId: task.id, value: task.text });
  };

  const saveEdit = () => {
    if (!editState) return;
    setTasks((prev) =>
      prev.map((d, di) =>
        di !== editState.dayIndex ? d : {
          ...d,
          tasks: d.tasks.map((t) =>
            t.id === editState.taskId ? { ...t, text: editState.value } : t
          ),
        }
      )
    );
    setEditState(null);
  };

  const getProgress = (day: DayPlan) => {
    const total = day.tasks.length;
    const done = day.tasks.filter((t) => t.completed).length;
    return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  };

  // Group tasks by category
  const groupByCategory = (taskList: TaskItem[]) => {
    const map: Record<string, TaskItem[]> = {};
    taskList.forEach((t) => {
      if (!map[t.category]) map[t.category] = [];
      map[t.category].push(t);
    });
    return map;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
      {tasks.map((day, di) => {
        const { done, total, pct } = getProgress(day);
        const isExpanded = expandedDays.has(di);
        const grouped = groupByCategory(day.tasks);

        return (
          <div key={di} className="day-card anim-fade-up" style={{ animationDelay: `${di * 0.04}s` }}>
            {/* Day Header */}
            <div className="day-header" onClick={() => toggleDay(di)}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "10px",
                  background: pct === 100 ? "var(--grad-emerald)" : accentGradient,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.8rem", fontWeight: 700, color: "white", flexShrink: 0,
                  opacity: pct === 100 ? 1 : 0.85,
                }}>
                  {pct === 100 ? <Check size={16} /> : `D${di + 1}`}
                </div>
                <div>
                  <div className="day-label">{day.label}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "1px" }}>
                    {day.focus} · {day.calories.toLocaleString()} kcal · {day.water}L water
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div className="day-progress">
                  <div style={{ width: 72, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: "100px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: pct === 100 ? "var(--grad-emerald)" : accentGradient,
                      borderRadius: "100px",
                      transition: "width 0.5s ease",
                    }} />
                  </div>
                  <span style={{ minWidth: 36, textAlign: "right" }}>{done}/{total}</span>
                </div>
                {isExpanded ? <ChevronUp size={16} style={{ color: "var(--text-muted)" }} /> : <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />}
              </div>
            </div>

            {/* Day Body */}
            {isExpanded && (
              <div className="day-body">
                {Object.entries(grouped).map(([category, categoryTasks]) => (
                  <div key={category}>
                    <div className="task-section-title">{category}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                      {categoryTasks.map((task) => {
                        const isEditing = editState?.taskId === task.id && editState?.dayIndex === di;
                        return (
                          <div
                            key={task.id}
                            className={`task-item ${task.completed ? "completed" : ""}`}
                            style={{ alignItems: isEditing ? "flex-start" : "center" }}
                          >
                            {/* Checkbox */}
                            <div
                              className="task-checkbox"
                              onClick={() => !isEditing && toggleTask(di, task.id)}
                              style={{ flexShrink: 0, marginTop: isEditing ? "0.25rem" : 0 }}
                            >
                              {task.completed && <Check size={11} color="white" />}
                            </div>

                            {/* Text or Edit input */}
                            {isEditing ? (
                              <div style={{ flex: 1, display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                <input
                                  autoFocus
                                  value={editState.value}
                                  onChange={(e) => setEditState((s) => s ? { ...s, value: e.target.value } : null)}
                                  onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditState(null); }}
                                  className="form-input"
                                  style={{ flex: 1, padding: "0.4rem 0.75rem", fontSize: "0.85rem", minWidth: 120 }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <button className="btn btn-sm btn-primary btn-icon" onClick={saveEdit} title="Save">
                                  <Save size={13} />
                                </button>
                                <button className="btn btn-sm btn-ghost btn-icon" onClick={() => setEditState(null)} title="Cancel">
                                  <X size={13} />
                                </button>
                              </div>
                            ) : (
                              <span
                                className="task-text"
                                onClick={() => toggleTask(di, task.id)}
                                style={{ flex: 1 }}
                              >
                                {task.text}
                              </span>
                            )}

                            {/* Edit button */}
                            {!isEditing && !task.completed && (
                              <button
                                className="btn btn-ghost btn-icon"
                                style={{ padding: "0.25rem", opacity: 0, transition: "opacity 0.15s" }}
                                onClick={(e) => { e.stopPropagation(); startEdit(di, task); }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                                title="Edit task"
                              >
                                <Pencil size={12} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
