import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoalSelection } from './GoalSelection';
import { GenderSelection } from './GenderSelection';
import { ProfileSetup } from './ProfileSetup';
import { BiometricsInput } from './BiometricsInput';
import { MedicalProfile } from './MedicalProfile';
import { AllergySetup } from './AllergySetup';
import { useUser, UserProfile, UserAccount, Gender } from '@/contexts/UserContext';
import { Target, User, Users, Ruler, Heart, AlertTriangle, Check } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (accountData: UserAccount, profileData: UserProfile) => void;
}

const steps = ['Profile', 'Goals', 'About You', 'Biometrics', 'Medical', 'Allergies'];

const stepIcons = [User, Target, Users, Ruler, Heart, AlertTriangle];

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [accountData, setAccountData] = useState<UserAccount>({
    firstName: '',
    lastName: '',
    email: '',
    avatarUrl: '',
    notifications: {
      meals: true,
      water: true,
      insights: true,
      weekly: true,
    },
  });
  const [userData, setUserData] = useState<UserProfile>({
    goals: [],
    gender: 'male',
    biometrics: { height: 170, weight: 70, age: 30 },
    medicalConditions: [],
    allergies: [],
  });

  const updateUserData = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setUserData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Pass data to parent for signup flow
      onComplete(accountData, userData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 0:
        return !accountData.firstName || !accountData.email;
      case 1:
        return userData.goals.length === 0;
      default:
        return false;
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProfileSetup
            account={accountData}
            onAccountChange={setAccountData}
          />
        );
      case 1:
        return (
          <GoalSelection
            selectedGoals={userData.goals}
            onGoalsChange={(goals) => updateUserData('goals', goals)}
          />
        );
      case 2:
        return (
          <GenderSelection
            selectedGender={userData.gender}
            onGenderChange={(gender) => updateUserData('gender', gender)}
          />
        );
      case 3:
        return (
          <BiometricsInput
            biometrics={userData.biometrics}
            onBiometricsChange={(bio) => updateUserData('biometrics', bio)}
          />
        );
      case 4:
        return (
          <MedicalProfile
            conditions={userData.medicalConditions}
            onConditionsChange={(conds) => updateUserData('medicalConditions', conds)}
          />
        );
      case 5:
        return (
          <AllergySetup
            allergies={userData.allergies}
            onAllergiesChange={(allergies) => updateUserData('allergies', allergies)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-surface">
      {/* Progress bar */}
      <div className="border-b border-border/50 bg-card/80 backdrop-blur-sm px-4 py-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-muted-foreground">{steps[currentStep]}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary-glow"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          
          {/* Step indicators */}
          <div className="mt-6 flex justify-between">
            {steps.map((step, index) => {
              const Icon = stepIcons[index];
              return (
                <div key={step} className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ 
                      scale: index === currentStep ? 1.1 : 1,
                      transition: { duration: 0.2 }
                    }}
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                      index < currentStep
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                        : index === currentStep
                        ? 'bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-lg shadow-primary/40'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index < currentStep ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </motion.div>
                  <span
                    className={`mt-2 hidden text-xs sm:block transition-colors ${
                      index <= currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <AnimatePresence mode="wait" custom={1}>
            <motion.div
              key={currentStep}
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-border/50 bg-card/80 backdrop-blur-sm px-4 py-4">
        <div className="mx-auto flex max-w-2xl justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="rounded-xl px-6 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <motion.button
            onClick={handleNext}
            disabled={isNextDisabled()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl bg-gradient-to-r from-primary to-primary-glow px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
