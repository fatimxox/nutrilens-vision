import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LandingPage } from '@/components/LandingPage';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { AuthPage } from '@/components/auth/AuthPage';
import { SignUpPage } from '@/components/auth/SignUpPage';
import { UserProvider, useUser, UserAccount, UserProfile } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

type AppView = 'landing' | 'auth' | 'onboarding' | 'signup' | 'dashboard';

function AppContent() {
  const { isOnboarded, setIsOnboarded, setAccount, setProfile } = useUser();
  const [view, setView] = useState<AppView>('landing');
  const [session, setSession] = useState<Session | null>(null);

  // Store onboarding data for signup
  const [pendingAccountData, setPendingAccountData] = useState<UserAccount | null>(null);
  const [pendingProfileData, setPendingProfileData] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Set up auth listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);

        if (session?.user) {
          // Defer profile loading
          setTimeout(() => {
            loadUserProfile(session.user.id);
          }, 0);
        }
      }
    );

    // THEN check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (profile) {
        // Filter out 'none' from medical conditions
        const conditions = (profile.medical_conditions || []).filter(c => c !== 'none');

        setAccount({
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          email: profile.email || '',
          avatarUrl: profile.avatar_url || '',
          notifications: {
            meals: profile.notifications_enabled ?? true,
            water: true,
            insights: true,
            weekly: true,
          },
        });

        setProfile({
          goals: profile.goals || [],
          gender: (profile.gender as 'male' | 'female') || 'male',
          biometrics: {
            height: Number(profile.height) || 170,
            weight: Number(profile.weight) || 70,
            age: profile.age || 30,
          },
          medicalConditions: conditions,
          allergies: profile.allergies || [],
        });

        setIsOnboarded(true);
        setView('dashboard');
      } else {
        // User exists but no profile - stay on landing page
        // User will click "Get Started" to go to onboarding
        setView('landing');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleGetStarted = () => {
    setView('onboarding');
  };

  const handleLogin = () => {
    setView('auth');
  };

  const handleOnboardingComplete = (accountData: UserAccount, profileData: UserProfile) => {
    // Store data for signup
    setPendingAccountData(accountData);
    setPendingProfileData(profileData);
    setView('signup');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOnboarded(false);
    setSession(null);
    setView('landing');
  };

  const handleAuthSuccess = () => {
    // Profile will be loaded via auth listener
  };

  const handleSignUpFromAuth = () => {
    setView('onboarding');
  };

  const handleSignUpSuccess = () => {
    // Data is already saved to database via SignUpPage
    // Update local state with the pending data
    if (pendingAccountData) setAccount(pendingAccountData);
    if (pendingProfileData) setProfile(pendingProfileData);
    setIsOnboarded(true);
    // Clear pending data
    setPendingAccountData(null);
    setPendingProfileData(null);
    setView('dashboard');
  };

  // Safety check: if on dashboard without session and not onboarded, go to landing
  useEffect(() => {
    if (view === 'dashboard' && !session && !isOnboarded) {
      setView('landing');
    }
  }, [view, session, isOnboarded]);

  return (
    <AnimatePresence mode="wait">
      {view === 'landing' && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LandingPage onGetStarted={handleGetStarted} onLogin={handleLogin} />
        </motion.div>
      )}

      {view === 'auth' && (
        <motion.div
          key="auth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AuthPage
            onBack={() => setView('landing')}
            onSuccess={handleAuthSuccess}
            onSignUp={handleSignUpFromAuth}
          />
        </motion.div>
      )}

      {view === 'onboarding' && (
        <motion.div
          key="onboarding"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <OnboardingWizard onComplete={handleOnboardingComplete} />
        </motion.div>
      )}

      {view === 'signup' && pendingAccountData && pendingProfileData && (
        <motion.div
          key="signup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SignUpPage
            onBack={() => setView('onboarding')}
            onSuccess={handleSignUpSuccess}
            accountData={pendingAccountData}
            profileData={pendingProfileData}
          />
        </motion.div>
      )}

      {view === 'dashboard' && (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Dashboard onLogout={handleLogout} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const Index = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default Index;
