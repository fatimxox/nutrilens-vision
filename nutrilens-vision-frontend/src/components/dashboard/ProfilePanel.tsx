import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Target, 
  Ruler, 
  Heart, 
  AlertTriangle, 
  Edit2, 
  Save, 
  X,
  Mail,
  Flame,
  Droplets
} from 'lucide-react';
import { useUser, Gender } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculateNutritionTargets } from '@/lib/nutrition-calculator';
import { CalculationExplainer } from './CalculationExplainer';
import { HealthGuidance } from './HealthGuidance';

const goalLabels: Record<string, string> = {
  weight_loss: 'Weight Loss',
  muscle_gain: 'Muscle Gain',
  maintain_weight: 'Maintain Weight',
  energy_boost: 'Energy Boost',
  better_sleep: 'Better Sleep',
  diabetes_management: 'Diabetes Management',
  heart_health: 'Heart Health',
};

const conditionLabels: Record<string, string> = {
  diabetes: 'Diabetes',
  hypertension: 'Hypertension',
  heart_disease: 'Heart Disease',
  kidney_disease: 'Kidney Disease',
  celiac_disease: 'Celiac Disease',
  ibs: 'IBS',
  none: 'None',
};

export function ProfilePanel() {
  const { account, profile, setAccount, setProfile } = useUser();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [editedAccount, setEditedAccount] = useState(account);
  const [editedProfile, setEditedProfile] = useState(profile);

  // Ensure valid gender for calculation
  const validGender: Gender = profile.gender === 'male' || profile.gender === 'female' 
    ? profile.gender 
    : 'male';
  
  const targets = calculateNutritionTargets(validGender, profile.biometrics, profile.goals);
  const bmi = profile.biometrics.weight / ((profile.biometrics.height / 100) ** 2);
  
  // Calculate BMR and TDEE for the explainer
  const bmr = validGender === 'male'
    ? (10 * profile.biometrics.weight) + (6.25 * profile.biometrics.height) - (5 * profile.biometrics.age) + 5
    : (10 * profile.biometrics.weight) + (6.25 * profile.biometrics.height) - (5 * profile.biometrics.age) - 161;
  const tdee = bmr * 1.55; // moderate activity

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            first_name: editedAccount.firstName,
            last_name: editedAccount.lastName,
            goals: editedProfile.goals,
            gender: editedProfile.gender,
            height: editedProfile.biometrics.height,
            weight: editedProfile.biometrics.weight,
            age: editedProfile.biometrics.age,
            medical_conditions: editedProfile.medicalConditions,
            allergies: editedProfile.allergies,
          })
          .eq('user_id', user.id);

        if (error) throw error;
      }

      setAccount(editedAccount);
      setProfile(editedProfile);
      setIsEditing(false);
      
      toast({
        title: 'Profile updated',
        description: 'Your changes have been saved.',
      });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message || 'Could not save changes.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedAccount(account);
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>
        {!isEditing ? (
          <motion.button
            onClick={() => setIsEditing(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </motion.button>
        ) : (
          <div className="flex gap-2">
            <motion.button
              onClick={handleCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </motion.button>
            <motion.button
              onClick={handleSave}
              disabled={isSaving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-lg"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
          </div>

          <div className="space-y-4">
            {/* Avatar & Name */}
            <div className="flex items-center gap-4">
              <div className="relative">
                {account.avatarUrl ? (
                  <img
                    src={account.avatarUrl}
                    alt="Avatar"
                    className="h-16 w-16 rounded-full object-cover ring-4 ring-primary/20"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-xl font-bold">
                    {account.firstName?.[0] || 'U'}
                  </div>
                )}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editedAccount.firstName}
                      onChange={(e) => setEditedAccount({ ...editedAccount, firstName: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="First name"
                    />
                    <input
                      type="text"
                      value={editedAccount.lastName}
                      onChange={(e) => setEditedAccount({ ...editedAccount, lastName: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Last name"
                    />
                  </div>
                ) : (
                  <>
                    <p className="text-xl font-semibold text-foreground">
                      {account.firstName} {account.lastName}
                    </p>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {account.email}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Gender */}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-muted-foreground">Gender</span>
              {isEditing ? (
                <div className="flex gap-2">
                  {(['male', 'female'] as Gender[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setEditedProfile({ ...editedProfile, gender: g })}
                      className={`rounded-lg px-3 py-1.5 text-sm capitalize transition-colors ${
                        editedProfile.gender === g
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="font-medium text-foreground capitalize">{profile.gender}</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Biometrics Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-lg"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-info/10">
              <Ruler className="h-6 w-6 text-info" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Body Metrics</h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Height', value: profile.biometrics.height, unit: 'cm', key: 'height' as const },
              { label: 'Weight', value: profile.biometrics.weight, unit: 'kg', key: 'weight' as const },
              { label: 'Age', value: profile.biometrics.age, unit: 'years', key: 'age' as const },
            ].map((metric) => (
              <div key={metric.label} className="text-center">
                {isEditing ? (
                  <input
                    type="number"
                    value={editedProfile.biometrics[metric.key]}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        biometrics: {
                          ...editedProfile.biometrics,
                          [metric.key]: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full rounded-lg border border-border bg-background px-2 py-2 text-center text-xl font-bold text-foreground focus:border-primary focus:outline-none"
                  />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {metric.label} ({metric.unit})
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl bg-muted/50 p-3 text-center">
            <span className="text-sm text-muted-foreground">BMI: </span>
            <span className="font-semibold text-foreground">{bmi.toFixed(1)}</span>
          </div>
        </motion.div>

        {/* Goals Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-lg"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
              <Target className="h-6 w-6 text-success" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Health Goals</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.goals.map((goal) => (
              <span
                key={goal}
                className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
              >
                {goalLabels[goal] || goal}
              </span>
            ))}
            {profile.goals.length === 0 && (
              <span className="text-muted-foreground">No goals set</span>
            )}
          </div>

          {/* Calculated targets */}
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-destructive" />
              <span className="text-sm text-muted-foreground">Target:</span>
              <span className="font-medium text-foreground">{targets.targetCalories} kcal</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-info" />
              <span className="text-sm text-muted-foreground">Water:</span>
              <span className="font-medium text-foreground">{targets.waterGlasses} glasses</span>
            </div>
          </div>
        </motion.div>

        {/* Health Conditions Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-lg"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
              <Heart className="h-6 w-6 text-warning" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Health Conditions</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Medical Conditions</h3>
              <div className="flex flex-wrap gap-2">
                {profile.medicalConditions.filter(c => c !== 'none').length > 0 ? (
                  profile.medicalConditions.filter(c => c !== 'none').map((condition) => (
                    <span
                      key={condition}
                      className="rounded-full bg-warning/10 px-3 py-1.5 text-sm text-warning"
                    >
                      {conditionLabels[condition] || condition}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground">None reported</span>
                )}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <AlertTriangle className="h-4 w-4" />
                Allergies
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.allergies.length > 0 ? (
                  profile.allergies.map((allergy) => (
                    <span
                      key={allergy}
                      className="rounded-full bg-destructive/10 px-3 py-1.5 text-sm text-destructive"
                    >
                      {allergy}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground">None reported</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Calculation Explainer */}
      <CalculationExplainer
        gender={validGender}
        weight={profile.biometrics.weight}
        height={profile.biometrics.height}
        age={profile.biometrics.age}
        activityLevel="moderate"
        goals={profile.goals}
        bmr={bmr}
        tdee={tdee}
        targetCalories={targets.targetCalories}
      />

      {/* Health Guidance */}
      <HealthGuidance
        medicalConditions={profile.medicalConditions}
        allergies={profile.allergies}
      />
    </div>
  );
}
