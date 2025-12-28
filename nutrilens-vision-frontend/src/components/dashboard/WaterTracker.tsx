import { motion } from 'framer-motion';
import { Droplets, Plus, Minus } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

export function WaterTracker() {
  const { dailyLog, addWater } = useUser();
  const { toast } = useToast();
  const { glasses, target } = dailyLog.water;
  const percentage = Math.min((glasses / target) * 100, 100);

  const handleAddWater = () => {
    if (glasses < target) {
      addWater(1);
      if (glasses + 1 === target) {
        toast({
          title: 'Hydration Goal Reached!',
          description: 'You\'ve reached your daily water intake goal.',
        });
      }
    }
  };

  const waterLevels = Array.from({ length: target }, (_, i) => i < glasses);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-br from-info/10 via-card to-info/5 p-6 shadow-lg border border-info/20"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/20">
            <Droplets className="h-5 w-5 text-info" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Water Intake</h3>
            <p className="text-xs text-muted-foreground">Stay hydrated</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-info">{glasses}</p>
          <p className="text-xs text-muted-foreground">of {target} glasses</p>
        </div>
      </div>

      {/* Water visualization */}
      <div className="mb-6">
        <div className="flex justify-center gap-2">
          {waterLevels.map((filled, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`relative h-16 w-8 rounded-b-lg rounded-t-sm border-2 overflow-hidden transition-all duration-300 ${
                filled ? 'border-info bg-info/20' : 'border-border bg-muted/30'
              }`}
            >
              {filled && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-info to-info/60"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full bg-gradient-to-r from-info to-info/70 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {Math.round(percentage)}% of daily goal
        </p>
      </div>

      {/* Add water button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAddWater}
        disabled={glasses >= target}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-info py-3 font-medium text-info-foreground shadow-lg shadow-info/30 transition-all hover:bg-info/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
      >
        <Plus className="h-5 w-5" />
        Add Glass
      </motion.button>

      {/* Quick add options */}
      <div className="mt-3 flex gap-2">
        {[250, 500].map((ml) => (
          <button
            key={ml}
            onClick={handleAddWater}
            disabled={glasses >= target}
            className="flex-1 rounded-lg border border-info/30 py-2 text-sm text-info hover:bg-info/10 transition-colors disabled:opacity-50"
          >
            +{ml}ml
          </button>
        ))}
      </div>
    </motion.div>
  );
}
