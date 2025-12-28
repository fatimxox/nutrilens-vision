import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Award, Star, Target, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StreakData {
  current_streak: number;
  longest_streak: number;
  total_logs: number;
  badges: string[];
  last_log_date: string | null;
}

const BADGES = [
  { id: 'first_log', name: 'First Step', icon: Star, requirement: 1, description: 'Log your first meal' },
  { id: 'week_streak', name: '7-Day Streak', icon: Flame, requirement: 7, description: 'Log meals for 7 days straight' },
  { id: 'month_streak', name: '30-Day Warrior', icon: Trophy, requirement: 30, description: 'Maintain a 30-day streak' },
  { id: 'century', name: 'Century Club', icon: Award, requirement: 100, description: '100 total meal logs' },
  { id: 'dedication', name: 'Dedicated', icon: Target, requirement: 14, description: '2-week streak' },
];

export function StreakTracker() {
  const { toast } = useToast();
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStreakData();
  }, []);

  const loadStreakData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setStreakData(data);
      } else {
        // Create initial streak record
        const { data: newStreak, error: createError } = await supabase
          .from('user_streaks')
          .insert({ user_id: user.id })
          .select()
          .single();

        if (createError) throw createError;
        setStreakData(newStreak);
      }
    } catch (error: any) {
      console.error('Error loading streak data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 animate-pulse">
        <div className="h-20 bg-muted rounded-xl" />
      </div>
    );
  }

  const currentStreak = streakData?.current_streak || 0;
  const longestStreak = streakData?.longest_streak || 0;
  const totalLogs = streakData?.total_logs || 0;
  const earnedBadges = streakData?.badges || [];

  return (
    <div className="space-y-6">
      {/* Main Streak Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-primary-glow/5 p-6 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Daily Streak</h2>
            <p className="text-sm text-muted-foreground">Keep logging to maintain your streak!</p>
          </div>
          <motion.div
            animate={{ 
              scale: currentStreak > 0 ? [1, 1.1, 1] : 1,
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="relative"
          >
            <div className={`flex h-20 w-20 items-center justify-center rounded-full ${
              currentStreak > 0 
                ? 'bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/30' 
                : 'bg-muted'
            }`}>
              <Flame className={`h-10 w-10 ${currentStreak > 0 ? 'text-white' : 'text-muted-foreground'}`} />
            </div>
            {currentStreak > 0 && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground shadow-lg">
                {currentStreak}
              </span>
            )}
          </motion.div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-background/50 p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-primary">
              <Flame className="h-4 w-4" />
              <span className="text-2xl font-bold">{currentStreak}</span>
            </div>
            <p className="text-xs text-muted-foreground">Current</p>
          </div>
          <div className="rounded-xl bg-background/50 p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-warning">
              <Trophy className="h-4 w-4" />
              <span className="text-2xl font-bold">{longestStreak}</span>
            </div>
            <p className="text-xs text-muted-foreground">Best</p>
          </div>
          <div className="rounded-xl bg-background/50 p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-success">
              <Calendar className="h-4 w-4" />
              <span className="text-2xl font-bold">{totalLogs}</span>
            </div>
            <p className="text-xs text-muted-foreground">Total Logs</p>
          </div>
        </div>
      </motion.div>

      {/* Badges Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-lg"
      >
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <Award className="h-5 w-5 text-warning" />
          Achievements
        </h3>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BADGES.map((badge) => {
            const isEarned = earnedBadges.includes(badge.id);
            const progress = badge.id === 'century' 
              ? Math.min(totalLogs / badge.requirement, 1)
              : Math.min(currentStreak / badge.requirement, 1);

            return (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.02 }}
                className={`relative rounded-xl border p-4 transition-all ${
                  isEarned 
                    ? 'border-warning/50 bg-warning/10' 
                    : 'border-border bg-muted/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isEarned ? 'bg-warning/20' : 'bg-muted'
                  }`}>
                    <badge.icon className={`h-5 w-5 ${isEarned ? 'text-warning' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${isEarned ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {badge.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                </div>
                
                {!isEarned && (
                  <div className="mt-3">
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress * 100}%` }}
                        className="h-full rounded-full bg-primary/50"
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground text-right">
                      {Math.round(progress * 100)}%
                    </p>
                  </div>
                )}

                {isEarned && (
                  <div className="absolute -right-1 -top-1">
                    <Star className="h-5 w-5 fill-warning text-warning" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
