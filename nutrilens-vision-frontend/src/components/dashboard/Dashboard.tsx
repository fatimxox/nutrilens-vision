import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardSidebar, DashboardTab } from './DashboardSidebar';
import { UploadCenter } from './UploadCenter';
import { MacroRings } from './MacroRings';
import { MealTimeline } from './MealTimeline';
import { AIInsightsPanel } from './AIInsightsPanel';
import { WaterTracker } from './WaterTracker';
import { SettingsPanel } from './SettingsPanel';
import { ProgressPanel } from './ProgressPanel';
import { ProfilePanel } from './ProfilePanel';
import { WelcomeMessage } from './WelcomeMessage';
import { StreakTracker } from './StreakTracker';
import { RecipeBook } from './RecipeBook';
import { MealPlanner } from './MealPlanner';
import { BloodSugarLog } from './BloodSugarLog';
import { MedicationReminders } from './MedicationReminders';
import { useUser } from '@/contexts/UserContext';
import { Flame, Target, Utensils, TrendingUp } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const { dailyLog, profile, account } = useUser();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const quickStats = [
    {
      label: 'Calories',
      value: dailyLog.calories.consumed,
      target: dailyLog.calories.target,
      icon: Flame,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      label: 'Protein',
      value: `${dailyLog.macros.protein}g`,
      target: '120g',
      icon: Target,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Meals',
      value: dailyLog.meals.length,
      target: '3',
      icon: Utensils,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Progress',
      value: `${Math.round((dailyLog.calories.consumed / dailyLog.calories.target) * 100)}%`,
      target: '100%',
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Welcome Message */}
            {showWelcome && (
              <WelcomeMessage onDismiss={() => setShowWelcome(false)} />
            )}

            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                {greeting()}, {account.firstName || 'there'}
              </h1>
              <p className="mt-1 text-muted-foreground">
                Track your nutrition and reach your{' '}
                {profile.goals[0]?.replace('_', ' ') || 'health'} goals.
              </p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="rounded-2xl bg-card p-5 shadow-lg border border-border/50"
                >
                  <div className="flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bgColor}`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <span className="text-xs text-muted-foreground">/ {stat.target}</span>
                  </div>
                  <p className="mt-3 text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
              {/* Left column */}
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <MacroRings
                    calories={{
                      consumed: dailyLog.calories.consumed,
                      target: dailyLog.calories.target,
                    }}
                    protein={{ current: dailyLog.macros.protein, target: 120 }}
                    carbs={{ current: dailyLog.macros.carbs, target: 250 }}
                    fats={{ current: dailyLog.macros.fats, target: 65 }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <MealTimeline />
                </motion.div>
              </div>

              {/* Right column */}
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <UploadCenter />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <WaterTracker />
                </motion.div>
              </div>
            </div>

            {/* AI Insights - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AIInsightsPanel />
            </motion.div>
          </div>
        );

      case 'meals':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Meals</h1>
              <p className="text-muted-foreground">Track and analyze your food intake</p>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              <UploadCenter />
              <MealTimeline />
            </div>
          </div>
        );

      case 'water':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Hydration</h1>
              <p className="text-muted-foreground">Stay hydrated throughout the day</p>
            </div>
            <div className="mx-auto max-w-md">
              <WaterTracker />
            </div>
          </div>
        );

      case 'progress':
        return <ProgressPanel />;

      case 'streaks':
        return <StreakTracker />;

      case 'recipes':
        return <RecipeBook />;

      case 'meal-planner':
        return <MealPlanner />;

      case 'blood-sugar':
        return <BloodSugarLog />;

      case 'medications':
        return <MedicationReminders />;

      case 'profile':
        return <ProfilePanel />;

      case 'settings':
        return <SettingsPanel />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={onLogout}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content */}
      <main
        className={`min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'
          }`}
      >
        <div className="mx-auto max-w-6xl px-6 py-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
