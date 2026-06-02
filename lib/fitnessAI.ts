// ============================================================
// FITNESS AI PLAN GENERATOR
// Generates hyper-personalized 7-day fitness & health plans
// ============================================================

export interface FitnessInput {
  age: number;
  height: number; // cm
  weight: number; // kg
  goal: "weight_loss" | "weight_gain" | "maintenance" | "muscle_gain";
  conditions: string[]; // e.g. ["diabetes", "hypertension"]
  activityLevel: "sedentary" | "light" | "moderate" | "active";
  gender: "male" | "female" | "other";
}

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
  category: string;
}

export interface DayPlan {
  day: number;
  label: string;
  focus: string;
  tasks: TaskItem[];
  calories: number;
  water: number; // liters
}

export interface FitnessPlan {
  summary: string;
  bmi: number;
  bmiCategory: string;
  dailyCalories: number;
  weeklyGoal: string;
  warnings: string[];
  tips: string[];
  days: DayPlan[];
}

function calcBMI(weight: number, height: number) {
  return parseFloat((weight / ((height / 100) ** 2)).toFixed(1));
}

function getBMICategory(bmi: number) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

function calcDailyCalories(input: FitnessInput): number {
  // Mifflin-St Jeor
  let bmr = input.gender === "female"
    ? 10 * input.weight + 6.25 * input.height - 5 * input.age - 161
    : 10 * input.weight + 6.25 * input.height - 5 * input.age + 5;

  const activityMultiplier = {
    sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725,
  }[input.activityLevel];

  let tdee = bmr * activityMultiplier;

  if (input.goal === "weight_loss") tdee -= 500;
  if (input.goal === "weight_gain" || input.goal === "muscle_gain") tdee += 400;

  // Diabetic adjustment
  if (input.conditions.includes("diabetes")) tdee = Math.min(tdee, 2000);

  return Math.round(tdee);
}

const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const dayFocuses = [
  "Upper Body Strength",
  "Cardio & Endurance",
  "Lower Body Strength",
  "Active Recovery & Flexibility",
  "Full Body HIIT",
  "Core & Stability",
  "Rest & Mindfulness",
];

function buildTasks(
  day: number,
  input: FitnessInput,
  calories: number
): TaskItem[] {
  const hasHypertension = input.conditions.includes("hypertension");
  const hasDiabetes = input.conditions.includes("diabetes");
  const hasPCOS = input.conditions.includes("pcos");
  const isRest = day === 6;
  const isCardio = day === 1 || day === 4;

  const morningTasks: string[] = [];
  const workoutTasks: string[] = [];
  const mealTasks: string[] = [];
  const eveningTasks: string[] = [];

  // Morning routine
  morningTasks.push("Wake up at 6:30 AM — start your day with intention");
  morningTasks.push(hasHypertension
    ? "Take blood pressure medication with a full glass of water"
    : "Drink 500ml warm lemon water to kickstart metabolism");
  morningTasks.push("10 minutes of deep breathing / meditation");
  if (hasDiabetes) morningTasks.push("Check fasting blood glucose level");
  if (hasPCOS) morningTasks.push("Take prescribed supplements (Inositol / Metformin if applicable)");

  // Workout
  if (isRest) {
    workoutTasks.push("20-min gentle yoga or stretching session");
    workoutTasks.push("10-min foam rolling for muscle recovery");
    workoutTasks.push("Light 15-min walk in fresh air");
  } else if (isCardio) {
    workoutTasks.push(hasHypertension
      ? "30-min low-impact steady-state cardio (walking, cycling)"
      : "25-min moderate cardio (jogging, elliptical, cycling)");
    workoutTasks.push("Heart rate target: 50–65% of max HR" + (hasHypertension ? " (hypertension-safe zone)" : ""));
    workoutTasks.push("5-min warm-up + 5-min cool-down mandatory");
  } else {
    const exercises = [
      ["3 sets × 12 reps Push-ups (modify to knee push-ups if needed)", "3 sets × 10 reps Dumbbell Shoulder Press", "3 sets × 15 reps Lat Pulldown or Band Pull-apart"],
      ["3 sets × 15 reps Bodyweight Squats", "3 sets × 12 reps Romanian Deadlifts", "3 sets × 12 reps Walking Lunges (each leg)"],
      ["3 sets × 20 reps Plank (30-sec holds)", "3 sets × 15 reps Russian Twists", "3 sets × 10 reps Leg Raises"],
      ["Full body circuit: 5 exercises × 45 sec on / 15 sec off"],
    ];
    const dayExercises = exercises[day % exercises.length];
    dayExercises.forEach((e) => workoutTasks.push(e));
    workoutTasks.push("10-min warm-up (dynamic stretches)");
    workoutTasks.push("10-min cool-down (static stretches)");
  }

  // Meals
  const carbNote = hasDiabetes ? " (low-GI carbs only)" : "";
  const sodiumNote = hasHypertension ? " (low-sodium)" : "";

  mealTasks.push(`Breakfast: Overnight oats with berries + boiled eggs${carbNote} — ~${Math.round(calories * 0.25)} kcal`);
  mealTasks.push(`Mid-Morning Snack: Greek yogurt with chia seeds${sodiumNote} — ~150 kcal`);
  mealTasks.push(`Lunch: Grilled chicken with quinoa and steamed vegetables${sodiumNote}${carbNote} — ~${Math.round(calories * 0.35)} kcal`);
  mealTasks.push(`Afternoon Snack: Handful of mixed nuts + 1 fruit${hasDiabetes ? " (apple or pear)" : ""} — ~200 kcal`);
  mealTasks.push(`Dinner: Baked salmon / tofu with brown rice and leafy greens${sodiumNote} — ~${Math.round(calories * 0.3)} kcal`);
  if (hasDiabetes) mealTasks.push("Monitor post-meal blood glucose at 1-hour mark");

  // Evening
  eveningTasks.push("Drink remaining daily water quota (aim for 2.5–3L total)");
  eveningTasks.push("Log today's meals and workouts in PlannerHub");
  eveningTasks.push("10-min evening walk (optional, enhances sleep quality)");
  eveningTasks.push("Prepare tomorrow's meal prep / plan for next day");
  eveningTasks.push("Wind down: no screens 30 mins before 10:30 PM bedtime");

  const allTasks: TaskItem[] = [
    ...morningTasks.map((t, i) => ({ id: `d${day}-m${i}`, text: t, completed: false, category: "🌅 Morning Routine" })),
    ...workoutTasks.map((t, i) => ({ id: `d${day}-w${i}`, text: t, completed: false, category: "🏋️ Workout" })),
    ...mealTasks.map((t, i) => ({ id: `d${day}-meal${i}`, text: t, completed: false, category: "🥗 Nutrition" })),
    ...eveningTasks.map((t, i) => ({ id: `d${day}-e${i}`, text: t, completed: false, category: "🌙 Evening" })),
  ];

  return allTasks;
}

