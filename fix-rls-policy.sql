-- Fix RLS Policy for Recipe Creation
-- This allows recipe creation for both authenticated users and the demo user

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can insert own recipes" ON public.recipes;

-- Create the updated policy that allows demo user recipes
CREATE POLICY "Users can insert own recipes" ON public.recipes FOR INSERT WITH CHECK (
  auth.uid() = user_id OR 
  user_id = '00000000-0000-0000-0000-000000000001'
);
