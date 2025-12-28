import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill, 
  Plus, 
  Bell, 
  Check, 
  Clock, 
  Trash2,
  X,
  BellRing
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Medication {
  id: string;
  medication_name: string;
  dosage: string | null;
  frequency: string;
  reminder_times: string[];
  is_active: boolean;
  last_taken_at: string | null;
}

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'twice_daily', label: 'Twice Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'as_needed', label: 'As Needed' },
];

export function MedicationReminders() {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newMed, setNewMed] = useState({
    medication_name: '',
    dosage: '',
    frequency: 'daily',
    reminder_times: ['08:00'],
  });

  useEffect(() => {
    loadMedications();
    requestNotificationPermission();
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const loadMedications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('medication_reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedications(data || []);
    } catch (error: any) {
      console.error('Error loading medications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.medication_name) return;

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('medication_reminders')
        .insert({
          user_id: user.id,
          medication_name: newMed.medication_name,
          dosage: newMed.dosage || null,
          frequency: newMed.frequency,
          reminder_times: newMed.reminder_times,
        })
        .select()
        .single();

      if (error) throw error;

      setMedications(prev => [data, ...prev]);
      setNewMed({ medication_name: '', dosage: '', frequency: 'daily', reminder_times: ['08:00'] });
      setShowForm(false);
      
      toast({
        title: 'Medication added',
        description: 'Reminder has been set up',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Could not add medication',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const markAsTaken = async (med: Medication) => {
    try {
      const { error } = await supabase
        .from('medication_reminders')
        .update({ last_taken_at: new Date().toISOString() })
        .eq('id', med.id);

      if (error) throw error;

      setMedications(prev =>
        prev.map(m => m.id === med.id ? { ...m, last_taken_at: new Date().toISOString() } : m)
      );

      toast({
        title: 'Marked as taken',
        description: `${med.medication_name} logged`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Could not update medication',
        variant: 'destructive',
      });
    }
  };

  const toggleActive = async (med: Medication) => {
    try {
      const { error } = await supabase
        .from('medication_reminders')
        .update({ is_active: !med.is_active })
        .eq('id', med.id);

      if (error) throw error;

      setMedications(prev =>
        prev.map(m => m.id === med.id ? { ...m, is_active: !m.is_active } : m)
      );
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Could not update medication',
        variant: 'destructive',
      });
    }
  };

  const deleteMedication = async (medId: string) => {
    try {
      const { error } = await supabase
        .from('medication_reminders')
        .delete()
        .eq('id', medId);

      if (error) throw error;

      setMedications(prev => prev.filter(m => m.id !== medId));
      toast({
        title: 'Medication removed',
        description: 'Reminder has been deleted',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Could not delete medication',
        variant: 'destructive',
      });
    }
  };

  const addReminderTime = () => {
    setNewMed(prev => ({
      ...prev,
      reminder_times: [...prev.reminder_times, '12:00'],
    }));
  };

  const updateReminderTime = (index: number, value: string) => {
    setNewMed(prev => ({
      ...prev,
      reminder_times: prev.reminder_times.map((t, i) => i === index ? value : t),
    }));
  };

  const removeReminderTime = (index: number) => {
    setNewMed(prev => ({
      ...prev,
      reminder_times: prev.reminder_times.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Medication Reminders</h1>
          <p className="text-muted-foreground">Never miss a dose with smart reminders</p>
        </div>
        <motion.button
          onClick={() => setShowForm(!showForm)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90"
        >
          <Plus className="h-5 w-5" />
          Add Medication
        </motion.button>
      </div>

      {/* Notification Permission Banner */}
      {'Notification' in window && Notification.permission === 'default' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl border border-info/30 bg-info/10 p-4"
        >
          <BellRing className="h-5 w-5 text-info" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Enable notifications</p>
            <p className="text-xs text-muted-foreground">Get reminded when it's time to take your medication</p>
          </div>
          <button
            onClick={requestNotificationPermission}
            className="rounded-lg bg-info/20 px-3 py-1.5 text-sm font-medium text-info hover:bg-info/30 transition-colors"
          >
            Enable
          </button>
        </motion.div>
      )}

      {/* Add Medication Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-card p-6 shadow-lg"
          >
            <h3 className="mb-4 font-semibold text-foreground">Add New Medication</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Medication Name
                </label>
                <input
                  type="text"
                  value={newMed.medication_name}
                  onChange={(e) => setNewMed(prev => ({ ...prev, medication_name: e.target.value }))}
                  placeholder="e.g., Metformin"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Dosage
                </label>
                <input
                  type="text"
                  value={newMed.dosage}
                  onChange={(e) => setNewMed(prev => ({ ...prev, dosage: e.target.value }))}
                  placeholder="e.g., 500mg"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Frequency
                </label>
                <select
                  value={newMed.frequency}
                  onChange={(e) => setNewMed(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {frequencyOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Reminder Times
                </label>
                <div className="space-y-2">
                  {newMed.reminder_times.map((time, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => updateReminderTime(index, e.target.value)}
                        className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
                      />
                      {newMed.reminder_times.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeReminderTime(index)}
                          className="rounded-lg bg-destructive/10 px-2 text-destructive hover:bg-destructive/20"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addReminderTime}
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Plus className="h-3 w-3" />
                    Add time
                  </button>
                </div>
              </div>
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
                {saving ? 'Saving...' : 'Add Medication'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Medications List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : medications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center"
        >
          <Pill className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">No medications added</h3>
          <p className="mt-2 text-muted-foreground">
            Add your medications to receive timely reminders
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {medications.map((med) => (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-2xl border p-5 shadow-lg transition-all ${
                med.is_active 
                  ? 'border-border bg-card' 
                  : 'border-border/50 bg-muted/30 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    med.is_active ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <Pill className={`h-6 w-6 ${med.is_active ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{med.medication_name}</h3>
                    {med.dosage && (
                      <p className="text-sm text-muted-foreground">{med.dosage}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteMedication(med.id)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="flex items-center gap-1 rounded-full bg-info/10 px-2 py-1 text-info">
                  <Clock className="h-3 w-3" />
                  {med.frequency.replace('_', ' ')}
                </span>
                {med.reminder_times.map((time, i) => (
                  <span key={i} className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-muted-foreground">
                    <Bell className="h-3 w-3" />
                    {time}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => markAsTaken(med)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-success/10 py-2 text-sm font-medium text-success hover:bg-success/20 transition-colors"
                >
                  <Check className="h-4 w-4" />
                  Mark as Taken
                </button>
                <button
                  onClick={() => toggleActive(med)}
                  className={`rounded-xl px-3 py-2 text-sm transition-colors ${
                    med.is_active 
                      ? 'bg-muted text-muted-foreground hover:bg-muted/80' 
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  {med.is_active ? 'Pause' : 'Resume'}
                </button>
              </div>

              {med.last_taken_at && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Last taken: {format(new Date(med.last_taken_at), 'MMM d, h:mm a')}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
