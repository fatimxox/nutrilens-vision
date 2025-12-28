import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  RefreshCw,
  Plus,
  ChefHat,
  Flame,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

interface MealSuggestion {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: string;
  ingredients: string[];
}

export function MealPlanner() {
  const { toast } = useToast();
  const { profile, dailyLog, addMeal } = useUser();
  const [suggestions, setSuggestions] = useState<MealSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remainingCalories = dailyLog.calories.target - dailyLog.calories.consumed;
  const remainingProtein = 120 - dailyLog.macros.protein;
  const remainingCarbs = 250 - dailyLog.macros.carbs;
  const remainingFats = 65 - dailyLog.macros.fats;

  const generateSuggestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/suggest-meals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          remainingCalories: Math.max(0, remainingCalories),
          remainingProtein: Math.max(0, remainingProtein),
          remainingCarbs: Math.max(0, remainingCarbs),
          remainingFats: Math.max(0, remainingFats),
          goals: profile.goals,
          medicalConditions: profile.medicalConditions,
          allergies: profile.allergies,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();

      if (data?.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (err: any) {
      console.error('Error generating suggestions:', err);
      setError('Could not generate meal suggestions. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to generate meal suggestions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const logSuggestion = (suggestion: MealSuggestion) => {
    const meal = {
      id: `meal_${Date.now()}`,
      timestamp: new Date(),
      imageUrl: '',
      items: suggestion.ingredients.map(ing => ({
        name: ing,
        confidence: 1,
        nutrition: {
          calories: Math.round(suggestion.calories / suggestion.ingredients.length),
          protein: Math.round(suggestion.protein / suggestion.ingredients.length),
          carbs: Math.round(suggestion.carbs / suggestion.ingredients.length),
          fats: Math.round(suggestion.fat / suggestion.ingredients.length),
          glycemicIndex: 50,
        },
        allergenFlags: [],
      })),
      totalCalories: suggestion.calories,
      totalProtein: suggestion.protein,
      totalCarbs: suggestion.carbs,
      totalFats: suggestion.fat,
    };

    addMeal(meal);

    toast({
      title: 'Meal logged!',
      description: `${suggestion.name} added to your daily log`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Meal Planner</h1>
          <p className="text-muted-foreground">Personalized meal suggestions based on your remaining macros</p>
        </div>
        <motion.button
          onClick={generateSuggestions}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:shadow-xl disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="h-5 w-5" />
          )}
          {loading ? 'Generating...' : 'Get Suggestions'}
        </motion.button>
      </div>

      {/* Remaining Macros Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-lg"
      >
        <h3 className="mb-4 font-semibold text-foreground">Remaining for Today</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-destructive/10 p-3 text-center">
            <Flame className="mx-auto h-5 w-5 text-destructive" />
            <p className="mt-1 text-lg font-bold text-foreground">
              {Math.max(0, remainingCalories)}
            </p>
            <p className="text-xs text-muted-foreground">Calories</p>
          </div>
          <div className="rounded-xl bg-primary/10 p-3 text-center">
            <p className="text-lg font-bold text-primary">{Math.max(0, remainingProtein)}g</p>
            <p className="text-xs text-muted-foreground">Protein</p>
          </div>
          <div className="rounded-xl bg-warning/10 p-3 text-center">
            <p className="text-lg font-bold text-warning">{Math.max(0, remainingCarbs)}g</p>
            <p className="text-xs text-muted-foreground">Carbs</p>
          </div>
          <div className="rounded-xl bg-info/10 p-3 text-center">
            <p className="text-lg font-bold text-info">{Math.max(0, remainingFats)}g</p>
            <p className="text-xs text-muted-foreground">Fats</p>
          </div>
        </div>
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4"
        >
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
          <button
            onClick={generateSuggestions}
            className="ml-auto flex items-center gap-1 text-sm text-destructive hover:underline"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </motion.div>
      )}

      {/* Suggestions */}
      {suggestions.length === 0 && !loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center"
        >
          <ChefHat className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            Ready to plan your meals?
          </h3>
          <p className="mt-2 text-muted-foreground">
            Click "Get Suggestions" to receive AI-powered meal recommendations based on your remaining macros, goals, and dietary restrictions.
          </p>
        </motion.div>
      )}

      <AnimatePresence mode="popLayout">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={`${suggestion.name}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-2xl border border-border bg-card p-5 shadow-lg transition-all hover:shadow-xl"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
                  <ChefHat className="h-6 w-6 text-primary" />
                </div>
                <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                  {suggestion.prepTime}
                </span>
              </div>

              <h3 className="font-semibold text-foreground">{suggestion.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {suggestion.description}
              </p>

              {/* Macros */}
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-1 text-destructive">
                  <Flame className="h-3 w-3" />
                  {suggestion.calories} kcal
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                  P: {suggestion.protein}g
                </span>
                <span className="rounded-full bg-warning/10 px-2 py-1 text-warning">
                  C: {suggestion.carbs}g
                </span>
                <span className="rounded-full bg-info/10 px-2 py-1 text-info">
                  F: {suggestion.fat}g
                </span>
              </div>

              {/* Ingredients Preview */}
              <div className="mt-3">
                <p className="text-xs text-muted-foreground">
                  {suggestion.ingredients.slice(0, 3).join(', ')}
                  {suggestion.ingredients.length > 3 && ` +${suggestion.ingredients.length - 3} more`}
                </p>
              </div>

              {/* Action */}
              <button
                onClick={() => logSuggestion(suggestion)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Log This Meal
              </button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
