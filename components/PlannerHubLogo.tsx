import React from "react";

interface PlannerHubLogoProps {
  /** Overall width of the entire lockup (icon + wordmark). Icon scales proportionally. */
  width?: number;
  /** Show or hide the wordmark text next to the icon. Default: true */
  showWordmark?: boolean;
  /** Show the sub-label "AI-POWERED PLATFORM". Default: false */
  showTagline?: boolean;
  /** Icon-only size override (square). Used when showWordmark=false. */
  iconSize?: number;
  /** Force a single flat color for the icon background. Defaults to the cyan gradient. */
  monoColor?: string;
}

/**
 * PlannerHub Premium SVG Logo
 *
 * Design language: a clean geometric "planning grid" emblem – three
 * intersecting node-lines radiating from a central glowing core –
 * symbolising AI-driven planning, growth, and connectivity.
 */
export default function PlannerHubLogo({
  width = 180,
  showWordmark = true,
  showTagline = false,
  iconSize,
  monoColor,
}: PlannerHubLogoProps) {
  // Compute icon dimensions from total width or explicit override
  const ICON_W = iconSize ?? Math.round(width * 0.215);
  const ICON_H = ICON_W;

  // Gradient IDs – unique per instance to avoid SVG id collisions
  const gradId  = React.useId().replace(/:/g, "");
  const glowId  = `glow-${gradId}`;
  const bgGradId = `bg-${gradId}`;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: showWordmark ? Math.round(ICON_W * 0.38) : 0,
        lineHeight: 1,
      }}
    >
      {/* ── Icon Mark ────────────────────────────────────────── */}
      <svg
        width={ICON_W}
        height={ICON_H}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
        role="img"
        aria-label="PlannerHub logo mark"
      >
        <defs>
          {/* Icon background gradient */}
          <linearGradient id={bgGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            {monoColor ? (
              <>
                <stop offset="0%" stopColor={monoColor} />
                <stop offset="100%" stopColor={monoColor} />
              </>
            ) : (
              <>
                <stop offset="0%"   stopColor="#00D4FF" />
                <stop offset="55%"  stopColor="#0099E6" />
                <stop offset="100%" stopColor="#7C3AED" />
              </>
            )}
          </linearGradient>

          {/* Core node glow */}
          <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="60%"  stopColor="#00D4FF" stopOpacity="0.8"  />
            <stop offset="100%" stopColor="#00D4FF" stopOpacity="0"    />
          </radialGradient>

          {/* Drop shadow filter */}
          <filter id={`shadow-${gradId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#00D4FF" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Rounded square background */}
        <rect
          width="48"
          height="48"
          rx="13"
          ry="13"
          fill={`url(#${bgGradId})`}
          filter={`url(#shadow-${gradId})`}
        />

        {/* Subtle inner top-light sheen */}
        <rect
          width="48"
          height="24"
          rx="13"
          ry="13"
          fill="white"
          fillOpacity="0.07"
        />

        {/* ── Planning grid / node lines ── */}
        {/* Central hub node */}
        <circle cx="24" cy="24" r="3.8" fill={`url(#${glowId})`} />
        <circle cx="24" cy="24" r="2.2" fill="white" />

        {/* Arm lines */}
        {/* Top-left node */}
        <line x1="24" y1="24" x2="13" y2="14" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.9" />
        <circle cx="13" cy="14" r="2.2" fill="white" fillOpacity="0.85" />

        {/* Top-right node */}
        <line x1="24" y1="24" x2="35" y2="14" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.9" />
        <circle cx="35" cy="14" r="2.2" fill="white" fillOpacity="0.85" />

        {/* Bottom-left node */}
        <line x1="24" y1="24" x2="11" y2="34" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.9" />
        <circle cx="11" cy="34" r="1.8" fill="white" fillOpacity="0.7" />

        {/* Bottom-right node */}
        <line x1="24" y1="24" x2="37" y2="34" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.9" />
        <circle cx="37" cy="34" r="1.8" fill="white" fillOpacity="0.7" />

        {/* Straight down node */}
        <line x1="24" y1="24" x2="24" y2="38" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeOpacity="0.8" />
        <circle cx="24" cy="38" r="1.6" fill="white" fillOpacity="0.65" />

        {/* Secondary connector arcs (top two nodes linked) */}
        <line x1="13" y1="14" x2="35" y2="14" stroke="white" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.35" strokeDasharray="2 3" />

        {/* Sparkle accent – top-right corner  */}
        <circle cx="40" cy="9" r="1.1" fill="white" fillOpacity="0.6" />
        <circle cx="38" cy="6"  r="0.7" fill="#00D4FF" fillOpacity="0.9" />
        <circle cx="43" cy="12" r="0.6" fill="white" fillOpacity="0.5" />
      </svg>

      {/* ── Wordmark ─────────────────────────────────────────── */}
      {showWordmark && (
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <span
            style={{
              fontFamily: "Sora, Inter, sans-serif",
              fontWeight: 800,
              fontSize: Math.round(ICON_H * 0.54),
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            Planner
            <span
              style={{
                background: "linear-gradient(90deg, #00D4FF 0%, #7C3AED 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Hub
            </span>
          </span>

          {showTagline && (
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: Math.round(ICON_H * 0.22),
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#00D4FF",
                lineHeight: 1,
              }}
            >
              AI-Powered Platform
            </span>
          )}
        </div>
      )}
    </div>
  );
}
