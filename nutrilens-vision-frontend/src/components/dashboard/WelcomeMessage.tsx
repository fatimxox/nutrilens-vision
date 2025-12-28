import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Target, 
  Flame, 
  Droplets, 
  TrendingUp, 
  Heart,
  AlertTriangle,
  X,
  ChevronRight
} from 'lucide-react';
import { useUser, Gender } from '@/contexts/UserContext';
import { 
  calculateNutritionTargets, 
  generateRecommendation,
  NutritionTargets,
  PersonalizedRecommendation 
} from '@/lib/nutrition-calculator';

interface WelcomeMessageProps {
  onDismiss: () => void;
}

export function WelcomeMessage({ onDismiss }: WelcomeMessageProps) {
  const { account, profile } = useUser();
  const [isVisible, setIsVisible] = useState(true);
  const [targets, setTargets] = useState<NutritionTargets | null>(null);
  const [recommendation, setRecommendation] = useState<PersonalizedRecommendation | null>(null);

  useEffect(() => {
    // Ensure gender is valid for calculation
    const validGender: Gender = profile.gender === 'male' || profile.gender === 'female' 
      ? profile.gender 
      : 'male'; // Default fallback
    
    const nutritionTargets = calculateNutritionTargets(
      validGender,
      profile.biometrics,
      profile.goals
    );
    setTargets(nutritionTargets);

    const displayName = account.firstName?.trim() || 'there';
    const rec = generateRecommendation(
      displayName,
      validGender,
      profile.biometrics,
      profile.goals,
      profile.medicalConditions,
      profile.allergies
    );
    setRecommendation(rec);
  }, [account, profile]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  if (!targets || !recommendation) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-2xl sm:p-8"
        >
          {/* Background decoration */}
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-primary/20 to-primary-glow/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-accent/10 blur-2xl" />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="relative mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">{recommendation.dietType}</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-foreground sm:text-3xl"
            >
              {recommendation.greeting}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-2 text-muted-foreground"
            >
              {recommendation.calorieAdvice}
            </motion.p>
          </div>

          {/* Nutrition Targets Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { 
                label: 'Daily Calories', 
                value: targets.targetCalories, 
                unit: 'kcal',
                icon: Flame, 
                color: 'text-destructive',
                bgColor: 'bg-destructive/10'
              },
              { 
                label: 'Protein', 
                value: targets.protein, 
                unit: 'g',
                icon: Target, 
                color: 'text-primary',
                bgColor: 'bg-primary/10'
              },
              { 
                label: 'Carbs', 
                value: targets.carbs, 
                unit: 'g',
                icon: TrendingUp, 
                color: 'text-warning',
                bgColor: 'bg-warning/10'
              },
              { 
                label: 'Water', 
                value: targets.waterGlasses, 
                unit: 'glasses',
                icon: Droplets, 
                color: 'text-info',
                bgColor: 'bg-info/10'
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="rounded-2xl bg-background/50 p-4 backdrop-blur-sm border border-border/50"
              >
                <div className={`mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">{stat.unit}</span>
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="relative mb-6"
          >
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
              <Heart className="h-4 w-4 text-primary" />
              Personalized Tips
            </h3>
            <div className="space-y-2">
              {recommendation.goalTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span>{tip}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Medical Considerations */}
          {recommendation.medicalConsiderations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="relative rounded-xl bg-warning/10 border border-warning/20 p-4"
            >
              <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-warning">
                <AlertTriangle className="h-4 w-4" />
                Health Considerations
              </h3>
              <ul className="space-y-1">
                {recommendation.medicalConsiderations.map((consideration, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {consideration}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            onClick={handleDismiss}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-primary to-primary-glow py-3 font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:shadow-xl"
          >
            Start Tracking
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
