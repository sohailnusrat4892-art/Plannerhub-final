// ============================================================
// PREGNANCY & WOMEN'S HEALTH AI GENERATOR
// ============================================================

export interface PregnancyInput {
  week: number; // 1-40
  weight: number; // kg
  age: number;
  complications: string[]; // gestational_diabetes, preeclampsia, anemia, etc.
  activityLevel: "sedentary" | "light" | "moderate";
  previousPregnancies: number;
}

export interface PrenatalTask {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  priority: "high" | "medium" | "low";
}

export interface WeeklyRoutine {
  week: number;
  trimester: 1 | 2 | 3;
  theme: string;
  babySize: string;
  babyDev: string;
  tasks: PrenatalTask[];
  nutrition: string[];
  supplements: string[];
  exercises: string[];
  warnings: string[];
  appointments: string[];
}

function getTrimester(week: number): 1 | 2 | 3 {
  if (week <= 13) return 1;
  if (week <= 26) return 2;
  return 3;
}

const babySizes: Record<number, { size: string; dev: string }> = {
  4: { size: "Poppy seed (0.1cm)", dev: "Embryo implanting; heart cells forming" },
  8: { size: "Raspberry (1.6cm)", dev: "Arms, legs, and facial features forming" },
  12: { size: "Lime (5.4cm)", dev: "Reflexes developing; kidneys producing urine" },
  16: { size: "Avocado (11.6cm)", dev: "Skeleton hardening; can hear sounds" },
  20: { size: "Banana (16.4cm)", dev: "Halfway point! Movements felt clearly" },
  24: { size: "Corn (30cm)", dev: "Lungs developing; brain growing rapidly" },
  28: { size: "Eggplant (37cm)", dev: "Eyes open; recognizes your voice" },
  32: { size: "Squash (42cm)", dev: "Gaining weight; practicing breathing" },
  36: { size: "Honeydew (47cm)", dev: "Nearly full-term; positioning for birth" },
  40: { size: "Watermelon (51cm)", dev: "Full term — ready to meet the world!" },
};

function getBabyInfo(week: number) {
  const keys = Object.keys(babySizes).map(Number).sort((a, b) => a - b);
  const closest = keys.reduce((prev, curr) => (Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev));
  return babySizes[closest];
}

const trimesterThemes: Record<1 | 2 | 3, string> = {
  1: "Foundation & Rest — Nurturing the earliest moments of life",
  2: "Energy & Growth — Your golden trimester of comfort",
  3: "Preparation & Strength — Getting ready for the big day",
};

