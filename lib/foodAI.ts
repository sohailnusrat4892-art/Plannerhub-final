// ============================================================
// FOOD AI — SIMULATED VISION NUTRITION ANALYZER
// ============================================================

export interface FoodAnalysis {
  detectedFood: string;
  confidence: number;
  servingSize: string;
  calories: number;
  protein: number;   // grams
  carbs: number;     // grams
  fat: number;       // grams
  fiber: number;     // grams
  sugar: number;     // grams
  sodium: number;    // mg
  calcium: number;   // mg
  iron: number;      // mg
  vitaminA: number;  // IU
  vitaminC: number;  // mg
  vitaminD: number;  // IU
  vitaminB12: number; // mcg
  potassium: number; // mg
  healthScore: number; // 0-100
  healthLabel: string;
  pros: string[];
  cons: string[];
  recommendation: string;
}

// Realistic food database for simulation
const foodProfiles: Record<string, Omit<FoodAnalysis, "detectedFood" | "confidence" | "healthScore" | "healthLabel" | "pros" | "cons" | "recommendation">> = {
  "Grilled Salmon": {
    servingSize: "1 fillet (200g)",
    calories: 412, protein: 42, carbs: 0, fat: 26, fiber: 0, sugar: 0,
    sodium: 120, calcium: 28, iron: 1.2, vitaminA: 180, vitaminC: 4, vitaminD: 820, vitaminB12: 4.9, potassium: 720,
  },
  "Chicken Caesar Salad": {
    servingSize: "1 large bowl (350g)",
    calories: 485, protein: 38, carbs: 22, fat: 28, fiber: 4, sugar: 3,
    sodium: 890, calcium: 180, iron: 2.1, vitaminA: 2400, vitaminC: 28, vitaminD: 40, vitaminB12: 0.8, potassium: 580,
  },
  "Avocado Toast": {
    servingSize: "2 slices (220g)",
    calories: 320, protein: 9, carbs: 32, fat: 20, fiber: 9, sugar: 2,
    sodium: 340, calcium: 62, iron: 2.8, vitaminA: 180, vitaminC: 14, vitaminD: 0, vitaminB12: 0, potassium: 620,
  },
  "Beef Burger": {
    servingSize: "1 large burger (400g)",
    calories: 680, protein: 35, carbs: 48, fat: 38, fiber: 2, sugar: 8,
    sodium: 1240, calcium: 140, iron: 4.8, vitaminA: 120, vitaminC: 6, vitaminD: 20, vitaminB12: 2.4, potassium: 480,
  },
  "Margherita Pizza": {
    servingSize: "2 slices (280g)",
    calories: 580, protein: 22, carbs: 72, fat: 22, fiber: 3, sugar: 6,
    sodium: 1080, calcium: 320, iron: 3.2, vitaminA: 480, vitaminC: 8, vitaminD: 10, vitaminB12: 0.6, potassium: 360,
  },
  "Oatmeal Bowl": {
    servingSize: "1 bowl with toppings (380g)",
    calories: 290, protein: 11, carbs: 52, fat: 6, fiber: 8, sugar: 12,
    sodium: 85, calcium: 180, iron: 3.6, vitaminA: 120, vitaminC: 8, vitaminD: 80, vitaminB12: 1.2, potassium: 420,
  },
  "Sushi Platter": {
    servingSize: "12 pieces (320g)",
    calories: 420, protein: 28, carbs: 60, fat: 8, fiber: 2, sugar: 4,
    sodium: 980, calcium: 80, iron: 1.4, vitaminA: 140, vitaminC: 4, vitaminD: 240, vitaminB12: 3.2, potassium: 380,
  },
  "Vegetable Stir Fry": {
    servingSize: "1 large serving (350g)",
    calories: 220, protein: 8, carbs: 38, fat: 6, fiber: 7, sugar: 10,
    sodium: 680, calcium: 120, iron: 2.4, vitaminA: 4800, vitaminC: 62, vitaminD: 0, vitaminB12: 0, potassium: 680,
  },
  "Greek Yogurt Parfait": {
    servingSize: "1 cup (280g)",
    calories: 260, protein: 18, carbs: 34, fat: 6, fiber: 3, sugar: 22,
    sodium: 95, calcium: 320, iron: 0.8, vitaminA: 120, vitaminC: 12, vitaminD: 60, vitaminB12: 1.4, potassium: 380,
  },
  "Protein Smoothie": {
    servingSize: "1 large glass (400ml)",
    calories: 380, protein: 32, carbs: 42, fat: 8, fiber: 5, sugar: 24,
    sodium: 180, calcium: 380, iron: 2.2, vitaminA: 480, vitaminC: 32, vitaminD: 120, vitaminB12: 2.8, potassium: 740,
  },
};

// Keywords to detect food type from filename or fallback
const foodKeywords: Record<string, string> = {
  salmon: "Grilled Salmon",
  fish: "Grilled Salmon",
  seafood: "Grilled Salmon",
  chicken: "Chicken Caesar Salad",
  salad: "Chicken Caesar Salad",
  avocado: "Avocado Toast",
  toast: "Avocado Toast",
  burger: "Beef Burger",
  beef: "Beef Burger",
  pizza: "Margherita Pizza",
  oat: "Oatmeal Bowl",
  oatmeal: "Oatmeal Bowl",
  sushi: "Sushi Platter",
  rice: "Sushi Platter",
  stir: "Vegetable Stir Fry",
  vegetable: "Vegetable Stir Fry",
  veggie: "Vegetable Stir Fry",
  yogurt: "Greek Yogurt Parfait",
  parfait: "Greek Yogurt Parfait",
  smoothie: "Protein Smoothie",
  shake: "Protein Smoothie",
};

