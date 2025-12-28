import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';
import { useUser, Meal } from '@/contexts/UserContext';

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

function getCalorieBadgeColor(calories: number, target: number): string {
  const dailyMealTarget = target / 3; // Assume 3 meals per day
  const percentage = (calories / dailyMealTarget) * 100;
  
  if (percentage <= 100) return 'bg-primary text-primary-foreground';
  if (percentage <= 120) return 'bg-warning text-warning-foreground';
  return 'bg-destructive text-destructive-foreground';
}

interface MealCardProps {
  meal: Meal;
  target: number;
  index: number;
}

function MealCard({ meal, target, index }: MealCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="group cursor-pointer overflow-hidden rounded-xl bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="relative h-32 overflow-hidden">
        <img
          src={meal.imageUrl}
          alt={`Meal at ${formatTime(meal.timestamp)}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div
          className={`absolute right-2 top-2 rounded-full px-2.5 py-1 text-xs font-semibold ${getCalorieBadgeColor(
            meal.totalCalories,
            target
          )}`}
        >
          {meal.totalCalories} cal
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {formatTime(meal.timestamp)}
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {meal.items.length} item{meal.items.length !== 1 ? 's' : ''}
        </p>
      </div>
    </motion.div>
  );
}

export function MealTimeline() {
  const { dailyLog } = useUser();
  const meals = dailyLog.meals;

  return (
    <div className="rounded-2xl bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Recent Meals</h2>
        {meals.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {meals.length} meal{meals.length !== 1 ? 's' : ''} today
          </span>
        )}
      </div>

      {meals.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {meals.map((meal, index) => (
              <MealCard
                key={meal.id}
                meal={meal}
                target={dailyLog.calories.target}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Clock className="h-8 w-8" />
          </div>
          <p className="font-medium text-foreground">No meals logged yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload a photo to start tracking your nutrition
          </p>
        </motion.div>
      )}
    </div>
  );
}
