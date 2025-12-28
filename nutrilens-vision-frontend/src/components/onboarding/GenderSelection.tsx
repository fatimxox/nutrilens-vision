import { motion } from 'framer-motion';
import { Check, Lock, User } from 'lucide-react';
import { Gender } from '@/contexts/UserContext';

interface GenderSelectionProps {
  selectedGender: Gender;
  onGenderChange: (gender: Gender) => void;
}

const genderOptions: { id: Gender; title: string; description: string }[] = [
  {
    id: 'male',
    title: 'Male',
    description: 'Optimize nutrition for male physiology',
  },
  {
    id: 'female',
    title: 'Female',
    description: 'Optimize nutrition for female physiology',
  },
];

export function GenderSelection({ selectedGender, onGenderChange }: GenderSelectionProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
          Tell us about yourself
        </h2>
        <p className="text-muted-foreground">
          This helps us calculate accurate nutritional targets
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 max-w-md mx-auto">
        {genderOptions.map((option, index) => {
          const isSelected = selectedGender === option.id;
          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              onClick={() => onGenderChange(option.id)}
              className={`relative flex flex-col items-center rounded-2xl border-2 p-6 text-center transition-all duration-300 ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                  : 'border-border bg-card hover:border-primary/50 hover:shadow-md'
              }`}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary"
                >
                  <Check className="h-4 w-4 text-primary-foreground" />
                </motion.div>
              )}
              
              {/* Simple white silhouette avatar */}
              <motion.div 
                className={`mb-4 h-20 w-20 rounded-full overflow-hidden transition-all duration-300 flex items-center justify-center ${
                  isSelected 
                    ? 'ring-4 ring-primary/30 scale-110 bg-primary' 
                    : 'ring-2 ring-border bg-muted'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <User className={`h-10 w-10 ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
              </motion.div>
              
              <h3 className="mb-1 font-semibold text-foreground">{option.title}</h3>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl bg-muted/50 border border-border p-4"
      >
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4" />
          <span>This information is private and used only for personalized nutrition calculations</span>
        </div>
      </motion.div>
    </div>
  );
}