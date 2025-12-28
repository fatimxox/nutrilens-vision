-- Create saved_recipes table for recipe database
CREATE TABLE public.saved_recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  calories INTEGER DEFAULT 0,
  protein NUMERIC DEFAULT 0,
  carbs NUMERIC DEFAULT 0,
  fat NUMERIC DEFAULT 0,
  fiber NUMERIC DEFAULT 0,
  ingredients TEXT[] DEFAULT '{}',
  image_url TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_recipes ENABLE ROW LEVEL SECURITY;

-- RLS policies for saved_recipes
CREATE POLICY "Users can view their own recipes"
ON public.saved_recipes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recipes"
ON public.saved_recipes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recipes"
ON public.saved_recipes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recipes"
ON public.saved_recipes FOR DELETE
USING (auth.uid() = user_id);

-- Create user_streaks table for gamification
CREATE TABLE public.user_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_log_date DATE,
  badges TEXT[] DEFAULT '{}',
  total_logs INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_streaks
CREATE POLICY "Users can view their own streaks"
ON public.user_streaks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own streaks"
ON public.user_streaks FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks"
ON public.user_streaks FOR UPDATE
USING (auth.uid() = user_id);

-- Create blood_sugar_logs table for diabetic users
CREATE TABLE public.blood_sugar_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  glucose_level NUMERIC NOT NULL,
  measurement_type TEXT DEFAULT 'fasting',
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blood_sugar_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for blood_sugar_logs
CREATE POLICY "Users can view their own blood sugar logs"
ON public.blood_sugar_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own blood sugar logs"
ON public.blood_sugar_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blood sugar logs"
ON public.blood_sugar_logs FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blood sugar logs"
ON public.blood_sugar_logs FOR DELETE
USING (auth.uid() = user_id);

-- Create medication_reminders table
CREATE TABLE public.medication_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  medication_name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT DEFAULT 'daily',
  reminder_times TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_taken_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.medication_reminders ENABLE ROW LEVEL SECURITY;

-- RLS policies for medication_reminders
CREATE POLICY "Users can view their own medication reminders"
ON public.medication_reminders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own medication reminders"
ON public.medication_reminders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medication reminders"
ON public.medication_reminders FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medication reminders"
ON public.medication_reminders FOR DELETE
USING (auth.uid() = user_id);

-- Add update triggers for timestamps
CREATE TRIGGER update_saved_recipes_updated_at
BEFORE UPDATE ON public.saved_recipes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_streaks_updated_at
BEFORE UPDATE ON public.user_streaks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medication_reminders_updated_at
BEFORE UPDATE ON public.medication_reminders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();