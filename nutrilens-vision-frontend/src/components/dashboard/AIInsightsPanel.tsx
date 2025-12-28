import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RefreshCw, TrendingUp, AlertCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface Insight {
  id: string;
  type: 'trend' | 'gap' | 'timing' | 'tip';
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  message: string;
  color: string;
}

const generateInsights = (dailyLog: any, profile: any): Insight[] => {
  const insights: Insight[] = [];
  
  const proteinPercentage = dailyLog.macros.protein > 0 ? (dailyLog.macros.protein / 120) * 100 : 0;
  
  if (proteinPercentage > 120) {
    insights.push({
      id: 'protein-high',
      type: 'trend',
      icon: TrendingUp,
      title: 'Protein Intake',
      message: `Your protein intake is ${Math.round(proteinPercentage - 100)}% above target today. Great for muscle building!`,
      color: 'text-success',
    });
  } else if (proteinPercentage < 50 && dailyLog.meals.length > 0) {
    insights.push({
      id: 'protein-low',
      type: 'gap',
      icon: AlertCircle,
      title: 'Protein Gap',
      message: 'Consider adding protein-rich foods like eggs, chicken, or legumes to meet your daily target.',
      color: 'text-warning',
    });
  }

  if (dailyLog.meals.length === 0) {
    insights.push({
      id: 'first-meal',
      type: 'tip',
      icon: Lightbulb,
      title: 'Get Started',
      message: 'Upload your first meal to begin tracking! Take a photo of your breakfast to kickstart your nutrition journey.',
      color: 'text-primary',
    });
  }

  if (profile.goals.includes('weight_loss')) {
    insights.push({
      id: 'weight-loss-tip',
      type: 'tip',
      icon: Lightbulb,
      title: 'Weight Loss Tip',
      message: 'Eating protein with every meal helps maintain muscle mass while losing fat. Aim for 30g per meal.',
      color: 'text-primary',
    });
  }

  if (profile.goals.includes('diabetes_management')) {
    insights.push({
      id: 'diabetes-tip',
      type: 'timing',
      icon: Clock,
      title: 'Blood Sugar Tip',
      message: 'Pair carbs with protein or healthy fats to slow glucose absorption and prevent blood sugar spikes.',
      color: 'text-info',
    });
  }

  // Default insights if none generated
  if (insights.length === 0) {
    insights.push({
      id: 'default-1',
      type: 'tip',
      icon: Lightbulb,
      title: 'Nutrition Tip',
      message: 'Colorful vegetables provide diverse micronutrients. Try to include 5 different colors on your plate today!',
      color: 'text-primary',
    });
  }

  insights.push({
    id: 'hydration',
    type: 'tip',
    icon: Lightbulb,
    title: 'Stay Hydrated',
    message: 'Drinking water before meals can help with portion control and improve digestion.',
    color: 'text-info',
  });

  return insights;
};

export function AIInsightsPanel() {
  const { dailyLog, profile } = useUser();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setInsights(generateInsights(dailyLog, profile));
  }, [dailyLog, profile]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setInsights(generateInsights(dailyLog, profile));
      setCurrentIndex(0);
      setIsRefreshing(false);
    }, 500);
  };

  const nextInsight = () => {
    setCurrentIndex((prev) => (prev + 1) % insights.length);
  };

  const prevInsight = () => {
    setCurrentIndex((prev) => (prev - 1 + insights.length) % insights.length);
  };

  if (insights.length === 0) return null;

  const currentInsight = insights[currentIndex];
  const IconComponent = currentInsight.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-card to-accent/20 p-6 shadow-lg border border-border/50"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Lightbulb className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">AI Insights</h3>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentInsight.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[100px]"
        >
          <div className="mb-3 flex items-center gap-2">
            <IconComponent className={`h-5 w-5 ${currentInsight.color}`} />
            <span className="font-medium text-foreground">{currentInsight.title}</span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {currentInsight.message}
          </p>
        </motion.div>
      </AnimatePresence>

      {insights.length > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={prevInsight}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <div className="flex gap-1.5">
            {insights.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'w-4 bg-primary' 
                    : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextInsight}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
}