export interface FitnessProfile {
  age: number;
  height: number; // cm
  weight: number; // kg
  goal: 'weight-loss' | 'weight-gain' | 'muscle-gain' | 'maintenance';
  conditions: string[];
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  gender: 'male' | 'female';
}

export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  notes?: string;
}

export interface Exercise {
  name: string;
  sets?: number;
  reps?: string;
  duration?: string;
  rest?: string;
  notes?: string;
  category: 'cardio' | 'strength' | 'flexibility' | 'rest';
}

export interface DayPlan {
  day: string;
  date: string;
  theme: string;
  targetCalories: number;
  exercises: Exercise[];
  meals: Meal[];
  tips: string[];
  completed: boolean;
  completedTasks: string[];
}

export interface FitnessPlan {
  profile: FitnessProfile;
  bmi: number;
  bmiCategory: string;
  dailyCalories: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  waterTarget: number;
  weeklyPlan: DayPlan[];
  generalAdvice: string[];
  restrictions: string[];
}

function calculateBMR(profile: FitnessProfile): number {
  if (profile.gender === 'male') {
    return 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
  }
  return 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
}

function getActivityMultiplier(level: string): number {
  const map: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very-active': 1.9,
  };
  return map[level] || 1.55;
}

function applyConditionModifiers(
  conditions: string[],
  exercises: Exercise[],
  meals: Meal[]
): { exercises: Exercise[]; meals: Meal[]; restrictions: string[] } {
  const restrictions: string[] = [];

  if (conditions.includes('diabetes')) {
    restrictions.push('Avoid high-glycemic foods and sugary drinks');
    restrictions.push('Eat smaller meals every 3-4 hours to stabilize blood sugar');
    meals.forEach(m => {
      m.notes = (m.notes || '') + ' | Low-GI option preferred';
    });
  }

  if (conditions.includes('hypertension')) {
    restrictions.push('Limit sodium intake to under 1,500mg/day');
    restrictions.push('Avoid high-intensity lifting with breath holding (Valsalva)');
    exercises.forEach(e => {
      if (e.category === 'strength') {
        e.notes = (e.notes || '') + ' | Keep intensity moderate, breathe continuously';
      }
    });
  }

  if (conditions.includes('heart-disease')) {
    restrictions.push('Keep heart rate below 75% of maximum during cardio');
    restrictions.push('Avoid high-impact exercises — prefer walking, swimming, cycling');
    exercises.forEach(e => {
      if (e.category === 'cardio' && e.name.toLowerCase().includes('run')) {
        e.name = e.name.replace(/run/gi, 'Brisk Walk');
        e.notes = (e.notes || '') + ' | Modified for cardiac safety';
      }
    });
  }

  if (conditions.includes('arthritis')) {
    restrictions.push('Avoid high-impact exercises on affected joints');
    restrictions.push('Focus on low-impact activities: swimming, cycling, yoga');
  }

  if (conditions.includes('asthma')) {
    restrictions.push('Warm up thoroughly before cardio sessions');
    restrictions.push('Keep inhaler accessible during workouts');
    restrictions.push('Prefer indoor exercise in controlled environments');
  }

  if (conditions.includes('pcos')) {
    restrictions.push('Focus on insulin-sensitizing exercises like strength training');
    restrictions.push('Anti-inflammatory diet: reduce processed carbs and sugars');
  }

  return { exercises, meals, restrictions };
}

const dayThemes = [
  'Full Body Activation',
  'Cardio & Endurance',
  'Upper Body Strength',
  'Active Recovery & Mobility',
  'Lower Body Power',
  'HIIT & Fat Burn',
  'Rest & Regeneration',
];

