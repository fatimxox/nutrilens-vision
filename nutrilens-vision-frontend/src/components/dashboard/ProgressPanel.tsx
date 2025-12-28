import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Calendar, Target, Flame, Droplets } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

export function ProgressPanel() {
  const { dailyLog, profile } = useUser();

  // Mock weekly data for visualization
  const weeklyData = [
    { day: 'Mon', calories: 1850, protein: 95, water: 7 },
    { day: 'Tue', calories: 2100, protein: 110, water: 8 },
    { day: 'Wed', calories: 1950, protein: 105, water: 6 },
    { day: 'Thu', calories: 2200, protein: 120, water: 8 },
    { day: 'Fri', calories: 1800, protein: 90, water: 7 },
    { day: 'Sat', calories: 2400, protein: 130, water: 5 },
    { day: 'Sun', calories: dailyLog.calories.consumed, protein: dailyLog.macros.protein, water: dailyLog.water.glasses },
  ];

  const maxCalories = Math.max(...weeklyData.map(d => d.calories), dailyLog.calories.target);
  const avgCalories = Math.round(weeklyData.reduce((a, b) => a + b.calories, 0) / 7);
  const avgProtein = Math.round(weeklyData.reduce((a, b) => a + b.protein, 0) / 7);

  const stats = [
    {
      label: 'Avg Daily Calories',
      value: avgCalories,
      target: dailyLog.calories.target,
      icon: Flame,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      label: 'Avg Protein',
      value: `${avgProtein}g`,
      target: '120g',
      icon: Target,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Hydration Rate',
      value: '85%',
      target: '100%',
      icon: Droplets,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      label: 'Streak',
      value: '7 days',
      target: 'Active',
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Progress</h1>
        <p className="text-muted-foreground">Track your nutrition journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl bg-card p-6 shadow-lg border border-border/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span className="text-xs text-muted-foreground">Target: {stat.target}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Weekly Calories Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-card p-6 shadow-lg border border-border/50"
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Weekly Overview</h2>
              <p className="text-sm text-muted-foreground">Calorie intake this week</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Calories</span>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="flex items-end gap-3 h-48">
          {weeklyData.map((day, index) => {
            const height = (day.calories / maxCalories) * 100;
            const isToday = index === weeklyData.length - 1;
            const isOverTarget = day.calories > dailyLog.calories.target;
            
            return (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground">{day.calories}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5, ease: 'easeOut' }}
                  className={`w-full rounded-t-lg transition-colors ${
                    isToday
                      ? 'bg-gradient-to-t from-primary to-primary-glow shadow-lg shadow-primary/30'
                      : isOverTarget
                      ? 'bg-warning'
                      : 'bg-primary/40'
                  }`}
                />
                <span className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                  {day.day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Target line indicator */}
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Minus className="h-4 w-4" />
          <span>Target: {dailyLog.calories.target} cal/day</span>
        </div>
      </motion.div>

      {/* Insights */}
      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl bg-gradient-to-br from-success/10 to-card p-6 border border-success/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/20">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <h3 className="font-semibold text-foreground">What's Working</h3>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Consistent protein intake above 100g
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Regular meal logging habit
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Good hydration on most days
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl bg-gradient-to-br from-warning/10 to-card p-6 border border-warning/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/20">
              <TrendingDown className="h-5 w-5 text-warning" />
            </div>
            <h3 className="font-semibold text-foreground">Areas to Improve</h3>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              Weekend calorie spikes detected
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              Fiber intake below recommended
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              Consider earlier dinner timing
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
