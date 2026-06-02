// ============================================================
// BUSINESS & STRATEGY AI GENERATOR
// Generates 12-week launch roadmaps
// ============================================================

export interface BusinessInput {
  businessName: string;
  industry: string;
  businessType: "ecommerce" | "saas" | "service" | "retail" | "content" | "consulting" | "food" | "other";
  budget: "under_1k" | "1k_5k" | "5k_20k" | "20k_plus";
  timeline: "3_months" | "6_months" | "1_year";
  teamSize: "solo" | "2_5" | "6_20" | "20_plus";
  targetMarket: string;
}

export interface Milestone {
  id: string;
  text: string;
  completed: boolean;
  week: number;
  cost?: string;
}

export interface Phase {
  id: string;
  phase: number;
  name: string;
  weeks: string;
  color: string;
  gradient: string;
  emoji: string;
  goal: string;
  budget: string;
  milestones: Milestone[];
  kpis: string[];
}

export interface BusinessPlan {
  summary: string;
  totalBudget: string;
  estimatedRevenue: string;
  breakEvenMonth: string;
  keyRisks: string[];
  successFactors: string[];
  phases: Phase[];
}

const budgetMap = {
  under_1k: { label: "< $1,000", total: 800 },
  "1k_5k": { label: "$1,000 – $5,000", total: 3500 },
  "5k_20k": { label: "$5,000 – $20,000", total: 12000 },
  "20k_plus": { label: "$20,000+", total: 35000 },
};

const typeDescriptions: Record<string, string> = {
  ecommerce: "online store",
  saas: "software-as-a-service product",
  service: "service-based business",
  retail: "retail shop",
  content: "content/media brand",
  consulting: "consulting practice",
  food: "food & beverage venture",
  other: "business",
};