export function generatePregnancyPlan(input: PregnancyInput): WeeklyRoutine {
  const trimester = getTrimester(input.week);
  const babyInfo = getBabyInfo(input.week);
  const hasGD = input.complications.includes("gestational_diabetes");
  const hasPE = input.complications.includes("preeclampsia");
  const hasAnemia = input.complications.includes("anemia");

  // Supplements
  const supplements = ["Folic Acid 400–800mcg daily (neural tube protection)"];
  supplements.push("Prenatal Multivitamin with DHA — take with food");
  supplements.push("Vitamin D3 600–2000 IU daily (bone & immune health)");
  if (hasAnemia || trimester >= 2) supplements.push("Iron 27mg daily — take with Vitamin C for absorption");
  supplements.push("Calcium 1000mg daily — split into 2 doses");
  if (trimester === 3) supplements.push("Omega-3 DHA 200mg daily (brain development)");
  if (hasGD) supplements.push("Chromium Picolinate (with doctor approval) — blood sugar regulation");

  // Nutrition
  const nutrition = [
    `Breakfast: Whole grain toast with avocado + 2 scrambled eggs${hasGD ? " (monitor blood sugar)" : ""}`,
    "Mid-Morning: Fresh fruit (apple/pear/berries) + handful of almonds",
    `Lunch: Lean protein (chicken/lentils/tofu) with complex carbs${hasGD ? " — keep portions measured" : ""} + salad`,
    "Afternoon Snack: Greek yogurt with flaxseeds + warm milk",
    "Dinner: Salmon or legumes with steamed vegetables + brown rice",
    `Daily hydration goal: ${hasPE ? "2L+ water (monitor for swelling)" : "2.5–3L water or herbal teas"}`,
  ];

  if (hasGD) {
    nutrition.push("⚠️ Gestational Diabetes: Check blood glucose before meals and 1 hour after");
    nutrition.push("Limit simple carbs; prioritize fiber-rich, low-GI foods");
  }

  // Exercises based on trimester and activity level
  const exercises: string[] = [];
  if (input.activityLevel === "sedentary") {
    exercises.push("10-min gentle walks (twice daily)");
    exercises.push("Seated stretching routine — 15 mins");
  } else if (trimester === 1) {
    exercises.push("30-min prenatal yoga (morning)");
    exercises.push("20-min brisk walking");
    exercises.push("Kegel exercises: 3 sets × 10 reps — pelvic floor strengthening");
    exercises.push("Cat-Cow stretches: 10 reps — back pain relief");
  } else if (trimester === 2) {
    exercises.push("Swimming or water aerobics — 30 mins (joint-friendly)");
    exercises.push("Prenatal yoga — 30 mins");
    exercises.push("Kegel exercises: 4 sets × 10 reps");
    exercises.push("Squats with support: 3 × 15 reps (birth preparation)");
    exercises.push("Side-lying leg lifts: 3 × 12 each side");
  } else {
    exercises.push("Gentle walking: 20–30 mins daily");
    exercises.push("Prenatal yoga — hip opening poses only");
    exercises.push("Kegel exercises: 5 sets × 10 reps (preparation for labor)");
    exercises.push("Breathing exercises for labor preparation — 10 mins");
    exercises.push("Avoid any supine (lying on back) exercises after week 28");
  }

  if (hasPE) {
    exercises.length = 0;
    exercises.push("⚠️ Pre-eclampsia: Limit physical activity — gentle walks only");
    exercises.push("Monitor blood pressure before and after any activity");
    exercises.push("Rest in left lateral position to improve kidney blood flow");
  }

  // Appointments
  const appointments: string[] = [];
  if (trimester === 1) {
    appointments.push("Book first prenatal appointment (8–10 weeks)");
    appointments.push("Schedule NIPT / genetic screening test (10–13 weeks)");
    appointments.push("Nuchal translucency ultrasound (11–14 weeks)");
  } else if (trimester === 2) {
    appointments.push("Anatomy scan ultrasound (18–20 weeks)");
    appointments.push("Gestational diabetes screening (24–28 weeks)");
    appointments.push("Monthly prenatal checkup");
    if (hasGD) appointments.push("Weekly endocrinology / high-risk OB appointment");
  } else {
    appointments.push("Bi-weekly prenatal visits (28–36 weeks)");
    appointments.push("Weekly visits from week 36 onwards");
    appointments.push("Group B Strep test (35–37 weeks)");
    appointments.push("Hospital pre-registration and birth plan discussion");
    appointments.push("Pediatrician selection and first visit planning");
  }

  // Warnings
  const warnings: string[] = [];
  if (hasPE) warnings.push("⚠️ Pre-eclampsia: Monitor for severe headaches, vision changes, sudden swelling — seek emergency care immediately if present");
  if (hasGD) warnings.push("⚠️ Gestational Diabetes: Maintain target blood glucose 70–95 mg/dL fasting, <140 mg/dL 1hr post-meal");
  if (hasAnemia) warnings.push("⚠️ Anemia: Avoid tea/coffee with iron-rich meals. Include Vitamin C sources to boost iron absorption");
  if (trimester === 3 && input.week >= 37) warnings.push("🏥 Full term: Hospital bag should be packed. Know your route to the hospital. Contact provider if contractions are 5 min apart");

  // Build task list
  const tasks: PrenatalTask[] = [];
  const push = (text: string, cat: string, priority: "high" | "medium" | "low" = "medium") => {
    tasks.push({ id: `${cat}-${tasks.length}`, text, completed: false, category: cat, priority });
  };

  push("Wake up at 7:00 AM — begin with gratitude journaling (3 things)", "🌅 Morning", "medium");
  push("Take prenatal vitamins with breakfast", "💊 Supplements", "high");
  push("Drink 2 glasses of water before noon", "💧 Hydration", "high");

  exercises.forEach((e) => push(e, "🤸 Exercise", "medium"));
  nutrition.forEach((n) => push(n, "🥗 Nutrition", "high"));
  appointments.forEach((a) => push(a, "🏥 Medical", "high"));

  push("Practice relaxation breathing — 10 mins (4-7-8 technique)", "🧘 Mindfulness", "low");
  push("Track baby movements after meals (kick counts)", "👶 Baby Tracking", "high");
  push("Apply belly moisturizer / oils (stretch mark prevention)", "✨ Self-Care", "low");
  push("Elevate feet for 20 mins if experiencing swelling", "💆 Rest", "medium");
  push("Prepare and freeze one batch-cooked meal for postpartum", "🍳 Preparation", "low");
  push("Connect with partner / support system — discuss birth plan", "❤️ Connection", "medium");
  push("10 PM bedtime — sleep on left side with pillow support", "😴 Sleep", "high");

  return {
    week: input.week,
    trimester,
    theme: trimesterThemes[trimester],
    babySize: babyInfo.size,
    babyDev: babyInfo.dev,
    tasks,
    nutrition,
    supplements,
    exercises,
    warnings,
    appointments,
  };
}