export function generateFitnessPlan(input: FitnessInput): FitnessPlan {
  const bmi = calcBMI(input.weight, input.height);
  const bmiCategory = getBMICategory(bmi);
  const dailyCalories = calcDailyCalories(input);

  const warnings: string[] = [];
  const tips: string[] = [];

  if (input.conditions.includes("hypertension")) {
    warnings.push("⚠️ Hypertension detected — all workouts keep heart rate in a safe zone (50-65% max HR). Avoid heavy lifting and intense HIIT.");
    tips.push("Monitor blood pressure before and after exercise. Stop if you experience dizziness or chest pain.");
  }
  if (input.conditions.includes("diabetes")) {
    warnings.push("⚠️ Diabetes noted — meal plans use low-GI foods only. Blood glucose monitoring reminders are included daily.");
    tips.push("Always carry a fast-acting carbohydrate source during workouts. Exercise 1-2 hours after meals when possible.");
  }
  if (input.conditions.includes("pcos")) {
    warnings.push("⚠️ PCOS profile — plan emphasizes low-impact cardio, anti-inflammatory foods, and stress reduction.");
    tips.push("Strength training 3x/week is particularly beneficial for PCOS — it improves insulin sensitivity.");
  }
  if (input.conditions.includes("heart_disease")) {
    warnings.push("⚠️ Heart condition noted — consult your cardiologist before starting this plan. Exercise intensity is kept very low.");
  }
  if (bmi < 18.5) tips.push("Your BMI indicates underweight. Focus on calorie surplus and protein-rich foods to build healthy mass.");
  if (bmi > 30) tips.push("Your BMI is in the obese range. This plan focuses on sustainable, gradual fat loss (0.5–1kg/week).");

  tips.push("Hydration is critical — aim for 2.5–3L of water daily.");
  tips.push("Sleep 7–9 hours per night for optimal recovery and hormone balance.");
  tips.push("Take progress photos every 2 weeks to track visible changes.");

  const goalText = {
    weight_loss: "Lose 0.5–1kg per week through caloric deficit",
    weight_gain: "Gain 0.25–0.5kg per week through lean mass building",
    maintenance: "Maintain current weight while improving fitness",
    muscle_gain: "Build lean muscle mass with progressive overload",
  }[input.goal];

  const days: DayPlan[] = dayNames.map((name, i) => ({
    day: i,
    label: `Day ${i + 1} — ${name}`,
    focus: dayFocuses[i],
    tasks: buildTasks(i, input, dailyCalories),
    calories: dailyCalories,
    water: 2.5 + (input.activityLevel === "active" ? 0.5 : 0),
  }));

  return {
    summary: `Your personalized 7-day ${input.goal.replace("_", " ")} plan, calibrated for ${input.age}y ${input.gender}, BMI ${bmi} (${bmiCategory}).`,
    bmi,
    bmiCategory,
    dailyCalories,
    weeklyGoal: goalText,
    warnings,
    tips,
    days,
  };
}
