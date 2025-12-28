import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, Lightbulb, ShieldAlert } from 'lucide-react';
import { conditionGuidance, allergyWarnings, FoodGuidance } from '@/lib/health-guidance';

interface HealthGuidanceProps {
  medicalConditions: string[];
  allergies: string[];
}

const conditionLabels: Record<string, string> = {
  diabetes: 'Diabetes',
  hypertension: 'Hypertension',
  heart_disease: 'Heart Disease',
  kidney_disease: 'Kidney Disease',
  celiac_disease: 'Celiac Disease',
  ibs: 'IBS (Irritable Bowel Syndrome)',
};

const conditionColors: Record<string, { bg: string; text: string; icon: string }> = {
  diabetes: { bg: 'bg-amber-500/10', text: 'text-amber-600', icon: 'bg-amber-500/20' },
  hypertension: { bg: 'bg-red-500/10', text: 'text-red-600', icon: 'bg-red-500/20' },
  heart_disease: { bg: 'bg-rose-500/10', text: 'text-rose-600', icon: 'bg-rose-500/20' },
  kidney_disease: { bg: 'bg-purple-500/10', text: 'text-purple-600', icon: 'bg-purple-500/20' },
  celiac_disease: { bg: 'bg-orange-500/10', text: 'text-orange-600', icon: 'bg-orange-500/20' },
  ibs: { bg: 'bg-blue-500/10', text: 'text-blue-600', icon: 'bg-blue-500/20' },
};

function ConditionCard({ condition, guidance }: { condition: string; guidance: FoodGuidance }) {
  const colors = conditionColors[condition] || { bg: 'bg-warning/10', text: 'text-warning', icon: 'bg-warning/20' };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border border-border ${colors.bg} p-5`}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.icon}`}>
          <ShieldAlert className={`h-5 w-5 ${colors.text}`} />
        </div>
        <h3 className={`text-lg font-semibold ${colors.text}`}>
          {conditionLabels[condition] || condition}
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Foods to Avoid */}
        <div className="rounded-xl bg-destructive/5 p-4">
          <div className="mb-3 flex items-center gap-2">
            <XCircle className="h-4 w-4 text-destructive" />
            <h4 className="font-medium text-destructive">Foods to Avoid</h4>
          </div>
          <ul className="space-y-1.5">
            {guidance.avoid.map((food, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive/50" />
                {food}
              </li>
            ))}
          </ul>
        </div>

        {/* Foods to Eat */}
        <div className="rounded-xl bg-success/5 p-4">
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <h4 className="font-medium text-success">Foods to Eat</h4>
          </div>
          <ul className="space-y-1.5">
            {guidance.eat.map((food, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-success/50" />
                {food}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 rounded-xl bg-info/5 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-info" />
          <h4 className="font-medium text-info">Pro Tips</h4>
        </div>
        <ul className="grid gap-1 sm:grid-cols-2">
          {guidance.tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-info">→</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function AllergyCard({ allergy, warnings }: { allergy: string; warnings: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-destructive/20 bg-destructive/5 p-4"
    >
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <h4 className="font-medium capitalize text-destructive">
          {allergy.replace('_', ' ')} Allergy
        </h4>
      </div>
      <p className="mb-2 text-xs text-muted-foreground">Watch out for these foods/ingredients:</p>
      <ul className="grid gap-1 sm:grid-cols-2">
        {warnings.map((warning, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
            <XCircle className="mt-0.5 h-3 w-3 text-destructive/70" />
            {warning}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function HealthGuidance({ medicalConditions, allergies }: HealthGuidanceProps) {
  const activeConditions = medicalConditions.filter(c => c !== 'none' && conditionGuidance[c]);
  const activeAllergies = allergies.filter(a => allergyWarnings[a.toLowerCase().replace(' ', '_')]);

  if (activeConditions.length === 0 && activeAllergies.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6 text-center"
      >
        <CheckCircle className="mx-auto h-12 w-12 text-success/50" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">No Special Dietary Needs</h3>
        <p className="mt-2 text-muted-foreground">
          You haven't reported any medical conditions or allergies. Follow your personalized calorie
          and macro targets for optimal health!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Medical Conditions */}
      {activeConditions.length > 0 && (
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <ShieldAlert className="h-5 w-5 text-warning" />
            Dietary Guidelines for Your Conditions
          </h2>
          <div className="space-y-4">
            {activeConditions.map((condition) => (
              <ConditionCard
                key={condition}
                condition={condition}
                guidance={conditionGuidance[condition]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Allergies */}
      {activeAllergies.length > 0 && (
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Allergy Warnings
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {activeAllergies.map((allergy) => {
              const key = allergy.toLowerCase().replace(' ', '_');
              return (
                <AllergyCard
                  key={allergy}
                  allergy={allergy}
                  warnings={allergyWarnings[key] || []}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
