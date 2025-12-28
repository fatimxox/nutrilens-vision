// Health guidance data for medical conditions and allergies

export interface FoodGuidance {
  avoid: string[];
  eat: string[];
  tips: string[];
}

export const conditionGuidance: Record<string, FoodGuidance> = {
  diabetes: {
    avoid: [
      'White bread & rice',
      'Sugary drinks & sodas',
      'Candy & sweets',
      'Fruit juices',
      'Processed snacks',
      'Honey & syrups',
    ],
    eat: [
      'Whole grains (quinoa, oats)',
      'Leafy greens & vegetables',
      'Lean proteins (chicken, fish)',
      'Berries (in moderation)',
      'Nuts & seeds',
      'Legumes & beans',
    ],
    tips: [
      'Monitor carbohydrate intake',
      'Eat smaller, frequent meals',
      'Choose low glycemic index foods',
      'Pair carbs with protein',
    ],
  },
  hypertension: {
    avoid: [
      'High sodium foods',
      'Processed meats (bacon, deli)',
      'Canned soups & sauces',
      'Fast food',
      'Pickled foods',
      'Salty snacks',
    ],
    eat: [
      'Bananas (potassium-rich)',
      'Leafy green vegetables',
      'Fatty fish (salmon, mackerel)',
      'Whole grains',
      'Berries & citrus fruits',
      'Low-fat dairy',
    ],
    tips: [
      'Limit sodium to 2,300mg/day',
      'Follow the DASH diet',
      'Increase potassium intake',
      'Cook at home to control salt',
    ],
  },
  heart_disease: {
    avoid: [
      'Fried foods',
      'Red meat (limit)',
      'Full-fat dairy',
      'Trans fats',
      'Processed meats',
      'Excess sugar & salt',
    ],
    eat: [
      'Omega-3 rich fish',
      'Olive oil & avocados',
      'Whole grains & fiber',
      'Colorful vegetables',
      'Nuts (walnuts, almonds)',
      'Beans & legumes',
    ],
    tips: [
      'Focus on heart-healthy fats',
      'Increase fiber intake',
      'Limit saturated fats',
      'Choose lean proteins',
    ],
  },
  kidney_disease: {
    avoid: [
      'High sodium foods',
      'High potassium fruits (bananas)',
      'Processed foods',
      'Dark colas',
      'Dairy products (limit)',
      'Whole grains (limit phosphorus)',
    ],
    eat: [
      'Cabbage & cauliflower',
      'Bell peppers',
      'Apples & berries',
      'Egg whites',
      'Fish (limited portions)',
      'Rice & pasta',
    ],
    tips: [
      'Monitor protein intake',
      'Limit phosphorus & potassium',
      'Control fluid intake if advised',
      'Work with a renal dietitian',
    ],
  },
  celiac_disease: {
    avoid: [
      'Wheat products',
      'Barley & rye',
      'Regular bread & pasta',
      'Beer & malt beverages',
      'Some sauces & dressings',
      'Processed foods (check labels)',
    ],
    eat: [
      'Rice & quinoa',
      'Corn & potatoes',
      'Certified gluten-free oats',
      'Fresh fruits & vegetables',
      'Meat, fish & eggs',
      'Gluten-free grains (buckwheat)',
    ],
    tips: [
      'Always read food labels',
      'Avoid cross-contamination',
      'Look for certified GF products',
      'Be cautious dining out',
    ],
  },
  ibs: {
    avoid: [
      'High-FODMAP foods',
      'Dairy products (if lactose intolerant)',
      'Beans & lentils',
      'Onions & garlic',
      'Carbonated drinks',
      'Artificial sweeteners',
    ],
    eat: [
      'Low-FODMAP vegetables',
      'Lean proteins',
      'Bananas & berries',
      'Rice & potatoes',
      'Lactose-free dairy',
      'Eggs',
    ],
    tips: [
      'Keep a food diary',
      'Eat smaller meals',
      'Stay hydrated',
      'Consider the Low-FODMAP diet',
    ],
  },
};

export const allergyWarnings: Record<string, string[]> = {
  peanuts: [
    'Peanut butter & oil',
    'Many Asian dishes',
    'Some candies & chocolates',
    'Baked goods',
    'Ice cream',
    'Sauces (satay, some curries)',
  ],
  tree_nuts: [
    'Almonds, walnuts, cashews',
    'Marzipan & nougat',
    'Pesto sauce',
    'Some cereals',
    'Nut butters & oils',
    'Many desserts',
  ],
  dairy: [
    'Milk & cream',
    'Cheese & butter',
    'Yogurt & ice cream',
    'Many baked goods',
    'Some processed meats',
    'Casein/whey in products',
  ],
  eggs: [
    'Mayonnaise',
    'Many baked goods',
    'Pasta (some types)',
    'Meringue & custards',
    'Some sauces',
    'Egg noodles',
  ],
  wheat: [
    'Bread & pasta',
    'Cereals',
    'Baked goods',
    'Beer',
    'Soy sauce',
    'Some processed foods',
  ],
  soy: [
    'Tofu & tempeh',
    'Soy sauce',
    'Edamame',
    'Many processed foods',
    'Some chocolates',
    'Vegetable oils',
  ],
  shellfish: [
    'Shrimp & lobster',
    'Crab & crayfish',
    'Some fish sauces',
    'Seafood restaurants (cross-contact)',
    'Some supplements',
    'Certain ethnic cuisines',
  ],
  fish: [
    'All fish varieties',
    'Fish sauce',
    'Caesar dressing',
    'Worcestershire sauce',
    'Some Asian dishes',
    'Omega-3 supplements',
  ],
  gluten: [
    'Wheat, barley, rye',
    'Regular bread & pasta',
    'Most cereals',
    'Beer',
    'Many sauces',
    'Processed foods',
  ],
};

export const calculationExplanation = {
  bmr: {
    title: 'Basal Metabolic Rate (BMR)',
    description: 'The calories your body needs at complete rest to maintain basic functions like breathing and circulation.',
    formula: {
      male: '(10 × weight kg) + (6.25 × height cm) - (5 × age) + 5',
      female: '(10 × weight kg) + (6.25 × height cm) - (5 × age) - 161',
    },
    source: 'Mifflin-St Jeor Equation (most accurate for most people)',
  },
  tdee: {
    title: 'Total Daily Energy Expenditure (TDEE)',
    description: 'Your BMR multiplied by an activity factor to account for daily movement and exercise.',
    multipliers: {
      sedentary: { value: 1.2, label: 'Little or no exercise' },
      light: { value: 1.375, label: '1-3 days/week' },
      moderate: { value: 1.55, label: '3-5 days/week' },
      active: { value: 1.725, label: '6-7 days/week' },
      veryActive: { value: 1.9, label: 'Very hard exercise/physical job' },
    },
  },
  goalAdjustment: {
    title: 'Goal-Based Adjustment',
    description: 'Your TDEE adjusted based on your health goals.',
    adjustments: {
      weight_loss: { value: -500, label: '~0.5 kg/week loss' },
      muscle_gain: { value: 300, label: 'Lean muscle building' },
      maintain_weight: { value: 0, label: 'Maintain current weight' },
    },
  },
};
