import { motion } from 'framer-motion';
import { Calculator, Info, Zap, Activity, Target } from 'lucide-react';
import { calculationExplanation } from '@/lib/health-guidance';
import { Gender } from '@/contexts/UserContext';

interface CalculationExplainerProps {
  gender: Gender;
  weight: number;
  height: number;
  age: number;
  activityLevel?: string;
  goals: string[];
  bmr: number;
  tdee: number;
  targetCalories: number;
}

export function CalculationExplainer({
  gender,
  weight,
  height,
  age,
  activityLevel = 'moderate',
  goals,
  bmr,
  tdee,
  targetCalories,
}: CalculationExplainerProps) {
  const activityMultiplier = calculationExplanation.tdee.multipliers[activityLevel as keyof typeof calculationExplanation.tdee.multipliers] 
    || calculationExplanation.tdee.multipliers.moderate;
  
  const goalAdjustment = targetCalories - tdee;
  const primaryGoal = goals[0] || 'maintain_weight';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-6 shadow-lg"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
          <Calculator className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Why These Numbers Work for You</h2>
          <p className="text-sm text-muted-foreground">Science-backed calculations personalized to your body</p>
        </div>
      </div>

      {/* Visual Calculation Flow */}
      <div className="mb-6 rounded-xl bg-gradient-to-r from-primary/5 to-success/5 p-4">
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between rounded-lg bg-background/60 p-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">BMR (at rest)</span>
            </div>
            <span className="font-bold text-foreground">{Math.round(bmr)} kcal</span>
          </div>
          
          <div className="flex items-center justify-center">
            <span className="text-muted-foreground">× {activityMultiplier.value} ({activityMultiplier.label})</span>
          </div>
          
          <div className="flex items-center justify-between rounded-lg bg-background/60 p-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-info" />
              <span className="text-muted-foreground">TDEE (daily burn)</span>
            </div>
            <span className="font-bold text-foreground">{Math.round(tdee)} kcal</span>
          </div>
          
          <div className="flex items-center justify-center">
            <span className={`${goalAdjustment >= 0 ? 'text-success' : 'text-destructive'}`}>
              {goalAdjustment >= 0 ? '+' : ''}{goalAdjustment} (goal adjustment)
            </span>
          </div>
          
          <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 p-3 ring-2 ring-primary/30">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">Your Daily Target</span>
            </div>
            <span className="text-lg font-bold text-primary">{targetCalories} kcal</span>
          </div>
        </div>
      </div>

      {/* Explanation Cards */}
      <div className="space-y-4">
        {/* BMR Explanation */}
        <div className="rounded-xl border border-border/50 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <span className="text-sm font-bold text-primary">1</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{calculationExplanation.bmr.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{calculationExplanation.bmr.description}</p>
              <div className="mt-2 rounded-lg bg-muted/50 p-2">
                <code className="text-xs text-muted-foreground">
                  {calculationExplanation.bmr.formula[gender]}
                </code>
              </div>
              <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Info className="h-3 w-3" />
                {calculationExplanation.bmr.source}
              </p>
            </div>
          </div>
        </div>

        {/* TDEE Explanation */}
        <div className="rounded-xl border border-border/50 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-info/10">
              <span className="text-sm font-bold text-info">2</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{calculationExplanation.tdee.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{calculationExplanation.tdee.description}</p>
              <div className="mt-2 grid gap-1">
                {Object.entries(calculationExplanation.tdee.multipliers).map(([key, mult]) => (
                  <div 
                    key={key}
                    className={`flex items-center justify-between rounded px-2 py-1 text-xs ${
                      key === activityLevel ? 'bg-info/20 text-info font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    <span>{mult.label}</span>
                    <span>×{mult.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Goal Adjustment */}
        <div className="rounded-xl border border-border/50 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
              <span className="text-sm font-bold text-success">3</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{calculationExplanation.goalAdjustment.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{calculationExplanation.goalAdjustment.description}</p>
              <div className="mt-2 grid gap-1">
                {Object.entries(calculationExplanation.goalAdjustment.adjustments).map(([key, adj]) => (
                  <div 
                    key={key}
                    className={`flex items-center justify-between rounded px-2 py-1 text-xs ${
                      goals.includes(key) ? 'bg-success/20 text-success font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    <span className="capitalize">{key.replace('_', ' ')}</span>
                    <span>{adj.value >= 0 ? '+' : ''}{adj.value} kcal ({adj.label})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
