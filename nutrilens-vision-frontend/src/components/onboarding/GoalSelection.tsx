import { motion } from 'framer-motion';
import { Target, Dumbbell, Heart, Activity, Check } from 'lucide-react';

interface GoalSelectionProps {
  selectedGoals: string[];
  onGoalsChange: (goals: string[]) => void;
}

const goals = [
  {
    id: 'weight_loss',
    icon: Target,
    title: 'Weight Loss',
    description: 'Reduce body weight and improve body composition',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
  },
  {
    id: 'muscle_gain',
    icon: Dumbbell,
    title: 'Muscle Gain',
    description: 'Build lean muscle mass and strength',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
  },
  {
    id: 'diabetes_management',
    icon: Heart,
    title: 'Diabetes Management',
    description: 'Monitor carbs and maintain stable blood sugar',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80',
  },
  {
    id: 'general_health',
    icon: Activity,
    title: 'General Health',
    description: 'Maintain a balanced, nutritious diet',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80',
  },
];

export function GoalSelection({ selectedGoals, onGoalsChange }: GoalSelectionProps) {
  const toggleGoal = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      onGoalsChange(selectedGoals.filter((g) => g !== goalId));
    } else {
      onGoalsChange([...selectedGoals, goalId]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
          What are your goals?
        </h2>
        <p className="text-muted-foreground">
          Select one or more goals to personalize your experience
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {goals.map((goal, index) => {
          const isSelected = selectedGoals.includes(goal.id);
          return (
            <motion.button
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              onClick={() => toggleGoal(goal.id)}
              className={`group relative overflow-hidden rounded-xl border-2 text-left transition-all duration-300 ${
                isSelected
                  ? 'border-primary shadow-lg shadow-primary/10'
                  : 'border-border bg-card hover:border-primary/50 hover:shadow-md'
              }`}
            >
              {/* Background Image */}
              <div className="relative h-24 overflow-hidden">
                <img 
                  src={goal.image} 
                  alt={goal.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
                
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-lg"
                  >
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </motion.div>
                )}
              </div>
              
              {/* Content */}
              <div className={`p-4 ${isSelected ? 'bg-primary/5' : 'bg-card'}`}>
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <goal.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {selectedGoals.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Please select at least one goal to continue
        </p>
      )}
    </div>
  );
}