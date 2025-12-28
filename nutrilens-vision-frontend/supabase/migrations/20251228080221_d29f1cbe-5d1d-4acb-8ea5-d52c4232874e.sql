-- Add goals array column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS goals text[] DEFAULT '{}';

-- Migrate existing goal data to goals array
UPDATE public.profiles 
SET goals = ARRAY[goal] 
WHERE goal IS NOT NULL AND (goals IS NULL OR goals = '{}');

-- Drop the old goal column
ALTER TABLE public.profiles DROP COLUMN IF EXISTS goal;