function detectFoodFromFilename(filename: string): string {
  const lower = filename.toLowerCase();
  for (const [keyword, food] of Object.entries(foodKeywords)) {
    if (lower.includes(keyword)) return food;
  }
  // Random realistic fallback
  const foods = Object.keys(foodProfiles);
  return foods[Math.floor(Math.random() * foods.length)];
}

function calcHealthScore(profile: typeof foodProfiles[string]): number {
  let score = 60;
  // Protein bonus
  if (profile.protein > 30) score += 10;
  else if (profile.protein > 20) score += 5;
  // Fiber bonus
  if (profile.fiber > 7) score += 10;
  else if (profile.fiber > 4) score += 5;
  // Vitamin bonus
  if (profile.vitaminC > 30) score += 5;
  if (profile.vitaminD > 200) score += 5;
  // Calorie penalty
  if (profile.calories > 600) score -= 10;
  else if (profile.calories < 300) score -= 0;
  // Sodium penalty
  if (profile.sodium > 1000) score -= 15;
  else if (profile.sodium > 700) score -= 8;
  // Fat penalty
  if (profile.fat > 35) score -= 10;
  // Sugar penalty
  if (profile.sugar > 15) score -= 8;
  return Math.min(100, Math.max(10, score));
}

function buildProsAndCons(name: string, profile: typeof foodProfiles[string]): { pros: string[]; cons: string[] } {
  const pros: string[] = [];
  const cons: string[] = [];

  if (profile.protein > 25) pros.push(`Excellent protein source (${profile.protein}g) — supports muscle repair and satiety`);
  if (profile.fiber > 5) pros.push(`High dietary fiber (${profile.fiber}g) — promotes gut health and blood sugar stability`);
  if (profile.vitaminD > 200) pros.push(`Rich in Vitamin D (${profile.vitaminD} IU) — essential for bone health and immunity`);
  if (profile.vitaminC > 25) pros.push(`High Vitamin C content (${profile.vitaminC}mg) — powerful antioxidant`);
  if (profile.vitaminB12 > 2) pros.push(`Good Vitamin B12 source (${profile.vitaminB12}mcg) — supports nerve function`);
  if (profile.potassium > 500) pros.push(`High potassium (${profile.potassium}mg) — heart and blood pressure friendly`);
  if (profile.calcium > 200) pros.push(`Good calcium content (${profile.calcium}mg) — bone strengthening`);
  if (profile.carbs < 15 && profile.fat < 20) pros.push("Low in carbs and fat — ideal for weight management");
  if (profile.calories < 350) pros.push("Relatively low calorie density — satisfying without excess");

  if (profile.sodium > 900) cons.push(`High sodium (${profile.sodium}mg) — limit if managing hypertension`);
  if (profile.sugar > 12) cons.push(`Elevated sugar content (${profile.sugar}g) — monitor if diabetic`);
  if (profile.fat > 30) cons.push(`High total fat (${profile.fat}g) — watch overall daily fat intake`);
  if (profile.calories > 600) cons.push(`High calorie count (${profile.calories} kcal) — adjust portions for weight loss goals`);
  if (profile.fiber < 2) cons.push("Low dietary fiber — pair with high-fiber side dish");
  if (profile.vitaminC < 5) cons.push("Minimal Vitamin C — add citrus or bell peppers to boost intake");
  if (profile.vitaminD < 20 && profile.vitaminD > 0) cons.push("Low Vitamin D — supplement or get 15 min daily sunlight");

  return { pros, cons };
}

export async function analyzeFoodImage(file: File): Promise<FoodAnalysis> {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 2200));

  const detectedFood = detectFoodFromFilename(file.name);
  const profile = foodProfiles[detectedFood];
  const healthScore = calcHealthScore(profile);
  const { pros, cons } = buildProsAndCons(detectedFood, profile);

  const healthLabel =
    healthScore >= 80 ? "Excellent Choice 🌟" :
    healthScore >= 65 ? "Healthy Option ✅" :
    healthScore >= 50 ? "Moderate — Eat Mindfully ⚠️" :
    "Occasional Treat — Limit Portions 🚨";

  const recommendation =
    healthScore >= 80
      ? `${detectedFood} is a nutritional powerhouse. Great choice for your health goals! Add to your daily log to track your macro targets.`
      : healthScore >= 65
      ? `${detectedFood} provides solid nutrition. Pair it with more vegetables or a protein source to optimize your meal.`
      : healthScore >= 50
      ? `${detectedFood} can be part of a balanced diet in moderation. Watch sodium and sugar content if you have specific health conditions.`
      : `${detectedFood} is best enjoyed occasionally. Consider lighter alternatives or reduce portion size for your health goals.`;

  return {
    detectedFood,
    confidence: Math.floor(Math.random() * 8 + 88), // 88-96%
    ...profile,
    healthScore,
    healthLabel,
    pros,
    cons,
    recommendation,
  };
}
