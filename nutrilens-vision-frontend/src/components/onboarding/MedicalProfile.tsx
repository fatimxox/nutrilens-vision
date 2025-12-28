import { motion } from 'framer-motion';
import { Check, Heart, AlertCircle, Activity, Stethoscope } from 'lucide-react';

interface MedicalProfileProps {
  conditions: string[];
  onConditionsChange: (conditions: string[]) => void;
}

const medicalConditions = [
  { id: 'diabetes_type1', label: 'Diabetes Type 1', icon: Activity },
  { id: 'diabetes_type2', label: 'Diabetes Type 2', icon: Activity },
  { id: 'hypertension', label: 'Hypertension', icon: Heart },
  { id: 'pcos', label: 'PCOS', icon: Stethoscope },
  { id: 'celiac', label: 'Celiac Disease', icon: AlertCircle },
  { id: 'ibs', label: 'IBS', icon: Stethoscope },
  { id: 'heart_disease', label: 'Heart Disease', icon: Heart },
  { id: 'kidney_disease', label: 'Kidney Disease', icon: Stethoscope },
  { id: 'none', label: 'None of the above', icon: Check },
];

export function MedicalProfile({ conditions, onConditionsChange }: MedicalProfileProps) {
  const toggleCondition = (conditionId: string) => {
    if (conditionId === 'none') {
      onConditionsChange(conditions.includes('none') ? [] : ['none']);
      return;
    }

    const withoutNone = conditions.filter((c) => c !== 'none');
    
    if (conditions.includes(conditionId)) {
      onConditionsChange(withoutNone.filter((c) => c !== conditionId));
    } else {
      onConditionsChange([...withoutNone, conditionId]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Stethoscope className="h-8 w-8 text-primary" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
          Medical Conditions
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Select any health conditions we should consider when providing nutrition recommendations
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {medicalConditions.map((condition, index) => {
          const isSelected = conditions.includes(condition.id);
          const isNone = condition.id === 'none';
          const IconComponent = condition.icon;
          
          return (
            <motion.button
              key={condition.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              onClick={() => toggleCondition(condition.id)}
              className={`relative flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200 ${
                isSelected
                  ? isNone
                    ? 'border-success bg-success/10 text-foreground'
                    : 'border-primary bg-primary/5 text-foreground'
                  : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/50'
              }`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                isSelected
                  ? isNone
                    ? 'bg-success text-success-foreground'
                    : 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {isSelected ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <IconComponent className="h-5 w-5" />
                )}
              </div>
              <span className="font-medium">{condition.label}</span>
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
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-info/10">
            <AlertCircle className="h-4 w-4 text-info" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              This information helps us provide better meal insights and health alerts tailored to your needs.
              {conditions.length > 0 && conditions[0] !== 'none' && (
                <span className="mt-1 block text-primary font-medium">
                  We'll monitor your meals for condition-specific concerns.
                </span>
              )}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}