export function generateBusinessPlan(input: BusinessInput): BusinessPlan {
  const budget = budgetMap[input.budget];
  const isBootstrapped = input.budget === "under_1k" || input.budget === "1k_5k";
  const isSolo = input.teamSize === "solo";
  const type = typeDescriptions[input.businessType] || "business";

  const phaseOneBudget = Math.round(budget.total * 0.2);
  const phaseTwoBudget = Math.round(budget.total * 0.35);
  const phaseThreeBudget = Math.round(budget.total * 0.3);
  const phaseFourBudget = Math.round(budget.total * 0.15);

  const buildMilestone = (text: string, week: number, cost?: string, id?: string): Milestone => ({
    id: id || `m-${Math.random().toString(36).slice(2, 7)}`,
    text,
    completed: false,
    week,
    cost,
  });

  const phases: Phase[] = [
    {
      id: "research",
      phase: 1,
      name: "Research & Validation",
      weeks: "Weeks 1–3",
      color: "var(--accent-cyan)",
      gradient: "var(--grad-primary)",
      emoji: "🔍",
      goal: "Validate market demand before spending a single dollar on development",
      budget: `$${phaseOneBudget.toLocaleString()}`,
      kpis: [
        "Complete 20+ customer discovery interviews",
        "Validate top 3 competitor differentiators",
        "Identify target ICP (Ideal Customer Profile)",
        "Confirm problem-solution fit with 10 potential customers",
      ],
      milestones: [
        buildMilestone(`Define your unique value proposition for ${type}`, 1),
        buildMilestone(`Conduct competitive analysis of top 10 players in ${input.industry}`, 1),
        buildMilestone("Build customer persona profiles (demographics, pain points, goals)", 1),
        buildMilestone("Run 20 customer discovery calls or surveys", 2, "$50–100 for survey tools"),
        buildMilestone("Validate willingness-to-pay with pricing test or pre-sales page", 2),
        buildMilestone("Define your niche and unfair advantage", 3),
        buildMilestone("Document findings in a Product Requirements Document (PRD)", 3),
        buildMilestone("Decision checkpoint: Pivot, persevere, or stop based on data", 3),
      ],
    },
    {
      id: "mvp",
      phase: 2,
      name: "MVP & Brand Building",
      weeks: "Weeks 4–7",
      color: "var(--accent-violet-light)",
      gradient: "var(--grad-violet)",
      emoji: "🏗️",
      goal: "Build the minimum viable product and establish your brand presence",
      budget: `$${phaseTwoBudget.toLocaleString()}`,
      kpis: [
        "MVP ready for beta testing",
        "Brand identity complete (logo, colors, fonts)",
        "Website live with conversion optimization",
        "First 10 beta users onboarded",
      ],
      milestones: [
        buildMilestone("Register business name and secure domain", 4, "$20–50/yr"),
        buildMilestone("Create brand identity: logo, color palette, typography", 4, isBootstrapped ? "$0 (Canva/Figma)" : "$500–2000 (designer)"),
        buildMilestone(`Build MVP of your ${type} (core features only — no scope creep!)`, 5, isSolo ? "$0 (build yourself)" : `$${Math.round(phaseTwoBudget * 0.5).toLocaleString()} (dev costs)`),
        buildMilestone("Set up essential tools: CRM, analytics, email marketing", 5, "$50–200/mo"),
        buildMilestone("Launch landing page with email capture and waitlist", 6, "$30–100 (hosting + tools)"),
        buildMilestone("Run soft-launch beta with 10–20 early adopters", 6),
        buildMilestone("Collect and document beta feedback systematically", 7),
        buildMilestone("Iterate on product based on beta learnings (2 sprint cycles)", 7),
      ],
    },
    {
      id: "launch",
      phase: 3,
      name: "Go-To-Market Launch",
      weeks: "Weeks 8–10",
      color: "var(--accent-emerald)",
      gradient: "var(--grad-emerald)",
      emoji: "🚀",
      goal: "Execute a high-impact public launch to generate first real revenue",
      budget: `$${phaseThreeBudget.toLocaleString()}`,
      kpis: [
        "First paying customer acquired",
        "Launch day press/social coverage",
        "$1,000+ in first-week revenue",
        "50+ email subscribers from launch",
      ],
      milestones: [
        buildMilestone("Craft launch story and press release for media outreach", 8),
        buildMilestone("Build pre-launch buzz: social posts, teaser campaign, countdown", 8, `$${Math.round(phaseThreeBudget * 0.15).toLocaleString()} (social ads)`),
        buildMilestone("Set up payment processing and order fulfillment systems", 8, "$0–100 (Stripe, PayPal)"),
        buildMilestone("Submit to Product Hunt, Reddit, relevant communities", 9),
        buildMilestone("Run launch-day social campaign across all platforms", 9, `$${Math.round(phaseThreeBudget * 0.3).toLocaleString()} (paid promotion)`),
        buildMilestone("Send launch email to full waitlist with launch-day discount", 9),
        buildMilestone("Do live demo / AMA session on LinkedIn or YouTube", 10),
        buildMilestone("Follow up with every person who signed up but didn't convert", 10),
      ],
    },
    {
      id: "growth",
      phase: 4,
      name: "Growth & Optimization",
      weeks: "Weeks 11–12",
      color: "var(--accent-amber)",
      gradient: "var(--grad-amber)",
      emoji: "📈",
      goal: "Establish repeatable growth channels and optimize for profitability",
      budget: `$${phaseFourBudget.toLocaleString()}`,
      kpis: [
        "Identify top 2 scalable acquisition channels",
        "Achieve positive unit economics (CAC < LTV)",
        "Build referral or affiliate program",
        "Publish month-1 retrospective and growth plan",
      ],
      milestones: [
        buildMilestone("Analyze launch metrics: conversion rate, CAC, LTV, churn", 11),
        buildMilestone("Double down on the 1–2 channels driving 80% of results", 11),
        buildMilestone("Set up referral program or affiliate marketing system", 11, `$${Math.round(phaseFourBudget * 0.2).toLocaleString()}`),
        buildMilestone("Start SEO content strategy: 4 pillar posts targeting key search terms", 12),
        buildMilestone("Set up retargeting ads for website visitors who didn't convert", 12, `$${Math.round(phaseFourBudget * 0.4).toLocaleString()}`),
        buildMilestone("Build customer success process to reduce churn and boost referrals", 12),
        buildMilestone("Set 90-day OKRs for next quarter based on launch learnings", 12),
        buildMilestone("Consider hiring/outsourcing first role (VA, developer, marketer)", 12),
      ],
    },
  ];

  const revenueMultiplier = { under_1k: 2, "1k_5k": 3, "5k_20k": 4, "20k_plus": 5 }[input.budget];
  const estimatedRevenue = `$${(budget.total * revenueMultiplier * 0.1).toLocaleString()}–$${(budget.total * revenueMultiplier * 0.3).toLocaleString()} / month by month 6`;
  const breakEven = { under_1k: "Month 2–3", "1k_5k": "Month 3–4", "5k_20k": "Month 4–6", "20k_plus": "Month 6–9" }[input.budget];

  const keyRisks = [
    "Market not large enough to sustain growth — validate ICP early",
    "Product-market fit not achieved before running out of budget",
    isSolo ? "Founder burnout — prioritize ruthlessly and say no often" : "Team misalignment — establish clear roles and decision-making framework",
    "Customer acquisition cost exceeds lifetime value — track unit economics from day 1",
    `Competition in ${input.industry} may require faster iteration cycles`,
  ];

  const successFactors = [
    "Talk to 20+ real customers before building anything",
    "Launch before you feel ready — speed beats perfection",
    "Focus on ONE acquisition channel until it's profitable",
    "Build an email list from day 1 — own your audience",
    "Obsess over customer success, not just acquisition",
  ];

  return {
    summary: `A 12-week ${type} launch roadmap for ${input.businessName || "your venture"} in ${input.industry}, targeting ${input.targetMarket || "your ideal customers"}.`,
    totalBudget: budget.label,
    estimatedRevenue,
    breakEvenMonth: breakEven,
    keyRisks,
    successFactors,
    phases,
  };
}
