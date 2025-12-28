import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, X, Check, Loader2 } from 'lucide-react';
import { useUser, NutritionItem, Meal } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

type UploadState = 'idle' | 'dragging' | 'uploading' | 'analyzing' | 'complete';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:3001';

export function UploadCenter() {
  const { addMeal, profile } = useUser();
  const { toast } = useToast();
  const [state, setState] = useState<UploadState>('idle');
  const [preview, setPreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<NutritionItem[] | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState('dragging');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState('idle');
  }, []);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload JPG or PNG files only.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image must be under 10MB.',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageUrl = e.target?.result as string;
      setPreview(imageUrl);
      setState('uploading');

      // Short delay for UI feedback
      await new Promise((r) => setTimeout(r, 300));
      setState('analyzing');

      try {
        // Call the real Gemini-powered backend API
        const response = await fetch(`${BACKEND_URL}/api/analyze-food`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: imageUrl, // Send base64 image data
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Failed to analyze food image');
        }

        const data = await response.json();

        // Transform API response to NutritionItem format
        const items: NutritionItem[] = data.food_items.map((item: {
          name: string;
          confidence: number;
          portion: string;
          nutrition: { calories: number; protein: number; carbs: number; fat: number };
          allergens?: string[];
          health_warnings?: string[];
        }) => ({
          name: item.name,
          confidence: item.confidence,
          nutrition: {
            calories: item.nutrition.calories,
            protein: item.nutrition.protein,
            carbs: item.nutrition.carbs,
            fats: item.nutrition.fat,
            glycemicIndex: 0, // Not provided by API
          },
          allergenFlags: item.allergens || [],
        }));

        // Collect all allergens and health warnings from analyzed items
        const allAllergens = data.food_items.flatMap((item: { allergens?: string[] }) => item.allergens || []);
        const allHealthWarnings = data.food_items.flatMap((item: { health_warnings?: string[] }) => item.health_warnings || []);

        // Check for allergens matching user's profile
        const userAllergies = profile.allergies.map((a) => a.toLowerCase());
        const matchingAllergens = allAllergens.filter((allergen: string) =>
          userAllergies.some((userAllergy) =>
            allergen.toLowerCase().includes(userAllergy) ||
            userAllergy.includes(allergen.toLowerCase())
          )
        );

        if (matchingAllergens.length > 0) {
          // Get food names that have these allergens
          const problematicFoods = data.food_items
            .filter((item: { allergens?: string[] }) =>
              (item.allergens || []).some((a: string) => matchingAllergens.includes(a))
            )
            .map((item: { name: string }) => item.name);

          toast({
            title: '⚠️ Allergen Warning!',
            description: `${problematicFoods.join(', ')} may contain: ${[...new Set(matchingAllergens)].join(', ')}`,
            variant: 'destructive',
          });
        }

        // Check health warnings against user's medical conditions
        const userConditions = profile.medicalConditions.map((c) => c.toLowerCase());
        const healthConcerns: string[] = [];

        // Map health warnings to medical conditions
        const warningToCondition: Record<string, string[]> = {
          'high_sugar': ['diabetes', 'diabetes_management'],
          'high_carb': ['diabetes', 'diabetes_management'],
          'high_sodium': ['hypertension', 'high_blood_pressure'],
          'high_fat': ['heart_disease', 'cholesterol'],
          'processed': ['diabetes', 'heart_disease'],
        };

        allHealthWarnings.forEach((warning: string) => {
          const relevantConditions = warningToCondition[warning] || [];
          if (relevantConditions.some(cond => userConditions.includes(cond))) {
            healthConcerns.push(warning.replace('_', ' '));
          }
        });

        if (healthConcerns.length > 0) {
          toast({
            title: '🏥 Health Consideration',
            description: `This meal has ${[...new Set(healthConcerns)].join(', ')} which may affect your health conditions.`,
            variant: 'destructive',
          });
        }

        setAnalysisResult(items);
        setState('complete');
      } catch (error) {
        console.error('Error analyzing food:', error);
        toast({
          title: 'Analysis Failed',
          description: error instanceof Error ? error.message : 'Failed to analyze the food image. Please try again.',
          variant: 'destructive',
        });
        setState('idle');
        setPreview(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleSaveMeal = () => {
    if (!analysisResult || !preview) return;

    const meal: Meal = {
      id: `meal_${Date.now()}`,
      timestamp: new Date(),
      imageUrl: preview,
      items: analysisResult,
      totalCalories: analysisResult.reduce((sum, item) => sum + item.nutrition.calories, 0),
      totalProtein: analysisResult.reduce((sum, item) => sum + item.nutrition.protein, 0),
      totalCarbs: analysisResult.reduce((sum, item) => sum + item.nutrition.carbs, 0),
      totalFats: analysisResult.reduce((sum, item) => sum + item.nutrition.fats, 0),
    };

    addMeal(meal);
    toast({
      title: 'Meal logged!',
      description: `Added ${meal.totalCalories} calories to your daily log.`,
    });

    // Reset
    setState('idle');
    setPreview(null);
    setAnalysisResult(null);
  };

  const handleReset = () => {
    setState('idle');
    setPreview(null);
    setAnalysisResult(null);
  };

  return (
    <div className="rounded-2xl bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Upload Meal</h2>
        {state !== 'idle' && (
          <button
            onClick={handleReset}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative min-h-[300px] overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 ${state === 'dragging'
          ? 'border-primary bg-accent'
          : state === 'idle'
            ? 'border-border bg-surface hover:border-primary/50'
            : 'border-transparent bg-foreground/5'
          }`}
      >
        <AnimatePresence mode="wait">
          {state === 'idle' && (
            <motion.label
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full min-h-[300px] cursor-pointer flex-col items-center justify-center p-8"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-primary">
                <Camera className="h-8 w-8" />
              </div>
              <p className="mb-2 text-center font-medium text-foreground">
                Drop photo or click to upload
              </p>
              <p className="text-center text-sm text-muted-foreground">
                JPG or PNG, max 10MB
              </p>
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileSelect}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </motion.label>
          )}

          {state === 'dragging' && (
            <motion.div
              key="dragging"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full min-h-[300px] flex-col items-center justify-center p-8"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Upload className="h-8 w-8" />
              </div>
              <p className="font-medium text-primary">Drop your image here</p>
            </motion.div>
          )}

          {(state === 'uploading' || state === 'analyzing') && preview && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative h-full min-h-[300px]"
            >
              <img
                src={preview}
                alt="Meal preview"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-foreground/60 backdrop-blur-sm">
                {state === 'analyzing' && (
                  <motion.div
                    className="absolute left-0 right-0 h-1 bg-primary/80"
                    initial={{ top: 0 }}
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                <Loader2 className="mb-3 h-10 w-10 animate-spin text-primary-foreground" />
                <p className="font-medium text-primary-foreground">
                  {state === 'uploading' ? 'Uploading...' : 'Analyzing...'}
                </p>
              </div>
            </motion.div>
          )}

          {state === 'complete' && preview && analysisResult && (
            <motion.div
              key="complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4"
            >
              <div className="mb-4 flex gap-4">
                <img
                  src={preview}
                  alt="Analyzed meal"
                  className="h-24 w-24 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">Analysis Complete</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {analysisResult.length} items detected
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {analysisResult.map((item, idx) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between rounded-lg bg-surface p-3"
                  >
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round(item.confidence * 100)}% confidence
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {item.nutrition.calories} cal
                      </p>
                      <p className="text-xs text-muted-foreground">
                        P: {item.nutrition.protein}g • C: {item.nutrition.carbs}g • F:{' '}
                        {item.nutrition.fats}g
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-lg border border-border py-3 font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMeal}
                  className="flex-1 rounded-lg bg-primary py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Save Meal
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
