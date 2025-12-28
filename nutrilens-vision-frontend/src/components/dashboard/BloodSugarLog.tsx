import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Droplet, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface BloodSugarEntry {
  id: string;
  glucose_level: number;
  measurement_type: string;
  notes: string | null;
  logged_at: string;
}

const measurementTypes = [
  { value: 'fasting', label: 'Fasting', description: 'Before eating' },
  { value: 'before_meal', label: 'Before Meal', description: '30 min before eating' },
  { value: 'after_meal', label: 'After Meal', description: '2 hours after eating' },
  { value: 'bedtime', label: 'Bedtime', description: 'Before sleep' },
  { value: 'random', label: 'Random', description: 'Any time' },
];

const getGlucoseStatus = (level: number, type: string) => {
  if (type === 'fasting' || type === 'before_meal') {
    if (level < 70) return { status: 'low', color: 'text-info', bg: 'bg-info/10' };
    if (level <= 100) return { status: 'normal', color: 'text-success', bg: 'bg-success/10' };
    if (level <= 125) return { status: 'elevated', color: 'text-warning', bg: 'bg-warning/10' };
    return { status: 'high', color: 'text-destructive', bg: 'bg-destructive/10' };
  } else {
    // After meal or random
    if (level < 70) return { status: 'low', color: 'text-info', bg: 'bg-info/10' };
    if (level <= 140) return { status: 'normal', color: 'text-success', bg: 'bg-success/10' };
    if (level <= 180) return { status: 'elevated', color: 'text-warning', bg: 'bg-warning/10' };
    return { status: 'high', color: 'text-destructive', bg: 'bg-destructive/10' };
  }
};

export function BloodSugarLog() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<BloodSugarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    glucose_level: '',
    measurement_type: 'fasting',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('blood_sugar_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.glucose_level) return;

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('blood_sugar_logs')
        .insert({
          user_id: user.id,
          glucose_level: Number(newEntry.glucose_level),
          measurement_type: newEntry.measurement_type,
          notes: newEntry.notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => [data, ...prev]);
      setNewEntry({ glucose_level: '', measurement_type: 'fasting', notes: '' });
      setShowForm(false);
      
      toast({
        title: 'Reading logged',
        description: 'Your blood sugar reading has been saved',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Could not save reading',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const latestReading = entries[0];
  const averageReading = entries.length > 0
    ? Math.round(entries.reduce((sum, e) => sum + e.glucose_level, 0) / entries.length)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blood Sugar Log</h1>
          <p className="text-muted-foreground">Track your glucose levels over time</p>
        </div>
        <motion.button
          onClick={() => setShowForm(!showForm)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90"
        >
          <Plus className="h-5 w-5" />
          Log Reading
        </motion.button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-5 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Droplet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Latest Reading</p>
              <p className="text-2xl font-bold text-foreground">
                {latestReading ? `${latestReading.glucose_level} mg/dL` : '--'}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-5 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10">
              <TrendingUp className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average</p>
              <p className="text-2xl font-bold text-foreground">
                {averageReading ? `${averageReading} mg/dL` : '--'}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-5 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
              <Calendar className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Readings</p>
              <p className="text-2xl font-bold text-foreground">{entries.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add Entry Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6 shadow-lg"
        >
          <h3 className="mb-4 font-semibold text-foreground">New Reading</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Glucose Level (mg/dL)
              </label>
              <input
                type="number"
                value={newEntry.glucose_level}
                onChange={(e) => setNewEntry(prev => ({ ...prev, glucose_level: e.target.value }))}
                placeholder="e.g., 95"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Measurement Type
              </label>
              <select
                value={newEntry.measurement_type}
                onChange={(e) => setNewEntry(prev => ({ ...prev, measurement_type: e.target.value }))}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {measurementTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label} - {type.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-foreground">
              Notes (optional)
            </label>
            <input
              type="text"
              value={newEntry.notes}
              onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="e.g., After exercise, feeling dizzy"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Reading'}
            </button>
          </div>
        </motion.form>
      )}

      {/* Entries List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card shadow-lg"
      >
        <div className="border-b border-border p-4">
          <h3 className="font-semibold text-foreground">Recent Readings</h3>
        </div>

        {loading ? (
          <div className="space-y-2 p-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="p-8 text-center">
            <Droplet className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No readings logged yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {entries.map((entry) => {
              const status = getGlucoseStatus(entry.glucose_level, entry.measurement_type);
              return (
                <div key={entry.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${status.bg}`}>
                      <span className={`text-lg font-bold ${status.color}`}>
                        {entry.glucose_level}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground capitalize">
                        {entry.measurement_type.replace('_', ' ')}
                      </p>
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(entry.logged_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${status.bg} ${status.color}`}>
                    {status.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
