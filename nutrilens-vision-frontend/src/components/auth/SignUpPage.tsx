import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Sparkles, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserAccount, UserProfile } from '@/contexts/UserContext';

interface SignUpPageProps {
  onBack: () => void;
  onSuccess: () => void;
  accountData: UserAccount;
  profileData: UserProfile;
}

export function SignUpPage({ onBack, onSuccess, accountData, profileData }: SignUpPageProps) {
  const [email, setEmail] = useState(accountData.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const goalLabels: Record<string, string> = {
    weight_loss: 'Weight Loss',
    muscle_gain: 'Muscle Gain',
    maintain_weight: 'Maintain Weight',
    energy_boost: 'Energy Boost',
    better_sleep: 'Better Sleep',
    diabetes_management: 'Diabetes Management',
    heart_health: 'Heart Health',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords don\'t match',
        description: 'Please make sure both passwords are the same.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          toast({
            title: 'Account exists',
            description: 'This email is already registered. Please sign in instead.',
            variant: 'destructive',
          });
        } else {
          throw authError;
        }
        return;
      }

      if (authData.user) {
        // Filter out 'none' from medical conditions before saving
        const conditionsToSave = profileData.medicalConditions.filter(c => c !== 'none');
        
        // Save profile to database with all goals
        const { error: profileError } = await supabase.from('profiles').insert({
          user_id: authData.user.id,
          first_name: accountData.firstName,
          last_name: accountData.lastName,
          email: email,
          avatar_url: accountData.avatarUrl,
          goals: profileData.goals,
          gender: profileData.gender,
          height: profileData.biometrics.height,
          weight: profileData.biometrics.weight,
          age: profileData.biometrics.age,
          medical_conditions: conditionsToSave.length > 0 ? conditionsToSave : null,
          allergies: profileData.allergies.length > 0 ? profileData.allergies : null,
          notifications_enabled: accountData.notifications.meals,
        });

        if (profileError) {
          console.error('Profile save error:', profileError);
          toast({
            title: 'Profile saved with issues',
            description: 'Your account was created but some profile data may not have saved.',
            variant: 'default',
          });
        }

        toast({
          title: 'Account created!',
          description: 'Welcome to NutriVision. Let\'s start your journey!',
        });

        onSuccess();
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: 'Sign up failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background via-surface to-background px-4 py-8">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* Back button */}
      <motion.button
        onClick={onBack}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute left-4 top-4 flex items-center gap-2 rounded-xl px-4 py-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-lg shadow-primary/30"
          >
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Create Your Account</h1>
          <p className="mt-2 text-muted-foreground">
            Save your personalized nutrition plan
          </p>
        </div>

        {/* Profile Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-2xl border border-border bg-card p-4"
        >
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">Your Profile Summary</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-foreground">{accountData.firstName} {accountData.lastName}</span>
              <Check className="h-4 w-4 text-success" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground capitalize">{profileData.gender}</span>
              <span className="text-muted-foreground">
                {profileData.biometrics.age}y, {profileData.biometrics.height}cm, {profileData.biometrics.weight}kg
              </span>
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              {profileData.goals.slice(0, 3).map((goal) => (
                <span
                  key={goal}
                  className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                >
                  {goalLabels[goal] || goal}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sign Up Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xl"
        >
          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-12 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-foreground">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-xl bg-gradient-to-r from-primary to-primary-glow py-3.5 font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating account...
              </span>
            ) : (
              'Create Account & Start'
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}
