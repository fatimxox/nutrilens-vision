import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Camera, Mail, Save, Check } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

export function SettingsPanel() {
  const { account, setAccount, profile } = useUser();
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState(account.avatarUrl);
  const [formData, setFormData] = useState({
    firstName: account.firstName,
    lastName: account.lastName,
    email: account.email,
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        setPreviewUrl(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setAccount({
      ...account,
      ...formData,
      avatarUrl: previewUrl,
    });
    toast({
      title: 'Settings Saved',
      description: 'Your profile has been updated successfully.',
    });
  };

  const handleNotificationToggle = (key: keyof typeof account.notifications) => {
    setAccount({
      ...account,
      notifications: {
        ...account.notifications,
        [key]: !account.notifications[key],
      },
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-card p-6 shadow-lg border border-border/50"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Profile</h2>
          </div>

          {/* Avatar */}
          <div className="mb-6 flex justify-center">
            <label className="relative cursor-pointer group">
              <div className="relative h-24 w-24 rounded-full overflow-hidden bg-accent border-4 border-card shadow-xl">
                {previewUrl ? (
                  <img src={previewUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface py-3 px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface py-3 px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-border bg-surface py-3 pl-11 pr-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-medium text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
            >
              <Save className="h-5 w-5" />
              Save Changes
            </motion.button>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-card p-6 shadow-lg border border-border/50"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10">
              <Bell className="h-5 w-5 text-info" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          </div>

          <div className="space-y-4">
            {[
              { key: 'meals' as const, label: 'Meal Reminders', desc: 'Get reminded to log your meals' },
              { key: 'water' as const, label: 'Water Reminders', desc: 'Stay hydrated throughout the day' },
              { key: 'insights' as const, label: 'AI Insights', desc: 'Receive personalized nutrition tips' },
              { key: 'weekly' as const, label: 'Weekly Report', desc: 'Get a summary of your progress' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between rounded-xl bg-surface p-4">
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle(item.key)}
                  className={`relative h-7 w-12 rounded-full transition-colors ${
                    account.notifications[item.key] ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <motion.div
                    animate={{ x: account.notifications[item.key] ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute left-1 top-1 h-5 w-5 rounded-full bg-primary-foreground shadow-sm"
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Health Profile Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-card p-6 shadow-lg border border-border/50 lg:col-span-2"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
              <Shield className="h-5 w-5 text-success" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Health Profile</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-surface p-4">
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="font-semibold text-foreground capitalize">{profile.gender}</p>
            </div>
            <div className="rounded-xl bg-surface p-4">
              <p className="text-sm text-muted-foreground">Height</p>
              <p className="font-semibold text-foreground">{profile.biometrics.height} cm</p>
            </div>
            <div className="rounded-xl bg-surface p-4">
              <p className="text-sm text-muted-foreground">Weight</p>
              <p className="font-semibold text-foreground">{profile.biometrics.weight} kg</p>
            </div>
            <div className="rounded-xl bg-surface p-4">
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="font-semibold text-foreground">{profile.biometrics.age} years</p>
            </div>
          </div>

          {(profile.allergies.length > 0 || profile.medicalConditions.length > 0) && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {profile.allergies.length > 0 && (
                <div className="rounded-xl bg-destructive/5 p-4">
                  <p className="text-sm font-medium text-destructive mb-2">Allergies</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.allergies.map((allergy) => (
                      <span key={allergy} className="rounded-full bg-destructive/10 px-3 py-1 text-xs text-destructive">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.medicalConditions.length > 0 && (
                <div className="rounded-xl bg-warning/5 p-4">
                  <p className="text-sm font-medium text-warning mb-2">Medical Conditions</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.medicalConditions.map((condition) => (
                      <span key={condition} className="rounded-full bg-warning/10 px-3 py-1 text-xs text-warning">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
