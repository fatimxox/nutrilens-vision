import { motion } from 'framer-motion';

interface MacroRingsProps {
  calories: { consumed: number; target: number };
  protein: { current: number; target: number };
  carbs: { current: number; target: number };
  fats: { current: number; target: number };
}

interface RingProps {
  progress: number;
  color: string;
  radius: number;
  strokeWidth: number;
}

function Ring({ progress, color, radius, strokeWidth }: RingProps) {
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(progress, 100);
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <motion.circle
      cx="100"
      cy="100"
      r={radius}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeDasharray={circumference}
      initial={{ strokeDashoffset: circumference }}
      animate={{ strokeDashoffset }}
      transition={{ duration: 1, ease: 'easeOut' }}
      style={{
        transformOrigin: 'center',
        transform: 'rotate(-90deg)',
      }}
    />
  );
}

export function MacroRings({ calories, protein, carbs, fats }: MacroRingsProps) {
  const calorieProgress = (calories.consumed / calories.target) * 100;
  const proteinProgress = (protein.current / protein.target) * 100;
  const carbsProgress = (carbs.current / carbs.target) * 100;
  const fatsProgress = (fats.current / fats.target) * 100;

  const getCalorieColor = () => {
    if (calorieProgress < 90) return 'hsl(160, 84%, 39%)'; // Primary green
    if (calorieProgress <= 110) return 'hsl(38, 92%, 50%)'; // Warning amber
    return 'hsl(0, 84%, 60%)'; // Destructive red
  };

  const macros = [
    { label: 'Protein', current: protein.current, target: protein.target, color: 'hsl(160, 84%, 39%)' },
    { label: 'Carbs', current: carbs.current, target: carbs.target, color: 'hsl(38, 92%, 50%)' },
    { label: 'Fats', current: fats.current, target: fats.target, color: 'hsl(0, 84%, 60%)' },
  ];

  return (
    <div className="rounded-2xl bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Daily Progress</h2>

      {/* Rings visualization */}
      <div className="relative mx-auto mb-6 h-[200px] w-[200px]">
        <svg
          viewBox="0 0 200 200"
          className="h-full w-full"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Background tracks */}
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="14"
          />
          <circle
            cx="100"
            cy="100"
            r="65"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="14"
          />
          <circle
            cx="100"
            cy="100"
            r="45"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="14"
          />

          {/* Progress rings */}
          <Ring
            progress={proteinProgress}
            color="hsl(160, 84%, 39%)"
            radius={85}
            strokeWidth={14}
          />
          <Ring
            progress={carbsProgress}
            color="hsl(38, 92%, 50%)"
            radius={65}
            strokeWidth={14}
          />
          <Ring
            progress={fatsProgress}
            color="hsl(0, 84%, 60%)"
            radius={45}
            strokeWidth={14}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={calories.consumed}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-bold"
            style={{ color: getCalorieColor() }}
          >
            {calories.consumed}
          </motion.span>
          <span className="text-sm text-muted-foreground">/ {calories.target} cal</span>
        </div>
      </div>

      {/* Macro breakdown */}
      <div className="space-y-3">
        {macros.map((macro) => {
          const progress = Math.min((macro.current / macro.target) * 100, 100);
          return (
            <div key={macro.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: macro.color }}
                  />
                  <span className="font-medium text-foreground">{macro.label}</span>
                </div>
                <span className="text-muted-foreground">
                  {macro.current}g / {macro.target}g
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: macro.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