const workoutsByGoal: Record<string, Exercise[][]> = {
  'weight-loss': [
    [
      { name: 'Jumping Jacks', duration: '3 min', category: 'cardio', notes: 'Warm-up' },
      { name: 'Bodyweight Squats', sets: 3, reps: '20', rest: '45s', category: 'strength' },
      { name: 'Push-Ups', sets: 3, reps: '15', rest: '45s', category: 'strength' },
      { name: 'Mountain Climbers', duration: '3 × 30s', rest: '30s', category: 'cardio' },
      { name: 'Plank Hold', duration: '3 × 40s', rest: '30s', category: 'strength' },
      { name: 'Cooldown Stretch', duration: '5 min', category: 'flexibility' },
    ],
    [
      { name: 'Brisk Walk / Light Jog', duration: '30 min', category: 'cardio' },
      { name: 'Cycling (Stationary)', duration: '20 min', category: 'cardio', notes: 'Moderate pace' },
      { name: 'High Knees', duration: '3 × 30s', rest: '20s', category: 'cardio' },
      { name: 'Yoga Flow', duration: '10 min', category: 'flexibility' },
    ],
    [
      { name: 'Dumbbell Shoulder Press', sets: 3, reps: '12', rest: '60s', category: 'strength' },
      { name: 'Dumbbell Bicep Curls', sets: 3, reps: '12', rest: '60s', category: 'strength' },
      { name: 'Tricep Dips', sets: 3, reps: '15', rest: '45s', category: 'strength' },
      { name: 'Lateral Raises', sets: 3, reps: '12', rest: '45s', category: 'strength' },
      { name: 'Face Pulls (Band)', sets: 3, reps: '15', rest: '45s', category: 'strength' },
    ],
    [
      { name: 'Yoga / Stretching', duration: '30 min', category: 'flexibility' },
      { name: 'Foam Rolling', duration: '10 min', category: 'flexibility' },
      { name: 'Light Walk', duration: '20 min', category: 'cardio', notes: 'Easy pace' },
    ],
    [
      { name: 'Goblet Squats', sets: 4, reps: '15', rest: '60s', category: 'strength' },
      { name: 'Romanian Deadlifts', sets: 3, reps: '12', rest: '60s', category: 'strength' },
      { name: 'Walking Lunges', sets: 3, reps: '10 each leg', rest: '45s', category: 'strength' },
      { name: 'Glute Bridges', sets: 3, reps: '20', rest: '30s', category: 'strength' },
      { name: 'Calf Raises', sets: 3, reps: '25', rest: '30s', category: 'strength' },
    ],
    [
      { name: 'HIIT Circuit', duration: '20 min', category: 'cardio', notes: '30s on / 15s off' },
      { name: 'Burpees', sets: 4, reps: '10', rest: '30s', category: 'cardio' },
      { name: 'Jump Squats', sets: 4, reps: '12', rest: '30s', category: 'cardio' },
      { name: 'Sprint Intervals', duration: '10 × 20s sprints', rest: '40s', category: 'cardio' },
    ],
    [
      { name: 'Complete Rest Day', category: 'rest', notes: 'Recovery is where growth happens' },
      { name: 'Light Stretching (optional)', duration: '15 min', category: 'flexibility' },
    ],
  ],
  'weight-gain': [
    [
      { name: 'Barbell Bench Press', sets: 4, reps: '8-10', rest: '90s', category: 'strength' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10', rest: '75s', category: 'strength' },
      { name: 'Pull-Ups / Lat Pulldown', sets: 4, reps: '8', rest: '90s', category: 'strength' },
      { name: 'Bent-Over Rows', sets: 4, reps: '10', rest: '75s', category: 'strength' },
      { name: 'Overhead Press', sets: 3, reps: '10', rest: '75s', category: 'strength' },
    ],
    [
      { name: 'Light Cardio Warm-up', duration: '10 min', category: 'cardio' },
      { name: 'Barbell Squats', sets: 5, reps: '5', rest: '2 min', category: 'strength', notes: 'Compound — priority lift' },
      { name: 'Romanian Deadlifts', sets: 4, reps: '8', rest: '90s', category: 'strength' },
      { name: 'Leg Press', sets: 3, reps: '12', rest: '90s', category: 'strength' },
      { name: 'Leg Curl', sets: 3, reps: '12', rest: '60s', category: 'strength' },
    ],
    [
      { name: 'Active Recovery Walk', duration: '30 min', category: 'cardio', notes: 'Easy pace' },
      { name: 'Stretching & Mobility', duration: '20 min', category: 'flexibility' },
    ],
    [
      { name: 'Deadlifts', sets: 5, reps: '5', rest: '2 min', category: 'strength', notes: 'Heavy compound' },
      { name: 'Pull-Ups', sets: 4, reps: '6-8', rest: '90s', category: 'strength' },
      { name: 'Dumbbell Rows', sets: 4, reps: '10', rest: '75s', category: 'strength' },
      { name: 'Face Pulls', sets: 3, reps: '15', rest: '45s', category: 'strength' },
    ],
    [
      { name: 'Dumbbell Shoulder Press', sets: 4, reps: '10', rest: '75s', category: 'strength' },
      { name: 'Lateral Raises', sets: 4, reps: '12', rest: '45s', category: 'strength' },
      { name: 'Bicep Curls', sets: 4, reps: '10', rest: '60s', category: 'strength' },
      { name: 'Tricep Pushdowns', sets: 4, reps: '12', rest: '60s', category: 'strength' },
      { name: 'Dips', sets: 3, reps: '12', rest: '75s', category: 'strength' },
    ],
    [
      { name: 'Front Squats', sets: 4, reps: '8', rest: '90s', category: 'strength' },
      { name: 'Hack Squats', sets: 3, reps: '10', rest: '75s', category: 'strength' },
      { name: 'Walking Lunges', sets: 3, reps: '12 each', rest: '60s', category: 'strength' },
      { name: 'Glute-Ham Raise', sets: 3, reps: '10', rest: '60s', category: 'strength' },
    ],
    [
      { name: 'Full Rest Day', category: 'rest', notes: 'Muscle is built during rest — prioritize sleep' },
      { name: 'Meal Prep (optional)', category: 'rest', notes: 'Prepare high-protein meals for the week' },
    ],
  ],
  'muscle-gain': [
    [
      { name: 'Bench Press', sets: 4, reps: '8', rest: '90s', category: 'strength' },
      { name: 'Incline Press', sets: 3, reps: '10', rest: '75s', category: 'strength' },
      { name: 'Cable Flyes', sets: 3, reps: '12', rest: '60s', category: 'strength' },
    ],
    [
      { name: 'Squats', sets: 4, reps: '8', rest: '2 min', category: 'strength' },
      { name: 'Leg Press', sets: 3, reps: '12', rest: '90s', category: 'strength' },
      { name: 'Leg Extensions', sets: 3, reps: '15', rest: '60s', category: 'strength' },
    ],
    [
      { name: 'Yoga & Mobility', duration: '40 min', category: 'flexibility' },
      { name: 'Foam Rolling', duration: '10 min', category: 'flexibility' },
    ],
    [
      { name: 'Deadlifts', sets: 4, reps: '6', rest: '2 min', category: 'strength' },
      { name: 'Pull-Ups', sets: 4, reps: '8', rest: '90s', category: 'strength' },
      { name: 'Seated Rows', sets: 3, reps: '12', rest: '60s', category: 'strength' },
    ],
    [
      { name: 'Overhead Press', sets: 4, reps: '8', rest: '90s', category: 'strength' },
      { name: 'Arnold Press', sets: 3, reps: '10', rest: '75s', category: 'strength' },
      { name: 'Lateral Raises', sets: 4, reps: '15', rest: '45s', category: 'strength' },
    ],
    [
      { name: 'Full Body Hypertrophy Circuit', duration: '45 min', category: 'strength', notes: 'Moderate weight, 12-15 reps, 30s rest' },
    ],
    [
      { name: 'Rest Day', category: 'rest' },
    ],
  ],
  'maintenance': [
    [
      { name: 'Moderate Cardio', duration: '30 min', category: 'cardio' },
      { name: 'Full Body Circuit', duration: '20 min', category: 'strength', notes: 'Bodyweight or light weights' },
    ],
    [
      { name: 'Yoga / Pilates', duration: '45 min', category: 'flexibility' },
    ],
    [
      { name: 'Swimming / Cycling', duration: '40 min', category: 'cardio' },
    ],
    [
      { name: 'Active Rest: Walk', duration: '45 min', category: 'cardio', notes: 'Enjoy the outdoors' },
    ],
    [
      { name: 'Strength Training', duration: '40 min', category: 'strength', notes: '3 sets × 10-12 reps, major muscles' },
    ],
    [
      { name: 'Dance / Sports / Recreation', duration: '60 min', category: 'cardio', notes: 'Fun activity of choice' },
    ],
    [
      { name: 'Rest & Recovery', category: 'rest' },
    ],
  ],
};

function generateMeals(calories: number, goal: string, conditions: string[]): Meal[] {
  const isLowGI = conditions.includes('diabetes');
  const isLowSodium = conditions.includes('hypertension');

  const baseProtein = Math.round((calories * 0.3) / 4);
  const baseCarbs = Math.round((calories * 0.4) / 4);
  const baseFat = Math.round((calories * 0.3) / 9);

  const mealsData: Meal[] = [
    {
      name: isLowGI ? 'Greek Yogurt with Berries & Chia Seeds' : 'Oatmeal with Banana & Honey',
      calories: Math.round(calories * 0.2),
      protein: Math.round(baseProtein * 0.2),
      carbs: Math.round(baseCarbs * 0.25),
      fat: Math.round(baseFat * 0.15),
      time: '7:00 AM',
      notes: isLowGI ? 'Low-GI breakfast' : undefined,
    },
    {
      name: 'Protein Shake with Almond Milk',
      calories: Math.round(calories * 0.1),
      protein: Math.round(baseProtein * 0.25),
      carbs: Math.round(baseCarbs * 0.1),
      fat: Math.round(baseFat * 0.05),
      time: '10:00 AM',
      notes: 'Pre or post workout',
    },
    {
      name: isLowSodium ? 'Grilled Chicken with Quinoa & Steamed Broccoli (no salt)' : 'Grilled Chicken with Brown Rice & Vegetables',
      calories: Math.round(calories * 0.35),
      protein: Math.round(baseProtein * 0.35),
      carbs: Math.round(baseCarbs * 0.35),
      fat: Math.round(baseFat * 0.3),
      time: '1:00 PM',
      notes: isLowSodium ? 'Use herbs instead of salt for flavor' : undefined,
    },
    {
      name: 'Apple with Almond Butter',
      calories: Math.round(calories * 0.1),
      protein: Math.round(baseProtein * 0.05),
      carbs: Math.round(baseCarbs * 0.15),
      fat: Math.round(baseFat * 0.15),
      time: '4:00 PM',
    },
    {
      name: goal === 'weight-loss'
        ? 'Baked Salmon with Asparagus & Cucumber Salad'
        : 'Beef Steak with Sweet Potato & Avocado',
      calories: Math.round(calories * 0.25),
      protein: Math.round(baseProtein * 0.35),
      carbs: Math.round(baseCarbs * 0.15),
      fat: Math.round(baseFat * 0.35),
      time: '7:30 PM',
    },
  ];

  return mealsData;
}

const tipsBank: Record<string, string[]> = {
  'weight-loss': [
    'Drink a glass of water 30 minutes before each meal to reduce appetite',
    'Aim for 7-9 hours of sleep — poor sleep increases ghrelin (hunger hormone)',
    'Track your food intake with a journal or app for accountability',
    'Replace processed snacks with whole fruits, nuts, or Greek yogurt',
  ],
  'weight-gain': [
    'Eat within 30 minutes after your workout to maximize muscle protein synthesis',
    'Add calorie-dense foods like nut butters, avocados, and whole milk',
    'Focus on compound lifts: squats, deadlifts, bench press, rows',
    'Sleep 8-9 hours — growth hormone is primarily released during deep sleep',
  ],
  'muscle-gain': [
    'Progressive overload: increase weight or reps each week by ~5%',
    'Track your lifts to ensure you are consistently progressing',
    'Prioritize protein timing: 20-40g within 1 hour post-workout',
    'Deload every 4-6 weeks to allow full recovery and prevent injury',
  ],
  'maintenance': [
    'Consistency over intensity — show up every day, even for light activity',
    'Mix cardio and strength to maintain both fitness and muscle mass',
    'Listen to your body — adjust intensity based on daily energy levels',
    'Stay hydrated and maintain consistent meal timing',
  ],
};

export function generateFitnessPlan(profile: FitnessProfile): FitnessPlan {
  const bmi = profile.weight / Math.pow(profile.height / 100, 2);
  const bmiCategory =
    bmi < 18.5 ? 'Underweight' :
    bmi < 25 ? 'Normal Weight' :
    bmi < 30 ? 'Overweight' : 'Obese';

  const bmr = calculateBMR(profile);
  const tdee = bmr * getActivityMultiplier(profile.activityLevel);

  let dailyCalories = Math.round(tdee);
  if (profile.goal === 'weight-loss') dailyCalories = Math.round(tdee - 500);
  if (profile.goal === 'weight-gain' || profile.goal === 'muscle-gain') dailyCalories = Math.round(tdee + 300);

  const proteinTarget = Math.round(profile.weight * (profile.goal === 'muscle-gain' ? 2.2 : 1.8));
  const fatTarget = Math.round((dailyCalories * 0.28) / 9);
  const carbsTarget = Math.round((dailyCalories - proteinTarget * 4 - fatTarget * 9) / 4);
  const waterTarget = Math.round(profile.weight * 0.033 * 10) / 10;

  const goalKey = profile.goal === 'muscle-gain' ? 'muscle-gain' : profile.goal;
  const workoutPlan = workoutsByGoal[goalKey] || workoutsByGoal['weight-loss'];
  const tips = tipsBank[goalKey] || tipsBank['weight-loss'];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const today = new Date();

  const weeklyPlan: DayPlan[] = days.map((day, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const exercises = [...(workoutPlan[i] || workoutPlan[6])];
    const meals = generateMeals(dailyCalories, profile.goal, profile.conditions);

    const modded = applyConditionModifiers(profile.conditions, exercises, meals);

    return {
      day,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      theme: dayThemes[i],
      targetCalories: dailyCalories,
      exercises: modded.exercises,
      meals: modded.meals,
      tips: [tips[i % tips.length]],
      completed: false,
      completedTasks: [],
    };
  });

  const allRestrictions: string[] = [];
  profile.conditions.forEach(c => {
    const temp = applyConditionModifiers([c], [], []);
    allRestrictions.push(...temp.restrictions);
  });

  return {
    profile,
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory,
    dailyCalories,
    proteinTarget,
    carbsTarget,
    fatTarget,
    waterTarget,
    weeklyPlan,
    generalAdvice: tips,
    restrictions: [...new Set(allRestrictions)],
  };
}
