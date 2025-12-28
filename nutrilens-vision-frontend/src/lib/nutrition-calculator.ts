// Nutrition calculation utilities based on scientific formulas

export type Gender = 'male' | 'female';

export interface Biometrics {
  height: number; // cm
  weight: number; // kg
  age: number;
}

export interface NutritionTargets {
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
  waterGlasses: number;
}

export interface PersonalizedRecommendation {
  greeting: string;
  calorieAdvice: string;
  macroAdvice: string;
  goalTips: string[];
  medicalConsiderations: string[];
  dietType: string;
}

// Activity level multipliers
const ACTIVITY_LEVELS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor equation
 */
export function calculateBMR(gender: Gender, biometrics: Biometrics): number {
  const { weight, height, age } = biometrics;
  
  if (gender === 'male') {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
}

/**
 * Calculate Total Daily Energy Expenditure
 */
export function calculateTDEE(bmr: number, activityLevel: keyof typeof ACTIVITY_LEVELS = 'moderate'): number {
  return Math.round(bmr * ACTIVITY_LEVELS[activityLevel]);
}

/**
 * Calculate target calories based on goals
 */
export function calculateTargetCalories(tdee: number, goals: string[]): number {
  let adjustment = 0;
  
  if (goals.includes('weight_loss')) {
    adjustment -= 500; // 500 calorie deficit for healthy weight loss
  }
  if (goals.includes('muscle_gain')) {
    adjustment += 300; // 300 calorie surplus for muscle gain
  }
  if (goals.includes('maintain_weight')) {
    adjustment = 0;
  }
  
  return Math.max(1200, tdee + adjustment); // Never go below 1200 calories
}

/**
 * Calculate macronutrient targets
 */
export function calculateMacros(
  targetCalories: number, 
  goals: string[],
  gender: Gender
): { protein: number; carbs: number; fats: number } {
  // Protein: 1.6-2.2g per kg for muscle gain, 1.2-1.6g for weight loss
  // Default split: 30% protein, 40% carbs, 30% fats
  
  let proteinPercent = 0.30;
  let carbPercent = 0.40;
  let fatPercent = 0.30;
  
  if (goals.includes('muscle_gain')) {
    proteinPercent = 0.35;
    carbPercent = 0.40;
    fatPercent = 0.25;
  } else if (goals.includes('weight_loss')) {
    proteinPercent = 0.35;
    carbPercent = 0.35;
    fatPercent = 0.30;
  } else if (goals.includes('diabetes_management')) {
    proteinPercent = 0.30;
    carbPercent = 0.30; // Lower carbs for diabetes
    fatPercent = 0.40;
  }
  
  return {
    protein: Math.round((targetCalories * proteinPercent) / 4), // 4 cal/g
    carbs: Math.round((targetCalories * carbPercent) / 4), // 4 cal/g
    fats: Math.round((targetCalories * fatPercent) / 9), // 9 cal/g
  };
}

/**
 * Calculate all nutrition targets
 */
export function calculateNutritionTargets(
  gender: Gender,
  biometrics: Biometrics,
  goals: string[]
): NutritionTargets {
  const bmr = calculateBMR(gender, biometrics);
  const tdee = calculateTDEE(bmr);
  const targetCalories = calculateTargetCalories(tdee, goals);
  const macros = calculateMacros(targetCalories, goals, gender);
  
  // Water intake: ~30-35ml per kg of body weight
  const waterMl = biometrics.weight * 33;
  const waterGlasses = Math.round(waterMl / 250); // 250ml per glass
  
  return {
    bmr: Math.round(bmr),
    tdee,
    targetCalories,
    ...macros,
    waterGlasses: Math.max(6, Math.min(12, waterGlasses)), // 6-12 glasses
  };
}

/**
 * Generate personalized recommendation based on user profile
 */
export function generateRecommendation(
  firstName: string,
  gender: Gender,
  biometrics: Biometrics,
  goals: string[],
  medicalConditions: string[],
  allergies: string[]
): PersonalizedRecommendation {
  const targets = calculateNutritionTargets(gender, biometrics, goals);
  const bmi = biometrics.weight / ((biometrics.height / 100) ** 2);
  
  // Determine diet type
  let dietType = 'Balanced Nutrition';
  if (goals.includes('weight_loss')) {
    dietType = 'Calorie-Controlled Plan';
  } else if (goals.includes('muscle_gain')) {
    dietType = 'High-Protein Muscle Building';
  } else if (goals.includes('diabetes_management')) {
    dietType = 'Low-Glycemic Diet';
  } else if (goals.includes('heart_health')) {
    dietType = 'Heart-Healthy Mediterranean';
  }
  
  // Generate greeting
  const greeting = `Welcome, ${firstName}! Your personalized nutrition plan is ready.`;
  
  // Calorie advice
  const calorieAdvice = `Based on your profile, we recommend ${targets.targetCalories} calories daily to help you ${
    goals.includes('weight_loss') ? 'lose weight safely' :
    goals.includes('muscle_gain') ? 'build lean muscle' :
    'maintain optimal health'
  }.`;
  
  // Macro advice
  const macroAdvice = `Daily targets: ${targets.protein}g protein, ${targets.carbs}g carbs, ${targets.fats}g fats. Aim for ${targets.waterGlasses} glasses of water.`;
  
  // Goal-specific tips
  const goalTips: string[] = [];
  if (goals.includes('weight_loss')) {
    goalTips.push('Focus on high-fiber foods to stay full longer');
    goalTips.push('Eat protein with every meal to preserve muscle');
  }
  if (goals.includes('muscle_gain')) {
    goalTips.push('Consume protein within 30 minutes after workouts');
    goalTips.push('Spread protein intake across 4-5 meals daily');
  }
  if (goals.includes('energy_boost')) {
    goalTips.push('Include complex carbs for sustained energy');
    goalTips.push('Don\'t skip breakfast - it fuels your morning');
  }
  if (goals.includes('better_sleep')) {
    goalTips.push('Avoid caffeine after 2 PM');
    goalTips.push('Include magnesium-rich foods like nuts and seeds');
  }
  if (goals.includes('diabetes_management')) {
    goalTips.push('Choose low-glycemic index foods');
    goalTips.push('Monitor portion sizes carefully');
  }
  if (goalTips.length === 0) {
    goalTips.push('Eat a variety of colorful vegetables daily');
    goalTips.push('Stay consistent with meal timing');
  }
  
  // Medical considerations
  const medicalConsiderations: string[] = [];
  if (medicalConditions.includes('diabetes')) {
    medicalConsiderations.push('Monitor carbohydrate intake and glycemic index');
  }
  if (medicalConditions.includes('hypertension')) {
    medicalConsiderations.push('Limit sodium to under 2,300mg daily');
  }
  if (medicalConditions.includes('heart_disease')) {
    medicalConsiderations.push('Focus on omega-3 rich foods and limit saturated fats');
  }
  if (medicalConditions.includes('kidney_disease')) {
    medicalConsiderations.push('Monitor protein and potassium intake');
  }
  if (allergies.length > 0) {
    medicalConsiderations.push(`Avoid allergens: ${allergies.join(', ')}`);
  }
  
  return {
    greeting,
    calorieAdvice,
    macroAdvice,
    goalTips,
    medicalConsiderations,
    dietType,
  };
}

/**
 * Get BMI category
 */
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}
