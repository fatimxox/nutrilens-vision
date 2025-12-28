import { motion } from 'framer-motion';
import { Ruler, Scale, Calendar } from 'lucide-react';

interface Biometrics {
  height: number;
  weight: number;
  age: number;
}

interface BiometricsInputProps {
  biometrics: Biometrics;
  onBiometricsChange: (bio: Biometrics) => void;
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  onChange: (value: number) => void;
}

function CustomSlider({ label, value, min, max, unit, icon: Icon, onChange }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className="rounded-xl bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <span className="font-medium text-foreground">{label}</span>
      </div>

      <div className="relative mb-4">
        {/* Value display above thumb */}
        <div
          className="absolute -top-8 flex -translate-x-1/2 flex-col items-center transition-all duration-150"
          style={{ left: `${percentage}%` }}
        >
          <span className="rounded-lg bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground shadow-md">
            {value} {unit}
          </span>
          <div className="h-2 w-2 rotate-45 bg-primary" />
        </div>

        {/* Track */}
        <div className="relative h-3 rounded-full bg-muted">
          {/* Active fill */}
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.15 }}
          />
          
          {/* Native range input (invisible but functional) */}
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={handleChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            style={{ WebkitAppearance: 'none' }}
          />
          
          {/* Custom thumb */}
          <motion.div
            className="pointer-events-none absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-4 border-primary bg-card shadow-lg"
            animate={{ left: `calc(${percentage}% - 12px)` }}
            transition={{ duration: 0.15 }}
          />
        </div>

        {/* Min/Max labels */}
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{min} {unit}</span>
          <span>{max} {unit}</span>
        </div>
      </div>
    </div>
  );
}

export function BiometricsInput({ biometrics, onBiometricsChange }: BiometricsInputProps) {
  const updateBiometric = (key: keyof Biometrics, value: number) => {
    onBiometricsChange({ ...biometrics, [key]: value });
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
          Your Measurements
        </h2>
        <p className="text-muted-foreground">
          Help us calculate your personalized nutrition targets
        </p>
      </div>

      <div className="space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CustomSlider
            label="Height"
            value={biometrics.height}
            min={100}
            max={250}
            unit="cm"
            icon={Ruler}
            onChange={(v) => updateBiometric('height', v)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CustomSlider
            label="Weight"
            value={biometrics.weight}
            min={30}
            max={200}
            unit="kg"
            icon={Scale}
            onChange={(v) => updateBiometric('weight', v)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CustomSlider
            label="Age"
            value={biometrics.age}
            min={13}
            max={100}
            unit="years"
            icon={Calendar}
            onChange={(v) => updateBiometric('age', v)}
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 rounded-xl bg-accent p-4 text-center"
      >
        <p className="text-sm text-accent-foreground">
          Based on your measurements, we'll calculate your daily calorie needs and macro targets.
        </p>
      </motion.div>
    </div>
  );
}
