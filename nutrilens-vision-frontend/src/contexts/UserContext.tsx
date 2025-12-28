import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { calculateNutritionTargets } from '@/lib/nutrition-calculator';

export type Gender = 'male' | 'female';

export interface UserAccount {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  notifications: {
    meals: boolean;
    water: boolean;
    insights: boolean;
    weekly: boolean;
  };
}

export interface UserProfile {
  goals: string[];
  gender: Gender;
  biometrics: {
    height: number;
    weight: number;
    age: number;
  };
  medicalConditions: string[];
  allergies: string[];
}

export interface NutritionItem {
  name: string;
  confidence: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    glycemicIndex: number;
  };
  allergenFlags: string[];
}

export interface Meal {
  id: string;
  timestamp: Date;
  imageUrl: string;
  items: NutritionItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

export interface WaterLog {
  glasses: number;
  target: number;
  logs: { id: string; amount: number; timestamp: Date }[];
}

export interface DailyLog {
  meals: Meal[];
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  calories: {
    target: number;
    consumed: number;
  };
  water: WaterLog;
}

interface UserContextType {
  account: UserAccount;
  setAccount: React.Dispatch<React.SetStateAction<UserAccount>>;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  dailyLog: DailyLog;
  setDailyLog: React.Dispatch<React.SetStateAction<DailyLog>>;
  isOnboarded: boolean;
  setIsOnboarded: React.Dispatch<React.SetStateAction<boolean>>;
  addMeal: (meal: Meal) => void;
  addWater: (amount: number) => void;
}

const defaultAccount: UserAccount = {
  firstName: '',
  lastName: '',
  email: '',
  avatarUrl: '',
  notifications: {
    meals: true,
    water: true,
    insights: true,
    weekly: true,
  },
};

const defaultProfile: UserProfile = {
  goals: [],
  gender: 'male',
  biometrics: { height: 170, weight: 70, age: 30 },
  medicalConditions: [],
  allergies: [],
};

const defaultDailyLog: DailyLog = {
  meals: [],
  macros: { protein: 0, carbs: 0, fats: 0 },
  calories: { target: 2000, consumed: 0 },
  water: { glasses: 0, target: 8, logs: [] },
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<UserAccount>(defaultAccount);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [dailyLog, setDailyLog] = useState<DailyLog>(defaultDailyLog);
  const [isOnboarded, setIsOnboarded] = useState(false);

  // Auto-sync calorie and water targets based on profile
  useEffect(() => {
    const validGender = profile.gender === 'male' || profile.gender === 'female'
      ? profile.gender
      : 'male';

    const targets = calculateNutritionTargets(validGender, profile.biometrics, profile.goals);

    setDailyLog(prev => ({
      ...prev,
      calories: {
        ...prev.calories,
        target: targets.targetCalories,
      },
      water: {
        ...prev.water,
        target: targets.waterGlasses,
      },
    }));
  }, [profile.gender, profile.biometrics, profile.goals]);

  // Fetch meals on mount
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/meals`);
        if (response.ok) {
          const data = await response.json();
          if (data.meals && Array.isArray(data.meals)) {
            // Need to convert string timestamps back to Date objects
            const parsedMeals = data.meals.map((m: any) => ({
              ...m,
              timestamp: new Date(m.timestamp)
            }));

            setDailyLog(prev => ({
              ...prev,
              meals: parsedMeals,
              // Recalculate totals
              macros: {
                protein: parsedMeals.reduce((sum: number, m: any) => sum + m.totalProtein, 0),
                carbs: parsedMeals.reduce((sum: number, m: any) => sum + m.totalCarbs, 0),
                fats: parsedMeals.reduce((sum: number, m: any) => sum + m.totalFats, 0),
              },
              calories: {
                ...prev.calories,
                consumed: parsedMeals.reduce((sum: number, m: any) => sum + m.totalCalories, 0),
              }
            }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch meals:', error);
      }
    };

    fetchMeals();
  }, []);

  const addMeal = async (meal: Meal) => {
    // Optimistic update
    setDailyLog((prev) => ({
      ...prev,
      meals: [...prev.meals, meal],
      macros: {
        protein: prev.macros.protein + meal.totalProtein,
        carbs: prev.macros.carbs + meal.totalCarbs,
        fats: prev.macros.fats + meal.totalFats,
      },
      calories: {
        ...prev.calories,
        consumed: prev.calories.consumed + meal.totalCalories,
      },
    }));

    // Persist to backend
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      await fetch(`${apiUrl}/api/meals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meal),
      });
    } catch (error) {
      console.error('Failed to save meal to backend:', error);
      // TODO: Handle rollback or retry on failure
    }
  };

  const addWater = (amount: number) => {
    setDailyLog((prev) => ({
      ...prev,
      water: {
        ...prev.water,
        glasses: prev.water.glasses + amount,
        logs: [
          ...prev.water.logs,
          { id: `water_${Date.now()}`, amount, timestamp: new Date() },
        ],
      },
    }));
  };

  return (
    <UserContext.Provider
      value={{
        account,
        setAccount,
        profile,
        setProfile,
        dailyLog,
        setDailyLog,
        isOnboarded,
        setIsOnboarded,
        addMeal,
        addWater,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
