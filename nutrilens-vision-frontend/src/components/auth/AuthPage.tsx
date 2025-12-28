import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Leaf } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthPageProps {
  onBack: () => void;
  onSuccess: () => void;
  onSignUp: () => void;
}

export function AuthPage({ onBack, onSuccess, onSignUp }: AuthPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success('Welcome back!');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" 
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-1/4 -right-32 w-80 h-80 bg-primary/8 rounded-full blur-3xl" 
        />
      </div>

      {/* Floating leaves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[15%]"
        >
          <Leaf className="w-6 h-6 text-primary/30" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[30%] right-[20%]"
        >
          <Leaf className="w-5 h-5 text-primary/25" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, -25, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[25%] left-[25%]"
        >
          <Leaf className="w-8 h-8 text-primary/20" />
        </motion.div>
      </div>

      {/* Header */}
      <header className="p-4 sm:p-6 relative z-10">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm sm:text-base font-medium">Back</span>
        </motion.button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl p-6 sm:p-8">
            {/* Logo */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center mb-6 sm:mb-8"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
                <Leaf className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Welcome Back
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Sign in to continue your nutrition journey
              </p>
            </motion.div>

            {/* Form */}
            <motion.form 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              onSubmit={handleSubmit} 
              className="space-y-4 sm:space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 sm:h-14 text-base bg-background/50 border-border/50 focus:border-primary/50 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 sm:h-14 text-base bg-background/50 border-border/50 focus:border-primary/50 rounded-xl"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 sm:h-14 text-base font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </motion.form>

            {/* Toggle */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-6 sm:mt-8 text-center"
            >
              <p className="text-sm sm:text-base text-muted-foreground">
                Don't have an account?
                <button
                  onClick={onSignUp}
                  className="ml-2 text-primary font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
